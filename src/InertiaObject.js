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

        this.roate = false;

        this.moveOffset = e => e.subtract(this.startClient);
        this.interferencesCall("init");
    }

    render(element, vector) {
        // todo 最小限の描画を行う
        let vect = vector.clone().floor(1);
        let transform = `translate3d(${vect.x}px,${vect.y}px,0px) rotate(${this.roate?"90deg":"0deg"})`;
        if(this.lastTransform !== transform){
            element.css({
                transform: transform,
            });
            this.lastTransform = transform;
        }
        if(this.lastReverse !== this.card.attr.reverse) {
            element.find(".img").css({
                "background-image": `url(${this.card.attr.reverse ? this.card.gmi : this.card.img})`
            });
            this.lastReverse = this.card.attr.reverse;
        }

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
        this.touchStartTime = (new Date).getTime();
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
        let time = (new Date).getTime();
        if(this.lastTouchEndTime + 400 > this.touchStartTime ) {
            this.card.attr.reverse = !this.card.attr.reverse;
            time = 0;
        } else {
            if(this.touchStartTime > time - 100) {
                let old = this.card.attr.reverse;
                setTimeout(() => {
                    if(old == this.card.attr.reverse) this.roate = !this.roate;
                }, 400);
            }
        }
        this.lastTouchEndTime = time;

        if(!this.interferencesCall("beforeTouchEnd", e)) return;
        this.isTouch = false;
        this.setVector(this.getInertia());
        debug("end", this.getInertia(), e);
        this.interferencesCall("afterTouchEnd", e);
    }
}