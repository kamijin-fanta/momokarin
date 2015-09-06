import $ from "jquery/dist/jquery.min.js";
import InertiaObject from "./InertiaObject";
import FieldInterference from "./FieldInterference";
import GateInterference from "./GateInterference";
import Card from "./Card";
let debug = require("debug")("CardStore");

export default class{
    constructor(cardListElement, field, interferences, client) {
        this.cardObjects = [];
        this.cardVirtualObjects = [];
        this.cardListElement = cardListElement;
        this.field = field;
        this.interferences = interferences.map(i => (i.store=this)&&i);
        this.ownerId = "owner";
        this.client = client;

        this.cardObjects = [];
        this.refresh();

        this.client.onChange = c => {
            this.cardObjects = c.cardList;
            this.ownerId = c.isMaster?null:c.socketId;
            this.refresh();
        };
    }
    refresh(){
        let alreadyList = [];
        let appendList = [];
        for(let cardRow in this.cardObjects){
            let card = this.cardObjects[cardRow];
            let virtualMatch = this.cardVirtualObjects.findIndex(e => card.hash() === e.card.hash());
            let isOwn = card.owner === this.ownerId || (this.ownerId === null && !card.owner);
            if(virtualMatch != -1 && isOwn){
                // found
                let virtual = this.cardVirtualObjects[virtualMatch];
                this.cardVirtualObjects[virtualMatch].card = card;
                debug("Match", card, virtual);
                alreadyList.push(virtualMatch);
            } else if(isOwn) {
                // not found
                appendList.push(card);
            }
        }
        let removeList = this.cardVirtualObjects.filter((e,i)=> !alreadyList.some(d => i == d));
        this.appendElement(appendList);
        this.removeElement(removeList);
        debug("Append", appendList, "RemoveList", removeList, "CardObjects", this.cardObjects, "Virtual", this.cardVirtualObjects);
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
        this.client.modifyCard(replace);
        return ;
        for(let cardRow in this.cardObjects){
            let card = this.cardObjects[cardRow];
            if(card.hash()  === replace.hash()){
                this.cardObjects[cardRow] = replace;
                debug("Replace Card", replace);
                // todo emit change
                this.refresh();
                return;
            }
        }
        debug("Warn!! ", replace);
        this.refresh();
    }
}