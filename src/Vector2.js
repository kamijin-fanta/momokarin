import victor from "victor";

export default class Vector2 extends victor {
    constructor(x, y) {
        super(x, y);
    }
    static empty(){
        return new Vector2(0, 0);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    floor(num = 0){
        let a = 10 ** num;
        let floor = b => Math.floor(b * a) / a;
        this.x = floor(this.x);
        this.y = floor(this.y);
        console.log(a, this.x);
    }
}
