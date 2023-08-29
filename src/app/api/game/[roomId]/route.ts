import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

type RoomsType = {
  [id: string]: {
    players: {
      id: string;
      name: string;
    }[];
  };
};

const rooms: RoomsType = {};

// get game by roomId
export async function GET(
  request: Request,
  context: { params: { roomId: string } }
) {
  const { roomId } = context.params;
  const game: Game | null = await db.get(`game:${roomId}`);

  console.log(`>> GET /game/${roomId}`);

  if (!game) {
    return NextResponse.error();
  }
  console.log(typeof game);
  console.log('gameData', game);

  if (game.type === 'hat') {
    const specificGame: HatGame | null = await db.get(
      `game:${roomId}:${game.type}`
    );
    if (!specificGame) {
      return NextResponse.error();
    }
    return NextResponse.json({ ...specificGame, type: game.type });
  }

  return NextResponse.json({ game });
}

// create game with roomId
export async function POST(
  request: Request,
  context: { params: { roomId: string } }
) {
  const { roomId } = context.params;
  const { gameType, userId } = await request.json();

  console.log(`>> POST /game/${roomId}`, gameType, userId);

  const game: Game = {
    type: gameType,
  };

  try {
    await db.set(`game:${roomId}`, JSON.stringify(game));
    if ((gameType as GameType) === 'hat') {
      const game: HatGame = {
        status: 'created',
        hostUserId: userId,
        type: 'hat',
      };
      await db.set(`game:${roomId}:hat`, JSON.stringify(game));
    }
  } catch (error) {
    console.log(`>> POST /game/${roomId} ERROR!`, error);
  }

  return new Response('OK');
}
