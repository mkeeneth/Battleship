import * as C from "./constants";
import {
  getShipFromProps,
  playerShipPlacementComplete,
  updateStatus,
  getPlayerOceanContainer,
  getEnemyOceanContainer,
  getShipFromTile,
  detectPlayerWin,
  detectEnemyWin,
  selectUntestedPlayerTile,
  isSunk
} from "./utils";
import { placeShip, placeEnemyShips } from "./actions";

export const startShipPlacementListener = shipElement => {
  shipElement.addEventListener("click", startShipPlacementEvent, false);
};

const startShipPlacementEvent = function(e) {
  // make sure another placement isn't in progress or that all ships are placed
  var currentSelection = document.getElementsByClassName("ship selected");
  if (currentSelection.length > 0 || playerShipPlacementComplete(currentSelection)) {
    return false;
  }

  e.target.classList.add("selected");

  let currentShip = getShipFromProps(e.target.dataset);

  if (currentShip.placed) {
    updateStatus(`You already placed your ${currentShip.name}!`);
    e.target.classList.remove("selected");
    return false;
  }

  updateStatus(`Place the ${currentShip.name} on your ocean below! 
    It is ${currentShip.length} space(s) long.`);

  getPlayerOceanContainer().addEventListener("click", gridPlacementListener, false);
};

const gridPlacementListener = function(e) {
  // get the position
  var x = e.target.dataset.x;
  var y = e.target.dataset.y;

  // ship placement state
  let shipState = document.getElementsByClassName("ship selected")[0].dataset;

  let currentShip = getShipFromProps(shipState);
  //let currentShip = getShipFromProps(e.target.dataset);

  // try to place it
  var placed = placeShip(shipState, currentShip, C.PLAYER_OCEAN_PREFIX, x, y);

  // Update on success and reset state
  if (placed) {
    document.getElementsByClassName("ship selected")[0].classList.add("placed");
    document.getElementsByClassName("ship selected")[0].classList.remove("selected");
  }

  // last ship placed
  if (document.getElementsByClassName("ship placed").length == 5) {
    getPlayerOceanContainer().removeEventListener("click", gridPlacementListener);
    // place the enemy ships and start the game
    placeEnemyShips();
    // bind target grid
    getEnemyOceanContainer().addEventListener("click", targetOceanListener, false);
    // start the game!
    updateStatus(`Start by selecting a tile on the enemy ocean you want attack! 
      The computer will automatically fire back at you on each turn.`);
  }
};

const targetOceanListener = e => {
  // get the position
  var x = e.target.dataset.x;
  var y = e.target.dataset.y;

  var playerShot = handleShotFired(C.ENEMY_OCEAN_PREFIX, x, y);

  // check for game win
  detectPlayerWin();

  // computer fires back at player after a successful shot
  if (playerShot) {
    var playerOceanTarget = selectUntestedPlayerTile();
    handleShotFired(
      C.PLAYER_OCEAN_PREFIX,
      playerOceanTarget.dataset.x,
      playerOceanTarget.dataset.y
    );

    detectEnemyWin();
  }

  return false;
};

// fire control
const handleShotFired = (gridPrefix, x, y) => {
  // get tile
  var tile = document.getElementById(gridPrefix + x + "_" + y);
  var tileState = tile.dataset;

  // get ship
  var ship = getShipFromTile(tileState.identifier);

  // skip if the tile has already been targeted
  if (tileState.status == C.HIT || tileState.status == C.MISSED) {
    return false;
  } else if (tileState.status == C.UNDAMAGED) {
    // make sure a valid ship was retrieved
    if (ship == null) {
      return false;
    }

    // a hit
    tileState.status = C.HIT;

    // sunk it?
    if (isSunk(gridPrefix, tileState.identifier, ship)) {
      updateStatus(`You sunk an enemy ${ship.name}!`);
    }
    return true;
  } else {
    // a miss
    tileState.status = C.MISSED;
    return true;
  }
};
