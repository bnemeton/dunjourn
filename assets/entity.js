class Entity extends Glyph{
    constructor(properties) {
        properties = properties || {};
        super(properties);
        // Instantiate any properties from the passed object
        this.name = properties['name'] || '';
        this.text = properties['text'] || '';
        this._x = properties['x'] || 0;
        this._y = properties['y'] || 0;
        this._z = properties['z'] || 0;
        this._map = null;
        this.actor = properties['actor'] || false;
        this.canDig = properties['canDig'] || false;
        this.sight = properties['sight'] || 3;
        this.smell = properties['smell'] || 3;
        // this.setX = function(x) {
        //     this._x = x;
        this.bagSlots = properties['bagSlots'] || 10;
        this.bag = [];
    }

    //methods ffs
    getClosest(array) {
        let x1 = this._x;
        let y1 = this._y;
        let nearest = {};
        let shortestDist = 10000;
        for (let i = 0; i < array.length; i++) {
            let x2 = array[i]._x;
            let y2 = array[i]._y;

            let dx = x1 - x2;
            let dy = y1 - y2;

            let distance = Math.sqrt((dx * dx) + (dy * dy))
            if (distance < shortestDist) {
                shortestDist = distance;
                nearest = array[i]
            }
        }
        return nearest;
    }
    //method to get the distance between this and other entity
    getDistance(target) {
        let target_x = target._x;
        let target_y = target._y;
        let thisGuy = this;
        let path = new ROT.Path.AStar(target_x, target_y, function(x, y) {
            let entity = thisGuy._map.getEntityAt(x, y, thisGuy._z);
            if (entity && entity !== target & entity !== thisGuy) {
                return false;
            }
            return thisGuy._map.getTile(x, y, thisGuy._z).isWalkable;
        }, {topology: 4});
        let count = 0;
        path.compute(this._x, this._y, function(x, y) {
            count++;
        });
        return count;

    }


    getBag() {
        return this.bag;
    }
    getItemFromBag(index) {
        return this.bag[index];
    }
    giveItem(item) {
        for (var i=0; i<this.bag.length; i++) {
            if (this.bag[i]) {
                    if (this.bag[i].name === item.name) {
                    this.bag[i].quantity++
                    return true;
                }
            }
        }
        if (this.hasFreeBagSlot()) {
            for (var i=0; i<this.bag.length; i++) {
                if (!this.bag[i]) {
                    this.bag[i] = item;
                    return true;
                }
            }
        }
        return false;
    }
    removeItem(index) {
        this.bag[index] = null;
    }
    hasFreeBagSlot() {
        for (var i = 0; i < this.bagSlots; i++) {
            if (!this.bag[i]) {
                return true;
            }
        }
        return false;
    }
    pickupItems(indices) {
        // Allows the user to pick up items from the map, where indices is
        // the indices for the array returned by map.getItemsAt
        var mapItems = this._map.getItemsAt(this.getX(), this.getY(), this.getZ());
        var added = 0;
        //check if we have a free bag slot
        if (this.hasFreeBagSlot()) {
            //find the first open slot lower than bagSlots
            for (var i = 0; i < this.bagSlots; i++) {
                if (!this.bag[i]) {
                    //add the item to the bag
                    this.bag[i] = mapItems[indices[0]];
                    //remove the item from the map
                    mapItems.splice(indices[0], 1);
                    //increment added
                    added++;
                    //remove the index from indices
                    indices.splice(0, 1);
                    //if we've added all the items, break
                    if (indices.length === 0) {
                        return true;
                    }
                }
            }
            //if we don't have a free bag slot, return false
        } else {
            Game.message('Your inventory is full.')
            return false;
        }
        // Update the map items
        this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);
        
        if (added > 1){
            Game.message(`${this.name} picked up some items.`)
        }
            
        // Return true only if we added all items
        return added === indices.length;
    }
    dropItem(index) {
        // Drops an item to the current map tile
        if (this.bag[index]) {
            if (this._map) {
                this._map.addItem(this.getX(), this.getY(), this.getZ(), this.bag[index]);
                Game.message(`${this.name} dropped a ${this.bag[index].name}.`)
            }
            // Game.message(`You put down the ${this.bag[index].name}.`)  
            if (this.bag[index].quantity > 1) {
                this.bag[index].quantity--
                return true;
            } else {
                this.removeItem(index);
                return true;
            }
        }
        //no such item in bag??
        console.log(`${index} has no item in this bag, apparently`)
        return false;
    }



    getSightRadius() {
        return this.sight;
    }
    setName(name) {
            this._name = name;
        }
    setPosition(x, y, z) {
        var oldX = this._x;
        var oldY = this._y;
        var oldZ = this._z;
        // Update position
        this._x = x;
        this._y = y;
        this._z = z;
        // If the entity is on a map, notify the map that the entity has moved.
        if (this._map) {
            this._map.updateEntityPosition(this, oldX, oldY, oldZ);
        }
    }
    setX(x) {
        this._x = x;
    }
    setY(y) {
        this._y = y;
    }
    setZ(z) {
        this._z = z;
    }
    setMap(map) {
        this._map = map;
    }
    getName() {
        return this._name;
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
    getZ() {
        return this._z;
    }
    getMap() {
        return this._map;
    }
}