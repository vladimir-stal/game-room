import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { roomId, gameType, userId } = await request.json();

  console.log(`>> POST /game/create`, roomId, gameType, userId);

  const game: Game = {
    type: gameType,
  };

  try {
    await db.set(`game:${roomId}`, JSON.stringify(game));
    if ((gameType as GameType) === 'hat') {
      const game: HatGame = {
        type: 'hat',
        status: 'created',
        hostUserId: userId,
      };
      await db.set(`game:${roomId}:hat`, JSON.stringify(game));
    }
  } catch (error) {
    console.log('ERROR');
  }

  return new Response('OK');
}
