import React from "react";

import ScrollToTop from 'react-scroll-up';

import { ATTR, EL, SHOW_UNDER } from "../constants";

import "../style/Template.css";


class Template extends React.Component {
    render() {
        const children = this.props[ATTR.CHILDREN];
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
