class Light {
    constructor(properties) {
        properties = properties || {};
        this.color = properties['color'] || [255, 255, 255];
        this.x = properties['x'] || 0;
        this.y = properties['y'] || 0;
    }

    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }

}