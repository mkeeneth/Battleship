import { startShipPlacementListener } from "./events";

// ship placement
export const shipPlacement = (ships, target) => {
  ships.forEach(function(ship) {
    var shipElement = document.createElement("li");
    shipElement.classList.add("ship");
    shipElement.innerHTML = ship.name;
    shipElement.dataset.name = ship.name;
    shipElement.dataset.length = ship.length;
    shipElement.dataset.identifier = ship.identifier;
    // bind events
    startShipPlacementListener(shipElement);
    target.appendChild(shipElement);
  });
};

// render a 10x10 grid
export const renderGrid = (ocean, prefix, gridSize, defaultStatus) => {
  for (let i = 0; i < gridSize; i++) {
    for (let ii = 0; ii < gridSize; ii++) {
      // add a tile
      var tile = document.createElement("div");
      tile.id = prefix + i + "_" + ii;
      tile.classList.add("tile");
      tile.dataset.x = i;
      tile.dataset.y = ii;
      tile.dataset.status = defaultStatus;
      var tileSpan = document.createElement("span");
      tile.appendChild(tileSpan);
      ocean.appendChild(tile);
    }
  }
};
