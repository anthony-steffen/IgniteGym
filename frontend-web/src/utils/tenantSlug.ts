export function normalizeTenantSlug(slug?: string | null): string | null {
  if (!slug) return null;

  const normalized = slug.trim();
  if (!normalized) return null;

  if (normalized === 'undefined' || normalized === 'null') {
    return null;
  }

  return normalized;
}

export function hasValidTenantSlug(slug?: string | null): slug is string {
  return normalizeTenantSlug(slug) !== null;
}
