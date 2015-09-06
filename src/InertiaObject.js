import Vector2 from "./Vector2";
import draggable from "./draggable";
import VectorObject from "./VectorObject";
import NormalizeTouch from "./NormalizeTouch";
const debug = require("debug")("Inertial");

export default class InertiaObject extends VectorObject {
    constructor(element) {
        super(element);
        this.eventInit(element);

        this.startOffset = null;
        this.startClient = null;
        this.cssOffset = null;
        this.isTouch = false;

        this.moveOffset = e => e.subtract(this.startClient);
        this.interferencesCall("init");
    }

    render(element, vector) {
        // todo 最小限の描画を行う
        element.css({
            transform: `translate3d(${vector.x}px,${vector.y}px,0px)`
        });

        // toggle active class
        let active = "active";
        if(element.hasClass(active) != this.isActive())
            element.toggleClass(active);
    }

    isActive(){
        return this.isTouch;
    }

    eventInit(e) {
        e.each(draggable())
            .on("dragstart", (_, e) => {
                this.setVector(Vector2.empty());
                this.eventFilter(e);
                this.touchStart(this.eventFilter(e));
            })
            .on("dragmove", (_, e) => {
                this.touchMove(this.eventFilter(e));
            })
            .on("dragend", (_, e) => {
                this.touchEnd(this.eventFilter(e));
            });
    }
    eventFilter(e){
        return new NormalizeTouch(e);
    }
    kill() {
        super.kill();
        this.element.off("dragstart")
            .off("dragmove")
            .off("dragend");
    }
    touchStart(e) {
        if(!this.interferencesCall("beforeTouchStart", e)) return;
        debug("start", e);
        this.isTouch = true;
        this.cssOffset = this.getComputedVector();
        this.startOffset = e.offsetVector();
        this.startClient = e.clientVector();
        this.interferencesCall("afterTouchStart", e);
    }
    touchMove(e) {
        if(!this.interferencesCall("beforeTouchMove", e)) return;
        debug("move", e);
        let move = this.moveOffset(e.clientVector());
        let includedCssOffset = move.add(this.cssOffset);
        this.setPosition(includedCssOffset);
        this.interferencesCall("afterTouchMove", e);
    }
    touchEnd(e) {
        if(!this.interferencesCall("beforeTouchEnd", e)) return;
        this.isTouch = false;
        this.setVector(this.getInertia());
        debug("end", this.getInertia(), e);
        this.interferencesCall("afterTouchEnd", e);
    }
}