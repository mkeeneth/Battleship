// battleship by Matt Keeneth
const constants = {};
constants.MAIN_CONTAINER = "battleship";
constants.SHIPS_CONTAINER = "battleships";
constants.SHIPS_CONTAINER_UL = "battleships_list";
constants.PLAYER_OCEAN_CONTAINER = "battleship_ocean_grid";
constants.PLAYER_OCEAN_PREFIX = "playergrid_";
constants.PLAYER_TARGET_CONTAINER = "battleship_target_grid";
constants.ENEMY_OCEAN_PREFIX = "enemygrid_";
constants.STATUS_CONTAINER = "status";
constants.SHIPS =
    [{ name: 'Aircraft Carrier (A)', length: 5, identifier: 'A' },
    { name: 'Battleship (B)', length: 4, identifier: 'B' },
    { name: 'Cruiser (C)', length: 3, identifier: 'C' },
    { name: 'Destroyer (D)', length: 2, identifier: 'D' },
    { name: 'Submarine (S)', length: 1, identifier: 'S' }];
constants.HIT = "hit";
constants.MISSED = "missed";
constants.UNDAMAGED = "undamaged";
constants.UNTESTED = "untested"

// Main battleship object
function Battleship() {
    this.init(); // setup the board
}

Battleship.prototype.init = function () {
    // containers
    this.container = document.getElementById(constants.MAIN_CONTAINER);
    this.ships = document.getElementById(constants.SHIPS_CONTAINER);
    this.shipsList = document.getElementById(constants.SHIPS_CONTAINER_UL);
    this.playerOcean = document.getElementById(constants.PLAYER_OCEAN_CONTAINER);
    this.enemyOcean = document.getElementById(constants.PLAYER_TARGET_CONTAINER);

    var self = this;
    // placement
    constants.SHIPS.forEach(function (ship) {
        var shipElement = document.createElement("li");
        shipElement.classList = "ship";
        shipElement.innerHTML = ship.name;
        shipElement.dataset.name = ship.name;
        shipElement.dataset.length = ship.length;
        shipElement.dataset.identifier = ship.identifier;
        shipElement.addEventListener('click', Battleship.prototype.startShipPlacementListener, false);
        self.shipsList.appendChild(shipElement);
    });

    this.currentShip = {};
    this.playerShipPlacementComplete = false;
    this.playerShipsPlaced = [];

    // track hits
    this.hitsOnPlayer = {};
    constants.SHIPS.forEach(function (ship) {
        self.hitsOnPlayer[ship.identifier] = 0;
    });
    this.hitsOnEnemy = {};
    constants.SHIPS.forEach(function (ship) {
        self.hitsOnEnemy[ship.identifier] = 0;
    });

    // 10x10 grids    
    Battleship.prototype.renderGrid(this.playerOcean, constants.PLAYER_OCEAN_PREFIX);
    Battleship.prototype.renderGrid(this.enemyOcean, constants.ENEMY_OCEAN_PREFIX);

    // hide spans on target grid
    var enemyTiles = Battleship.prototype.enemyOcean.getElementsByClassName("tile");
    for (var i = 0; i < enemyTiles.length; i++) {
        enemyTiles[i].classList.add("hidden");
    }
}

// render the 10x10 grids    
Battleship.prototype.renderGrid = function (ocean, prefix) {
    for (i = 0; i < 10; i++) {
        for (ii = 0; ii < 10; ii++) {
            // add a tile
            var tile = document.createElement("div");
            tile.id = prefix + i + "_" + ii;
            tile.classList.add('tile');
            tile.dataset.x = i;
            tile.dataset.y = ii;
            tile.dataset.status = constants.UNTESTED;
            var tileSpan = document.createElement("span");
            tile.appendChild(tileSpan);
            ocean.appendChild(tile);
        }
    }
}

Battleship.prototype.updateStatus = function (message) {
    var status = document.getElementById(constants.STATUS_CONTAINER);
    status.innerHTML = message;
}

Battleship.prototype.startShipPlacementListener = function (e) {
    // make sure another placement isn't in progress or that all ships are placed
    var currentSelection = document.getElementsByClassName("ship selected");
    if (currentSelection.length > 0 || Battleship.prototype.playerShipPlacementComplete) {
        return false;
    }

    e.target.classList.add("selected");

    var shipName = e.target.dataset.name;
    var shipLength = e.target.dataset.length;
    var shipIdentifier = e.target.dataset.identifier;

    Battleship.prototype.currentShip = {
        name: shipName,
        length: shipLength,
        identifier: shipIdentifier
    }

    if (Battleship.prototype.playerShipsPlaced.indexOf(Battleship.prototype.currentShip.identifier) != -1) {
        Battleship.prototype.updateStatus("You already placed your " + shipName + "!");
        Battleship.prototype.currentShip = {};
        e.target.classList.remove("selected");
        return false;
    }

    Battleship.prototype.updateStatus("Place the " + shipName + " on your ocean below! It is " + shipLength + " space(s) long.");

    Battleship.prototype.playerOcean.addEventListener('click', Battleship.prototype.gridPlacementListener, false);
}

