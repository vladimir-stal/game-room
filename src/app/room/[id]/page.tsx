'use client';
import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useRef,
  MutableRefObject,
} from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';
import Player from '@/components/player/Player';
import Game from '@/components/game/Game';

type GameRoomProps = {
  params: {
    id: string;
  };
};

type Player = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
};

async function getPlayers(roomId: string) {
  try {
    const results = await axios.get(`/api/room/${roomId}/players`);
    return results.data.players;
  } catch (error) {
    console.log('error getPlayers', error);
  }
}

const getGame = async (roomId: string) => {
  try {
    const result = await axios.get<Game>(`/api/game/${roomId}`);
    return result.data.type;
  } catch (error) {
    console.log('error getGame', error);
  }
};

const addPlayerToRoom = async (
  roomId: string,
  userId: string,
  username: string
) => {
  try {
    await axios.post(`/api/room/${roomId}/players/add`, {
      userId,
      username,
    });
  } catch (error) {
    console.log('error addPlayerToRoom', error);
  }
};

const removePlayerFromRoom = async (roomId: string, userId: string) => {
  try {
    await axios.post(`/api/room/${roomId}/players/remove`, {
      userId,
    });
  } catch (error) {
    console.log('error removePlayerFromRoom', error);
  }
};

const useRoomPlayersSubscribe = (
  roomId: string,
  players: MutableRefObject<Player[]>,
  setPlayers: Dispatch<SetStateAction<Player[]>>
) => {
  useEffect(() => {
    const channelName = `room-${roomId}-players`;
    const addPlayerEventName = 'new-player';
    const removePlayerEventName = 'remove-player';

    pusherClient.subscribe(channelName);

    const newPlayerHandler = (player: Player) => {
      if (players.current.find((pl) => pl.id === player.id)) {
        return;
      }
      setPlayers((prev) => [...prev, player]);
    };

    const removePlayerHandler = (player: Player) => {
      setPlayers((prev) => prev.filter((pl) => pl.id !== player.id));
    };

    pusherClient.bind(addPlayerEventName, newPlayerHandler);
    pusherClient.bind(removePlayerEventName, removePlayerHandler);

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind(addPlayerEventName, newPlayerHandler);
      pusherClient.unbind(removePlayerEventName, removePlayerHandler);
    };
  }, []);
};

const GameRoom = ({ params }: GameRoomProps) => {
  const roomId = params.id;

  const handleTabClosing = async (e: any) => {
    if (status === 'authenticated') {
      const userId = session.user!.image!;
      await removePlayerFromRoom(roomId, userId);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClosing);
    return () => {
      window.removeEventListener('beforeunload', handleTabClosing);
    };
  }, []);

  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({ id: '', name: '' });
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameType, setGameType] = useState<GameType | null>(null);

  const playersRef = useRef<Player[]>([]);

  useEffect(() => {
    playersRef.current = players;
  }, [players.length]);

  useRoomPlayersSubscribe(roomId, playersRef, setPlayers);

  useEffect(() => {
    if (status === 'authenticated') {
      const userName = session.user!.name!;
      const userId = session.user!.image!;
      setUser({ id: userId, name: userName });
      (async () => {
        await addPlayerToRoom(roomId, userId, userName);
        const playersInRoom = await getPlayers(roomId);
        setPlayers(playersInRoom);
        const gType = await getGame(roomId);
        if (gType) {
          setGameType(gType as GameType);
        }
      })();
    }
  }, [status]);

  return (
    <main className="flex flex-col items-center justify-center mt-3 gap-2 m-auto">
      <div className="flex flex-row items-center justify-center gap-1 w-1/2 min-w-[500px]">
        {players.length > 0 &&
          players.map((player) => (
            <Player key={player.id} name={player.name} />
          ))}
      </div>
      {!user.name && <div>Loading...</div>}
      {user.name && <></>}
      {gameType && <Game type={gameType} />}
    </main>
  );
};

export default GameRoom;
