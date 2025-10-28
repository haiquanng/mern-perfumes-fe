import type { User } from 'firebase/auth';

const adminEmails = new Set<string>([
  'admin@example.com'
]);

export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false;
  return adminEmails.has(user.email);
}


