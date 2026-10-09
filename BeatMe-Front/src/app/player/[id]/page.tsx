import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import "./player.css";

interface PageProps {
  params: { id: string };
}

export default async function PlayerPage({ params }: PageProps) {
  const playerId = Number(params.id);
  if (isNaN(playerId)) notFound();

  const player = await prisma.user.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      discordUsername: true,
      discordAvatar: true,
      discordId: true,
      riotGameName: true,
      riotTagLine: true,
      riotTier: true,
      riotTierIcon: true,
      riotRegion: true,
      rating: true,
      wins: true,
      losses: true,
      region: true,
      createdAt: true,
    },
  });

  if (!player) notFound();

  // جلب آخر 10 مباريات
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { player1Id: player.id },
        { player2Id: player.id },
      ],
      status: "completed",
    },
    orderBy: { completedAt: "desc" },
    take: 10,
    include: {
      player1: { select: { id: true, discordUsername: true, riotGameName: true } },
      player2: { select: { id: true, discordUsername: true, riotGameName: true } },
    },
  });

  // حساب الرانك العالمي
  const rank = await prisma.user.count({
    where: { rating: { gt: player.rating } },
  });

  const totalGames = player.wins + player.losses;
  const winRate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : "0.0";

  return (
    <div className="player-page">
      <div className="player-header">
        <div className="player-avatar-large">
          {player.discordAvatar ? (
            <img
              src={`https://cdn.discordapp.com/avatars/${player.discordId}/${player.discordAvatar}.png?size=256`}
              alt={player.discordUsername}
            />
          ) : (
            <div className="avatar-placeholder-large">
              {player.discordUsername.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="player-info">
          <h1>{player.discordUsername}</h1>
          {player.riotGameName && player.riotTagLine && (
            <p className="valorant-id">
              {player.riotGameName}#{player.riotTagLine}
            </p>
          )}
          <p className="player-region">Region: {player.region}</p>
        </div>

        <div className="player-rank">
          <span className="rank-label">Global Rank</span>
          <span className="rank-value">#{rank + 1}</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card--rating">
          <span className="stat-label">Rating</span>
          <span className="stat-value">{player.rating.toLocaleString("en-US")} <small>PR</small></span>
        </div>

        <div className="stat-card stat-card--wins">
          <span className="stat-label">Wins</span>
          <span className="stat-value">{player.wins}</span>
        </div>

        <div className="stat-card stat-card--losses">
          <span className="stat-label">Losses</span>
          <span className="stat-value">{player.losses}</span>
        </div>

        <div className="stat-card stat-card--winrate">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{winRate}%</span>
        </div>

        <div className="stat-card stat-card--tier">
          <span className="stat-label">Valorant Tier</span>
          <div className="stat-tier-content">
            {player.riotTierIcon && (
              <img src={player.riotTierIcon} alt="" width={40} height={40} />
            )}
            <span className="stat-value-small">
              {player.riotTier?.replace("_", " ") || "Unranked"}
            </span>
          </div>
        </div>
      </div>

      <div className="matches-section">
        <h2>Recent Matches</h2>
        {matches.length === 0 ? (
          <p className="no-matches">No completed matches yet.</p>
        ) : (
          <div className="matches-list">
            {matches.map((match) => {
              const isPlayer1 = match.player1Id === player.id;
              const opponent = isPlayer1 ? match.player2 : match.player1;
              const won = match.winnerId === player.id;

              return (
                <div
                  key={match.id}
                  className={`match-row ${won ? "match-row--won" : "match-row--lost"}`}
                >
                  <span className="match-result">{won ? "WIN" : "LOSS"}</span>
                  <span className="match-opponent">
                    vs{" "}
                    <Link href={`/player/${opponent.id}`}>
                      {opponent.discordUsername}
                    </Link>
                  </span>
                  <span className="match-points">
                    {won ? "+50" : "-50"} PR
                  </span>
                  <span className="match-date">
                    {match.completedAt
                      ? new Date(match.completedAt).toLocaleDateString("en-US")
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}