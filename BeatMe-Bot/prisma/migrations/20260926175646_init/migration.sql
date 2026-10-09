-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,
    "discordAvatar" TEXT,
    "riotPuuid" TEXT,
    "riotGameName" TEXT,
    "riotTagLine" TEXT,
    "riotTier" TEXT,
    "riotTierIcon" TEXT,
    "riotRegion" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 1000,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "region" TEXT NOT NULL DEFAULT 'EU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "discordChannelId" TEXT,
    "discordMessageId" TEXT,
    "refereeDiscordId" TEXT,
    "pointsDelta" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_riotPuuid_key" ON "User"("riotPuuid");

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "User"("rating" DESC);

-- CreateIndex
CREATE INDEX "User_region_rating_idx" ON "User"("region", "rating" DESC);

-- CreateIndex
CREATE INDEX "Match_player1Id_idx" ON "Match"("player1Id");

-- CreateIndex
CREATE INDEX "Match_player2Id_idx" ON "Match"("player2Id");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "PointHistory_userId_idx" ON "PointHistory"("userId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointHistory" ADD CONSTRAINT "PointHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
