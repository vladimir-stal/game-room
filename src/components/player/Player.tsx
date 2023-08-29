import { FC } from 'react';

interface PlayerProps {
  name: string;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColorClass() {
  const bgColors = [
    'bg-purple-100',
    'bg-blue-100',
    'bg-yellow-100',
    'bg-red-100',
  ];
  return bgColors[getRandomInt(0, bgColors.length - 1)];
}

const Player: FC<PlayerProps> = ({ name }) => {
  const bgColor = getRandomColorClass();

  return (
    <div
      className={`border border-dashed border-black h-10 px-2 pt-2 ${bgColor}`}
    >
      {name}
    </div>
  );
};

export default Player;
