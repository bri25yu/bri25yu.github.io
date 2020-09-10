import React, { Component } from "react";
import ReactDOM from "react-dom";

import Footer from "./components/Footer";
import Head from "./components/Head";
import HomeBlog from "./components/HomeBlog";
import ScrollToTop from "./components/ScrollToTop";

import "./style/clear.css";
import "./style/common.css";
import "./style/font-awesome.min.css";
import "./style/carouFredSel.css";
import "./style/sm-clean.css";
import "./style/style.css";


class Index extends Component {
    render() {
        return React.createElement(
            "div",
            null,
            [
                React.createElement(
                    Head
                ),
                React.createElement(
                    HomeBlog
                ),
                React.createElement(
                    ScrollToTop
                ),
                React.createElement(
                    Footer
                ),
                <script type="text/javascript" src="js/jquery.js"></script>,
                <script type="text/javascript" src="js/jquery.smartmenus.min.js"></script>,
                <script type="text/javascript" src="js/queryloader2.min.js"></script>,
                <script type="text/javascript" src="js/jquery.carouFredSel-6.0.0-packed.js"></script>,
                <script type="text/javascript" src="js/jquery.mousewheel.min.js"></script>,
                <script type="text/javascript" src="js/jquery.touchSwipe.min.js"></script>,
                <script type="text/javascript" src="js/jquery.easing.1.3.js"></script>,
                <script type="text/javascript" src="js/jquery.nicescroll.min.js"></script>,
                <script type="text/javascript" src="js/main.js"></script>,
            ]
        );
    }
}


const container = document.getElementById("index");
ReactDOM.render(React.createElement(Index), container);
