// battleship2 by Matt Keeneth
import * as C from "./constants";
import { renderGrid, shipPlacement } from "./render";
import { happyPathTest } from "./test";

export const Battleship = () => {
  // grab handles to render
  let playerOcean = document.getElementById(C.PLAYER_OCEAN_CONTAINER);
  let enemyOcean = document.getElementById(C.PLAYER_TARGET_CONTAINER);
  let shipsList = document.getElementById(C.SHIPS_CONTAINER_UL);

  // draw the board
  renderGrid(playerOcean, C.PLAYER_OCEAN_PREFIX, C.GRID_SIZE, C.UNTESTED);
  renderGrid(enemyOcean, C.ENEMY_OCEAN_PREFIX, C.GRID_SIZE, C.UNTESTED);

  // draw ship placement and bind events
  shipPlacement(C.SHIPS, shipsList);

  // bind happy path test
  document.getElementById("launchtest").addEventListener("click", happyPathTest);
};

// start after dom loads
document.addEventListener("DOMContentLoaded", function() {
  Battleship();
});
