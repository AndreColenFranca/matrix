import { GoogleGenAI, Type } from '@google/genai';
import { Quadrant } from './types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second between retries

let lastRequestTime = 0;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiAPI(taskDescription: string): Promise<Quadrant> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Atue como um especialista em produtividade. Categorize a seguinte tarefa na Matriz de Eisenhower: "${taskDescription}".

    CRITÉRIOS DE DECISÃO:
    - DO (Fazer): Tarefas críticas, crises ou com prazos fatais que exigem SEU talento e conhecimento estratégico. (Ex: Resolver bug crítico em produção, finalizar proposta comercial estratégica).
    - SCHEDULE (Agendar): Atividades importantes para o longo prazo, mas sem urgência imediata. Foco em crescimento e prevenção. (Ex: Planejamento trimestral, Exercícios, Networking).
    - DELEGATE (Delegar): Tarefas que precisam ser feitas LOGO (Urgentes), mas que não exigem seu nível de especialidade. São tarefas operacionais, administrativas ou rotinas que outra pessoa qualificada poderia executar. (Ex: Agendar salas, formatar planilhas, triagem de e-mails básicos, compras de suprimentos urgentes).
    - ELIMINATE (Eliminar): Distrações, tarefas sem valor agregado ou atividades que consomem tempo sem gerar resultados.

    Responda apenas com o JSON contendo a categoria: DO, SCHEDULE, DELEGATE ou ELIMINATE.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'A categoria da Matriz: DO, SCHEDULE, DELEGATE ou ELIMINATE',
              },
            },
            required: ['category'],
          },
        },
      });

      const text = response.text || '';
      const json = JSON.parse(text.trim());
      const cat = json.category.toUpperCase();

      if (Object.values(Quadrant).includes(cat as Quadrant)) {
        return cat as Quadrant;
      }
      return Quadrant.DO;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);

      // If 429 rate limit error, wait longer before retry
      if (error.status === 429 && attempt < MAX_RETRIES) {
        const waitTime = RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await sleep(waitTime);
      } else if (attempt === MAX_RETRIES) {
        console.error('Max retries exceeded');
        break;
      }
    }
  }

  console.error('Failed to categorize task after retries:', lastError);
  return Quadrant.DO;
}

export async function categorizeTask(taskDescription: string): Promise<Quadrant> {
  // Apply rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await sleep(RATE_LIMIT_DELAY - timeSinceLastRequest);
  }

  const result = await callGeminiAPI(taskDescription);
  lastRequestTime = Date.now();
  return result;
}
