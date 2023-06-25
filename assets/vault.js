var vault = {
    pebble: {
        name: 'pebble',
        text: 'Small, smooth stone.',
        char: ',',
        fg: 'lightgrey',
        bg: 'black',
        options: [
            'drop'
        ]
    },
    bag: {
        name: 'cloth bag',
        text: 'Small cloth bag, suitable for carrying a few items.',
        char: '&',
        fg: 'lightgrey',
        bg: 'black',
        options: [
            'open',
            'stow',
            'retrieve',
            'drop'
        ],
        container: true
    },
    loaf: {
        name: 'loaf',
        text: "Stale loaf of bread. It's hard and chewy, but filling.",
        char: 'ࡇ',
        fg: 'lightsalmon',
        bg: 'black',
        options: [
            "drop",
        ],
        tags: [
            'food'
        ],
        foodValue: 2
    },
    "bit of string": {
        name: "bit of string",
        text: "Bit of faded string. It's not very useful.",
        char: '~',
        fg: 'lightgrey',
        bg: 'black',
        options: [
            "drop"
        ],
        tags: [
            "junk"
        ]
    },
    "rat corpse": {
        name: "dead rat",
        text: "Carcass of a small, furry mammal. It's not very appetizing. Might be better roasted.",
        char: 'ࡎ',
        fg: 'brown',
        bg: 'black',
        options: [
            "drop",
            "eat"
        ],
        tags: [
            "food"
        ]
    }

}