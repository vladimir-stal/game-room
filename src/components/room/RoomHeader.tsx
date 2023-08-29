'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface RoomHeaderProps {
  children: ReactNode;
  roomId: string;
}

export default function RoomHeader({ children, roomId }: RoomHeaderProps) {
  const { status } = useSession();

  return (
    <>
      <header className="flex flex-col justify-center gap-2 p-2 border border-black border-dashed w-[500px] m-auto mt-4 bg-white">
        <div className="border border-solid border-black p-3 font-bold text-lg text-center bg-green-100">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2 pl-2">
              <div>GAME ROOM</div>
              <div className="border border-dashed border-black px-3 bg-purple-300">
                CODE: {roomId}
              </div>
            </div>
            <Link href="/" className="border rounded border-black px-3">
              Leave
            </Link>
            <button
              className="border rounded border-black px-3"
              onClick={() => {
                signOut();
              }}
            >
              Signout
            </button>
          </div>
        </div>
      </header>
      {status === 'authenticated' ? children : 'Loading...'}
    </>
  );
}
