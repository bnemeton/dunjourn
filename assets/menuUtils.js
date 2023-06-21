class MenuItem {
    constructor(label, position, action) {
        this.label = label;
        this.action = action || null;
        this.position = position || null;
        }
    }

class ListItem extends MenuItem {
    constructor(label, position) {
        super(label, position);
        this.action = function() {
            return label;
        }
    }
}

class ItemListItem extends ListItem {
    constructor(item) {
        // console.log(item); //defined here... but then it runs again? and it's undefined???
        let name = item.name; //let's try this instead. nope! somehow undefined???
        super(name);
        this.action = function() {
            return item;
        }
        this.quantity = item.quantity;
        this.selected = false;
        this.hovered = false;
        this.index = "";
    }
}