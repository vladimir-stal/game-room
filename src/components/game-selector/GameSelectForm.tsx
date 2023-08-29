import { redirect } from 'next/navigation';
import Select from '../Select';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const options = [{ value: 'hat', label: 'The Hat' }];

function generateRoomId(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const GameSelectForm = async () => {
  const session = await getServerSession(authOptions);
  if (session === null) {
    redirect('/login');
  }

  const createGameRoom = async (formData: FormData) => {
    'use server';
    const gameType = formData.get('type');
    const roomId = generateRoomId(4);
    try {
      await axios.post(`${process.env.API_URL}/game/${roomId}`, {
        userId: session.user!.image,
        gameType,
      });
    } catch (error) {
      console.log(error);
    }
    redirect(`/room/${roomId}/`);
  };

  return (
    <div className="w-1/5 min-w-[200px] bg-green-100 m-auto p-4 mt-2 rounded border border-black border-dashed">
      <form
        action={createGameRoom}
        className="flex flex-col gap-2 justify-center content-center items-center"
      >
        <Select name="type" options={options} />
        <button
          type="submit"
          className="border border-black rounded w-[100px] bg-purple-100 disabled"
        >
          Create room
        </button>
      </form>
    </div>
  );
};

export default GameSelectForm;
