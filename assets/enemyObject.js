var enemies = {

    // goblin enemy
    goblin: {
        name: "goblin",
        hp: 10,
        damage: 2,
        armor: 0,
        luck: 1,
        bagSlots: 5,
        corpseRate: 100,
        foes: ["player"],
        friends: ["goblin"],
        sight: 10,
        maxSpeed: 1,
        char: "g",
        fg: "green",
        bg: "black"
    },
    //rat enemy
    rat: {
        name: "rat",
        hp: 5,
        damage: 1,
        armor: 0,
        luck: 1,
        bagSlots: 0,
        corpseRate: 100,
        foes: ["player"],
        friends: ["rat"],
        sight: 10,
        maxSpeed: 1,
        char: "r",
        fg: "lightbrown",
        bg: "black"
    }

};