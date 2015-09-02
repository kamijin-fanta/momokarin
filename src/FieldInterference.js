import InterferenceBase from "./InterferenceBase";

export default class FieldInterference extends InterferenceBase {
    constructor(field) {
        super();
        this.fieldElement = field;
    }
    init(vectorObj){
    }

    beforeTouchStart(vectorObj, e) {
    }
    afterTouchStart(vectorObj, e) {
    }

    beforeTouchMove(vectorObj, e) {
    }
    afterTouchMove(vectorObj, e) {
    }

    beforeTouchEnd(vectorObj, e) {
    }
    afterTouchEnd(vectorObj, e) {
    }

    beforeRender(vectorObj){
        // フィールドからはみ出なようにする
        // todo 山札等のフィット
        let pos = vectorObj.getCenterPosition();
        let setPos = function (axis, v, revers = false) {
            let flag = pos[axis] < v;
            console.log(flag);
            if(revers?(!flag):flag){
                vectorObj.vector["multiply" + axis.toUpperCase()](v);
                if(!vectorObj.isTouch){
                    pos[axis] = v;
                    vectorObj.setCenterPosition(pos);
                }
            }
        };
        setPos("x", 0, false);
        setPos("y", 0, false);
        setPos("x", this.fieldElement.width(), true);
        setPos("y", this.fieldElement.height(), true);
    }
    afterRender(vectorObj){
    }
}