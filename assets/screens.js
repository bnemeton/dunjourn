
// enter : function()
// exit : function()
// render : function(display)
// handleInput : function(inputType, inputData)

Game.Screen = {};

var fg = ROT.Color.toRGB([
    31,
    207,
    142
]);
var bg = ROT.Color.toRGB([
    0,
    0,
    0
]);
var foreColor = "%c{" + fg + "}%b{" + bg + "}";

fg = ROT.Color.toRGB([
    200,
    200,
    200
]);

var ashColor = "%c{" + fg + "}%b{" + bg + "}"

//start screen
Game.Screen.startScreen = {
    enter: function() {console.log('entered start screen...')},
    exit: function() {console.log('exited start screen.')},
    render: function(displays) {
        displays.main.drawText(32, 6, foreColor + "DUNJOURN 0.0.1");
        displays.main.drawText(32, 8, ashColor + "press [enter] to start");
        displays.main.drawText(22, 12, ashColor + `
                                            there's no game here yet! still working on initial setup.


                                            go to /about.html for what the hell is going on,
                                            & a reference of commands!

                                            go to /outline.html for planned features!
                                            `)
        displays.text.drawText(0, 0, ashColor + `
        Messages and combat log will appear here.`)
    },
    handleInput: function(inputType, inputData) {
        // when [enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
}

// option window
class OptionWindow {
    constructor(props) {
        this.index = props.index
        this.item = props.item
        this.options = props.options
        this.label = props.label
        this.indent = (Game._screenWidth/3)-12
        this.top = (Game._screenHeight/2)-12
        this.listItems = this.options.map(option => 
             {
                return {
                    name: option,
                    hovered: false
                }
            })
        this.container = props.container
    }

    setup(player) {
        this.player = player;
        // console.log(`window should be labeled ${this.label}`)
    }

    okFunction(option) {
        switch(option){
            case 'eat':
                console.log(`trying to eat the ${this.item.name}`)
                this.item.eat(this.index);
                break;
            case 'use':
                this.item.use(this.index);
                break;
            // case examine:
            //     this.item.examine();
            //     break;
            case 'drop':
                this.item.drop(this.index);
                break;
            case 'study':
                this.item.study(this.index);
                break;
            case 'take':
                let newItem = new Item({...this.item});
                this.item.quantity -= 1;
                this.player.giveItem(newItem);
                break;
            case "take all":
                let newItems = new Item({...this.item});
                this.item.quantity = 0;
                this.player.giveItem(newItems);
                break;
            case 'open':
                this.item.open();
                return true;
        }
        console.log(`optionScreen okFunction called`)
        Game.Screen.playScreen.setSubScreen(null);
        return true;
    }

    render(display) {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        let text = this.item.text;
        if (this.item.contents && this.item.contents.length > 0) {
            text += " It contains: "
            for (let i = 0; i < this.item.contents.length; i++) {
                text += `${this.item.contents[i].quantity} ${this.item.contents[i].name}`
                if (i < this.item.contents.length - 1) {
                    text += ", "
                }
            }
            text += "."
        }
        display.drawText(this.indent, this.top, text, 50)
        var row = 2;
        display.drawText(this.indent, this.top+row+1, this.label);
        row += 2
        for (var i = 0; i < this.listItems.length; i++) {
            // If we have an option, we want to render it.
            if (this.listItems[i]) {
                // Get the letter matching the option's index
                var letter = letters.substring(i, i + 1);
                let text = letter + " - " + this.listItems[i].name;
                let bg = "black"
                if (this.listItems[i].hovered) {
                    bg = "darkslategray";
                }
                this.listItems[i].position = [this.indent, this.top + 2 + row];
                this.listItems[i].index = letter;
                // console.log(this.listItems[i].position)
                display.drawText(this.indent, this.top + 2 + row, `%c{white}%b{${bg}}`+text,);
                row++;
            }
        }
        display.drawText(this.indent  + 6, this.top + 4+row, `[esc] - back`)
    }

    setGameEnded(gameEnded) {
        this._gameEnded = gameEnded;
    }

    handleInput(inputType, inputData) {
        // console.log('should be awaiting subscreen input...') // but it never hits any of the below ifs? but you can hit this console log again by hitting a key again
        //console.log(`input data: ${inputData.keyCode}`)
        // console.log(`input type: ${inputType}`)
        
        if (inputType === 'mousemove') {
            // console.log(inputData.y)
            //detect if mouse is over a list item
            let eventData = {
                clientX: inputData.x, //only actually need these apparently! also wait i adjusted these forever and set them back to default. what.
                clientY: inputData.y
            }
                //set these values to be easier to access
                var mouseCoords = Game._display.eventToPosition(eventData);
                // var mouseX = mouseCoords[0]; not currently necessary
                var mouseY = mouseCoords[1];
                // console.log(mouseY)
                //if mouse position matches a row, highlight that row
                for (let i=0; i < this.listItems.length; i++) { //never true, so i'm missing something about formatting
                    let itemY = this.listItems[i].position[1];
                    // console.log(itemY)
                    if (mouseY === itemY) {
                        this.listItems[i].hovered = true;
                        // console.log(this.listItems[i].label + " is hovered")
                        // console.log(`hovered`) //this triggers now but doesn't actually change the bg color
                        Game.refresh(); //why is it not highlighting the row?
                        // this.render(Game._display); //this doesn't work either. also, game.refresh works elsewhere...
                    } else {
                        this.listItems[i].hovered = false;
                        // console.log(`not hovered`)
                        Game.refresh();
                    }
                }

                
        }

        if (inputType === 'mousedown') {
            // console.log('mousedown') //never triggers..
            for (let i=0; i < this.listItems.length; i++) {
                if (this.listItems[i].hovered) {
                    // console.log(`clicked on ${this.listItems[i].label}`)
                        this.okFunction(this.listItems[i].name);
                }
                        
            }
        }

        if (inputType === 'keydown') {
            // If the user hit escape, hit enter and can't select an item, or hit
            // enter without any items selected, simply cancel out
            if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
                    console.log('returning to menu')
                    Game.Screen.inventoryScreen.setup(this.player, this.player.getBag())
                    Game.Screen.playScreen.setSubScreen(Game.Screen.inventoryScreen);
                    Game.refresh(); // is this necessary?
            // } else if (inputData.keyCode === ROT.KEYS.VK_RETURN) { // if they press return with an item selected
            //     console.log('should exit the subscreen...') //never hit this... let's check the keycode?
            //     this.okFunction();
            // Handle pressing a letter if we can select 
            } else {
                // console.log('trying to use something....????')
                let optionIndex;
                switch(inputData.keyCode) {
                    case ROT.KEYS.VK_A:
                        optionIndex = 0;
                        break;
                    case ROT.KEYS.VK_B:
                        optionIndex = 1;
                        break;
                    case ROT.KEYS.VK_C:
                        optionIndex = 2;
                        break;
                    case ROT.KEYS.VK_D:
                        optionIndex = 3;
                        break;
                    case ROT.KEYS.VK_E:
                        optionIndex = 4;
                        break;
                    case ROT.KEYS.VK_F:
                        optionIndex = 5;
                        break;
                    case ROT.KEYS.VK_G:
                        optionIndex = 6;
                        break;
                }
                if (this.options[optionIndex]) {
                    this.okFunction(this.options[optionIndex]);
                }
            }
        }
    }
}

