import "./style.sass";

import $ from "jquery/dist/jquery.min.js";
import InertiaObject from "./src/InertiaObject";
import polyffil from "babel/polyfill";
import FieldInterference from "./src/FieldInterference";
import GateInterference from "./src/GateInterference";
import SelectRect from "./src/SelectRect";
import CardStore from "./src/CardStore";


$(() => {
    var field = $(".field");

    var fieldInterference = new FieldInterference(field); // 壁にぶつかる
    var gateInterference = new GateInterference(field, $(".player-maker .side")); // PlayerMakerに反応させる
    var intList = [fieldInterference, gateInterference];

    // カード生成
    for(var a in " ".repeat(0)){
        new InertiaObject($("<div class='card'>").appendTo(".card-list")).setInterferences(intList);
    }

    // 選択範囲
    new SelectRect(field, $(".selector"));

    new CardStore($(".card-list"), $(".field"), intList);
});
