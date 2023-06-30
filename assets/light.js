class Light {
    constructor(properties) {
        properties = properties || {};
        this.color = properties['color'] || [255, 255, 255];
        this.x = properties['x'] || 0;
        this.y = properties['y'] || 0;
        this.z = properties['z'] || 0;
        this.states = properties['states'] || [properties['color']];
        this.naturalStates = properties['states'] || [properties['color']];
    }
    flicker() {
        this.color = this.states[Math.floor(Math.random() * this.states.length)];
    }
    hide() {
        this.color = [0, 0, 0];
        this.states = [[0, 0, 0]];
    }
    show() {
        this.color = this.naturalStates[0];
        this.states = this.naturalStates;
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
    getZ() {
        return this.z;
    }
    setZ(z) {
        this.z = z;
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}