//itemlist screen
class ItemListScreen {
    constructor(type) {
        this.label = type.label;
        this.okFunction = type.okFunction;
        this.selectable = type.selectable;
        this.multiselect = type.multiselect;
        this.indent = (Game._screenWidth/2) - 16;
        this.top = (Game._screenHeight/2) - 9;
    }

    setup(player, items, container = null) {
        if (container) {
            console.log(`setting up a container screen for ${container.name}`) //this fires
            this.container = container;
            this.label += ` of ${container.name}`
        }
        // console.log(items); //let's see what this looks like. looks fine!
        if (items.length === 0) {
            // console.log(`no items, closing itemlist`) 
            Game.Screen.playScreen.setSubScreen(null);
        }
        this.player = player;
        this.items = items;
        // console.log(this.items) // should just be bag contents. and is! //still fine for containers
        this.selectedIndices = [];
        //make a list item object for each item
        this.listItems = [];
        for (var i = 0; i < this.items.length; i++) {
            //make sure the slot *has* an item
            if (this.items[i]) {
                this.listItems.push(new ItemListItem(this.items[i]));
            }
        }
        // console.log(`here are the selected indices (should be none):`)
        // console.log(this.selectedIndices)
        // console.log(`window should be labeled ${this.label}`) 
    }

    executeOkFunction(item, index) { //leaving these here in case i want them later
        // gather selected items
        // console.log('here are the selected indices:')
        // console.log(this.selectedIndices)
        var selectedItems = [];
        this.selectedIndices.forEach(entry => selectedItems.push(this.items[entry])); //why do i do this instead of just. using selected indices?
        // console.log('Here are the selected items:')
        // console.log(selectedItems) // always the top item in the inventory screen, regardless of the input, despite the previous console log giving the correct index. why is it the top one, rather than all of them or something?
        // //return to playscreen
        // Game.Screen.playScreen.setSubScreen(null);
        // Call the OK function and end the player's turn if it return true.
        if (this.okFunction(selectedItems, this.selectedIndices)) {
            this.player.getMap().getEngine().unlock();
            // console.log(`okFunction triggered, returning to playscreen`) //not the culprit of the Container Clearing Bug
            Game.Screen.playScreen.setSubScreen(null);
        }
    }

