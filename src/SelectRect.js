import $ from "jquery/dist/jquery.min.js";
import NormalizeTouch from "./NormalizeTouch";
import draggable from "./draggable";
import Vector2 from "./Vector2";

export default class {
    constructor(field, view, store) {
        this.field = field;
        this.view = view;
        this.store = store;
        this.isDragging = false;

        this.field.each(draggable())
            .on("dragstart", (_, e) => {
                let event = this.eventFilter(e);
                if(this.field.get(0) == event.e.target){
                    this.isDragging = true;
                    this.startPos = event.clientVector();
                    this.nowPos = Vector2.empty();
                    this.first = true;
                }
            })
            .on("dragmove", (_, e) => {
                if(!this.isDragging) return;
                if(this.first == true){
                    this.view.show();
                    this.first = false;
                }
                let event = this.eventFilter(e);
                this.nowPos = event.clientVector();
                this.render();
            })
            .on("dragend", (_, e) => {
                if(!this.isDragging) return;
                let event = this.eventFilter(e);
                this.view.hide();
                this.isDragging = false;
            });

        let render = () => {
            this.render();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
    eventFilter(e){
        let event = new NormalizeTouch(e);
        return event;
    }
    render(){
        if(!this.isDragging) return;
        let sub = this.nowPos.clone().subtract(this.startPos);
        this.view.css({
            height: Math.abs(sub.y),
            width: Math.abs(sub.x),
            left: this.startPos.x - (sub.x<0?-sub.x:0),
            top: this.startPos.y - (sub.y<0?-sub.y:0)
        });
    }
}