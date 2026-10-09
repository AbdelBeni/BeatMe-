const HENRIK_API = "https://api.henrikdev.xyz/valorant";

export interface ValorantAccount {
  puuid: string;
  region: string;
  account_level: number;
  name: string;
  tag: string;
  card: {
    small: string;
    large: string;
  };
}

export interface ValorantMMR {
  currenttier: number;
  currenttierpatched: string;
  ranking_in_tier: number;
  mmr_change_to_last_game: number;
  elo: number;
  images: {
    small: string;
    large: string;
    triangle_down: string;
    triangle_up: string;
  };
}

interface HenrikResponse<T> {
  status: number;
  data: T;
}

function henrikHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const key = process.env.HENRIK_API_KEY;
  if (key && key.trim()) {
    headers["Authorization"] = key.trim();
  }

  return headers;
}

export async function fetchValorantAccount(
  gameName: string,
  tagLine: string
): Promise<ValorantAccount> {
  const url = `${HENRIK_API}/v1/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

  const res = await fetch(url, {
    headers: henrikHeaders(),
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new ValorantNotFoundError("Account not found");
  }

  if (res.status === 429) {
    throw new Error("Rate limited by Henrik API. Please wait a moment.");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Henrik API error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as HenrikResponse<ValorantAccount>;

  if (!json.data) {
    throw new ValorantNotFoundError("Account not found");
  }

  return json.data;
}

export async function fetchValorantMMR(
  region: string,
  gameName: string,
  tagLine: string
): Promise<ValorantMMR> {
  const url = `${HENRIK_API}/v2/mmr/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

  const res = await fetch(url, {
    headers: henrikHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Henrik MMR error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as HenrikResponse<ValorantMMR>;
  return json.data;
}

export class ValorantNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValorantNotFoundError";
  }
}