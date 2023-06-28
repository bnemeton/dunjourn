class Tile extends Glyph{

 constructor(properties) {
    //call glyph constructor!!
    super(properties);
    // console.log(properties);
    this.isWalkable = properties['isWalkable'] || false;
    this.isDiggable = properties['isDiggable'] || false;
    this.isOpaque = properties['isOpaque'] || false;
    
 }
};

class FloorTile extends Tile {
    constructor() {
        super({
            char: '.',
            fg: '#609494',
            isWalkable: true,
            text: 'This is open floor.'
        });
        // this.char = '.'
        // this.fg = 'darkslategrey';
        // this.isWalkable = true;
    }
}

class WallTile extends Tile {
    constructor() {
        super({
            char: '#',
            fg: 'peachpuff',
            isDiggable: true,
            isOpaque: true,
            text: "This is a wall of solid stone. You've heard legends of bygone heroes of ages past who could carve through walls with their bare hands. It couldn't be true, could it?"
        });
        // this.isOpaque = true;
        // this.char = '#',
        // this.fg = 'peachpuff',
        // this.isDiggable = true
    }
}

class NullTile extends Tile {
    constructor() {
        super({})
    }
}

class StairDown extends Tile {
    constructor() {
        super({
            char: '>',
            fg: 'white',
            isWalkable: true,
            text: "There is a staircase descending to a lower floor here."
        })
    }
}

class StairUp extends Tile {
    constructor() {
        super({
            char: '<',
            fg: 'white',
            isWalkable: true,
            text: "There is a staircase ascending to an upper floor here."
        })
    }
}

class SignTile extends Tile {
    constructor(properties) {
        super({
            char: '=',
            fg: 'tan',
            isWalkable: false,
            text: "There is a sign here. "
        })
        this.signText = properties['signText'] || "This sign is blank."
        this.text = this.text+this.signText;
    }
    setText(string) {
        this.signText = string;
        this.text = `There is a sign here. It reads:"${this.signText}"`;
    }
}

class DoorTile extends Tile {
    constructor() {
        super({
            char: '□',
            fg: 'tan',
            isWalkable: false,
            isOpaque: true,
            text: "This is a closed door."
        })
        this.closed = true;
    }
    toggle() {
        this.closed = !this.closed;
        if (this.closed) {
            this._char = '□';
            this.text = "This is a closed door."
            this.isOpaque = true;
            this.isWalkable = false;
        } else {
            this._char = '-'; //every other part of toggling works, why not this?
            // console.log(this.char); //yeah this is fine... so why is it still rendering +?
            this.text = "This is an open door.";
            this.isOpaque = false;
            this.isWalkable = true;
        }
    }
}

class GateTile extends Tile {
    constructor() {
        super({
            char: '+',
            fg: 'tan',
            isWalkable: false,
            isOpaque: false,
            text: "This is a closed gate, but you can see through its bars."
        })
        this.closed = true;
    }
    toggle() {
        this.closed = !this.closed;
        if (this.closed) {
            this._char = '+';
            this.text = "This is a closed gate, but you can see through its bars."
            this.isWalkable = false;
        } else {
            this._char = '-'; //every other part of toggling works, why not this?
            // console.log(this.char); //yeah this is fine... so why is it still rendering +?
            this.text = "This is an open gate.";
            this.isWalkable = true;
        }
    }
}

// //getters

// Game.Tile.prototype.isWalkable = function() {
//     return this._isWalkable;
// }
// Game.Tile.prototype.isDiggable = function() {
//     return this._isDiggable;
// }

// Game.Tile.nullTile = new Game.Tile({});
// Game.Tile.floorTile = new Game.Tile({
//     char: '.',
//     isWalkable: true
// // });
// Game.Tile.wallTile = new Game.Tile({
//     char: '#',
//     fg: 'peachpuff',
//     isDiggable: true
// });