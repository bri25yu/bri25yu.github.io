import React from "react";
import ReactDOM from "react-dom";

import ReactHtmlParser from 'react-html-parser';
import ScrollToTop from 'react-scroll-up';

import { APPS,
    ATTR,
    CLASS,
    EL,
    SHOW_UNDER,
} from "./constants";

import "./style/index.css";
import "./style/common.css";

import PanelContainer from "./components/Panel";

import blog_post_metadata from "./resources/panel_metadata.js";


function getPanelData() {
    blog_post_metadata.forEach(blog_post_datum => {
        blog_post_datum[ATTR.DESCRIPTION] = ReactHtmlParser(blog_post_datum[ATTR.DESCRIPTION]);
    });
    return blog_post_metadata;
}

function Index(props) {
    return React.createElement(
        EL.DIV,
        {
            [ATTR.CLASSNAME]: "index",
        },
        [
            React.createElement(
                PanelContainer,
                {
                    [ATTR.PANEL_DATA]: getPanelData(),
                }
            ),
            React.createElement(
                ScrollToTop,
                {
                    [ATTR.SHOWUNDER]: SHOW_UNDER,
                },
                React.createElement(
                    EL.IMG,
                    {
                        [ATTR.CLASSNAME]: "back-to-top-img",
                        [ATTR.SRC]: "images/back_to_top.png",
                    }
                )
            )
        ]
    );
}


const index_container = document.getElementById(APPS.INDEX);
ReactDOM.render(React.createElement(Index), index_container);
