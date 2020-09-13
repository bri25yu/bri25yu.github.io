import React from "react";

import { ATTR, EL } from "../constants";

import "../style/BlogPost.css";


export default function BlogPost(props) {
    return React.createElement(
        EL.DIV,
        {
            [ATTR.CLASSNAME]: "blog-post",
        },
        [
            React.createElement(
                BlogPostTitle,
                {
                    [ATTR.TITLE]: props[ATTR.TITLE],
                    [ATTR.KEY]: "title",
                }
            ),
            React.createElement(
                BlogPostBody,
                {
                    [ATTR.BODY]: props[ATTR.BODY],
                    [ATTR.KEY]: "body",
                }
            )
        ]
    )
}

export function BlogPostTitle(props) {
    return React.createElement(
        EL.DIV,
        {
            [ATTR.CLASSNAME]: "blog-post-title",
        },
        props[ATTR.TITLE]
    )
}

export function BlogPostBody(props) {
    return React.createElement(
        EL.DIV,
        {
            [ATTR.CLASSNAME]: "blog-post-body",
        },
        props[ATTR.BODY]
    )
}
