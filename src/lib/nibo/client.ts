const NIBO_BASE = "https://api.nibo.com.br/empresas/v1";

export type NiboStakeholder = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
};

export async function fetchNiboStakeholders(
  apiToken: string,
  options?: { orderBy?: string; top?: number; skip?: number }
): Promise<{ data: NiboStakeholder[]; count: number }> {
  const orderBy = options?.orderBy ?? "name";
  const top = options?.top ?? 500;
  const skip = options?.skip ?? 0;
  const params = new URLSearchParams({
    $orderBy: orderBy,
    $top: String(top),
    $skip: String(skip),
  });
  const url = `${NIBO_BASE}/stakeholders?${params.toString()}`;
  const res = await fetch(url, {
    headers: { ApiToken: apiToken },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Nibo API ${res.status}`);
  }
  const json = (await res.json()) as { value?: NiboStakeholder[]; count?: number };
  const data = Array.isArray(json.value) ? json.value : Array.isArray(json) ? json : [];
  const count = typeof json.count === "number" ? json.count : data.length;
  return { data, count };
}
