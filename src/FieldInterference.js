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
        // todo フィールドからはみ出なようにする
        if(vectorObj.position.x < 0){
            vectorObj.vector.multiplyX(0);
            if(!vectorObj.isTouch) vectorObj.position.x = 0;
        }
        if(vectorObj.position.y < 0){
            vectorObj.vector.multiplyY(0);
            if(!vectorObj.isTouch) vectorObj.position.y = 0;
        }
    }
    afterRender(vectorObj){
    }
}