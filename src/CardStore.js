import $ from "jquery/dist/jquery.min.js";
import InertiaObject from "./InertiaObject";
import FieldInterference from "./FieldInterference";
import GateInterference from "./GateInterference";
import Card from "./Card";

export default class{
    constructor(cardListElement, field, interferences) {
        this.cardObjects = [];
        this.cardVirtualObjects = [];
        this.cardListElement = cardListElement;
        this.field = field;
        this.interferences = interferences.map(i => (i.store=this)&&i);
        this.ownerId = "owner";

        this.cardObjects = [new Card(5,2,"img", "gmi", "owner", "attr"), new Card(1,2,"img", "gmi", "owner", "attr")];
        this.refresh();
    }
    refresh(){
        let alreadyList = [];
        let appendList = [];
        for(let cardRow in this.cardObjects){
            let card = this.cardObjects[cardRow];
            let virtualMatch = this.cardVirtualObjects.findIndex(e => card.getId() === e.card.getId());
            let isOwn = card.owner === this.ownerId;
            if(virtualMatch != -1 && isOwn){
                // found
                let virtual = this.cardVirtualObjects[virtualMatch];
                this.cardVirtualObjects[virtualMatch].card = card;
                console.log("Match", card, virtual);
                alreadyList.push(virtualMatch);
            } else if(isOwn) {
                // not found
                appendList.push(card);
            }
        }
        let removeList = this.cardVirtualObjects.filter((e,i)=> !alreadyList.some((e2,i2) => i == i2));
        console.log("Append", appendList, "RemoveList", removeList);

        this.appendElement(appendList);
        this.removeElement(removeList);
    }

    appendElement(list){
        list.forEach(card => {
            let element = $("<div class='card'></div>");

            this.cardListElement.append(element);
            let object = new InertiaObject(element).setInterferences(this.interferences);

            object.card = card;
            this.cardVirtualObjects.push(object);
        });
    }
    removeElement(list){
        let rmVirtual = (target) => this.cardVirtualObjects.some((v, i) => {
            if (v==target) this.cardVirtualObjects.splice(i,1);
        });
        list.forEach(object => {
            object.kill();
            rmVirtual(object);
        });
    }

    setCard(replace){
        for(let cardRow in this.cardObjects){
            let card = this.cardObjects[cardRow];
            if(card.getId()  === replace.getId()){
                this.cardObjects[cardRow] = replace;
                console.log("Replace Card", replace);
                // todo emit change
                this.refresh();
                return;
            }
        }
        console.warn("Cant Replace Card", replace);
        this.refresh();
    }
}