import React from "react";

import { APPS, ATTR, CLASS, COLOR, EL } from "../constants";

import "../style/Panel.css";


export default function PanelContainer(props) {
    const panel_data = props[ATTR.PANEL_DATA];
    const panels = panel_data.map((props, i) => {
        const panel_type = (i % 2 == 0) ? DarkPanel : LightPanel;
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

export function Panel(props) {
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
                EL.DIV,
                {
                    [ATTR.CLASSNAME]: "panel-title",
                    [ATTR.KEY]: "panel-title",
                },
                props[ATTR.TITLE]
            ),
            React.createElement(
                EL.DIV,
                {
                    [ATTR.CLASSNAME]: "panel-description",
                    [ATTR.KEY]: "panel-description",
                },
                props[ATTR.DESCRIPTION]
            )
        ]
    )
}

export function LightPanel(props) {
    return React.createElement(
        Panel,
        {
            [ATTR.BACKGROUNDCOLOR]: COLOR.WHITE,
            [ATTR.COLOR]: COLOR.TAUPE,
            [ATTR.TITLE]: props[ATTR.TITLE],
            [ATTR.DESCRIPTION]: props[ATTR.DESCRIPTION],
        }
    )
}

export function DarkPanel(props) {
    return React.createElement(
        Panel,
        {
            [ATTR.BACKGROUNDCOLOR]: COLOR.TAUPE,
            [ATTR.COLOR]: COLOR.WHITE,
            [ATTR.TITLE]: props[ATTR.TITLE],
            [ATTR.DESCRIPTION]: props[ATTR.DESCRIPTION],
        }
    )
}
