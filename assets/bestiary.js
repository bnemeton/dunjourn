var bestiary = {

    // goblin enemy
    goblin: {
        name: "goblin",
        hp: 10,
        damage: 2,
        armor: 0,
        luck: 1,
        bagSlots: 5,
        foes: ["player"],
        friends: ["goblin", "rat"],
        sight: 10,
        maxSpeed: 1,
        char: "g",
        fg: "lightgreen",
        bg: "black"
    },
    //rat enemy
    rat: {
        name: "rat",
        hp: 3,
        damage: 1,
        armor: 0,
        luck: 1,
        bagSlots: 0,
        foes: ["player"],
        friends: ["rat", "goblin"],
        sight: 10,
        maxSpeed: 1,
        char: "r",
        fg: "lightbrown",
        bg: "black",
        loot: [
            {
                name: "rat corpse",
                chance: 100
            }
        ]
    }

};