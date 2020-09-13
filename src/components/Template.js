import React from "react";

import ScrollToTop from 'react-scroll-up';

import { ATTR, EL, SHOW_UNDER } from "../constants";

import "../style/Template.css";

import NavBar, { HomeNav } from "./NavBar";


class Template extends React.Component {
    render() {
        const children = this.props[ATTR.CHILDREN];

        children.splice(0, 0, React.createElement(
            NavBar,
            null,
            React.createElement(
                HomeNav,
                {
                    [ATTR.ONCLICK]: this.props[ATTR.HOME_FN],
                }
            )
        ));

        children.push(React.createElement(
            ScrollToTop,
            {
                [ATTR.SHOWUNDER]: SHOW_UNDER,
                [ATTR.KEY]: "scroll-to-top",
            },
            React.createElement(
                EL.IMG,
                {
                    [ATTR.CLASSNAME]: "back-to-top-img",
                    [ATTR.SRC]: "images/back_to_top.png",
                }
            )
        ));

        return React.createElement(
            EL.DIV,
            {
                [ATTR.CLASSNAME]: "template",
            },
            children
        );
    }
}

export default Template;
