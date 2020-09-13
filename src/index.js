import React from "react";
import ReactDOM from "react-dom";

import ReactHtmlParser from 'react-html-parser';

import { APPS, ATTR } from "./constants";

import "./style/common.css";

import Template from "./components/Template";
import PanelContainer from "./components/Panel";
import BlogPost from "./components/BlogPost";

import blog_post_data from "./resources/panel_data.js";


function getRawPanelData() {
    return blog_post_data;
}

function getPanelData(rawPanelData, parent) {
    const panelData = [];
    for (const [title, data] of Object.entries(rawPanelData)) {
        const panelDatum = {};
        panelDatum[ATTR.TITLE] = title;
        panelDatum[ATTR.DESCRIPTION] = ReactHtmlParser(data[ATTR.DESCRIPTION]);
        panelDatum[ATTR.BODY] = ReactHtmlParser(data[ATTR.BODY]);
        panelDatum[ATTR.ONCLICK] = parent.updatePageWrapper(data[ATTR.TITLE]);
        panelData.push(panelDatum);
    }
    return panelData;
}

function getPages(panelData) {
    const pages = {};
    panelData.forEach(panelDatum => {
        const title = panelDatum[ATTR.TITLE];
        const body = panelDatum[ATTR.BODY];

        pages[title] = React.createElement(
            BlogPost,
            {
                [ATTR.KEY]: `blog-post-${title}`,
                [ATTR.TITLE]: title,
                [ATTR.BODY]: body,
            }
        );
    })
    return pages;
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            [ATTR.PAGE]: ATTR.INDEX,
        };

        this.updatePageWrapper = this.updatePageWrapper.bind(this);

        this.rawPanelData = getRawPanelData();
        this.panelData = getPanelData(this.rawPanelData, this);
        this.pages = getPages(this.panelData);
        this.pages[ATTR.INDEX] = React.createElement(
            PanelContainer,
            {
                [ATTR.PANEL_DATA]: this.panelData,
                [ATTR.KEY]: "panel-container",
            }
        );
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
                [ATTR.CHILDREN]: [this.pages[this.state[ATTR.PAGE]]],
            },
        );
    }
}

const index_container = document.getElementById(APPS.INDEX);
ReactDOM.render(React.createElement(Index), index_container);
