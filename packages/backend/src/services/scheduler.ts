import cron from 'node-cron';
import { logger } from '../utils/logger';
import { metaAdsScraper } from '../scraper/metaAdsScraper';
import { aiService } from './aiService';
import { db } from '../config/firebase';
import { ScrapingJob } from '@/shared/types';

export class SchedulerService {
  private static instance: SchedulerService;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  startAll(): void {
    this.startScrapingJobs();
    this.startAnalysisJobs();
    this.startCleanupJobs();
    logger.info('All scheduled jobs started');
  }

  private startScrapingJobs(): void {
    // Run scraping every 2 hours
    const scrapingJob = cron.schedule('0 */2 * * *', async () => {
      logger.info('Starting scheduled scraping job');
      await this.runScrapingJob();
    }, {
      scheduled: false,
      timezone: 'America/Sao_Paulo'
    });

    this.jobs.set('scraping', scrapingJob);
    scrapingJob.start();
    logger.info('Scraping job scheduled to run every 2 hours');
  }

  private startAnalysisJobs(): void {
    // Run AI analysis every 30 minutes
    const analysisJob = cron.schedule('*/30 * * * *', async () => {
      logger.info('Starting scheduled analysis job');
      await this.runAnalysisJob();
    }, {
      scheduled: false,
      timezone: 'America/Sao_Paulo'
    });

    this.jobs.set('analysis', analysisJob);
    analysisJob.start();
    logger.info('Analysis job scheduled to run every 30 minutes');
  }

  private startCleanupJobs(): void {
    // Run cleanup daily at 2 AM
    const cleanupJob = cron.schedule('0 2 * * *', async () => {
      logger.info('Starting scheduled cleanup job');
      await this.runCleanupJob();
    }, {
      scheduled: false,
      timezone: 'America/Sao_Paulo'
    });

    this.jobs.set('cleanup', cleanupJob);
    cleanupJob.start();
    logger.info('Cleanup job scheduled to run daily at 2 AM');
  }

  private async runScrapingJob(): Promise<void> {
    const jobId = `scraping_${Date.now()}`;
    
    try {
      // Create scraping job record
      const scrapingJob: ScrapingJob = {
        id: jobId,
        status: 'running',
        startTime: new Date(),
        creativesFound: 0,
        creativesProcessed: 0,
        errors: [],
        config: {
          maxPages: 10,
          delayBetweenRequests: 2000,
          useProxy: false,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      };

      await db.collection('scraping_jobs').doc(jobId).set(scrapingJob);

      // Initialize scraper
      await metaAdsScraper.init();

      // Get trending keywords to scrape
      const keywords = await this.getTrendingKeywords();
      
      let totalCreatives = 0;
      const errors: string[] = [];

      for (const keyword of keywords) {
        try {
          logger.info(`Scraping ads for keyword: ${keyword}`);
          const creatives = await metaAdsScraper.scrapeAds(keyword, 5);
          
          if (creatives.length > 0) {
            await metaAdsScraper.saveCreatives(creatives);
            totalCreatives += creatives.length;
          }
        } catch (error) {
          const errorMessage = `Error scraping keyword '${keyword}': ${error}`;
          logger.error(errorMessage);
          errors.push(errorMessage);
        }
      }

      // Update job status
      await db.collection('scraping_jobs').doc(jobId).update({
        status: 'completed',
        endTime: new Date(),
        creativesFound: totalCreatives,
        creativesProcessed: totalCreatives,
        errors,
      });

      logger.info(`Scraping job completed. Total creatives: ${totalCreatives}`);
    } catch (error) {
      logger.error('Error in scraping job:', error);
      
      // Update job status to failed
      await db.collection('scraping_jobs').doc(jobId).update({
        status: 'failed',
        endTime: new Date(),
        errors: [error instanceof Error ? error.message : String(error)],
      });
    } finally {
      await metaAdsScraper.close();
    }
  }

  private async runAnalysisJob(): Promise<void> {
    try {
      logger.info('Starting AI analysis job');
      
      // Get creatives without analysis
      const creativesQuery = await db.collection('creatives')
        .where('analysis', '==', null)
        .limit(20)
        .get();

      if (creativesQuery.empty) {
        logger.info('No creatives to analyze');
        return;
      }

      const creatives = creativesQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      logger.info(`Analyzing ${creatives.length} creatives`);

      // Analyze each creative
      const batch = db.batch();
      let analyzedCount = 0;

      for (const creative of creatives) {
        try {
          const analysis = await aiService.analyzeCreative(creative);
          
          batch.update(db.collection('creatives').doc(creative.id), {
            analysis,
            updatedAt: new Date(),
          });
          
          analyzedCount++;
        } catch (error) {
          logger.error(`Error analyzing creative ${creative.id}:`, error);
        }
      }

      if (analyzedCount > 0) {
        await batch.commit();
        logger.info(`Analysis job completed. Analyzed ${analyzedCount} creatives`);
      }
    } catch (error) {
      logger.error('Error in analysis job:', error);
    }
  }

  private async runCleanupJob(): Promise<void> {
    try {
      logger.info('Starting cleanup job');
      
      // Clean up old scraping jobs (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldJobsQuery = await db.collection('scraping_jobs')
        .where('startTime', '<', thirtyDaysAgo)
        .get();

      if (!oldJobsQuery.empty) {
        const batch = db.batch();
        oldJobsQuery.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        logger.info(`Cleaned up ${oldJobsQuery.size} old scraping jobs`);
      }

      // Clean up old alert triggers (older than 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const oldTriggersQuery = await db.collection('alert_triggers')
        .where('triggeredAt', '<', ninetyDaysAgo)
        .get();

      if (!oldTriggersQuery.empty) {
        const batch = db.batch();
        oldTriggersQuery.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        logger.info(`Cleaned up ${oldTriggersQuery.size} old alert triggers`);
      }

      logger.info('Cleanup job completed');
    } catch (error) {
      logger.error('Error in cleanup job:', error);
    }
  }

  private async getTrendingKeywords(): Promise<string[]> {
    try {
      // Get keywords from recent successful creatives
      const recentCreativesQuery = await db.collection('creatives')
        .where('createdAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();

      if (recentCreativesQuery.empty) {
        return ['emagrecimento', 'ganho de massa', 'beleza', 'dinheiro', 'relacionamento'];
      }

      const keywords = new Set<string>();
      recentCreativesQuery.docs.forEach(doc => {
        const data = doc.data();
        if (data.analysis?.tags) {
          data.analysis.tags.forEach((tag: string) => keywords.add(tag));
        }
      });

      return Array.from(keywords).slice(0, 10);
    } catch (error) {
      logger.error('Error getting trending keywords:', error);
      return ['emagrecimento', 'ganho de massa', 'beleza', 'dinheiro', 'relacionamento'];
    }
  }

  stopAll(): void {
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped job: ${name}`);
    });
    this.jobs.clear();
    logger.info('All scheduled jobs stopped');
  }

  stopJob(jobName: string): void {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      this.jobs.delete(jobName);
      logger.info(`Stopped job: ${jobName}`);
    }
  }

  getJobStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    this.jobs.forEach((job, name) => {
      status[name] = job.running;
    });
    return status;
  }
}

// Export singleton instance
export const schedulerService = SchedulerService.getInstance();

// Export convenience functions
export const startScheduler = () => schedulerService.startAll();
export const stopScheduler = () => schedulerService.stopAll();
export const getSchedulerStatus = () => schedulerService.getJobStatus();