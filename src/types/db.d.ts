interface User {
  name: string;
  id: string;
}

interface Player {
  id: string;
  name: string;
}

interface Game {
  type: string;
}

interface HatGame extends Game {
  type: string = 'hat';
  status: string;
  hostUserId: string;
}
