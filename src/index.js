import React, { Component } from "react";
import ReactDOM from "react-dom";

import Blog from "./components/Blog";


const container = document.getElementById("index");
ReactDOM.render(React.createElement(Blog, null, "Currently revamping, please check back later!"), container);
