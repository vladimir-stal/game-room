import { fetchRedis } from '@/helpers/redis';
import { NextResponse } from 'next/server';
//import { notFound } from 'next/navigation';

export async function GET(
  request: Request,
  context: { params: { roomId: string } }
) {
  const { roomId } = context.params;

  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `room:${roomId}:players`,
      0,
      -1
    );

    const players = results.map((player) => JSON.parse(player) as Player);
    console.log('players', players);

    return NextResponse.json({ players });
  } catch (error) {
    console.log(`ERROR GET room/${roomId}/players`, error);
  }
}