    handleInput(inputType, inputData) {
        // console.log('should be awaiting subscreen input...') // but it never hits any of the below ifs? but you can hit this console log again by hitting a key again
        // console.log(`input keycode: ${inputData.keyCode}`)
        // console.log(`input type: ${inputType}`)
        if (inputType === 'keydown') {
            // If the user hit escape, hit enter and can't select an item, or hit
            // enter without any items selected, simply cancel out
            if (inputData.keyCode === ROT.KEYS.VK_ESCAPE || 
                (inputData.keyCode === ROT.KEYS.VK_RETURN && 
                (!this.selectable || this.selectedIndices.length === 0))) {
                    // console.log('setting subscreen to null')
                    Game.Screen.playScreen.setSubScreen(null);
                    Game.refresh(); // is this necessary?
            } else if (inputData.keyCode === ROT.KEYS.VK_RETURN) { // if they press return with an item selected
                // console.log('should exit the subscreen...') //never hit this... let's check the keycode?
                this.executeOkFunction();
            // Handle pressing a letter if we can select 
            } else if (this.selectable && inputData.keyCode >= ROT.KEYS.VK_A &&
                inputData.keyCode <= ROT.KEYS.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what letter of the alphabet we used.
                var index = inputData.keyCode - ROT.KEYS.VK_A;
                //console.log(`this is the index: ${index}`) //this is correct, but the actual update onscreen is always for the first item?
                if (this.items[index]) {
                    // If multiple selection is allowed, toggle the selection status, else
                    // select the item and exit the screen
                    if (this.multiselect) {
                        // console.log('multiselect enabled...')
                        if (this.selectedIndices.includes(index)) {
                            this.selectedIndices.forEach(entry => {
                                if (entry === index) {
                                this.selectedIndices.splice(this.selectedIndices.indexOf(entry), 1)
                            }
                        })
                        } else {
                            this.selectedIndices.push(index)
                        }
                        // Redraw screen
                        Game.refresh();
                    } else {
                        this.selectedIndices.push(index)
                        this.executeOkFunction(this.items[index], index);
                    }
                }
            }
        }
        //highlight list item on mousemove
        if (inputType === 'mousemove') {
            // console.log(inputData.y)
            //detect if mouse is over a list item
            let eventData = {
                clientX: inputData.x, //only actually need these apparently! also wait i adjusted these forever and set them back to default. what.
                clientY: inputData.y
            }
                //set these values to be easier to access
                var mouseCoords = Game._display.eventToPosition(eventData);
                var mouseX = mouseCoords[0]+this.indent;
                var mouseY = mouseCoords[1];
                // console.log(mouseY)
                //if mouse position matches a row, highlight that row
                for (let i=0; i < this.listItems.length; i++) { //never true, so i'm missing something about formatting
                    let itemY = this.listItems[i].position[1];
                    // console.log(itemY)
                    if (mouseY === itemY) {
                        this.listItems[i].hovered = true;
                        //tooltip with item's description and options
                        let toolTip = document.getElementById('tooltip');
                        toolTip.style.top = inputData.y-20 + 'px';
                        toolTip.style.left = inputData.x+15 + 'px';

                        let text = this.listItems[i].description;
                        // for (let j=0; j < this.listItems[i].options.length; j++) {
                        //     text += `<br>${this.listItems[i].options[j]}`
                        // }

                        let toolTipText = text
                        // let toolTip = document.getElementById('tooltip'); //now this is declared up in repositioning
                        if (toolTipText.length > 0) {
                            toolTip.style.display = "block"
                            document.body.style.cursor = "crosshair"
                        } else {
                            toolTip.style.display = "none"
                            document.body.style.cursor = "auto"
                        }
                        toolTip.innerHTML = toolTipText;

                        // console.log(this.listItems[i].label + " is hovered")
                        // console.log(`hovered`) //this triggers now but doesn't actually change the bg color
                        Game.refresh(); //why is it not highlighting the row?
                        // this.render(Game._display); //this doesn't work either. also, game.refresh works elsewhere...
                    } else {
                        this.listItems[i].hovered = false;
                        // console.log(`not hovered`)
                        Game.refresh();
                    }
                }

                
        }

        //select list item on mouseclick
        if (inputType === 'mousedown') {
            // console.log('mousedown') //never triggers..
            for (let i=0; i < this.listItems.length; i++) {
                if (this.listItems[i].hovered) {
                    // console.log(`clicked on ${this.listItems[i].label}`)
                    
                    if (this.multiselect) {
                        this.listItems[i].selected = true;
                        Game.refresh();
                    } else {
                        this.selectedIndices.push(i);
                        this.executeOkFunction();
                    }
                        
                }
            }
        }
    }

    render(display) {
        // console.log(`rendering an itemList screen`) //fires fine for containers. why does the inventory render fine but not containerscreen?
        // console.log(this.label)
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(this.indent, this.top, this.label);
        var row = 0;
        //for each itemlistitem, render it
        for (let i=0; i < this.listItems.length; i++) {
            //get the letter matching the item's index
            var letter = letters.substring(i, i + 1);
            let text = "";
            let bg = "black";
            text = letter + " - " + this.listItems[i].label + " - " + this.listItems[i].quantity;
            if (this.listItems[i].selected) {
                text += " +";
            }
            if (this.listItems[i].hovered) {
                bg = "darkslategray";
            }
            this.listItems[i].position = [this.indent, this.top + 2 + row];
            this.listItems[i].index = letter;
            // console.log(this.listItems[i].position)
            display.drawText(this.indent, this.top + 2 + row, `%c{white}%b{${bg}}`+text,);
            row++;
        }
        // for (var i = 0; i < this.items.length; i++) {
        //     // If we have an item, we want to render it.
        //     if (this.items[i]) {
        //         // Get the letter matching the item's index
        //         var letter = letters.substring(i, i + 1);
        //         // If we have selected an item, show a +, else show a dash between
        //         // the letter and the item's name.
        //         var selectionState = (this.selectable && this.multiselect &&
        //             this.selectedIndices.includes(i)) ? '+' : '-';
        //         // Render at the correct row and add 2.
        //         display.drawText(this.indent, this.top + 2 + row, letter + ' ' + selectionState + ' ' + this.items[i].quantity + ' ' + this.items[i].name);
        //         row++;
        //     }
        // }
    }
}

//container screen
Game.Screen.containerScreen = new ItemListScreen({
    label: "contents",
    multiselect: false,
    selectable: true,
    container: null,
    okFunction: function(selectedItems, selectedIndices) {
        var item = selectedItems[0];
        //console.log(`attempting to use a(n) ${item.name}`)
        let options = item.options;
        options.push("take");
        var window = new OptionWindow({
            index: selectedIndices[0],
            item: item,
            options: options,
            label: `What do you want to do with this ${item.name}?`,
            container: this.container
        })
        window.setup(this.player)
        Game.Screen.playScreen.setSubScreen(window);
        Game.refresh();
    }

})


//inventory screen
// Game.Screen.inventoryScreen = new ItemListScreen({
//     label: "~ inventory ~",
//     multiselect: false,
//     selectable: true,
//     okFunction: function(selectedItems, selectedIndices) {
//         var item = selectedItems[0];
//         //console.log(`attempting to use a(n) ${item.name}`)
//         var window = new OptionWindow({
//             index: selectedIndices[0],
//             item: item,
//             options: item.options,
//             label: `What do you want to do with this ${item.name}?`
//         })
//         window.setup(this.player)
//         Game.Screen.playScreen.setSubScreen(window);
//         Game.refresh();
//     }
// })

