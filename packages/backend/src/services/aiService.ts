import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { Creative, CreativeAnalysis, HookType } from '@/shared/types';
import { OPENAI_CONFIG } from '@/shared/utils/constants';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  private static instance: AIService;
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeCreative(creative: Creative): Promise<CreativeAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(creative);
      
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de criativos publicitários do Facebook e Instagram. 
            Sua tarefa é analisar criativos e identificar o tipo de gancho, nicho, sentimento e outras características importantes.
            
            Responda sempre em formato JSON válido com os seguintes campos:
            - hookType: tipo de gancho (urgency, curiosity, fear, social_proof, authority, scarcity, benefit, problem_solution, question, story, listicle, how_to, comparison, testimonial, discount, free, guarantee, limited_time, exclusive, trending, new, other)
            - niche: nicho do produto/serviço
            - tags: array de tags relevantes
            - sentiment: sentimento (positive, negative, neutral)
            - urgencyLevel: nível de urgência (low, medium, high)
            - emotionalTriggers: array de gatilhos emocionais identificados
            - suggestions: array de sugestões de melhoria
            - confidence: nível de confiança da análise (0-1)
            
            Seja preciso e baseie sua análise no conteúdo fornecido.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: OPENAI_CONFIG.TEMPERATURE,
      });

      const analysisText = response.choices[0]?.message?.content;
      if (!analysisText) {
        throw new Error('No analysis returned from OpenAI');
      }

      const analysis = JSON.parse(analysisText);
      
      return {
        hookType: analysis.hookType as HookType,
        niche: analysis.niche,
        tags: analysis.tags,
        sentiment: analysis.sentiment,
        urgencyLevel: analysis.urgencyLevel,
        emotionalTriggers: analysis.emotionalTriggers,
        suggestions: analysis.suggestions,
        confidence: analysis.confidence,
        processedAt: new Date(),
      };
    } catch (error) {
      logger.error('Error analyzing creative with AI:', error);
      
      // Return default analysis if AI fails
      return {
        hookType: 'other',
        niche: 'Não identificado',
        tags: [],
        sentiment: 'neutral',
        urgencyLevel: 'low',
        emotionalTriggers: [],
        suggestions: [],
        confidence: 0,
        processedAt: new Date(),
      };
    }
  }

  private buildAnalysisPrompt(creative: Creative): string {
    return `
Analise o seguinte criativo publicitário:

HEADLINE: ${creative.headline}
DESCRIÇÃO: ${creative.description}
CALL TO ACTION: ${creative.callToAction}
PÁGINA: ${creative.pageName}
PLATAFORMA: ${creative.platform}
FORMATO: ${creative.format}
URL DE DESTINO: ${creative.destinationUrl}

Por favor, analise este criativo e identifique:
1. O tipo de gancho principal utilizado
2. O nicho/categoria do produto/serviço
3. Tags relevantes para categorização
4. O sentimento geral do criativo
5. O nível de urgência transmitido
6. Gatilhos emocionais identificados
7. Sugestões de melhoria
8. Sua confiança na análise

Considere o contexto brasileiro e os padrões de marketing digital no Brasil.
    `.trim();
  }

  async analyzeBatch(creatives: Creative[]): Promise<CreativeAnalysis[]> {
    const analyses: CreativeAnalysis[] = [];
    
    for (const creative of creatives) {
      try {
        const analysis = await this.analyzeCreative(creative);
        analyses.push(analysis);
        
        // Add delay to respect rate limits
        await this.delay(1000);
      } catch (error) {
        logger.error(`Error analyzing creative ${creative.id}:`, error);
        
        // Add default analysis for failed ones
        analyses.push({
          hookType: 'other',
          niche: 'Não identificado',
          tags: [],
          sentiment: 'neutral',
          urgencyLevel: 'low',
          emotionalTriggers: [],
          suggestions: [],
          confidence: 0,
          processedAt: new Date(),
        });
      }
    }
    
    return analyses;
  }

  async generateTrendingInsights(creatives: Creative[]): Promise<string> {
    try {
      const recentCreatives = creatives
        .filter(c => c.analysis)
        .slice(0, 50) // Analyze last 50 creatives
        .map(c => ({
          headline: c.headline,
          hookType: c.analysis?.hookType,
          niche: c.analysis?.niche,
          tags: c.analysis?.tags,
        }));

      const prompt = `
Com base nos seguintes criativos publicitários recentes, gere insights sobre tendências emergentes:

${recentCreatives.map((c, i) => `
${i + 1}. Headline: ${c.headline}
   Gancho: ${c.hookType}
   Nicho: ${c.niche}
   Tags: ${c.tags?.join(', ')}
`).join('\n')}

Analise estes dados e forneça insights sobre:
1. Tendências de ganchos mais utilizados
2. Nichos em alta
3. Padrões emergentes
4. Recomendações estratégicas
5. Oportunidades identificadas

Seja específico e prático nas recomendações.
      `.trim();

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de tendências de marketing digital. Forneça insights práticos e acionáveis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'Não foi possível gerar insights no momento.';
    } catch (error) {
      logger.error('Error generating trending insights:', error);
      return 'Não foi possível gerar insights no momento.';
    }
  }

  async improveCreative(creative: Creative): Promise<string[]> {
    try {
      const prompt = `
Analise o seguinte criativo publicitário e sugira melhorias específicas:

HEADLINE: ${creative.headline}
DESCRIÇÃO: ${creative.description}
CALL TO ACTION: ${creative.callToAction}
NICHO: ${creative.analysis?.niche || 'Não identificado'}
GANCHO ATUAL: ${creative.analysis?.hookType || 'Não identificado'}

Forneça 5 sugestões específicas de melhoria, considerando:
1. Otimização do gancho
2. Melhoria da headline
3. Aprimoramento da descrição
4. Otimização do CTA
5. Aumento da conversão

Seja específico e prático.
      `.trim();

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em otimização de criativos publicitários. Forneça sugestões práticas e específicas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.5,
      });

      const suggestions = response.choices[0]?.message?.content?.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0) || [];

      return suggestions;
    } catch (error) {
      logger.error('Error improving creative:', error);
      return ['Não foi possível gerar sugestões no momento.'];
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

// Export convenience functions
export const analyzeCreative = (creative: Creative) => aiService.analyzeCreative(creative);
export const analyzeBatch = (creatives: Creative[]) => aiService.analyzeBatch(creatives);
export const generateTrendingInsights = (creatives: Creative[]) => aiService.generateTrendingInsights(creatives);
export const improveCreative = (creative: Creative) => aiService.improveCreative(creative);