const DEFAULT_HEADER = "apikey";

export type EvolutionSendTextParams = {
  number: string;
  text: string;
};

export async function sendEvolutionText(
  baseUrl: string,
  apiKey: string,
  instanceName: string,
  params: EvolutionSendTextParams
): Promise<{ ok: boolean; error?: string }> {
  const url = `${baseUrl.replace(/\/$/, "")}/message/sendText/${instanceName}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [DEFAULT_HEADER]: apiKey,
    },
    body: JSON.stringify({
      number: params.number.replace(/\D/g, ""),
      text: params.text,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text || res.statusText };
  }
  return { ok: true };
}
