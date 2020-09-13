import React from "react";

import { ATTR, COLOR, EL } from "../constants";

import "../style/Panel.css";


export default function PanelContainer(props) {
    const panel_data = props[ATTR.PANEL_DATA];
    const panels = panel_data.map((props, i) => {
        const panel_type = (i % 2 === 0) ? DarkPanel : LightPanel;
        props[ATTR.KEY] = `panel-${i}`;
        return React.createElement(
            panel_type,
            props
        )
    });

    return React.createElement(
        EL.DIV,
        {
            [ATTR.CLASSNAME]: "panel-container",
        },
        panels
    )
}

class HoverColor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            [ATTR.COLOR]: this.props[ATTR.COLOR],
        };

        this.onMouseEnterFn = this.onMouseEnterFn.bind(this);
        this.onMouseLeaveFn = this.onMouseLeaveFn.bind(this);
    }
    
    onMouseEnterFn() {
        this.setState({
            [ATTR.COLOR]: this.props[ATTR.MOUSEOVER_COLOR],
        });
    }

    onMouseLeaveFn() {
        this.setState({
            [ATTR.COLOR]: this.props[ATTR.COLOR],
        });
    }

    render() {
        return React.createElement(
            EL.A,
            {
                [ATTR.CLASSNAME]: this.props[ATTR.CLASSNAME],
                [ATTR.ONCLICK]: this.props[ATTR.ONCLICK],
                [ATTR.HREF]: "#",
                [ATTR.STYLE]: {
                    [ATTR.COLOR]: this.state[ATTR.COLOR],
                },
                [ATTR.ONMOUSEENTER]: this.onMouseEnterFn,
                [ATTR.ONMOUSELEAVE]: this.onMouseLeaveFn,
            },
            this.props[ATTR.CHILDREN]
        );
    }
}

function Panel(props) {
    return React.createElement(
        EL.DIV,
        {
            [ATTR.CLASSNAME]: "panel",
            [ATTR.STYLE]: {
                [ATTR.BACKGROUNDCOLOR]: props[ATTR.BACKGROUNDCOLOR],
                [ATTR.COLOR]: props[ATTR.COLOR],
            },
        },
        [
            React.createElement(
                HoverColor,
                {
                    [ATTR.CLASSNAME]: "panel-title",
                    [ATTR.KEY]: "panel-title",
                    [ATTR.ONCLICK]: props[ATTR.ONCLICK],
                    [ATTR.CHILDREN]: props[ATTR.TITLE],
                    [ATTR.COLOR]: props[ATTR.COLOR],
                    [ATTR.MOUSEOVER_COLOR]: props[ATTR.MOUSEOVER_COLOR],
                }
            ),
            React.createElement(
                HoverColor,
                {
                    [ATTR.CLASSNAME]: "panel-description",
                    [ATTR.KEY]: "panel-description",
                    [ATTR.ONCLICK]: props[ATTR.ONCLICK],
                    [ATTR.CHILDREN]: props[ATTR.DESCRIPTION],
                    [ATTR.COLOR]: props[ATTR.COLOR],
                    [ATTR.MOUSEOVER_COLOR]: props[ATTR.MOUSEOVER_COLOR],
                }
            ),
        ]
    )
}

export function LightPanel(props) {
    return React.createElement(
        Panel,
        {
            [ATTR.BACKGROUNDCOLOR]: COLOR.WHITESMOKE,
            [ATTR.COLOR]: COLOR.TAUPE,
            [ATTR.MOUSEOVER_COLOR]: COLOR.BEIGE,
            [ATTR.TITLE]: props[ATTR.TITLE],
            [ATTR.DESCRIPTION]: props[ATTR.DESCRIPTION],
            [ATTR.ONCLICK]: props[ATTR.ONCLICK],
        }
    )
}

export function DarkPanel(props) {
    return React.createElement(
        Panel,
        {
            [ATTR.BACKGROUNDCOLOR]: COLOR.TAUPE,
            [ATTR.COLOR]: COLOR.WHITESMOKE,
            [ATTR.MOUSEOVER_COLOR]: COLOR.BEIGE,
            [ATTR.TITLE]: props[ATTR.TITLE],
            [ATTR.DESCRIPTION]: props[ATTR.DESCRIPTION],
            [ATTR.ONCLICK]: props[ATTR.ONCLICK],
        }
    )
}
