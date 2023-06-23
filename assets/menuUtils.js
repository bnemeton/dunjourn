class MenuItem {
    constructor(props) {
        this.label = props.label;
        this.action = props.action || null;
        this.position = props.position || null;
        }
        select() {
            this.selected = true;
        }
        unselect() {
            this.selected = false;
        }
        execute() {
            if (this.action) {
                return this.action();
            }
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
        this.description = item.text;
        this.quantity = item.quantity;
        this.selected = false;
        this.hovered = false;
        this.index = "";
        this.options = item.options;
    }
}