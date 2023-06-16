
var buildRow = function (row) {
    // console.log(row); //looks fine
    //iterate through the  and create a FloorTile when the tile is a . or a WallTile when the tile is a # or a StairDown when the tile is a > or a StairUp when the tile is a <
    let rowTiles = [];
    for (var x = 0; x < row.length; x++) {
        // console.log(row[x]) //duh whoops
        //switch statement
        switch ([row[x]]) {
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
    }
    console.log(rowTiles); //all empty now.... so something is afoot in buildRow
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