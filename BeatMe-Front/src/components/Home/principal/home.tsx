import { prisma } from "@/lib/prisma";
import TopBar from "../principal/components/TopBar/topBar";
import TopPlayers from "../principal/components/Top/top";
import Pagination from "../principal/components/pagination/pagination";
import "./home.css";

const PAGE_SIZE = 25;

interface HomeProps {
  searchParams?: {
    page?: string;
    region?: string;
    search?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const region = searchParams?.region;
  const search = searchParams?.search?.trim();

  const where: any = {};
  if (region && region !== "all") where.region = region;
  if (search) {
    where.OR = [
      { discordUsername: { contains: search, mode: "insensitive" } },
      { riotGameName: { contains: search, mode: "insensitive" } },
      { riotTagLine: { contains: search, mode: "insensitive" } },
    ];
  }

  const [players, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { rating: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        discordUsername: true,
        discordId: true,
        discordAvatar: true,
        riotGameName: true,
        riotTagLine: true,
        riotTier: true,
        riotTierIcon: true,
        rating: true,
        wins: true,
        losses: true,
        region: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  const playersWithRank = players.map((p, i) => ({
    ...p,
    rank: (page - 1) * PAGE_SIZE + i + 1,
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section className="home" id="Home">
      <TopBar
        totalPlayers={total}
        initialRegion={region || "US"}
        initialSearch={search || ""}
      />
      <TopPlayers players={playersWithRank} />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={PAGE_SIZE}
      />
    </section>
  );
}