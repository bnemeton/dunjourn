var items = {
    pebble: {
        name: 'pebble',
        text: 'A small, smooth stone.',
        char: ',',
        fg: 'lightsalmon',
        bg: 'black',
        options: [
            'drop'
        ]
    },
    bag: {
        name: 'cloth bag',
        text: 'A small cloth bag, suitable for carrying a few items.',
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
        text: "A stale chunk of bread. It's hard and chewy, but filling.",
        char: '~',
        fg: 'lightsalmon',
        bg: 'black',
        options: [
            "drop",
        ],
        tags: [
            'food'
        ],
    } 

}