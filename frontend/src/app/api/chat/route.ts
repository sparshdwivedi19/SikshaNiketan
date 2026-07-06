import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-pro'),
      system: `You are Shiksha Niketan AI, an expert tutor and mentor for students preparing for highly competitive Indian entrance exams, specifically JEE (Main and Advanced) and NEET. You also help students with foundation concepts from class 6-10. 
      Your tone is encouraging, highly knowledgeable, precise, and supportive. 
      Format your responses using Markdown, and when explaining physics, chemistry, or math concepts, provide clear step-by-step reasoning. Do not give away the final answer immediately if it's a practice problem; try to guide the student.
      Keep your responses concise unless a deep explanation is requested.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request." }), { status: 500 });
  }
}
