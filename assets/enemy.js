class Enemy extends Entity {
    constructor(properties) {
        console.log(properties); //undefined...
        super(properties);
        this.hp = properties['hp'] || 1;
        this.actor = true;
        this.mortal = true;
        this.armor = properties['armor'] || 0;
        this.damage = properties['damage'] || 1;
        this.luck = properties['luck'] || 1.0;
        this.bagSlots = properties['bagSlots'] || 3;
        this.attacker = properties['attacker'] || true;
        // this.corpseRate = properties['corpseRate'] || 0;
        this.foes = properties['foes'] || ['branded'];
        this.wants = properties['wants'] || [];
        this.friends = properties["friends"] || [this.name];
        this.maxSpeed = properties['maxSpeed'] || 1;
        this.tags = properties['tags'] || [];
        this.loot = properties['loot'] || {};
        
    }
    wander() {
        // this.tryMove(this.getX(), this.getY(), this.getZ()) //stand still
       // Flip coin to determine if moving by 1 in the positive or negative direction
       var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
       // Flip coin to determine if moving in x direction or y direction
       if (Math.round(Math.random()) === 1) {
           this.tryMove(this.getX() + moveOffset, this.getY(), this.getZ());
       } else {
           this.tryMove(this.getX(), this.getY() + moveOffset, this.getZ());
       }
   }
    act() {
        if (this.tags.includes("vicious") && this.lookout("foes", this.sight)) {
            let closestFoe = this.getClosest(this.lookout("foes", this.sight))
            console.log(this.getDistance(closestFoe)) //always at least 2? even when adjacent?
            if (this.getDistance(closestFoe) <= 2) {
                console.log(this.name + " attacks " + closestFoe.name)
                this.attack(closestFoe);
            } else {
                this.seek(closestFoe);
            }
        }
    }
    canSee(entity) {
        if (!entity || this.getMap() !== entity.getMap() || this.getZ() !== entity.getZ()) {
            return false;
        }
        let otherX = entity.getX();
        let otherY = entity.getY();

        // If we're not in a square field of view, then we won't be in a real
        // field of view either.
        if ((otherX - this._x) * (otherX - this._x) +
            (otherY - this._y) * (otherY - this._y) >
            this.sight * this.sight) {
            return false;
        }
        let found = false;
        this.getMap().getFOV(this.getZ()).compute(
            this.getX(), this.getY(), this.sight,
            function(x, y, radius, visibility) {
                if (x === otherX && y === otherY) {
                    found = true;
                }
            }
        )
        return found;


    }
    lookout(type, range) {
        let results = [];
        let nearbyThings = [];
        
        switch(type){
            case "foes": 
                nearbyThings = this._map.getEntitiesWithinRadius(this._x, this._y, this._z, range);
                if (nearbyThings) {
                    results = nearbyThings.filter(guy => 
                        this.canSee(guy) && this.foes.includes(guy.name)
                    )
                }
                break;
            case "wants":
                nearbyThings = this._map.getItemsWithinRadius(this._x, this._y, this._z, range);
                if (nearbyThings) {
                    //console.log(`${this.name} smells ${nearbyThings.length} items nearby...`)
                results = nearbyThings.filter(item => this.wants.includes(item.name))
                }
                break;
            case "friends":
                nearbyThings = this._map.getEntitiesWithinRadius(this._x, this._y, this._z, range);
                if (nearbyThings) {
                    results = nearbyThings.filter(guy => this.friends.includes(guy.name))
                }
                break;
            case 'prey':
                nearbyThings = this._map.getEntitiesWithinRadius(this._x, this._y, this._z, range);
                if (nearbyThings) {
                    results = nearbyThings.filter(guy => this.prey.includes(guy.name))
                }
                break;
        }
        if (results.length > 0) {
            return results;
        } else {        
            return false;
        }
    }
    seek(target) {
        // console.log(target); //why is it seeking an empty target?
        // console.log(this); //why is map undefined when checked on line 71? it's defined correctly here
        let thisEnemy = this;
        let z = this._z;
        let path = new ROT.Path.AStar(target._x, target._y, function (x, y) {
            // console.log(thisEnemy) //ah this is not callable within functions or whatever, sure
            let entity = thisEnemy._map.getEntityAt(x, y, z);
            if (entity && entity !== target & entity !== thisEnemy) {
                return false;
            }
            //console.log(`enemy ${thisEnemy.name} at ${thisEnemy._x}, ${thisEnemy._y} trying to path to ${target.name} at:`)
            //console.log(`coords: ${x}, ${y}, ${z}`)
            return thisEnemy._map.getTile(x, y, z).isWalkable;
        }, {topology: 4});
        let count = 0;
        path.compute(thisEnemy._x, thisEnemy._y, function (x, y) {
            if (count === 1) {
                thisEnemy.tryMove( x, y, z)
                return true;
            }
            count++;
        });
    }
    attack(target) {
        console.log(`enemy attacking/targeting ${target.name}`)
        //only do this if the target is mortal
        if(target.mortal) {
            let damage = this.damage;
            let critChance = 0.05*this.luck;
            let crit = false;
            let message = "";
            if (Math.random() <= critChance) {
                damage = damage * 2;
                crit = true;
            }
            if (crit) {
                message = `The ${this.name} critically hit the ${target.name} for ${damage - target.armor} point(s) of damage!`
            } else {
                message = `The ${this.name} hit the ${target.name} for ${damage - target.armor} point(s) of damage!`
            }
            Game.message(message)
            target.takeDamage(this, this.damage)
        }
    }
    takeDamage(attacker, damage) {
        // console.log(`${this.name} got hit by ${attacker.name} for ${damage - this.armor} point(s) of damage!`)
        this.hp -= damage - this.armor;
        //console.log(`${this.name} has ${this.hp} hp remaining...`)
        if (this.hp <= 0) {
            this.die(attacker);
        }
    }
    getHp() {
        return this.hp
    }
    tryMove(x, y, z, map) {
        var map = this.getMap();
        // console.log(this.getZ());

        // console.log('trying to move!')
        var tile = map.getTile(x, y, this.getZ());
        var target = map.getEntityAt(x, y, this.getZ());
        // console.log(`${this.name} attempting to move into ${target.name}`)
        // console.log(target);
        //on stair?
        if (z < this.getZ()) {
            if (!(tile instanceof StairUp)) {
                // Game.message("You can't go up here.")
            } else {
                this.setPosition(x, y, z);
                // Game.message("You walk up the stairs.")
            }
        }
        if (z > this.getZ()) {
            if (!(tile instanceof StairDown)) {
                // Game.message("You can't go down here.")
            } else {
                this.setPosition(x, y, z);
                // Game.message("You walk down the stairs.")
            }
        }

        // If an entity was present at the tile, check if it's us. if it is, wait a turn
        if (target === this) {
            // console.log('waiting one turn.');
            return true;
        }
        if (this.attacker && (this.foes.includes[target.name])) { //removed some conditions to try to get shamblers to attack... this allows enemies to attack one another
            // console.log(`${this.name} targeting ${target.name}`)
            this.attack(target);
            // console.log(`${this.name} attacked ${target.name}!`)
            return true;
        }  else if (target) {
            // console.log(`${this.name} bumps into ${target.name} harmlessly.`)
            //cannot attack
            return false;
        }
        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (tile.isWalkable) {
            // Update the entity's position
            this.setPosition(x, y, z);
            // console.log(`updated ${this.name} stored position!`)
            return true;
        // Check if the tile is diggable, and
        // if so try to dig it
        }
        //  else if (tile.isDiggable) { //only players can dig, for now
        //     map.dig(x, y, z);
        //     console.log('dug terrrain instead!')
        //     return true;
        // }
        return false;
    }
    die(attacker) {
        // replacing corpse item class with unique corpse items in creature loot object
        // if (this.corpseRate > 0) {
        //     this.tryDropCorpse();
        // }
        this.dropLoot();
        this.getMap().removeEntity(this);
        Game.message(`The ${this.name} is killed by a ${attacker.name}!`)
    }
    dropLoot() {
        let dropNames = [];
        // for each item in this.loot.drops, add if roll below drop chance
        for (let i = 0; i < this.loot.length; i++) {
            if (Math.round(Math.random() * 100) < this.loot[i].chance) {
                dropNames.push(this.loot[i].name);
            }
        }
        // for each item in dropNames, create item and drop
        for (let i = 0; i < dropNames.length; i++) {
            if (dropNames[i] in vault) {
                let item = new Item(vault[dropNames[i]]);
                this._map.addItem(this.getX(), this.getY(), this.getZ(), item);
            }
        }
        //drop items in bag
        for (let i = 0; i < this.bag.length; i++) {
            if (this.bag[i]){
                while (this.bag[i] && this.bag[i].quantity > 0) {
                    this.dropItem(i);
                }
                //console.log(`a dying ${this.name} dropped a ${this.bag[i].name}`) //this is printing but the item isn't being placed on the map
            }
        }

    }
    // tryDropCorpse() {
    //     if (Math.round(Math.random() * 100) < this.corpseRate) {
    //         // Create a new corpse item and drop it.
    //         this._map.addItem(this.getX(), this.getY(), this.getZ(), (new Corpse({
    //             name: this.name
    //         })));
    //     }
    // }
}

