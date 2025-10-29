import { api } from '../api/client';

export async function getSimilarPerfumes(perfumeId: string, forceRefresh?: boolean) {
  const { data } = await api.get(`/ai/similar/${perfumeId}`, {
    params: forceRefresh ? { forceRefresh: 'true' } : undefined,
  });
  return data as { perfumes: any[]; source: string; analyzedAt?: string };
}

export async function getAISummary(perfumeId: string, forceRefresh?: boolean) {
  const { data } = await api.get(`/ai/summary/${perfumeId}`, {
    params: forceRefresh ? { forceRefresh: 'true' } : undefined,
  });
  return data as { summary: string; source: string; generatedAt?: string; reviewsCount?: number };
}

export async function chatOnce(params: {
  query: string;
  includeContext?: boolean;
  image?: string; // base64 encoded image
}) {
  const { data } = await api.post('/ai/chat', {
    query: params.query,
    includeContext: !!params.includeContext,
    image: params.image,
    stream: false,
  });
  return data as { reply: string; query: string; timestamp: string };
}

export async function streamingChat(
  params: {
    query: string;
    includeContext?: boolean;
    image?: string;
  },
  onChunk: (text: string) => void,
  signal?: AbortSignal
) {
  const baseUrl = (api.defaults as any)?.baseURL || '';
  const resp = await fetch(`${baseUrl}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: params.query, includeContext: !!params.includeContext, stream: true, image: params.image }),
    credentials: 'include',
    signal,
  });

  const reader = resp.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'chunk' && typeof data.content === 'string') {
            onChunk(data.content);
          }
        } catch {}
      }
    }
  }
}
