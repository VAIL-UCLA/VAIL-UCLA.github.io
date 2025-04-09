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



<!-- ============================================ -->
<div class="clearfix">
Want to say something here?
</div>
<!-- ============================================ -->


<!-- ============================================ -->
<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

<!-- Swiper Styles (Updated Style, No Background Change) -->
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
    font-size: 18px;
  }

    .swiper-button-next::after,
    .swiper-button-prev::after {
      color: var(--global-theme-color); /* Change this to any color you want */
      font-size: 24px; /* Optional: tweak size */
    }
    
    .swiper-pagination-bullet-active {
      background: var(--global-theme-color); /* Color of the currently active bullet */
    }

  .swiper-slide video,
  .swiper-slide img {
    width: 100%;
    height: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 12px;

    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); /* subtle soft shadow */
    overflow: hidden;    /* to prevent shadow from being clipped */
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
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
</script>
<!-- ============================================ -->





<!-- ============================================ -->
<!-- News -->
<h2>
News
</h2>
{% include news.liquid limit=true %}
<!-- ============================================ -->


<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

<!-- {% include bib_search.liquid %} -->

<div class="publications">

{% bibliography %}

</div>