Battleship.prototype.gridPlacementListener = function (e) {

    // get the position 
    var x = e.target.dataset.x;
    var y = e.target.dataset.y;

    // try to place it 
    var placed = Battleship.prototype.placeShip(
        Battleship.prototype.currentShip,
        constants.PLAYER_OCEAN_PREFIX,
        x,
        y
    );

    // Update on success and reset state
    if (placed) {
        Battleship.prototype.currentShip = {};
        document.getElementsByClassName("ship selected")[0].classList.add("placed");
        document.getElementsByClassName("ship selected")[0].classList.remove("selected");
    }

    // last ship placed
    if (document.getElementsByClassName("ship placed").length == 5) {
        Battleship.prototype.playerOcean.removeEventListener('click', Battleship.prototype.gridPlacementListener);
        // state
        Battleship.prototype.playerShipPlacementComplete = true;
        // place the enemy ships and start the game
        Battleship.prototype.placeEnemyShips();
        // bind target grid
        Battleship.prototype.enemyOcean.addEventListener('click', Battleship.prototype.targetOceanListener, false);
        // start the game!
        Battleship.prototype.updateStatus("Start by selecting a tile on the enemy ocean you want attack! " +
            "The computer will automatically fire back at you on each turn.");
    }
}

Battleship.prototype.placeShip = function (ship, gridPrefix, x, y) {
    // check it will fit and the tiles are clear
    var tile = document.getElementById(gridPrefix + x + "_" + y);
    if (Battleship.prototype.checkShipBounds(ship, tile, x, y)
        && Battleship.prototype.spotIsClear(ship, gridPrefix, tile, x, y)) {
        // state
        this.playerShipsPlaced.push(ship.identifier);

        // draw ship and set data
        for (i = 0; i < ship.length; i++) {
            var loopTile = document.getElementById(gridPrefix + (parseInt(x) + i) + "_" + y);
            loopTile.firstChild.innerHTML = ship.identifier;
            loopTile.dataset.identifier = ship.identifier;
            loopTile.dataset.status = constants.UNDAMAGED;
        }
        return true;
    } else {
        console.log("invalid placement");
        return false;
    }
}

Battleship.prototype.checkShipBounds = function (ship, tile, x, y) {
    var boundCheck = parseFloat(x) + parseFloat(ship.length);
    if (boundCheck < 11) {
        return true;
    } else {
        return false;
    }
}

Battleship.prototype.spotIsClear = function (ship, gridPrefix, tile, x, y) {
    for (i = 0; i < ship.length; i++) {
        if (document.getElementById(gridPrefix + (parseInt(x) + i) + "_" + y).firstChild.innerHTML != "") {
            return false;
        }
    }
    return true;
}

Battleship.prototype.placeEnemyShips = function () {
    // loop ships 
    constants.SHIPS.forEach(function (ship) {
        // hard coded positions 
        switch (ship.length) {
            case 5:
                Battleship.prototype.placeShip(ship, constants.ENEMY_OCEAN_PREFIX, 1, 1);
                break;
            case 4:
                Battleship.prototype.placeShip(ship, constants.ENEMY_OCEAN_PREFIX, 2, 3);
                break;
            case 3:
                Battleship.prototype.placeShip(ship, constants.ENEMY_OCEAN_PREFIX, 5, 5);
                break;
            case 2:
                Battleship.prototype.placeShip(ship, constants.ENEMY_OCEAN_PREFIX, 5, 9);
                break;
            case 1:
                Battleship.prototype.placeShip(ship, constants.ENEMY_OCEAN_PREFIX, 8, 4);
                break;
        }
    });
}

