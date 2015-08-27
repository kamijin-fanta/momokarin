import $ from "jquery/dist/jquery.min.js";

let draggableMouse = (index, element, action) => {
    // todo action
    var move = (e) => {
        element.trigger("dragmove", [e]);
    };
    var up = function(e) {
        $(document).unbind("mouseup", up);
        $(document).unbind("mousemove");
        element.trigger("dragend", [e]);
    };
    element.bind("mousedown", function(e) {
        $(document).bind("mouseup", up);
        $(document).bind("mousemove", move);
        element.trigger("dragstart", [e]);
    });
};

export default function (action){
    return (index, elem) => {
        var element = $(elem);
        if(window.ontouchstart === undefined){
            return draggableMouse(index, element, action);
        }
        var offset = null;

        if (action == "disable") {
            // todo
            element.unbind("touchstart");
            element.unbind("touchmove");
            element.unbind("touchend");
            element.unbind("touchcancel");
            return this;
        }

        element.bind("touchstart", e => {
            element.trigger("dragstart", [e]);
        });
        element.bind("touchmove", e => {
            e.preventDefault();
            element.trigger("dragmove", [e]);
        });
        var end = e => {
            e.preventDefault();
            element.trigger("dragend", [e]);
        };
        element.bind("touchend", end); // todo document
        element.bind("touchcancel", end);
    };
};
