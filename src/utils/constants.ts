export const ROUTES: { [key: string]: string } = {
  game: "/game",
  home: "/",
};

export const COMPLEXITY: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const CANVAS_SPEEDS: { speed: number; interval: number }[] = [
  {
    speed: 1,
    interval: 800,
  },
  {
    speed: 2,
    interval: 500,
  },
  {
    speed: 3,
    interval: 450,
  },
  {
    speed: 4,
    interval: 400,
  },
  {
    speed: 5,
    interval: 350,
  },
  {
    speed: 6,
    interval: 300,
  },
  {
    speed: 7,
    interval: 250,
  },
  {
    speed: 8,
    interval: 200,
  },
  {
    speed: 9,
    interval: 100,
  },
  {
    speed: 10,
    interval: 50,
  },
];

export const DRONE_SPEEDS: { speed: number; interval: number }[] = [
  {
    speed: 1,
    interval: 100,
  },
  {
    speed: 2,
    interval: 90,
  },
  {
    speed: 3,
    interval: 80,
  },
  {
    speed: 4,
    interval: 70,
  },
  {
    speed: 5,
    interval: 60,
  },
  {
    speed: 6,
    interval: 50,
  },
  {
    speed: 7,
    interval: 40,
  },
  {
    speed: 8,
    interval: 30,
  },
  {
    speed: 9,
    interval: 20,
  },
  {
    speed: 10,
    interval: 10,
  },
];

export const RULES = [
  {
    symbol: "⇧",
    key: "ArrowUp",
    description: "Increase vertical speed",
  },
  {
    symbol: "⇩",
    key: "ArrowDown",
    description: "Decrease vertical speed",
  },
  {
    symbol: "⇦",
    key: "ArrowLeft",
    description:
      "Decrease the drone's horizontal speed and move it to the left",
  },
  {
    symbol: "⇨",
    key: "ArrowRight",
    description:
      "Increase the drone's horizontal speed and move it to the right",
  },
];
