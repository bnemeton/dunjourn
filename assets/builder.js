
var buildRow = function (row) {
    // console.log(row); //looks fine
    //iterate through the  and create a FloorTile when the tile is a . or a WallTile when the tile is a # or a StairDown when the tile is a > or a StairUp when the tile is a <
    let results = [];
    let rowEnemies = [];
    let rowTiles = [];
    let rowSigns = [];
    for (var x = 0; x < row.length; x++) {
        // console.log(row[x]) //duh whoops
        let glyph = row[x];
        //switch statement
        switch (glyph) {
            case ".":
                rowTiles.push(new FloorTile());
                break;
            case "#":
                rowTiles.push(new WallTile());
                break;
            case ">":
                rowTiles.push(new StairDown());
                break;
            case "<":
                rowTiles.push(new StairUp());
                break;
            case "Ħ":
                let newSign = new SignTile({});
                rowTiles.push(newSign);
                rowSigns.push(newSign);
                break;
        }
        //if none of the standard tiles, check enemies for a match
        if (glyph != "." && glyph != "#" && glyph != ">" && glyph != "<" && glyph != "Ħ") {
            // console.log(glyph+` found in map.`) // works fine
            for (var enemy in enemies) {
                // console.log(enemies[enemy]) //ah for in iterates over the keys, not the values, whoops
                let thisEnemy = enemies[enemy];
                if (thisEnemy.char == glyph) {
                    // console.log(`found an ${enemy.name}`); //never firing....
                    //create enemy and set position
                    let newEnemy = new Enemy(thisEnemy);
                    // push floortile and add enemy to enemy array
                    rowTiles.push(new FloorTile());
                    rowEnemies.push(
                        {
                        type: `${newEnemy.name}`,
                        x: x
                        }
                    );
                    // console.log(`added ${newEnemy.name} to enemy array with position `); 
                }
            }
        };

    }
    // console.log(rowTiles); //all empty now.... so something is afoot in buildRow
    results.push(rowTiles);
    results.push(rowEnemies);
    results.push(rowSigns);
    return results;
}


var buildFloor = function (tiles, depth) {
    // console.log(tiles); // seems correct, which i would expect
    let results = [];
    var floorTiles = [];
    var floorEnemies = [];
    var floorSignText = levelSigns[depth];
    var signIndex = 0;
    for (var y = 0; y < tiles.length; y++) {
        let builtRow = buildRow(tiles[y]);
        let rowTiles = builtRow[0];
        let rowEnemies = builtRow[1];
        let rowSigns = builtRow[2];
        // add sign text to each sign
        for (var i = 0; i < rowTiles.length; i++) {
            if (rowTiles[i] instanceof SignTile) {
            rowTiles[i].setText(floorSignText[signIndex]); 
            console.log(`sign at ${i},${y}: ${floorSignText[signIndex]}`); //this is outputting the correct text, but the signs wind up "blank".
            signIndex++;
            }
        }
        floorTiles.push(rowTiles);
        // add y position to each enemy in the returned array
        for (var i = 0; i < rowEnemies.length; i++) {
            rowEnemies[i].y = y;
            floorEnemies.push(rowEnemies[i]);
        }

    }

    results.push(floorTiles);
    results.push(floorEnemies);

    return results;

}

class Builder {
    constructor(tilemap) {
        this._width = tilemap[0][0].length;
        this._height = tilemap[0].length;
        this._depth = tilemap.length;
        this._tiles = [];
        this._enemies = [];
        this._items = [];

        //console log the enemies object for me right quick
        // console.log(enemies); //ugh no of course it's fine
        // build dungeon
        for (var z = 0; z < this._depth; z++) {
            // build each floor of the dungeon
            let floor = buildFloor(tilemap[z], z);
            // console.log(`floor tiles: ${floor[0]}`); //fixed
            // console.log(`floor enemies: ${floor[1]}`); //fixed
            this._tiles.push(floor[0]);
            //set enemies z position to this floor
            for (var i = 0; i < floor[1].length; i++) {
                floor[1][i].z = z;
                this._enemies.push(floor[1][i]);
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