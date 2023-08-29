import './globals.css';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const joinGame = async (formData: FormData) => {
  'use server';
  const gameCode = formData.get('code');
  redirect(`/room/${gameCode}`);
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session === null) {
    redirect('/login');
  }

  return (
    <>
      <header className="flex flex-col justify-center gap-2 p-2 border border-black border-dashed w-[500px] m-auto mt-4 bg-white">
        <div className="border border-solid border-black p-3 font-bold text-lg text-center bg-green-100">
          <Link href="/">GAME ROOM</Link>
        </div>
      </header>
      <main className="flex flex-col justify-center gap-2 p-2 border border-black border-dashed w-[500px] m-auto mt-5 bg-white">
        <div className="flex flex-row gap-2 justify-between">
          <form className="flex flex-row gap-1" action={joinGame}>
            <input
              type="text"
              name="code"
              placeholder="ROOM CODE"
              className="border rounded border-black px-4 w-[130px]"
            ></input>
            <button className="border rounded border-black px-2 bg-green-100">
              JOIN GAME
            </button>
          </form>
          <div>OR</div>
          <Link
            href="/create"
            className="border rounded border-black px-2 bg-green-100"
          >
            CREATE GAME
          </Link>
        </div>
      </main>
    </>
  );
}
