import * as C from "./constants";
import { checkShipBounds, spotIsClear, setShipToProps } from "./utils";

export const placeShip = (props, ship, gridPrefix, x, y) => {
  // check it will fit and the tiles are clear
  var tile = document.getElementById(gridPrefix + x + "_" + y);
  if (checkShipBounds(ship, tile, x, y) && spotIsClear(ship, gridPrefix, tile, x, y)) {
    // state
    // this.playerShipsPlaced.push(ship.identifier);
    if (props != null) {
      setShipToProps(ship, props);
    }

    // draw ship and set data
    for (let i = 0; i < ship.length; i++) {
      var loopTile = document.getElementById(gridPrefix + (parseInt(x) + i) + "_" + y);
      loopTile.firstChild.innerHTML = ship.identifier;
      loopTile.dataset.identifier = ship.identifier;
      loopTile.dataset.status = C.UNDAMAGED;
    }
    return true;
  } else {
    console.log("invalid placement");
    return false;
  }
};

export const placeEnemyShips = () => {
  // loop ships
  C.SHIPS.forEach(function(ship) {
    // hard coded positions
    switch (ship.length) {
      case 5:
        placeShip(null, ship, C.ENEMY_OCEAN_PREFIX, 1, 1);
        break;
      case 4:
        placeShip(null, ship, C.ENEMY_OCEAN_PREFIX, 2, 3);
        break;
      case 3:
        placeShip(null, ship, C.ENEMY_OCEAN_PREFIX, 5, 5);
        break;
      case 2:
        placeShip(null, ship, C.ENEMY_OCEAN_PREFIX, 5, 9);
        break;
      case 1:
        placeShip(null, ship, C.ENEMY_OCEAN_PREFIX, 8, 4);
        break;
    }
  });
};
