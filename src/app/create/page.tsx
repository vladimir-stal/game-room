import GameSelectForm from '@comp/game-selector/GameSelectForm';

type Props = {};

const CreateGamePage = (props: Props) => {
  return (
    <>
      <header className="flex flex-col justify-center gap-2 p-2 border border-black border-dashed w-[500px] m-auto mt-4 bg-white">
        <div className="border border-solid border-black p-3 font-bold text-lg text-center bg-green-100">
          CREATE GAME ROOM
        </div>
      </header>
      <GameSelectForm />
    </>
  );
};

export default CreateGamePage;
