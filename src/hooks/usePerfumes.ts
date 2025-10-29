import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { mockPerfumes, Perfume } from '../api/mockData';

type Filters = Partial<{ q: string; brand: string; concentration: string; targetAudience: string }>;

export function usePerfumes(filters?: Filters) {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters || {}).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'all')
  ) as Record<string, string>;

  return useQuery<Perfume[]>({
    queryKey: ['perfumes', cleanedFilters],
    queryFn: async () => {
      try {
        const res = await api.get('/perfumes', { params: cleanedFilters });
        return res.data;
      } catch {
        return mockPerfumes;
      }
    }
  });
}


