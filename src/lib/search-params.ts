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
