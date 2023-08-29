'use client';

import RoomHeader from '@/components/room/RoomHeader';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Game Room',
  description: 'Game Room project with Next.js',
};

interface RoomLayout {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default function Layout({ children, params }: RoomLayout) {
  const { data: session, status } = useSession();
  const { id: roomId } = params;

  return (
    <>
      {status === 'authenticated' ? (
        <RoomHeader roomId={roomId}>{children}</RoomHeader>
      ) : (
        <div className="m-auto text-center mt-5">Loading...</div>
      )}
    </>
  );
}
