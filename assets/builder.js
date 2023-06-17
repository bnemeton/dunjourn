
var buildRow = function (row) {
    // console.log(row); //looks fine
    //iterate through the  and create a FloorTile when the tile is a . or a WallTile when the tile is a # or a StairDown when the tile is a > or a StairUp when the tile is a <
    let rowTiles = [];
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
        }
        //if none of the standard tiles, check enemies for a match
        if (glyph != "." && glyph != "#" && glyph != ">" && glyph != "<") {
            // console.log(glyph+` found in map.`) // works fine
            for (var enemy in enemies) {
                console.log(enemy) //just the word goblin instead of the object? if i ask for a property it's always undefined.
                if (enemy.char == glyph) {
                    // console.log(`found an ${enemy.name}`); //never firing....
                    //create enemy and set position
                    let newEnemy = new Enemy(enemy);
                    newEnemy.setPosition(x, y, z);
                    // push floortile and add enemy to enemy array
                    rowTiles.push(new FloorTile());
                    this._enemies.push(newEnemy);
                    console.log(`added ${newEnemy.name} to enemy array with position ${newEnemy.getX()}, ${newEnemy.getY()}, ${newEnemy.getZ()}`); //not firing
                }
            }
        };

    }
    // console.log(rowTiles); //all empty now.... so something is afoot in buildRow
    return rowTiles;
}


var buildFloor = function (tiles) {
    // console.log(tiles); // seems correct, which i would expect
    var floor = [];
    for (var y = 0; y < tiles.length; y++) {
        floor.push(buildRow(tiles[y]));
    }
    return floor;

}

class Builder {
    constructor(tiles) {
        this._width = tiles[0][0].length;
        this._height = tiles[0].length;
        this._depth = tiles.length;
        this._tiles = [];
        this._enemies = [];
        this._items = [];

        // build dungeon
        for (var z = 0; z < this._depth; z++) {
            // build each floor of the dungeon
            this._tiles.push(buildFloor(tiles[z]));
        }
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