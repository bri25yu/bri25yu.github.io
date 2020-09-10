import React, { Component } from "react";


export default function HomeBlog(props) {
    return <body class="home blog">
    <div class="doc-loader"></div>
    <div class="content-1170 header-holder center-relative">
        <div class="header-logo left">
            <a href="index.html">
                <img src="images/katt_default_logo.png" alt="Katt" />
            </a>
        </div>

        <div class="header-menu">
            <div class="toggle-holder relative">
                <div id="toggle">
                    <div class="one"></div>
                    <div class="two"></div>
                    <div class="three"></div>
                </div>
            </div>

            <nav id="header-main-menu" class="big-menu">
                <ul class="main-menu sm sm-clean">
                    <li><a href="index.html" class="current">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="about2.html">About 2</a></li>
                    <li><a href="about3.html">About 3</a></li>
                    <li><a href="contact.html">Contact</a>
                        <ul class="sub-menu">
                            <li><a href="contact2.html">Contact + Map</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
    </div>

    <div class="block content-1170 center-relative">
        <div class="blog-holder block center-relative">

            <article id="post-1" class="relative blog-item-holder">
                <div class="post-thumb thumb-html one_thumb relative">
                    <script>
                        var slider1_speed = "500";
                        var slider1_auto = "true";
                        var slider1_pagination = "true";
                        var slider1_hover = "true";
                    </script>
                    <div class="image-slider-wrapper">
                        <div class="caroufredsel_wrapper">
                            <ul id="slider1" class="image-slider slides center-text">
                                <li><img src="demo-images/katt_home_image01_slider01.jpg" alt="" /></li>
                                <li><img src="demo-images/katt_home_image01_slider02.jpg" alt="" /></li>
                                <li><img src="demo-images/katt_home_image01_slider03.jpg" alt="" /></li>
                            </ul>
                        </div>
                        <div class="slider1_pagination carousel_pagination left"></div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="post-title-holder one_title absolute">
                    <h2 class="entry-title excerpt">
                        <a href="single.html">
                            We are design &amp; digital studio based in New York.<br/>
                            This is our showcase of crafted awesomeness.</a>
                    </h2>
                    <div class="cat-links">
                        <ul>
                            <li>
                                <a href="#">Design</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>
            </article>


            <article id="post-2" class="relative blog-item-holder">
                <div class="only-post-title-holder">
                    <h2 class="entry-title excerpt">
                        <a href="single.html">
                            Gathered by gravity bits of moving fluff Flatland venture hearts of the stars Hypatia birth cosmic ocean! Flatland are creatures of the cosmos Orion's sword two ghostly white figures
                        </a>
                    </h2>
                    <div class="cat-links">
                        <ul>
                            <li>
                                <a href="#">Handmade</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="zigzag absolute" style="bottom: 30px; left: -90px;">
                    <img src="images/zigzag.png" alt="" />
                </div>
            </article>


            <article id="post-3" class="relative blog-item-holder">
                <div class="post-thumb thumb-image two_third_thumb left">
                    <img src="demo-images/katt_home_image02.jpg" alt="" />
                </div>
                <div class="post-title-holder one_third_title right">
                    <h2 class="entry-title">
                        <a href="single.html">What was most significant about the office chairs</a>
                    </h2>
                    <div class="cat-links">
                        <ul>
                            <li>
                                <a href="#">Interior</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="zigzag absolute" style="bottom: 40px; right: 331px;">
                    <img src="images/zigzag.png" alt="" />
                </div>
            </article>


            <article id="post-4" class="relative blog-item-holder">
                <div class="post-thumb thumb-image two_third_thumb right">
                    <img src="demo-images/katt_home_image03.jpg" alt="" />
                </div>
                <div class="post-title-holder one_third_title left">
                    <h2 class="entry-title">
                        <a href="single.html">
                            The sky is the limit only for those who aren’t afraid to fly
                        </a>
                    </h2>
                    <div class="cat-links">
                        <ul>
                            <li>
                                <a href="#">Packaging</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="zigzag absolute" style="bottom: 110px; left: -83px;">
                    <img src="images/zigzag.png" alt="" />
                </div>
            </article>


            <article id="post-5" class="relative blog-item-holder">
                <div class="post-thumb thumb-image one_third_thumb left">
                    <img src="demo-images/katt_home_image04.jpg" alt="" />
                </div>
                <div class="post-title-holder two_third_title right">
                    <h2 class="entry-title">
                        <a href="single.html">
                            To go places and do things that have never been done before, that’s what living is all about
                        </a>
                    </h2>
                    <div class="cat-links">
                        <ul>
                            <li>
                                <a href="#">Handmade</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="zigzag absolute" style="bottom: 50px; right: -92px;">
                    <img src="images/zigzag.png" alt="" />
                </div>
            </article>


            <article id="post-6" class="relative blog-item-holder">
                <div class="only-post-title-holder">
                    <h2 class="entry-title excerpt">
                        <a href="single.html">
                            It suddenly struck me that that tiny pea, pretty and blue, was the Earth. I put up my thumb and shut one eye, and my thumb blotted out the planet Earth. I didn't feel like a giant. I felt very, very small.
                        </a>
                    </h2>
                    <div class="cat-links">
                        <ul>
                            <li>
                                <a href="#">Handmade</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="zigzag absolute" style="bottom: 25px; left: -80px;">
                    <img src="images/zigzag.png" alt="" />
                </div>
            </article>


            <article id="post-7" class="relative blog-item-holder">
                <div class="post-thumb thumb-image two_third_thumb right">
                    <img src="demo-images/katt_home_image05.jpg" alt="" />
                </div>
                <div class="post-title-holder one_third_title left">
                    <h2 class="entry-title" style="margin-top: 305px;">
                        <a href="single.html">I believe every human has a finite number of heartbeats</a>
                    </h2>
                    <div class="cat-links">
                        <ul>
                            <li>
                                <a href="#">Lifestyle</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="zigzag absolute" style="bottom: 120px; left: 310px;">
                    <img src="images/zigzag.png" alt="" />
                </div>
            </article>

        </div>
        <div class="clear"></div>
        <div class="block center-relative center-text">
            <a class="more-posts">Load more articles</a>
        </div>
        <div class="clear"></div>
    </div>

</body>
}
