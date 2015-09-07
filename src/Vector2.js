import victor from "victor";

export default class Vector2 extends victor {
    constructor(x, y) {
        super(x, y);
    }
    static empty(){
        return new Vector2(0, 0);
    }
    static contain(rect1, rect2, point){
        // rect1 rect2の長方形にpointが存在するか
        let fn = k => rect1[k] <= point[k] && rect2[k] >= point[k];
        return fn("x") && fn("y");
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    floor(num = 0){
        let a = 10 ** num;
        let floor = b => (b>0?Math.floor:Math.ceil)(b * a) / a;
        this.x = floor(this.x);
        this.y = floor(this.y);
        return this;
    }
}
