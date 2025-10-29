const adminEmails = new Set<string>([
  'admin@example.com'
]);

export function isAdmin(user: { email?: string; isAdmin?: boolean } | null): boolean {
  if (!user) return false;
  // Check isAdmin flag first
  if (user.isAdmin === true) return true;
  // Fallback to email check
  return user.email ? adminEmails.has(user.email) : false;
}


