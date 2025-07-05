import puppeteer, { Browser, Page } from 'puppeteer';
import { logger } from '../utils/logger';
import { SCRAPING_CONFIG } from '@/shared/utils/constants';
import { Creative, ScrapingConfig } from '@/shared/types';
import { generateCreativeHash } from '@/shared/utils/helpers';
import { db } from '../config/firebase';
import { analyzeCreative } from '../services/aiService';

export class MetaAdsScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: ScrapingConfig;

  constructor(config: Partial<ScrapingConfig> = {}) {
    this.config = {
      maxPages: config.maxPages || SCRAPING_CONFIG.DEFAULT_MAX_PAGES,
      delayBetweenRequests: config.delayBetweenRequests || SCRAPING_CONFIG.DEFAULT_DELAY,
      useProxy: config.useProxy || false,
      userAgent: config.userAgent || SCRAPING_CONFIG.DEFAULT_USER_AGENT,
      keywords: config.keywords || [],
      targetNiches: config.targetNiches || [],
    };
  }

  async init(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      });

      this.page = await this.browser.newPage();
      
      // Set user agent
      await this.page.setUserAgent(this.config.userAgent);
      
      // Set viewport
      await this.page.setViewport({ width: 1920, height: 1080 });
      
      // Block unnecessary resources
      await this.page.setRequestInterception(true);
      this.page.on('request', (request) => {
        const resourceType = request.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
          request.abort();
        } else {
          request.continue();
        }
      });

      logger.info('Meta Ads Scraper initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Meta Ads Scraper:', error);
      throw error;
    }
  }

  async scrapeAds(searchTerm: string = '', maxPages: number = this.config.maxPages): Promise<Creative[]> {
    if (!this.page || !this.browser) {
      throw new Error('Scraper not initialized. Call init() first.');
    }

    const creatives: Creative[] = [];
    let currentPage = 1;

    try {
      // Navigate to Meta Ads Library
      const baseUrl = 'https://www.facebook.com/ads/library';
      const searchUrl = searchTerm 
        ? `${baseUrl}/?search_type=keyword_unordered&search_term=${encodeURIComponent(searchTerm)}&country=BR`
        : `${baseUrl}/?country=BR`;

      logger.info(`Scraping ads from: ${searchUrl}`);
      
      await this.page.goto(searchUrl, { waitUntil: 'networkidle2' });

      while (currentPage <= maxPages) {
        logger.info(`Scraping page ${currentPage}/${maxPages}`);
        
        // Wait for ads to load
        await this.page.waitForSelector('[data-testid="ad-archive-result"]', { timeout: 10000 });
        
        // Extract ads from current page
        const pageCreatives = await this.extractAdsFromPage();
        creatives.push(...pageCreatives);
        
        logger.info(`Found ${pageCreatives.length} ads on page ${currentPage}`);
        
        // Try to go to next page
        const nextPageExists = await this.goToNextPage();
        if (!nextPageExists) {
          logger.info('No more pages to scrape');
          break;
        }
        
        currentPage++;
        
        // Delay between requests
        await this.delay(this.config.delayBetweenRequests);
      }

      logger.info(`Total ads scraped: ${creatives.length}`);
      return creatives;
    } catch (error) {
      logger.error('Error scraping ads:', error);
      throw error;
    }
  }

  private async extractAdsFromPage(): Promise<Creative[]> {
    if (!this.page) return [];

    try {
      const ads = await this.page.evaluate(() => {
        const adElements = document.querySelectorAll('[data-testid="ad-archive-result"]');
        const extractedAds: any[] = [];

        adElements.forEach((adElement, index) => {
          try {
            // Extract headline
            const headlineElement = adElement.querySelector('[data-testid="ad-creative-title"]');
            const headline = headlineElement?.textContent?.trim() || '';

            // Extract description
            const descriptionElement = adElement.querySelector('[data-testid="ad-creative-body"]');
            const description = descriptionElement?.textContent?.trim() || '';

            // Extract thumbnail
            const thumbnailElement = adElement.querySelector('img[data-testid="ad-image"]');
            const thumbnailUrl = thumbnailElement?.getAttribute('src') || '';

            // Extract video URL if it's a video ad
            const videoElement = adElement.querySelector('video');
            const videoUrl = videoElement?.getAttribute('src') || '';

            // Extract destination URL
            const linkElement = adElement.querySelector('[data-testid="ad-link"]');
            const destinationUrl = linkElement?.getAttribute('href') || '';

            // Extract CTA
            const ctaElement = adElement.querySelector('[data-testid="ad-cta"]');
            const callToAction = ctaElement?.textContent?.trim() || '';

            // Extract page name
            const pageNameElement = adElement.querySelector('[data-testid="page-name"]');
            const pageName = pageNameElement?.textContent?.trim() || '';

            // Extract start date
            const dateElement = adElement.querySelector('[data-testid="ad-start-date"]');
            const startDateText = dateElement?.textContent?.trim() || '';

            // Determine format
            let format: 'image' | 'video' | 'carousel' = 'image';
            if (videoUrl) {
              format = 'video';
            } else if (adElement.querySelector('[data-testid="carousel-indicator"]')) {
              format = 'carousel';
            }

            // Only add if we have minimum required data
            if (headline && pageName) {
              extractedAds.push({
                headline,
                description,
                thumbnailUrl,
                videoUrl,
                destinationUrl,
                callToAction,
                pageName,
                startDateText,
                format,
                platform: 'facebook' as const,
                index,
              });
            }
          } catch (error) {
            console.error('Error extracting ad data:', error);
          }
        });

        return extractedAds;
      });

      // Process and create Creative objects
      const creatives: Creative[] = [];
      for (const ad of ads) {
        try {
          const creative: Creative = {
            id: '', // Will be set when saving to database
            headline: ad.headline,
            description: ad.description,
            thumbnailUrl: ad.thumbnailUrl,
            videoUrl: ad.videoUrl,
            destinationUrl: ad.destinationUrl,
            callToAction: ad.callToAction,
            startDate: this.parseDate(ad.startDateText),
            pageName: ad.pageName,
            platform: ad.platform,
            format: ad.format,
            createdAt: new Date(),
            updatedAt: new Date(),
            hash: generateCreativeHash(ad),
            isActive: true,
          };

          creatives.push(creative);
        } catch (error) {
          logger.error('Error processing ad:', error);
        }
      }

      return creatives;
    } catch (error) {
      logger.error('Error extracting ads from page:', error);
      return [];
    }
  }

  private async goToNextPage(): Promise<boolean> {
    if (!this.page) return false;

    try {
      const nextButton = await this.page.$('[data-testid="next-page-button"]');
      if (!nextButton) return false;

      const isDisabled = await this.page.evaluate((btn) => {
        return btn.getAttribute('aria-disabled') === 'true' || btn.hasAttribute('disabled');
      }, nextButton);

      if (isDisabled) return false;

      await nextButton.click();
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      return true;
    } catch (error) {
      logger.error('Error going to next page:', error);
      return false;
    }
  }

  private parseDate(dateText: string): Date {
    try {
      // Handle different date formats from Meta Ads Library
      const now = new Date();
      
      if (dateText.includes('ago')) {
        // Handle "X days ago", "X weeks ago", etc.
        const match = dateText.match(/(\d+)\s+(day|week|month|year)s?\s+ago/i);
        if (match) {
          const value = parseInt(match[1]);
          const unit = match[2].toLowerCase();
          
          switch (unit) {
            case 'day':
              return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
            case 'week':
              return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
            case 'month':
              return new Date(now.getTime() - value * 30 * 24 * 60 * 60 * 1000);
            case 'year':
              return new Date(now.getTime() - value * 365 * 24 * 60 * 60 * 1000);
          }
        }
      }
      
      // Try to parse as regular date
      const parsed = new Date(dateText);
      return isNaN(parsed.getTime()) ? now : parsed;
    } catch (error) {
      logger.error('Error parsing date:', error);
      return new Date();
    }
  }

  async saveCreatives(creatives: Creative[]): Promise<void> {
    try {
      const batch = db.batch();
      const creativeCollection = db.collection('creatives');
      
      for (const creative of creatives) {
        // Check if creative already exists
        const existingQuery = await creativeCollection.where('hash', '==', creative.hash).get();
        
        if (existingQuery.empty) {
          const docRef = creativeCollection.doc();
          creative.id = docRef.id;
          
          // Analyze creative with AI
          try {
            const analysis = await analyzeCreative(creative);
            creative.analysis = analysis;
          } catch (error) {
            logger.error('Error analyzing creative:', error);
          }
          
          batch.set(docRef, {
            ...creative,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // Update existing creative
          const existingDoc = existingQuery.docs[0];
          batch.update(existingDoc.ref, {
            ...creative,
            id: existingDoc.id,
            updatedAt: new Date(),
          });
        }
      }
      
      await batch.commit();
      logger.info(`Saved ${creatives.length} creatives to database`);
    } catch (error) {
      logger.error('Error saving creatives:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      
      logger.info('Meta Ads Scraper closed successfully');
    } catch (error) {
      logger.error('Error closing scraper:', error);
    }
  }
}

// Export singleton instance
export const metaAdsScraper = new MetaAdsScraper();