//pickup screen
Game.Screen.pickupScreen = new ItemListScreen({
    label: "which items do you want to pick up?",
    multiselect: true,
    selectable: true,
    okFunction: function(selectedItems, selectedIndices) {
        // Try to pick up all items, messaging the player if they couldn't all be picked up.
        if (!this.player.pickupItems(selectedIndices)) {
            Game.message("Your inventory is full! Not all items were picked up.");
        }
        return true;
    }
})

// //drop screen
// Game.Screen.dropScreen = new ItemListScreen({
//     label: "which item do you want to drop?",
//     multiselect: false,
//     selectable: true,
//     okFunction: function(selectedItems) {
//         // Drop the selected item
//         this.player.dropItem(Object.keys(selectedItems)[0]);
//         return true;
//     }
// })

//menu screen
class MenuScreen {
    constructor(props) {
        console.log(props)
        this.options = props.options
        this.label = props.label
        this.type = props.label
        this.text= ""
        this.indent = 3
        this.top = 2
        this.multiselect = props.multiselect || false
        // this.listItems = this.options.map(option => 
        //      {
        //         return new MenuItem({option})
        //     })
    }
    setup(player, args) {
        console.log(args) //this is even correct! how is item menu not working??
        this.player = player;
        switch(this.label) {
            case "inventory":
                // console.log("setting up inventory screen") //fires fine
                let bag = this.player.getBag();
                if (bag.length > 0) {
                    let options = [];
                    for (let i=0;i < bag.length; i++) {
                        let item = bag[i];
                        console.log(item.name) 
                        let menuItem = new MenuItem({
                            label: item.name, 
                            index: i,
                            hovered: false,
                            selected: false,
                            action: function() {
                                console.log(`attempting to open item menu for a(n) ${item.name}`) //this seems to console log the right name (the one we clicked on)
                                Game.Screen.itemMenu.setup(this.player, {item: item, index: i}) //but this is clearly setting up the wrong menu? how?
                                Game.Screen.playScreen.setSubScreen(Game.Screen.itemMenu);
                                Game.menuRefresh();
                            }
                        })
                        options.push(menuItem);
                    }
                    this.options = options;
                    //unselect all options
                    this.options.forEach(option => {
                        option.unselect()
                    })
                    // console.log(this.options) // this is correct...
                    return true;
                } else {
                    this.options = [
                        new MenuItem({
                            label: "inventory is empty, click to exit",
                            hovered: false,
                            selected: false,
                            action: () => {
                                Game.Screen.playScreen.setSubScreen(null);
                                Game.refresh();
                            }
                        })
                    ]};
                    // console.log(this.options) //fires with correct info
                return true;
            case "item menu":
                let item = args.item;
                let index = args.index;
                this.text = item.text;
                console.log(item) 
                let options = item.options;
                this.label = item.name;
                this.options = options.map(option => {
                    let action;
                    switch(option) {
                        case "eat":
                            action = () => {item.eat(index)};
                            break;
                    }
                    let menuItem = new MenuItem({
                        label: option,
                        hovered: false,
                        selected: false,
                        action: action
                        })
                    return menuItem;
                    })
                
                return true;
            }
    }
    render(display) {
        display.drawText(this.indent, this.top, this.label);
        display.drawText(this.indent, this.top + 2, this.text);
        var row = 3;
        for (let i=0; i < this.options.length; i++) {
            let text = "";
            let bg = "black";
            
            if (this.options[i].hovered) {
                bg = "darkslategray";
                display.drawText(this.indent-2, this.top + 2 + row, "> ")
            }
            text = " " + this.options[i].label;
            this.options[i].position = [this.indent, this.top + 2 + row];
            this.options[i].index = i;
            // console.log(this.options[i].position)
            display.drawText(this.indent, this.top + 2 + row, `%c{white}%b{${bg}}`+text,);
            row++;
        }
    }
    handleInput(inputType, inputData) {
        //exit menu screen when escape is pressed
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
                //so item menus don't just reload the previous one!!
                this.label = this.type;
                Game.Screen.playScreen.setSubScreen(null);
                Game._menuDisplay.clear();
                //hide menuContainer once more
                let menuContainer = document.getElementById("menuContainer");
                menuContainer.style.display = "none";
                Game.refresh();
            // } else { //keyboard menu controls
            //     switch(inputData.keyCode) {
            //         case ROT.KEYS.VK_UP:
            // }
            }
        }
        //mousemove to highlight menu items
        if (inputType === 'mousemove') {
            
            let mousePosition = Game._menuDisplay.eventToPosition(inputData);
            this.options.forEach(item => {
                // console.log(item.position) //seems fine
                if (item.position[0] < mousePosition[0] && item.position[0] + item.label.length + 1 > mousePosition[0] && item.position[1] === mousePosition[1]) {
                    item.hovered = true;
                    console.log(`hovered over ${item.label}`)
                } else {
                    item.hovered = false;
                }
            })
            Game.menuRefresh();
        }
        //click to select menu item
        if (inputType === 'mousedown') {
            let mousePosition = [inputData.clientX, inputData.clientY];
            this.options.forEach(item => {
                if (item.hovered && !item.selected) {
                    item.select()
                    console.log(`selected ${item.label}`)
                } else if (item.hovered && item.selected) {
                    item.unselect()
                    console.log(`unselected ${item.label}` )
                }
            })
            let selected = this.options.filter(item => item.selected);
            console.log(selected) //this shows the correct selected item, but see below
            if (this.multiselect === false && selected.length > 0) {
                console.log(selected[0]) // this is fine! is the problem in the execute function?
                selected[0].execute(); //in inventory, always opens whatever item you first opened, even if you close and reopen inventory?
                return;
            }
            Game.menuRefresh();

        }
    }
}

