
var buildRow = function (row) {
    console.log(row); //splitting this isn't a function?
    //iterate through the  and create a FloorTile when the tile is a . or a WallTile when the tile is a # or a StairDown when the tile is a > or a StairUp when the tile is a <
    let results = [];
    let rowEnemies = [];
    let rowTiles = [];
    let rowSigns = [];
    let rowItems = [];
    for (var x = 0; x < row.length; x++) {
        // console.log(row[x]) //duh whoops
        let glyph = row[x];
        // console.log(glyph); //now this is fine
        //switch statement
        switch (glyph) {
            case ".":
                rowTiles.push(new FloorTile());
                break;
            case "#":
                // console.log("pushing walltile")
                rowTiles.push(new WallTile());
                break;
            case ">":
                rowTiles.push(new StairDown());
                break;
            case "<":
                rowTiles.push(new StairUp());
                break;
            case "=":
                let newSign = new SignTile({});
                rowTiles.push(newSign);
                rowSigns.push(newSign);
                break;
            case "+":
                rowTiles.push(new GateTile());
                break;
        }
        //if none of the standard tiles, check enemies for a match
        if (glyph != "." && glyph != "#" && glyph != ">" && glyph != "<" && glyph != "=") {
            // console.log(glyph+` found in map.`) // works fine
            for (var creature in bestiary) {
                // console.log(enemies[enemy]) //ah for in iterates over the keys, not the values, whoops
                let thisGuy = bestiary[creature];
                if (thisGuy.char == glyph) {
                    // console.log(`found an ${enemy.name}`); //never firing....
                    //create enemy and set position
                    // let newEnemy = new Enemy(thisEnemy); //needlessly generating an enemy object we will regenerate later
                    // push floortile and add enemy to enemy array
                    rowTiles.push(new FloorTile());
                    rowEnemies.push(
                        {
                        type: `${thisGuy.name}`,
                        x: x
                        }
                    );
                    // console.log(`added ${newEnemy.name} to enemy array with position `); 
                }
            }
            //check items for a match
            for (var item in Game.Dungeon.vault) {
                let thisItem = Game.Dungeon.vault[item];
                if (thisItem.char == glyph) {
                    // console.log(`found an ${enemy.name}`); //never firing....
                    //create enemy and set position
                    // let newItem = new Item(thisItem);
                    // push floortile and add enemy to enemy array
                    rowTiles.push(new FloorTile());
                    let resultItem = {};
                    resultItem.type = `${item}`;
                    resultItem.x = x;
                    //if item tags include key, add keystring to the pushed object
                    console.log(thisItem)
                    if (thisItem.tags.includes("key")) {
                        resultItem.key = true;
                    }
                    rowItems.push(resultItem);
                    // console.log(`added ${newEnemy.name} to enemy array with position `); 
                }
            }
        };

    }
    // console.log(rowTiles); //all empty now.... so something is afoot in buildRow
    results.push(rowTiles);
    results.push(rowEnemies);
    results.push(rowSigns);
    results.push(rowItems);
    // console.log(results);
    return results;
}


var buildFloor = function (dungeon, depth) {
    // console.log(tiles); // seems correct, which i would expect
    let results = [];
    var floorTiles = [];
    var floorEnemies = [];
    // console.log(dungeon.signs[depth]) //looks fine so why is floorSignText undefined?
    var floorSignText = dungeon.signs[depth];
    console.log(floorSignText)
    var floorItems = [];
    var signIndex = 0;
    for (var y = 0; y < dungeon.map[depth].length; y++) {
        let builtRow = buildRow(dungeon.map[depth][y]);
        let rowTiles = builtRow[0];
        let rowEnemies = builtRow[1];
        let rowItems = builtRow[3];
        // let rowSigns = builtRow[2];
        // add sign text to each sign
        for (var i = 0; i < rowTiles.length; i++) {
            if (rowTiles[i] instanceof SignTile) {
            // console.log(floorSignText[signIndex])
            rowTiles[i].setText(floorSignText[signIndex]); 
            // console.log(`sign at ${i},${y}: ${floorSignText[signIndex]}`); //this works now
            signIndex++;
            }
        }
        floorTiles.push(rowTiles);
        //add y position to each item in the returned array
        for (var i = 0; i < rowItems.length; i++) {
            rowItems[i].y = y;
            floorItems.push(rowItems[i]);
        }
        // add y position to each enemy in the returned array
        for (var i = 0; i < rowEnemies.length; i++) {
            rowEnemies[i].y = y;
            floorEnemies.push(rowEnemies[i]);
        }

    }

    results.push(floorTiles);
    results.push(floorEnemies);
    results.push(floorItems);

    return results;

}

class Builder {
    constructor(dungeon) {
        // console.log(dungeon.map);
        this._width = dungeon.map[0][0].length;
        this._height = dungeon.map[0].length;
        this._depth = dungeon.map.length;
        this._tiles = [];
        this._enemies = [];
        this._items = [];
        // this.signText = dungeon.signs

        //console log the enemies object for me right quick
        // console.log(enemies); //ugh no of course it's fine
        // build dungeon
        for (var z = 0; z < this._depth; z++) {
            // build each floor of the dungeon
            let floor = buildFloor(dungeon, z);
            // console.log(`floor tiles: ${floor[0]}`); //fixed
            // console.log(`floor enemies: ${floor[1]}`); //fixed
            this._tiles.push(floor[0]);
            //set enemies z position to this floor
            for (var i = 0; i < floor[1].length; i++) {
                floor[1][i].z = z;
                this._enemies.push(floor[1][i]);
            }
            //set items z position to this floor
            for (var i = 0; i < floor[2].length; i++) {
                floor[2][i].z = z;
                this._items.push(floor[2][i]);
            }
            //for each door or gate, check if Game.Dungeon.keys contains a key with matching coordinates, then set lockstring
            for (var i = 0; i < this._tiles[z].length; i++) {
                for (var j = 0; j < this._tiles[z][i].length; j++) {
                    if (this._tiles[z][i][j] instanceof DoorTile || this._tiles[z][i][j] instanceof GateTile) {
                        // console.log(`found a door or gate at ${i},${j},${z}`);
                        // console.log(this._tiles[z][i][j]);
                        let thisTile = this._tiles[z][i][j];
                        // console.log(thisTile);
                        // console.log(this._items);
                        for (key in Game.Dungeon.keys) {
                            let thisKey = Game.Dungeon.keys[key];
                            // console.log(thisKey);
                            if (thisKey.x == i && thisKey.y == j && thisKey.z == z) {
                                // console.log(`found a key at ${i},${j},${z}`);
                                // console.log(thisKey);
                                // console.log(thisTile);
                                thisTile.lockstring(thisKey.keystring);
                                thisTile.locked = true;
                            }
                        }
                    }
                }
            }
            //for each key, check if Game.Dungeon.keys contains an item with matching coordinates, then set keystring
            for (var i = 0; i < this._items.length; i++) {
                let thisItem = this._items[i];
                if (thisItem.key) {
                    //check Game.Dungeon.keys for matching coords
                    for (key in Game.Dungeon.keys) {
                        let thisKey = Game.Dungeon.keys[key];
                        if (thisKey.x == thisItem.x && thisKey.y == thisItem.y && thisKey.z == thisItem.z) {
                            thisItem.keystring = thisKey.keystring;
                        }
                    }
                }
            }
        }
        // console.log(this._tiles); //why is this undefined?
    }

    getTiles() {
        return this._tiles;
    }

    getDepth() {
        return this._depth;
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }


}