Battleship.prototype.targetOceanListener = function (e) {
    // get the position 
    var x = e.target.dataset.x;
    var y = e.target.dataset.y;

    // is the container click is captured
    if (Battleship.prototype.isUndefined(x) || Battleship.prototype.isUndefined(y)) {
        return false;
    }

    var playerShot = Battleship.prototype.handleShotFired(constants.ENEMY_OCEAN_PREFIX, x, y);

    // check for game win
    Battleship.prototype.detectPlayerWin();

    // computer fires back at player after a successful shot
    if (playerShot) {
        var playerOceanTarget = Battleship.prototype.selectUntestedPlayerTile();
        Battleship.prototype.handleShotFired(
            constants.PLAYER_OCEAN_PREFIX,
            playerOceanTarget.dataset.x,
            playerOceanTarget.dataset.y
        );

        Battleship.prototype.detectEnemyWin();
    }

    return false;
}

// fire control 
Battleship.prototype.handleShotFired = function (gridPrefix, x, y) {

    // get tile
    var tile = document.getElementById(gridPrefix + x + "_" + y);

    // is a container click is captured
    if (Battleship.prototype.isUndefined(tile)) {
        return false;
    }

    // get ship
    var ship = constants.SHIPS.filter(function (ship) {
        return ship.identifier == tile.dataset.identifier;
    })[0];

    var status = tile.dataset.status;
    // skip if the tile has already been targeted 
    if (tile.dataset.status == constants.HIT || tile.dataset.status == constants.MISSED) {
        return false;
    } else if (tile.dataset.status == constants.UNDAMAGED) {        
        // make sure a valid ship was retrieved
        if (Battleship.prototype.isUndefined(ship)) {
            return false;
        }
        
        // a hit
        tile.dataset.status = constants.HIT;
        Battleship.prototype.updateEnemyHitStatus(gridPrefix, tile.dataset.identifier);

        // sunk it?
        if (Battleship.prototype.isSunk(gridPrefix, tile.dataset.identifier, ship)) {
            Battleship.prototype.updateStatus("You sunk an enemy " + ship.name + "!");
        }
        return true;
    } else {
        // a miss
        tile.dataset.status = constants.MISSED;
        return true;
    }
}

Battleship.prototype.selectUntestedPlayerTile = function () {
    // filter for untested tiles
    var allPlayerTiles = Array.from(Battleship.prototype.playerOcean.getElementsByClassName("tile"));
    var untestedPlayerTiles = allPlayerTiles.filter(function (tile) {
        return tile.dataset.status == constants.UNTESTED ||
            tile.dataset.status == constants.UNDAMAGED;
    });

    // select a random tile
    var random = Math.floor((Math.random() * untestedPlayerTiles.length));

    return untestedPlayerTiles[random];
}

Battleship.prototype.updateEnemyHitStatus = function (gridPrefix, identifier) {
    if (gridPrefix == constants.ENEMY_OCEAN_PREFIX) {
        Battleship.prototype.hitsOnEnemy[identifier] += 1;
    } else {
        Battleship.prototype.hitsOnPlayer[identifier] += 1;
    }
}

Battleship.prototype.isSunk = function (gridPrefix, identifier, ship) {
    if (Battleship.prototype.hitsOnEnemy[identifier] == ship.length) {
        return true;
    } else {
        return false;
    }
}

Battleship.prototype.detectPlayerWin = function () {
    if (Battleship.prototype.getHitCount(Battleship.prototype.hitsOnEnemy) > 14) {
        Battleship.prototype.enemyOcean.removeEventListener('click', Battleship.prototype.targetOceanListener);
        Battleship.prototype.updateStatus("You Won! All enemy ships have been sunk!");
        Battleship.prototype.showEnemyPositions();
        return true;
    } else {
        return false;
    }
}

Battleship.prototype.detectEnemyWin = function () {
    if (Battleship.prototype.getHitCount(Battleship.prototype.hitsOnPlayer) > 14) {
        Battleship.prototype.enemyOcean.removeEventListener('click', Battleship.prototype.targetOceanListener);
        Battleship.prototype.updateStatus("You Lost! All your ships have been sunk!");
        Battleship.prototype.showEnemyPositions();
        return true;
    } else {
        return false;
    }
}

Battleship.prototype.getHitCount = function (hitObj) {
    var hitKeys = Object.keys(hitObj);
    var totalHitCount = 0;
    hitKeys.forEach(function (key) {
        totalHitCount += hitObj[key];
    });
    return totalHitCount;
}

Battleship.prototype.showEnemyPositions = function () {
    var tiles = Battleship.prototype.enemyOcean.getElementsByClassName("tile hidden");
    Array.from(tiles).forEach(function (tile) {
        tile.classList.remove("hidden");
    });
}

Battleship.prototype.isUndefined = function (value) {
    if (typeof value == "undefined") {
        return true;
    } else {
        return false;
    }
}

// begin 
Battleship.prototype.init();

