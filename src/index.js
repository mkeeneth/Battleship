// battleship2 by Matt Keeneth
import * as C from "./constants";
import { renderGrid, shipPlacement } from "./render";
import "./index.css";
import { happyPathTest } from "./test";
import { getEnemyOceanContainer } from "./utils";

export const Battleship = () => {
  // grab handles to render
  let playerOcean = document.getElementById(C.PLAYER_OCEAN_CONTAINER);
  let enemyOcean = document.getElementById(C.PLAYER_TARGET_CONTAINER);
  let shipsList = document.getElementById(C.SHIPS_CONTAINER_UL);

  // draw the board
  renderGrid(playerOcean, C.PLAYER_OCEAN_PREFIX, C.GRID_SIZE, C.UNTESTED);
  renderGrid(enemyOcean, C.ENEMY_OCEAN_PREFIX, C.GRID_SIZE, C.UNTESTED);

  // hide spans on target grid
  const enemyTiles = getEnemyOceanContainer().getElementsByClassName("tile");
  for (var i = 0; i < enemyTiles.length; i++) {
    enemyTiles[i].classList.add("hidden");
  }

  // draw ship placement and bind events
  shipPlacement(C.SHIPS, shipsList);

  // bind happy path test
  document.getElementById("launchtest").addEventListener("click", happyPathTest);
};

// start after dom loads
document.addEventListener("DOMContentLoaded", function() {
  Battleship();
});
