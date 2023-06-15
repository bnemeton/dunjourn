
var buildFloor = function (tiles) {
    //iterate through the tiles and create a FloorTile when the tile is a . or a WallTile when the tile is a #
    var floor = [];
    for (var x = 0; x < tiles.length; x++) {
        var row = [];
        for (var y = 0; y < tiles[x].length; y++) {
            if (tiles[x][y] == ".") {
                row.push(new FloorTile());
            } else if (tiles[x][y] == "#") {
                row.push(new WallTile());
            }
        }
        floor.push(row);
    }
    return floor;

}

class Builder {
    constructor(tiles) {
        this._width = tiles[0].length;
        this._height = tiles[0][0].length;
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