import { api } from '../api/client';

export type UpdateProfileBody = {
  name?: string;
  yob?: number | null;
  gender?: 'male' | 'female' | 'other' | '' | null;
};

export async function fetchProfileService() {
  const { data } = await api.get('/profile');
  return data;
}

export async function updateProfileService(body: UpdateProfileBody) {
  const { data } = await api.put('/profile', body);
  return data;
}

export async function changePasswordService(params: { currentPassword: string; newPassword: string }) {
  const { data } = await api.put('/profile/password', params);
  return data;
}
