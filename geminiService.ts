import { GoogleGenAI, Type } from '@google/genai';
import { Quadrant } from './types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function categorizeTask(taskDescription: string): Promise<Quadrant> {
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
  try {
    const json = JSON.parse(text.trim());
    const cat = json.category.toUpperCase();
    if (Object.values(Quadrant).includes(cat as Quadrant)) {
      return cat as Quadrant;
    }
    return Quadrant.DO;
  } catch (e) {
    console.error('Erro ao processar resposta do Gemini:', e);
    return Quadrant.DO;
  }
}
