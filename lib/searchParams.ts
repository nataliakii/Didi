export type SearchParamValue = string | string[] | undefined;

export function getParam(
  params: Record<string, SearchParamValue>,
  key: string,
): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function buildQueryString(
  current: URLSearchParams,
  updates: Record<string, string | null | undefined>,
  resetPage = true,
): string {
  const next = new URLSearchParams(current.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }

  if (resetPage) {
    next.delete("page");
  }

  const query = next.toString();
  return query ? `?${query}` : "";
}

export function setParam(
  current: URLSearchParams,
  key: string,
  value: string | null | undefined,
  resetPage = true,
): string {
  return buildQueryString(current, { [key]: value }, resetPage);
}

export function toggleParam(
  current: URLSearchParams,
  key: string,
): string {
  const isActive = current.get(key) === "true";
  return buildQueryString(current, { [key]: isActive ? null : "true" });
}

export function clearFilters(
  current: URLSearchParams,
  keys: string[],
): string {
  const updates: Record<string, null> = {};
  for (const key of keys) {
    updates[key] = null;
  }
  return buildQueryString(current, updates);
}

export function buildPageHref(
  current: URLSearchParams,
  page: number,
): string {
  const next = new URLSearchParams(current.toString());
  if (page <= 1) {
    next.delete("page");
  } else {
    next.set("page", String(page));
  }
  const query = next.toString();
  return query ? `?${query}` : "";
}
