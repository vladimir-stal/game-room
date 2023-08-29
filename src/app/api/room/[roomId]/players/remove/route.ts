import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(
  request: Request,
  context: { params: { roomId: string } }
) {
  const { roomId } = context.params;
  const { userId } = await request.json();

  console.log(`>> POST room/${roomId}/players/remove`, userId);

  const userIdNum = Number(userId);
  await db.zremrangebyscore(`room:${roomId}:players`, userIdNum, userIdNum);

  await pusherServer.trigger(`room-${roomId}-players`, 'remove-player', {
    id: userId,
  });

  return new Response('OK');
}
