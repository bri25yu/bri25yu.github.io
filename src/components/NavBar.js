import React from "react";

import { ATTR, EL } from "../constants";

import "../style/NavBar.css";


export default function NavBar(props) {
    return React.createElement(
        EL.DIV,
        {
            [ATTR.KEY]: "nav-bar",
            [ATTR.CLASSNAME]: "nav-bar",
        },
        props[ATTR.CHILDREN],
    )
}

export function HomeNav(props) {
    return React.createElement(
        EL.A,
        {
            [ATTR.CLASSNAME]: "home-nav",
            [ATTR.ONCLICK]: props[ATTR.ONCLICK],
        },
        React.createElement(
            EL.IMG,
            {
                [ATTR.SRC]: "images/home.png",
                [ATTR.CLASSNAME]: "home-img",
            }
        )
    )
}
