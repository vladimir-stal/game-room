import { FC } from 'react';
import HatGame from './HatGame';

interface GameProps {
  type: GameType;
}

const Game: FC<GameProps> = ({ type }) => {
  const games = {
    hat: <HatGame />,
    anotherGame: null,
  };

  return games['hat'];
};

export default Game;
