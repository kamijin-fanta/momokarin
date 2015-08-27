import Vector2 from "./Vector2";

export default class NormalizeTouch{
    constructor(event) {
        this.rawEvent = event;
        this.e = (event.type.startsWith("touch"))?(event.originalEvent.touches[0]):(event);
    }
    clientVector(){
        return new Vector2(this.e.clientX, this.e.clientY);
    }
    offsetVector(){
        return new Vector2(this.e.offsetX, this.e.offsetY);
    }
}

