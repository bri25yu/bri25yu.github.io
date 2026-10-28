---
layout: default
title: bri25yu.github.io
---

# bri25yu.github.io

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
