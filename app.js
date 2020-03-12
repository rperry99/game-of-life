const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const resolution = 10;
canvas.width = resolution * 70;
canvas.height = resolution * 70;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let anim;
let stopped = false;

function buildGrid() {
  return new Array(COLS)
    .fill(null)
    .map(() =>
      new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}

let grid = buildGrid();
anim = requestAnimationFrame(update);

function restart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid = buildGrid();
  render(grid);
  requestAnimationFrame(update);
}

function stop() {
  stopped = !stopped;
  if (stopped) {
    cancelAnimationFrame(anim);
    document.getElementById("stop").innerHTML = "Start";
  } else {
    requestAnimationFrame(anim);
    document.getElementById("stop").innerHTML = "Stop";
  }
}

function update() {
  setTimeout(function() {
    grid = nextGen(grid);
    render(grid);
    anim = requestAnimationFrame(update);
  }, 1000 / 20);
}

function nextGen(grid) {
  const nextGen = grid.map(arr => [...arr]);
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbors = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const xCell = col + i;
          const yCell = row + j;
          if (xCell >= 0 && yCell >= 0 && xCell < COLS && yCell < ROWS) {
            const currentNeighbor = grid[col + i][row + j];
            numNeighbors += currentNeighbor;
          }
        }
      }
      // Rules of the game
      if (cell === 1 && numNeighbors < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbors > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbors === 3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? "#bada55" : "white";
      ctx.fill();
    }
  }
}
