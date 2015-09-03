import "./style.sass";

import $ from "jquery/dist/jquery.min.js";
import InertiaObject from "./src/InertiaObject";
import polyffil from "babel/polyfill";
import Interference from "./src/FieldInterference";
import SelectRect from "./src/SelectRect";

$(() => {
    var int = new Interference($(".field"));
    var card = new InertiaObject($(".card"), [int])
                    .setInterferences(int);

    // 選択範囲
    new SelectRect(field, $(".selector"));
});
