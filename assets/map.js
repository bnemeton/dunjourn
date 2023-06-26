class Map {
    constructor(tiles, player) {
        console.log(tiles); //undefined, bc it's undefined from the builder
    
        this._tiles = tiles;
        // cache the width and height based
        // on the length of the dimensions of
        // the tiles array
        this._depth = tiles.length;
        this._width = tiles[0][0].length;
        this._height = tiles[0].length;
        this._explored = new Array(this._depth);
        this.setupExploredArray();
        //array of arrays of lights
        let testLight = new Light({
            color: [150, 100, 75],
            x: 32,
            y: 32,
            z: 0,
            states: [
                [235, 235, 250],
                [235, 235, 250],
                [235, 235, 250],
                [235, 235, 250],
                [235, 235, 250],
                [175, 175, 125]
            ]
        });
        this._lights = [[testLight],[]];
        //lightData
        this._lightData = [];
        //add empty lightdata object for each floor
        for (var z = 0; z < this._depth; z++) {
            this._lightData.push({});
        }
        //object of items on map
        this._items = {};
        //object of entities on map
        this._entities = {};
        //FOVs
        this._fov = [];
        this.setupFOV();
        // console.log(this._fov)
        //engine and scheduler
        this._scheduler = new ROT.Scheduler.Simple();
        this._engine = new ROT.Engine(this._scheduler);
        //add the player
        this.addEntityAtRandomPosition(player, 0);
        //set player light location & add player light to map
        player.light.setPosition(player.getX(), player.getY(), player.getZ());
        this._lights.push(player.light);
        console.log(`added player light at ${player.light.getX()}, ${player.light.getY()}`)
        
    }
    getLights() {
        return this._lights;
    }
    getLightData() {
        return this._lightData;
    }
    setLightData(lightData) {
        this._lightData = lightData;
    }
    updateLightData(z) {
        var map = this;
        //iterate over lights and flicker them
        if (this._lights[z].length > 0) {
            for (let i = 0; i < this._lights[z].length; i++) {
                this._lights[z][i].flicker();
            }
        }
        
        function reflectivityCallback(x, y) {
            let tile = map.getTile(x, y, z);
            switch (tile.char) {
                case ".": return 0.3;
                case "#": return 0;
                case ">": return 0.5;
                case "<": return 0.5;
            }
        }
        var lighting = new ROT.Lighting(reflectivityCallback, {range: 10, passes: 3});
             lighting.setFOV(this._fov[z]);
             function lightingCallback(x, y, color) {
                 var key = `${x},${y}`;
                 map._lightData[z][key] = color;
                //  console.log("lighting callback called")
                 
             }
             for (let i = 0; i < this._lights.length; i++) {
                 lighting.setLight(this._lights[i].x, this._lights[i].y, this._lights[i].color);
             }
             lighting.compute(lightingCallback);
    }

    getItemsAt(x, y, z) {
        // if (this._items[`${x},${y},${z}`]) {
        //     console.log(this._items[`${x},${y},${z}`])
        // }
        if (this._items[`${x},${y},${z}`]) {
            return this._items[`${x},${y},${z}`];
        } else {
            return [];
        }
    }
    setItemsAt(x, y, z, items) {
        var key = `${x},${y},${z}`;
        if (items.length === 0) {
            if (this._items[key]) {
                delete this._items[key];
            } 
        } else {
            this._items[key] = items;
        }
    }
    addItem(x, y, z, item) {
        var key = `${x},${y},${z}`;
        item._x = x;
        item._y = y;
        item._z = z;
        if (this._items[key]) {
            this._items[key].push(item);
        } else {
            this._items[key] = [item];
        }
    }
    addItemAtRandomPosition(item, z) {
        var position = this.getRandomFloorPosition(z);
        this.addItem(position.x, position.y, position.z, item);
    };
    setupFOV() {
        var map = this;
        
        for (var z = 0; z < this._depth; z++) {
           
            let whatever = function() { 
                var depth = z;
                map._fov.push(
                    new ROT.FOV.PreciseShadowcasting(function(x, y) {
                        // console.log(`tile ${x}, ${y} on floor ${depth} type: ${map.getTile(x, y, z).constructor.name}`) //always returns NullTile for some reason? but the actual shadowcasting works
                        return !map.getTile(x, y, depth).isOpaque;
                    },
                    {topology: 8}
                ))
                }
            whatever();
            //generate dark/empty lightData
            for (var y = 0; y < this._height; y++) {
                for (var x = 0; x < this._width; x++) {
                    var key = `${x},${y}`;
                    map._lightData[z][key] = [0, 0, 0];
                }
            }

             // lightData setup
             function reflectivityCallback(x, y) {
                    let tile = map.getTile(x, y, z);
                    switch (tile.char) {
                        case ".": return 0.3;
                        case "#": return 0;
                        case ">": return 0.5;
                        case "<": return 0.5;
                    }
             }
             var lighting = new ROT.Lighting(reflectivityCallback, {range: 10, passes: 3});
            // var lighting = new ROT.Lighting();
             lighting.setFOV(this._fov[z]);
             function lightingCallback(x, y, color) {
                 var key = `${x},${y}`;
                 map._lightData[z][key] = color;
                //  console.log("lighting callback called")
                 
             }
             for (let i = 0; i < this._lights.length; i++) {
                 lighting.setLight(this._lights[i].x, this._lights[i].y, this._lights[i].color);
             }
             lighting.compute(lightingCallback);
        }
        // console.log(map._fov)
    };
    addLight(x, y, z, color) {
        let light = new Light({x: x, y: y, z: z, color: color});
        this._lights.push(light);

    }
    setupExploredArray() {
        for (var z = 0; z < this._depth; z++) {
            this._explored[z] = new Array(this._height);
            for (var y = 0; y < this._height; y++) {
                this._explored[z][y] = new Array(this._width);
                for (var x = 0; x < this._height; x++) {
                    this._explored[z][y][x] = false;
                }
            }
        }
    }
    setExplored(x, y, z, state) {
        // Only update if the tile is within bounds
        if (!(this.getTile(x, y, z) instanceof NullTile)) {
            this._explored[z][y][x] = state;
        }
    }
    isExplored(x, y, z) {
        // Only return the value if within bounds
        if (!(this.getTile(x, y, z) instanceof NullTile)) {
            return this._explored[z][y][x];
        } else {
            return false;
        }
    };
    getFOV(depth) {
        // console.log(depth);
        return this._fov[depth];
    }
    dig(x, y, z) {
        // If the tile is diggable, update it to a floor
        if (this.getTile(x, y, z).isDiggable) {
            this._tiles[z][y][x] = new FloorTile();
        }
    }
    getRandomFloorPosition(z) {
        // Randomly select a tile which is a floor
        // console.log(this._tiles) // weird empty array of arrays
        var thisFloorTiles = this._tiles[z];
        // console.log(thisFloorTiles); //weird empty array of arrays

        var empties = [];

        for (var x=0; x < thisFloorTiles.length; x++) {
            let column = thisFloorTiles[x];
            for(var y=0; y < column.length; y++) {
                if ((thisFloorTiles[y][x] instanceof FloorTile) && !this.getEntityAt(x, y, z)) {
                    empties.push({
                        x: x,
                        y: y,
                        z: z
                    });
                }
            }
        }

        // console.log(empties);

        var shuffledEmpties = shuffle(empties);
        // console.log(shuffledEmpties); //length 0... where did the tiles go wrong, i wonder?

        var randFloor = shuffledEmpties.pop();
        // console.log(randFloor); //undefined...

        return {x: randFloor.x, y: randFloor.y, z: randFloor.z};
        // var x; 
        // var y;
        // do {
        //     x = Math.floor(Math.random() * this._width);
        //     y = Math.floor(Math.random() * this._height);
        // } while(!this.isEmptyFloor(x, y, z));
        // return {x: x, y: y, z: z};
    };
    getWidth() {
        return this._width;
    };
    getHeight() {
        return this._height;
    };
    getDepth() {
        return this._depth;
    }
    getTile(x, y, z) {
        // Make sure we are inside the bounds. If we aren't, return
        // null tile.
        if (x < 0 || x >= this._width || y < 0 || y >= this._height || z < 0 ||z >= this._depth) {
            return new NullTile();
        } else {
            // console.log(z);
            return this._tiles[z][y][x];
        }
    }
    getEngine() {
        return this._engine;
    }
    getEntities() {
        return this._entities;
    }
    getEntityAt(x, y, z) {
            // Get the entity based on position key
            if (this._entities[x + ',' + y + ',' + z]) {
                return this._entities[x + ',' + y + ',' + z];
            } else {
                return false;
            }
    }
    updateEntityPosition(entity, oldX, oldY, oldZ) {
        // Delete the old key if it is the same entity and we have old positions.
        // console.log(`attempting to update the position of a ${entity.name}...`)
        if (true) { // maybe figure out what this is supposed to be
            var oldKey = oldX + ',' + oldY + ',' + oldZ;
            if (true) { //this too
                // console.log(`removing old entity position`)
                delete this._entities[oldKey];
            }
        }
        // Make sure the entity's position is within bounds
        if (entity.getX() < 0 || entity.getX() >= this._width ||
            entity.getY() < 0 || entity.getY() >= this._height ||
            entity.getZ() < 0 || entity.getZ() >= this._depth) {
            //console.log("!! Entity's position is out of bounds !!");
        }
        // Sanity check to make sure there is no entity at the new position.
        var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
        if (this._entities[key]) {
            //console.log('!! Tried to add an entity at an occupied position !!');
        }
        // Add the entity to the table of entities
        // console.log('adding entity at new position')
        this._entities[key] = entity;
    };

    getItemsWithinRadius(centerX, centerY, centerZ, radius) {
        let items = [];
        for (let i=-radius;i<radius;i++) {
            for (let j=-radius;j<radius;j++) {
            let itemPile = this.getItemsAt(centerX+i, centerY+j, centerZ)
                if (itemPile) {
                    itemPile.forEach(item => items.push(item));
                }
            }
        }
        if (items.length > 0) {
            return items;
        } else {        
            return false;
        }
    }

    getEntitiesWithinRadius(centerX, centerY, centerZ, radius) {
        let results = [];
        // Determine our bounds
        var leftX = centerX - radius;
        var rightX = centerX + radius;
        var topY = centerY - radius;
        var bottomY = centerY + radius;
        let counted = 0;
        // Iterate through our entities, adding any which are within the bounds
        for (var key in this._entities) {
            // console.log(entity) // what exactly is this iterating over? oh it's the key. but that wasn't working before either...
            let entity = this._entities[key]
            // console.log(`checking the ${entity.name} at ${entity.getX()}, ${entity.getY()}`) //ugh this prints fine
            // console.log(entity) // let's try this again... // this is printing entities appropriately. so why isn't the following ever pushing anyone to results?

            // if (entity.getX() >= leftX && entity.getX() <= rightX) { //as suspected, this is never "true"... // even if i switch from getters to the props as if that would matter
            //     console.log(`there's a ${entity.name} in the right columns...`)
            //     if (entity.getY() >= topY && entity.getY() <= bottomY) {
            //         console.log(`there's an ${entity.name} in the right rows...`)
            //         if (entity.getZ() === centerZ) {
            //             console.log('ding ding ding! it is on the correct floor! push that baby to the results array!!!')
            //             results.push(entity)
            //         }
            //     }
            // }

            if (entity.getX() >= leftX && entity.getX() <= rightX && //entity.getX() isn't a function...? // bc entity was the key, addressed that
            entity.getY() >= topY && entity.getY() <= bottomY &&
            entity.getZ() === centerZ) {
                //console.log(entity.name+' detected!') // never fires???
                results.push(entity);
            }
            counted++
        }
        // console.log(`${counted} entities counted, ${results.length} results!`) // counted increases as fungi spawn, but results.length is always zero. aaaaaaa
        // console.log(results) // always empty array... even though things *are* getting stored in the _entities object and can be retrieved just fine. baffling.
        return results;
    }
    addEntity(entity) {
        // Update the entity's map
        entity.setMap(this);
        // Update the map with the entity's position
        this.updateEntityPosition(entity);
        // Check if this entity is an actor, and if so add
        // them to the scheduler
        if (entity.actor) {
           this._scheduler.add(entity, true);
        }
    }
    addEntityAtRandomPosition(entity, z) {
        var position = this.getRandomFloorPosition(z);
        entity.setX(position.x);
        entity.setY(position.y);
        entity.setZ(position.z)
        this.addEntity(entity);
    }
    removeEntity(entity) {
        // Remove the entity from the map
        var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
        // console.log(`attempting to remove a ${this._entities[key].name}`)
        if (this._entities[key] == entity) {
            // console.log(`removing a ${this._entities[key].name}`)
            delete this._entities[key];
            
        }
        // If the entity is an actor, remove them from the scheduler
        if (entity.actor) {
            this._scheduler.remove(entity);
        }
    }
    getTilesWithinRadius(centerX, centerY, centerZ, radius) {
        let tiles = [];
        for (let i=-radius;i<radius;i++) {
            for (let j=-radius;j<radius;j++) {
            let tile = this.getTile(centerX+i, centerY+j, centerZ)
                if (tile) {
                    tiles.push(tile)
                }
            }
        }
        return tiles;
    }
    getRandomEmptyFloorWithinRadius(centerX, centerY, centerZ, radius) { //does not work
        let results = [];
        for (let i=-radius;i<radius;i++) {
            for (let j=-radius;j<radius;j++) {
                let x = centerX+i;
                let y = centerY+j;
                if (this.isEmptyFloor(x, y, centerZ)) {
                    results.push({x: x, y: y, z: centerZ});
                }
            }
        }
        if (results.length === 0) {
            return false;
        }
        return results[(Math.floor(Math.random() * results.length))];
    }

    // removeEntity(entity) {
    //     //find entity in the array if it exists
    //     for (var i=0; i < this._entities.length; i++) {
    //         if (this._entities[i] == entity) {
    //             this._entities.splice(i, 1);
    //             break;
    //         }
    //     }
    //     //remove them from scheduler if they are an actor
    //     if (entity.actor) {
    //         this._scheduler.remove(entity);
    //     }
    // }
    isEmptyFloor(x, y, z) {
        return (this.getTile(x, y, z) instanceof FloorTile) && !this.getEntityAt(x, y, z);
    }
    removeItem(item) {
        let items = this.getItemsAt(item._x, item._y, item._z);
        console.log(items);
        if (!items || !items.includes(item)) {
            return false;
        } else {
            let index = items.indexOf(item);
            // remove item from array
            items.splice(index, 1);
            return true;
        }
        
    }

};
