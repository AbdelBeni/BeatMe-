import Link from "next/link";
import "./top.css";

interface Player {
  id: number;
  rank: number;
  discordUsername: string;
  discordId: string;
  discordAvatar: string | null;
  riotGameName: string | null;
  riotTagLine: string | null;
  riotTier: string | null;
  riotTierIcon: string | null;
  rating: number;
  wins: number;
  losses: number;
  region: string;
}

interface TopPlayersProps {
  players: Player[];
}

export default function TopPlayers({ players }: TopPlayersProps) {
  if (players.length === 0) {
    return (
      <section className="TopPlayers">
        <div className="Empty-State">
          <p>No players found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="TopPlayers">
      <table className="w-full">
        <colgroup>
          <col className="rank-col" />
          <col className="player-col" />
          <col className="tier-col" />
          <col className="rating-col" />
          <col className="wins-col" />
        </colgroup>

        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Tier</th>
            <th>Rating</th>
            <th className="Td-Right">Wins</th>
          </tr>
        </thead>

        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td className="Rank-Cell">{player.rank}</td>
              <td>
                <Link href={`/player/${player.id}`} className="User-Info">
                  <div className="Profile-Picture">
                    {player.discordAvatar ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${player.discordId}/${player.discordAvatar}.png`}
                        alt=""
                      />
                    ) : (
                      <div className="Avatar-Placeholder">
                        {player.discordUsername.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="User-Name">
                    <span className="Discord-UserName">{player.discordUsername}</span>
                    {player.riotGameName && player.riotTagLine && (
                      <span className="Valorant-UserName">
                        {player.riotGameName}#{player.riotTagLine}
                      </span>
                    )}
                  </div>
                </Link>
              </td>
              <td className="Tier-Icon">
                {player.riotTierIcon ? (
                  <img
                    src={player.riotTierIcon}
                    alt={player.riotTier || ""}
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className="No-Tier">—</span>
                )}
              </td>
              <td className="PR-COl">
                <span className="Player-Rating">
                  {player.rating.toLocaleString("en-US")}
                </span>
                <span className="PR-icon">PR</span>
              </td>
              <td className="Td-Right">
                <span className="ALL-Wins">{player.wins}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}