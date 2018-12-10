import * as C from "./constants";
import { targetOceanListener } from "./events";

export const getPlayerOceanContainer = () => document.getElementById(C.PLAYER_OCEAN_CONTAINER);
export const getEnemyOceanContainer = () => document.getElementById(C.PLAYER_TARGET_CONTAINER);

export const getShipFromProps = props => {
  const { name, length, identifier, placed } = props;
  return { ...props };
};

export const setShipToProps = (ship, props) => {
  props.name = ship.name;
  props.length = ship.length;
  props.identifier = ship.identifier;
  props.placed = true;

  return { ...props };
};

export const playerShipPlacementComplete = ship => {
  if (ship.length === 0) {
    return false;
  } else {
    return (
      ship.parentNode.classList.contains("placed") || ship.parentNode.classList.contains("complete")
    );
  }
};

export const detectPlayerWin = () => {
  if (
    document.querySelectorAll("[id^='" + C.ENEMY_OCEAN_PREFIX + "']" + "[data-status='hit']")
      .length > 14
  ) {
    getEnemyOceanContainer().removeEventListener("click", targetOceanListener);
    updateStatus("You Won! All enemy ships have been sunk!");
    showEnemyPositions();
    return true;
  } else {
    return false;
  }
};

export const detectEnemyWin = () => {
  if (
    document.querySelectorAll("[id^='" + C.PLAYER_OCEAN_PREFIX + "']" + "[data-status='hit']")
      .length > 14
  ) {
    getEnemyOceanContainer().removeEventListener("click", targetOceanListener);
    updateStatus("You Lost! All your ships have been sunk!");
    showEnemyPositions();
    return true;
  } else {
    return false;
  }
};

export const checkShipBounds = (ship, tile, x, y) => {
  var boundCheck = parseFloat(x) + parseFloat(ship.length);
  return boundCheck < 11;
};

export const spotIsClear = (ship, gridPrefix, tile, x, y) => {
  for (let i = 0; i < ship.length; i++) {
    if (
      document.getElementById(gridPrefix + (parseInt(x) + i) + "_" + y).firstChild.innerHTML != ""
    ) {
      return false;
    }
  }
  return true;
};

export const isSunk = (gridPrefix, identifier, ship) => {
  return (
    document.querySelectorAll(
      "[id^='" + gridPrefix + "'][data-identifier='" + identifier + "'][data-status='hit']"
    ).length == ship.length
  );
};

export const getShipFromTile = identifier => {
  return C.SHIPS.filter(function(ship) {
    return ship.identifier == identifier;
  })[0];
};

export const selectUntestedPlayerTile = () => {
  // filter for untested tiles
  var allPlayerTiles = Array.from(getPlayerOceanContainer().getElementsByClassName("tile"));
  var untestedPlayerTiles = allPlayerTiles.filter(function(tile) {
    return tile.dataset.status == C.UNTESTED || tile.dataset.status == C.UNDAMAGED;
  });

  // select a random tile
  var random = Math.floor(Math.random() * untestedPlayerTiles.length);

  return untestedPlayerTiles[random];
};

export const showEnemyPositions = () => {
  var tiles = getEnemyOceanContainer().getElementsByClassName("tile hidden");
  Array.from(tiles).forEach(function(tile) {
    tile.classList.remove("hidden");
  });
};

export const updateStatus = message => {
  var status = document.getElementById(C.STATUS_CONTAINER);
  status.innerHTML = message;
};
