import InterferenceBase from "./InterferenceBase";
import Vector2 from "./Vector2";
import $ from "jquery/dist/jquery.min.js";

export default class extends InterferenceBase {
    constructor(field, players, selector) {
        super();
        this.fieldElement = field;
        this.players = players;
        this.selector = selector;
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
        // PlayerMakerに反応させる
        let pos = vectorObj.getCenterPosition();
        let match;
        this.players.find(this.selector).each((i,v) => {
            let vect = Vector2;
            let rectLT = new Vector2(v.offsetLeft, v.offsetTop);
            let rectRB = rectLT.clone().add(new Vector2(v.offsetWidth, v.offsetHeight));
            let flag = Vector2.contain(rectLT, rectRB, pos, v.offsetWidth);

            if(flag){
                match = $(v);
                let owner = match.attr("data-owner");
                let card = vectorObj.card;
                console.log(`Change Owner -> ${owner}`);
                card.owner = owner;
                this.store.setCard(card);
                return false;
            }
        });
        if(vectorObj.matchElement != match){
            // todo テストでクラス名の表示を行っているので置き換えする
            vectorObj.element.text(match?match.className:"");
            vectorObj.matchElement = match;
        }
    }
    afterRender(vectorObj){
    }
}
