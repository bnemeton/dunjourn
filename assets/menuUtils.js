class MenuItem {
    constructor(label, action) {
        this.label = label;
        this.action = action || function() {;
        }
    }
}

class ListItem extends MenuItem {
    constructor(label) {
        super(label);
        this.action = function() {
            return label;
        }
    }
}

class ItemListItem extends ListItem {
    constructor(item) {
        console.log(item); //defined here... but then it runs again? and it's undefined???
        let name = item.name; //let's try this instead. nope! somehow undefined???
        super(name);
        this.action = function() {
            return item;
        }
        this.quantity = item.quantity;
        this.selected = false;
    }
}