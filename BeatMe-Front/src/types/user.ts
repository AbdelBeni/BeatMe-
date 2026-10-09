export interface User {
  id: number;
  discordId: string;
  discordUsername: string;
  discordAvatar: string | null;
  riotGameName: string | null;
  riotTagLine: string | null;
  riotTier: string | null;
  riotTierIcon: string | null;
  riotRegion: string | null;
  rating: number;
  wins: number;
  losses: number;
  region: string;
  createdAt: string;
}