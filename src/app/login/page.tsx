'use client';

import { FC, FormEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

const Page: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>('');

  async function login(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signIn('credentials', {
        name: username,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Hello! What's your name?
            </h2>
          </div>
          <form onSubmit={login} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="YOUR NAME"
              value={username}
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="border-black w-full px-10 box-border text-center text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="border border-black border-dashed bg-green-100 text-black hover:bg-green-200 h-10 py-2 px-4 max-w-sm mx-auto w-full active:scale-95 
              inline-flex items-center justify-center rounded-md text-sm font-medium transition-color 
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none"
              onClick={login}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
