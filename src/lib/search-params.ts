export async function readSearchParams(
  input?: Promise<Record<string, string | string[] | undefined>>,
) {
  const params = input ? await input : {};

  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    success: get("success"),
    error: get("error"),
  };
}

export async function readListParams(
  input?: Promise<Record<string, string | string[] | undefined>>,
) {
  const params = input ? await input : {};

  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const pageValue = Number.parseInt(get("page") ?? "1", 10);

  return {
    success: get("success"),
    error: get("error"),
    domain: (get("domain") ?? "").trim().toLowerCase(),
    query: (get("q") ?? "").trim(),
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
  };
}

export function buildListHref(
  pathname: string,
  options: {
    domain?: string;
    query?: string;
    page?: number;
    success?: string;
    error?: string;
  },
) {
  const params = new URLSearchParams();

  if (options.domain) {
    params.set("domain", options.domain);
  }

  if (options.query) {
    params.set("q", options.query);
  }

  if (options.page && options.page > 1) {
    params.set("page", String(options.page));
  }

  if (options.success) {
    params.set("success", options.success);
  }

  if (options.error) {
    params.set("error", options.error);
  }

  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    totalItems,
    totalPages,
    currentPage,
    start,
    end: Math.min(end, totalItems),
  };
}