// inventory menu screen
Game.Screen.inventoryMenu = new MenuScreen({
    label: "inventory",
    multiselect: false,
    selectable: true,
})

Game.Screen.itemMenu = new MenuScreen({
    label: "item menu",
    multiselect: false,
    selectable: true,
})



//play screen
Game.Screen.playScreen = {
    map: null,
    _player: null,
    subScreen: null,
    _gameEnded: false,
    topLeftX: NaN,
    topLeftY: NaN,
    visibleCells: {},
    highlightedTile: {
        x: -1,
        y:-1
    },
    setSubScreen: function(subScreen) {
        //if subscreen we're leaving is a menu, hide menu container
        if (this.subScreen instanceof MenuScreen) {
            Game._menuDisplay.clear();
            let menuContainer = document.getElementById("menuContainer");
            menuContainer.style.display = "none";
        }
        this.subScreen = subScreen;
        if (this.subScreen === null) {
            console.log(`cleared subscreen`) //container screens immediately clear... why?
        }
        // if (this.subScreen === Game.Screen.containerScreen)
        //     {console.log(`set subscreen to containerscreen`)} //Lying To Me
        if (this.subScreen instanceof MenuScreen) {
            // console.log("menu refresh on switch to menu") //firing but inventory not rendering?
            //forgot to add the stuff to make the menuContainer visible
            let menuContainer = document.getElementById("menuContainer");
            menuContainer.style.display = "block";

            Game.menuRefresh();
        } else {
            Game.refresh()
        }
    },
    enter: function() {
        // console.log("entering play screen..."); 
        // var map = []; //old map array
        // var width = 128;
        // var height = 64;
        // var depth = 1;
        //retrieve the tiles from the level object
        // console.log(level); //this works fine, level is available
        let dungeonArray = splitLevel(blankLevel);
        // console.log(blankLevel) //works fine
        // console.log(levelArray); //fixed

        var dungeon = new Builder(dungeonArray);
        // console.log(tiles); //empty now! gah!
        this._player = new Player();
        this._map = new Map(dungeon.getTiles(), this._player);
        this._map.getEngine().start();
        // add enemies from dungeon enemies
        // console.log(dungeon._enemies); //this is fine
        dungeon._enemies.forEach(enemy => {
            //create new enemy of appropriate type
            console.log(`attempting to create a(n) ${enemy.type} at ${enemy.x},${enemy.y} on dungeon floor ${(enemy.z)+1}`); //works fine, so why is the goblin not spawning
            var newEnemy = new Enemy(bestiary[enemy.type]);
            // console.log(newEnemy.name); //seems to create a real enemy, not sure why rot.js is tripping up
            //set enemy position
            newEnemy.setX(enemy.x);
            newEnemy.setY(enemy.y);
            newEnemy.setZ(enemy.z);
            //add enemy to map
            this._map.addEntity(newEnemy);
        })
        //add items from dungeon items
        dungeon._items.forEach(item => {
            //if item is a container, create a container, otherwise create a normal item
            //initiate bagIndex
            var bagIndex = 0;
            console.log(`spawning a(n) ${item.type}`)
            if (vault[item.type].container === true) {
                let contents = [];
                //iterate over levelContainers[bagIndex], creating a new item for each item in the container
                levelContainers[bagIndex].forEach(item => {
                    //create new item of appropriate type
                    let newSubItem = new Item(vault[item]);
                    //add item to contents
                    contents.push(newSubItem);
                    console.log(`Putting a(n) ${newSubItem.name} in a container.`)
                })
                //increment bagIndex
                bagIndex++
                var newItem = new Container(vault[item.type], contents);
            } else {
                var newItem = new Item(vault[item.type]);
            }
        
            //set item position
            newItem.setX(item.x);
            newItem.setY(item.y);
            newItem.setZ(item.z);
            //add item to map
            console.log(`adding a(n) ${newItem.name} to the map at ${newItem.getX()},${newItem.getY()} on dungeon floor ${(newItem.getZ())+1}`)
            this._map.addItem(newItem._x, newItem._y, newItem._z, newItem);
        })
        // //this is the old map builder that used dynamic level generation
        // var tiles = new Builder(width, height, depth).getTiles();
        // this._player = new Player();
        // this._map = new Map(tiles, this._player);
        // this._map.getEngine().start();
    },
    exit: function() { console.log("Exited play screen."); },
    //move screen/camera/thing
    move: function(dX, dY, dZ) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;

        // Try to move to the new cell
        this._player.tryMove(newX, newY, newZ, this._map);
    },
    // exit: function() {console.log("exited play screen."); },
    render: function(displays) {
        if (this.subScreen) {
            // if (this.subScreen === Game.Screen.containerScreen) {
            //     console.log(`rendering container screen!`) // LTM!!!
            // }
            if (this.subScreen instanceof MenuScreen) {
                this.subScreen.render(displays.menu);
                return;
            }
            this.subScreen.render(displays.main);
            return;
        }
        // console.log('rendering screen!')
        var screenWidth = (Game.getScreenWidth());
        var screenHeight = Game.getScreenHeight();
        // console.log('got screen dimensions!')
        // Make sure the x-axis doesn't go to the left of the left bound
        this.topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        this.topLeftX = Math.min(this.topLeftX, this._map.getWidth() - screenWidth);
        // Make sure the y-axis doesn't above the top bound
        this.topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        this.topLeftY = Math.min(this.topLeftY, this._map.getHeight() - screenHeight);

        //track which cells are visible
        this.visibleCells = {};
        var visibleCells = this.visibleCells;
        //find them and add to object
        // console.log(this._player.getZ())
        // console.log(this._map.getFOV(this._player.getZ())) //undefined...? no now it's not but it isn't working right. no it's undefined again
        var map = this._map;
        var currentDepth = this._player.getZ()
        this._map.getFOV(currentDepth).compute(
            this._player.getX(), this._player.getY(),
            this._player.getSightRadius(),
            function(x, y, radius, visbility) {
                if(visbility) {
                    visibleCells[`${x},${y}`] = true;
                    // Mark cell as explored
                    map.setExplored(x, y, currentDepth, true);
                }


               
            });
        this.visibleCells = visibleCells;
        this._map.updateLightData(currentDepth);
        var lightData = this._map.getLightData();
        //check each visible cell for light
        for (var cell in visibleCells) {
            //if cell is dark, remove from visibleCells
            if (lightData[currentDepth][cell][0]+lightData[currentDepth][cell][1]+lightData[currentDepth][cell][2] < 128) {
                delete visibleCells[cell];
            }
        }
        var lighting = new ROT.Lighting()
        lighting.setFOV(this._map.getFOV(currentDepth));
        var lights = this._map.getLights()[currentDepth];
        for (var x = 0; x < lights.length; x++) {
            lighting.setLight(lights[x].x, lights[x].y, lights[x].color);
        }
        function lightingCallback(x, y, color) {
            var key = `${x},${y}`;
            lightData[currentDepth][key] = color;
            console.log("lighting callback called")
            
        }
        lighting.compute(lightingCallback);


        // console.log(visibleCells);

        // Iterate through all visible map cells
        // console.log('beginning tile render for loop!')
        // for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
        //     for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
        //         if (visibleCells[`${x},${y}`]) {
        //             // Fetch the glyph for the tile and render it to the screen at the offset position.
        //             var tile = this._map.getTile(x, y, this._player.getZ());
        //             // console.log(tile); //do not do this
        //             display.draw(
        //                 x - topLeftX,
        //                 y - topLeftY,
        //                 tile.getChar(), 
        //                 tile.getForeground(), 
        //                 tile.getBackground());
        //             }
        //     }
        // }

          // Render the explored map cells
        for (var x = this.topLeftX; x < this.topLeftX + screenWidth; x++) {
            for (var y = this.topLeftY; y < this.topLeftY + screenHeight; y++) {
                if (this._map.isExplored(x, y, currentDepth)) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var glyph = this._map.getTile(x, y, currentDepth);
                    var foreground = glyph.getForeground();
                    var background = glyph.getBackground();
                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (visibleCells[x + ',' + y]) {
                        // Check for items first, since we want to draw entities
                        // over items.
                        var items = this._map.getItemsAt(x, y, currentDepth);
                        // If we have items, we want to render the top most item
                        // console.log(items)
                        if (items.length > 0) {
                            // console.log('there should be visible items...')
                            glyph = items[items.length - 1];
                            // console.log(`here's the ${glyph.name}'s foreground color: ${glyph._foreground}`)
                        }
                        // Check if we have an entity at the position
                        if (this._map.getEntityAt(x, y, currentDepth)) {
                            glyph = map.getEntityAt(x, y, currentDepth);
                        }
                        // Update the foreground color in case our glyph changed
                        // console.log(glyph.getForeground()) //this is fine
                        let baseColor = ROT.Color.fromString(glyph.getForeground());
                        // console.log(baseColor) //works fine/color has been converted`
                        // multiply baseColor by lightData for this tile
                        // console.log(`here's the lightData for this tile: ${lightData[currentDepth][x + ',' + y]}`)
                        let lightData = this._map.getLightData();
                        // console.log(lightData) //always empty objects, so no light data getting set
                        let lightColor = lightData[currentDepth][x + ',' + y];
                        let lighterColor = ROT.Color.add(lightColor, [45, 45, 45]);

                            // console.log(`lightData at ${x},${y}:` + lightColor) //undefined, bc there's no lightdata for this tile presumably?
                        // console.log(`here's the lightColor for this tile: ${lightColor}`)
                        let litColor = ROT.Color.multiply(baseColor, lighterColor);
                        // if (lightColor[0]+lightColor[1]+lightColor[2] < 60) {
                        //     litColor = [30, 30, 30]
                        // }
                        // if (litColor[0]+litColor[1]+litColor[2] < 60) {
                        //     litColor = [20, 20, 20]
                        // }
                        foreground = ROT.Color.toHex(litColor); //getting error "a[e] is undefined" somewhere in rot.min.js
                        
                        // foreground = baseColor;
                        
                        
                        background = glyph.getBackground();
                    } else {
                        // Since the tile was previously explored but is not 
                        // visible, we want to change the foreground color to
                        // dark gray.
                        foreground = 'rgb(20,20,20)';
                    }
                    if (this.highlightedTile.x === x && this.highlightedTile.y === y) {
                        //console.log(`rendering selected tile at ${glyph.x},${glyph.y}`)
                        background = 'darkslategrey'
                    }
                    // if glyph is the player, replace foreground with white
                    if (glyph.name === 'player') {
                        foreground = 'white'
                    }
                    // console.log(`highlighted tile SHOULD be ${this.highlightedTile.x}, ${this.highlightedTile.y}`)
                    displays.main.draw(
                        x - this.topLeftX,
                        y - this.topLeftY,
                        glyph.getChar(), 
                        foreground, 
                        background)
                }
            }
        }

         // Render the entities
        //  console.log('rendering entities!')
        //  var entities = this._map.getEntities();
        //  for (var key in entities) {
        //      var entity = entities[key];
        //      //render them if on screen
        //      if (entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
        //         entity.getX() < topLeftX + screenWidth &&
        //         entity.getY() < topLeftY + screenHeight && 
        //         entity.getZ() == this._player.getZ()) {
        //             if (visibleCells[`${entity.getX()},${entity.getY()}`]) {
        //                 console.log(`drawing a ${entity.name} at ${entity.getX() - topLeftX}, ${entity.getY() - topLeftY} `)
        //                 display.draw(
        //                     entity.getX() - topLeftX, 
        //                     entity.getY() - topLeftY,    
        //                     entity.getChar(), 
        //                     entity.getForeground(), 
        //                     entity.getBackground()
        //                 )
        //         };
        //     }
        //  }
         //render messages and stat bar
         var stats = `%c{white}%b{black} HP: ${this._player.getHp()} / ${this._player.getMaxHp()}   GLYPHS: ${this._player.glyphs}   ATK: ${this._player.damage}   ARMOR: ${this._player.armor}`
         displays.main.drawText(0, screenHeight, stats)
         let messages = Game.messages;
         let messageHeight = 0;
         for (let i=0; i < messages.length; i++) {
             //draw each message, adding its line count to height
             messageHeight += displays.text.drawText(
                0,
                 messageHeight,
                 '%c{white}%b{black}' + messages[i]
             );
         }
        if (messageHeight >= screenHeight+8) {
            messages.shift();
            Game.messages.shift();
            Game.refresh();
        }
    },
    handleInput: function(inputType, inputData) {
        if (this._map.getEngine()._lock === 1) {   
            if (this._gameEnded) {
                if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                    Game.switchScreen(Game.Screen.loseScreen);
                }
                // Return to make sure the user can't still play
                return;
            }
            //let subscreen handle input if there is one
            if (this.subScreen) {
                this.subScreen.handleInput(inputType, inputData);
                return;
            }    
            if (inputType === 'mousemove') {
                //reposition the tooltip
                // console.log(inputData) //position is indeed stored in x and y; why isn't this working? //does ROT.Display.eventToPosition(e) care about e.x / e.y or diff props?
                let x = inputData.x;
                let y = inputData.y;
                // console.log(`mouse at ${x}, ${y}`) //these work correctly
                let toolTip = document.getElementById('tooltip');

                toolTip.style.top = y-20 + 'px';
                toolTip.style.left = x+15 + 'px';

                let dummyData = {
                    // x: inputData.x - 5,
                    // y: inputData.y - 5,
                    // screenX: inputData.x - 5,
                    // screenY: inputData.y - 5,
                    clientX: inputData.x, //only actually need these apparently! also wait i adjusted these forever and set them back to default. what.
                    clientY: inputData.y
                }
                //set these values to be easier to access
                var mouseCoords = Game._display.eventToPosition(dummyData);
                var actualX = mouseCoords[0]+this.topLeftX;
                var actualY = mouseCoords[1]+this.topLeftY;
                
                // console.log(mouseCoords);
                // Game.message(`mouse coordinates: ${mouseCoords}`)
                // let splitCoords = mouseCoords.split(','); //whoops duh mouseCoords actually an array lmao
                let currentDepth = this._player.getZ();
                let text ='';
                // if(this._map.isExplored(mouseCoords[0],mouseCoords[1],currentDepth)) { //checking visible is better imo
                //     text = this._map.getTile(mouseCoords[0]+this.topLeftX,mouseCoords[1]+this.topLeftY,currentDepth).text
                // }
                // console.log(this.visibleCells);
                // console.log(`the tooltip text condition should be:`)
                // console.log(this.visibleCells[`${mouseCoords[0],mouseCoords[1]}`]) //returns undefined

                if (this.visibleCells[`${actualX},${actualY}`]) {
                    let tile = this._map.getTile(actualX,actualY,currentDepth)
                    this.highlightedTile = {
                        x: actualX,
                        y: actualY
                    };
                    text = tile.text;
                   
                    let entity = this._map.getEntityAt(actualX,actualY,currentDepth)
                    
                    if (entity) {
                        //console.log(entity.name)
                        text = `There is a ${entity.name} here. ${entity.text}`

                        if (this._map.getEntityAt(actualX,actualY, currentDepth).name === 'player') {
                            text += ` It's you.`
                        }
                        let inventory = ``;
                        if (entity.bag.length > 0) {
                            for (let i=0; i < entity.bag.length; i++) {
                                if (entity.bag[i]) {
                                    inventory += `<li>${entity.bag[i].quantity} ${entity.bag[i].name}(s)</li>`
                                }
                                
                            }
                            if (inventory.length > 0) {
                                text += ` It's carrying <ul>${inventory}</ul>.`
                            } else {
                                text += ` It's not carrying anything.` 
                            }
                            
                        } 
                        text += ` It has ${entity.hp} HP.`
                    }
                    
                    items = this._map.getItemsAt(actualX,actualY,currentDepth);

                    if (items.length > 0) {
                        if (items.length === 1) {
                            text += ` There is also a(n) ${items[0].name} here.`
                        } else {
                            text += ` There are also some items here.`
                        }
                    }
                    // let lightLevel = this._map._lightData[currentDepth][`${actualX},${actualY}`];
                    // text += ` It is ${lightLevel} bright here.`
                }

                let toolTipText = text
                // let toolTip = document.getElementById('tooltip'); //now this is declared up in repositioning
                if (toolTipText.length > 0) {
                    toolTip.style.display = "block"
                    document.body.style.cursor = "crosshair"
                } else {
                    toolTip.style.display = "none"
                    document.body.style.cursor = "auto"
                }
                toolTip.innerHTML = toolTipText;
                // toolTip.classList.add("tooltiptext")


                // inputData.target.appendChild(toolTip)

                Game.refresh(); //CSS tooltips make this unnecessary // hightlightedTile makes it necessary again
            }    
            if (inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            //numpad 8-dir movement
            // console.log(inputData);
            switch (inputData.keyCode) {
                case ROT.KEYS.VK_RETURN:
                    Game.switchScreen(Game.Screen.winScreen);
                    break;
                case ROT.KEYS.VK_ESCAPE:
                    Game.switchScreen(Game.Screen.loseScreen);
                    break;
                case ROT.KEYS.VK_S:
                case ROT.KEYS.VK_NUMPAD5:
                    //stay put for one turn
                    this.move(0, 0, 0);
                    Game.message("You wait one turn.")
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_W:
                case ROT.KEYS.VK_NUMPAD8:
                    this.move(0,-1, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_E:
                case ROT.KEYS.VK_NUMPAD9:
                    this.move(1, -1, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_D:
                case ROT.KEYS.VK_NUMPAD6:
                    this.move(1, 0, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_C:
                case ROT.KEYS.VK_NUMPAD3:
                    this.move(1, 1, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_X:
                case ROT.KEYS.VK_NUMPAD2:
                    this.move(0, 1, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_Z:
                case ROT.KEYS.VK_NUMPAD1:
                    this.move(-1, 1, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_A:
                case ROT.KEYS.VK_NUMPAD4:
                    this.move(-1, 0, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_Q:
                case ROT.KEYS.VK_NUMPAD7:
                    this.move(-1, -1, 0); //move
                    //refresh screen
                    // Game.refresh();
                    // Unlock the engine
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_COMMA:
                    this.move(0, 0, 1);
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_PERIOD:
                    this.move(0, 0, -1);
                    this._map.getEngine().unlock();
                    break;
                case ROT.KEYS.VK_I:
                    //console.log('inventory button hit')
                    if (this._player.getBag().length === 0) {
                        // If the player has no items, send a message and don't take a turn
                        Game.message("You are not carrying anything.");
                        Game.refresh();
                    } else {
                        // Show the inventory
                        Game.Screen.inventoryMenu.setup(this._player);
                        this.setSubScreen(Game.Screen.inventoryMenu);
                    }
                    break;
                // case ROT.KEYS.VK_D:
                //     if (this._player.getBag().filter(function(x){return x;}).length === 0) {
                //         // If the player has no items, send a message and don't take a turn
                //         Game.message("You have nothing to drop.");
                //         Game.refresh();
                //     } else {
                //         // Show the drop screen
                //         Game.Screen.dropScreen.setup(this._player, this._player.getBag());
                //         this.setSubScreen(Game.Screen.dropScreen); // this isn't happening, but doesn't throw an error?
                //     }
                //     break;
                case ROT.KEYS.VK_P:
                    //console.log('pickup button hit')
                    var items = this._map.getItemsAt(this._player.getX(), this._player.getY(), this._player.getZ());
                    // If there are no items, show a message
                    if (items.length === 0) {
                        // console.log('really should not have to check this......') //and i was right. so why isn't the below message happening??? it was not refreshing after, haha
                        Game.message("There is nothing here to pick up.");
                        Game.refresh(); //needed to add this, 
                    } else if (items.length === 1) {
                        // If only one item, try to pick it up
                        var item = items[0];
                        if (this._player.pickupItems([0])) {
                            Game.message(`You pick up the ${item.name}.`);
                            Game.refresh();
                        } else {
                            Game.message("Your inventory is full! Nothing was picked up.");
                            Game.refresh();
                        }
                    } else {
                        // Show the pickup screen if there are any items
                        Game.Screen.pickupScreen.setup(this._player, items);
                        this.setSubScreen(Game.Screen.pickupScreen);
                    }
                    break;
                //test menu with spacebar
                case ROT.KEYS.VK_SPACE:
                    //make menuContainer visible
                    let menuContainer = document.getElementById('menuContainer');
                    menuContainer.style.display = 'block';
                    //position menuContainer
                    //render menuTest in menuDisplay
                    Game.Screen.menuTest.render(Game._menuDisplay);
                    this.setSubScreen(Game.Screen.menuTest);

            }
            }
            // if (inputType === 'mousedown')  { // never detected
            //     console.log('mouse click registered');
            // }   
    }}
}

Game.Screen.menuTest = new MenuScreen({
    options: [
        {
            name: 'option 1',
        },
        {
            name: 'option 2',
        },
        {
            name: 'option 3',
        }
    ],
    label: `TEST MENU DO NOT EAT`,

});

//win screen
Game.Screen.winScreen = {
    enter: function() {console.log("entering win screen..."); },
    exit: function() { console.log("exited win screen."); },
    render: function(displays) {
        // Render our prompt to the screen
        for (var i = 0; i < 19; i++) {
            // Generate random background colors
            var r = i*50;
            var g = i*15;
            var b = i*5;
            var background = ROT.Color.toRGB([r, g, b]);
            var fg = ROT.Color.toRGB ([
                255-(i*20),
                255-(i*20),
                255-(i*20)
            ])
            displays.main.drawText(5*i, 2*i, "%c{" + fg + "}%b{" + background + "}T R I U M P H   O F   F L A M E !");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}

//lose screen
Game.Screen.loseScreen = {
    enter: function() {console.log("entering lose screen..."); },
    exit: function() { console.log("exited lose screen."); },
    render: function(displays) {
        // Render our prompt to the screen
        for (var i = 0; i < 35; i++) {
            let r = 225 - (6*i);
            let g = 200 - (7*i);
            let b = 250 - (12*i);
            let color = ROT.Color.toRGB([
                r, g, b
            ])
            let mod = (Math.floor(Math.random()*23)-(Math.floor(Math.random()*23)))
            displays.main.drawText(50 + mod, i + 1, `%c{${color}}the flame goes out...`);
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}
