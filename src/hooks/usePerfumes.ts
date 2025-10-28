import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { mockPerfumes, Perfume } from '../api/mockData';

type Filters = Partial<{ q: string; brand: string; concentration: string; targetAudience: string }>;

export function usePerfumes(filters?: Filters) {
  const query = new URLSearchParams((filters || {}) as Record<string, string>).toString();
  return useQuery<Perfume[]>({
    queryKey: ['perfumes', filters],
    queryFn: async () => {
      try {
        const res = await api.get(`/perfumes${query ? `?${query}` : ''}`);
        return res.data;
      } catch {
        return mockPerfumes;
      }
    }
  });
}


