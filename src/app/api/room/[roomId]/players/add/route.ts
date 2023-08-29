import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  context: { params: { roomId: string } }
) {
  const { username, userId } = await request.json();
  const { roomId } = context.params;

  console.log('>> POST room/addPlayer');
  console.log(`room ${roomId}, username ${username}, userId: ${userId}`);

  const player: Player = {
    id: userId,
    name: username,
  };

  await db.zadd(`room:${roomId}:players`, {
    score: Number(userId),
    member: JSON.stringify(player),
  });

  await pusherServer.trigger(`room-${roomId}-players`, 'new-player', player);

  return new Response('OK');
}
