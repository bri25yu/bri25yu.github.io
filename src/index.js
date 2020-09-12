import React from "react";
import ReactDOM from "react-dom";

import ReactHtmlParser from 'react-html-parser';

import { APPS, ATTR, CLASS, EL } from "./constants";

import "./style/common.css";

import Template from "./components/Template";
import PanelContainer from "./components/Panel";

import blog_post_metadata from "./resources/panel_metadata.js";


function getPanelData(parent) {
    blog_post_metadata.forEach(blog_post_datum => {
        blog_post_datum[ATTR.DESCRIPTION] = ReactHtmlParser(blog_post_datum[ATTR.DESCRIPTION]);
        blog_post_datum[ATTR.ONCLICK] = parent.updatePageWrapper(blog_post_datum[ATTR.TITLE]);
    });
    return blog_post_metadata;
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            [ATTR.PAGE]: ATTR.INDEX,
        };

        this.updatePageWrapper = this.updatePageWrapper.bind(this);

        this.panelData = getPanelData(this);
    }

    updatePageWrapper(page) {
        const parent = this;
        function updatePage() {
            parent.setState({
                [ATTR.PAGE]: page,
            });
        }
        return updatePage;
    }

    render() {
        return React.createElement(
            Template,
            {
                [ATTR.CHILDREN]: [
                    React.createElement(
                        PanelContainer,
                        {
                            [ATTR.PANEL_DATA]: this.panelData,
                        }
                    ),
                ]
            },
        );
    }
}

const index_container = document.getElementById(APPS.INDEX);
ReactDOM.render(React.createElement(Index), index_container);
