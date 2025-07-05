/*
  Warnings:

  - You are about to drop the `ChatroomDates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatroomDates" DROP CONSTRAINT "ChatroomDates_chatroomId_fkey";

-- DropTable
DROP TABLE "ChatroomDates";
