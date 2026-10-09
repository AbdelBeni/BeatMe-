import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.pointHistory.deleteMany();
  await prisma.match.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared all existing data');

  const users = [
    {
      discordId: '111111111111111111',
      discordUsername: 'PlayerTD',
      discordAvatar: null,
      riotGameName: 'PlayerTD',
      riotTagLine: 'css',
      riotPuuid: 'puuid-1',
      riotTier: 'GOLD_2',
      riotTierIcon: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/15/largeicon.png',
      riotRegion: 'EU',
      rating: 0,
      wins: 0,
      losses: 0,
      region: 'EU',
    },
    {
      discordId: '222222222222222222',
      discordUsername: 'ShadowStrike',
      discordAvatar: null,
      riotGameName: 'ShadowStrike',
      riotTagLine: 'EUW',
      riotPuuid: 'puuid-2',
      riotTier: 'PLATINUM_1',
      riotTierIcon: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
      riotRegion: 'EU',
      rating: 0,
      wins: 0,
      losses: 0,
      region: 'EU',
    },
    {
      discordId: '333333333333333333',
      discordUsername: 'AceHunter',
      discordAvatar: null,
      riotGameName: 'AceHunter',
      riotTagLine: 'FR',
      riotPuuid: 'puuid-3',
      riotTier: 'DIAMOND_2',
      riotTierIcon: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/21/largeicon.png',
      riotRegion: 'EU',
      rating: 0,
      wins: 0,
      losses: 0,
      region: 'EU',
    },
    {
      discordId: '444444444444444444',
      discordUsername: 'Nocturnal',
      discordAvatar: null,
      riotGameName: 'Nocturnal',
      riotTagLine: 'NA1',
      riotPuuid: 'puuid-4',
      riotTier: 'SILVER_3',
      riotTierIcon: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/12/largeicon.png',
      riotRegion: 'NA',
      rating: 0,
      wins: 0,
      losses: 0,
      region: 'NA',
    },
    {
      discordId: '555555555555555555',
      discordUsername: 'CyberWolf',
      discordAvatar: null,
      riotGameName: 'CyberWolf',
      riotTagLine: 'DE',
      riotPuuid: 'puuid-5',
      riotTier: 'ASCENDANT_1',
      riotTierIcon: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/24/largeicon.png',
      riotRegion: 'EU',
      rating: 0,
      wins: 0,
      losses: 0,
      region: 'EU',
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log(`✅ Created ${users.length} test users (all at 0 PR)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });