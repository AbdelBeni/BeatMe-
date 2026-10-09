const DISCORD_API = "https://discord.com/api/v10";

export interface DiscordTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name?: string;
}

export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
  });

  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Discord token exchange failed: ${error}`);
  }

  return response.json();
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Discord user");
  }

  return response.json();
}

export async function addUserToGuild(
  discordUserId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${DISCORD_API}/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUserId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    }
  );

  if (!response.ok && response.status !== 204) {
    const error = await response.text();
    console.warn(`Guild join failed (continuing anyway): ${error}`);
  }
}

export function buildOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    response_type: "code",
    scope: "identify guilds.join",
    state,
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}