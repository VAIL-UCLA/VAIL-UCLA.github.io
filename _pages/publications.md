---
layout: page
permalink: /
title: Vision and Autonomy Intelligence Lab at UCLA
description:

highlighted_projects:
  - teaser_video: /assets/video/pvp4real_highlight_video.mp4
    teaser_img: 
    caption: 
    title: "PVP4Real: Mobile robots learned from human-in-the-loop interventions"
    link: https://metadriverse.github.io/pvp4real/
  - teaser_video: /assets/video/scenarionet_highlight_video.mp4
    teaser_img: 
    caption: 
    title: "ScenarioNet: Open-source platform for large-scale traffic scenario modeling and simulation"
    link: https://metadriverse.github.io/scenarionet/
---

<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

<!-- Custom Swiper Styles -->
<style>
  .swiper {
    width: 100%;
    height: 500px;
    margin-bottom: 2rem;
  }

  .swiper-slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    text-align: center;
  }

  .swiper-slide video,
  .swiper-slide img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: 12px;
  }

  .slide-title {
    margin-top: 0.5rem;
    font-weight: bold;
    font-size: 1.1rem;
  }
</style>

<!-- Swiper Markup -->
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    {% for item in page.highlighted_projects %}
      <div class="swiper-slide">
        {% if item.link %}
          <a href="{{ item.link | relative_url }}" style="text-decoration: none; color: inherit;">
        {% endif %}

        {% if item.teaser_video %}
          <video
            src="{{ item.teaser_video | relative_url }}"
            autoplay
            muted
            loop
            playsinline
            poster="{{ item.teaser_img | relative_url }}"
          ></video>
        {% elsif item.teaser_img %}
          <img src="{{ item.teaser_img | relative_url }}" alt="{{ item.title }}" />
        {% endif %}

        {% if item.title %}
          <div class="slide-title">{{ item.title }}</div>
        {% endif %}

        {% if item.link %}
          </a>
        {% endif %}
      </div>
    {% endfor %}
  </div>

  <!-- Swiper UI -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-pagination"></div>
</div>

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Swiper Initialization -->
<script>
  var swiper = new Swiper(".mySwiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
</script>




<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

<!-- {% include bib_search.liquid %} -->

<div class="publications">

{% bibliography %}

</div>
