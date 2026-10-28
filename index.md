---
layout: default
title: About me
---

# About me
I'm a research engineer who enjoys building and optimizing systems. Currently, I develop engineering, language model, and organizational systems at Nvidia Nemotron.

I have a capability to truly understand systems and drill problems down until the true issue reveals itself, especially regarding performance bottlenecks and bugs. Along the way, I tend to build tools and processes that rapidly increase iteration speed. As a result, I'm highly adaptable and exercise strong strategic judgement.


## Blog

{% assign blog_pages = site.pages | sort: 'title' %}
<ul>
{% for blog_page in blog_pages %}
  {% assign top_directory = blog_page.path | split: '/' | first %}
  {% if top_directory == 'blog' %}
  <li><a href="{{ blog_page.url | relative_url }}">{{ blog_page.title | default: blog_page.name | escape }}</a></li>
  {% endif %}
{% endfor %}
</ul>
