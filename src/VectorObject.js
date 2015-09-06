import Vector2 from "./Vector2";
import {List} from "immutable"; // todo remove

export default class VectorObject {
    /*
     move trigger
     - mouse event
     - vector
     - set position(force)
     */
    constructor(jqueryElement) {
        this.element = jqueryElement;
        this.forceMove = false;
        this.vector = Vector2.empty();
        this.position = Vector2.empty();
        this.destination = Vector2.empty();
        this.positionHistory = List();
        this.positionHistoryLifeTimeMs = 100;
        this.lastRendTime = (new Date()).getTime();
        this.interferences = [];
        this.size = new Vector2(jqueryElement.width(), jqueryElement.height());
        this.stop = false;

        this.initRenderLoop();
    }

    kill(){
        this.stop = true;
        this.element.remove();
    }

    moveToPosition(vector, time) {

    }

    setDestination(vector) {

    }

    setPosition(vector) {
        this.position = vector;
        this.gcPositionHistory();
        this.positionHistory = this.positionHistory.push([(new Date()).getTime(), vector]);
    }

    setVector(vector){
        this.vector = vector;
    }

    getInertia(){
        this.gcPositionHistory();
        if(this.positionHistory.size==0)
            return Vector2.empty();
        let first = this.positionHistory.first()[1];
        let rawVector = this.position.clone().subtract(first);
        let normalize = rawVector.clone().mix(Vector2.empty(), 1-1/this.positionHistoryLifeTimeMs);
        return normalize;
    }

    gcPositionHistory(){
        let now = (new Date()).getTime();
        this.positionHistory = this.positionHistory
            .filter(i => i[0] + this.positionHistoryLifeTimeMs > now);
    }

    getComputedVector() {
        return this.position;
    }
    getPosition(){
        return this.position.clone();
    }
    getCenterPosition(){
        return this.position.clone().add(this.size.clone().divide(new Vector2(2,2)))
    }
    setCenterPosition(vector){
        this.position = vector.clone().subtract(this.size.clone().divide(new Vector2(2,2)));
    }

    /* virtual */
    render(element, vector) {
        // ex. rend to dom object
    }

    renderFire() {
        // if chenged
        let now = (new Date()).getTime();
        let sub = now - this.lastRendTime;
        let mixAmount = sub / 300;
        mixAmount = Math.min(Math.max(mixAmount, 0), 1);
        this.vector.mix(Vector2.empty(), mixAmount).floor(3);
        this.position.add(this.vector.clone().multiply(new Vector2(sub,sub)));

        if(!this.interferencesCall("beforeRender")) return;
        this.render(this.element, this.getComputedVector());
        this.lastRendTime = now;
        this.interferencesCall("afterRender");
    }

    initRenderLoop(){
        let render = () => {
            this.renderFire();
            if(!this.stop) requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    setInterferences(interferences){
        interferences.map(i => {
            (i.init||(a=>{}))(this);
            this.interferences.push(i);
        });
        return this;
    }
    interferencesCall(name, ...args){
        let _toConsumableArray = (arr) => { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
        return this.interferences.reduce((prev,next) => {
            let fn = (next[name]||(a=>{}));
            return prev===false?false:fn.apply(next, [this].concat(_toConsumableArray(args)))
        }, true)===false?false:true;
    }
}
