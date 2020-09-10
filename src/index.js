import React from "react";
import ReactDOM from "react-dom";

import { APPS, ATTR, CLASS, EL } from "./constants";

import "./style/index.css";
import "./style/common.css";


function Index(props) {
    return React.createElement(
        EL.DIV,
        {
            [ATTR.CLASSNAME]: "index",
        },
        []
    );
}


const index_container = document.getElementById(APPS.INDEX);
ReactDOM.render(React.createElement(Index), index_container);
