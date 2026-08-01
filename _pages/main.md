---
layout: page
permalink: /
title: Lab
description:

# Video carousel auto-advance timing (in milliseconds)
carousel_autoplay_delay: 3500

highlighted_projects:

  - teaser_video: /assets/video/urbanverse_demo.mp4
    teaser_img: 
    caption: 
    title: "UrbanVerse: Scaling Urban Simulation by Watching City-Tour Videos"
    link: https://urbanverseproject.github.io/
  - teaser_video: /assets/video/s2e_demo.mp4
    teaser_img: 
    caption: 
    title: "From Seeing to Experiencing: Scaling Navigation Foundation Models with Reinforcement Learning"
    link: https://vail-ucla.github.io/S2E/
  - teaser_video: /assets/video/josh.mp4
    teaser_img: 
    caption: 
    title: "Joint Optimization for 4D Human-Scene Reconstruction in the Wild"
    link: https://vail-ucla.github.io/JOSH/
  - teaser_video: /assets/video/SceneStreamer_video.mp4
    teaser_img: 
    caption: 
    title: "SceneStreamer: Continuous Scenario Generation as Next Token Group Prediction"
    link: https://vail-ucla.github.io/scenestreamer/ 
  - teaser_video: /assets/video/urbansim_demo.mp4
    teaser_img: 
    caption: 
    title: "Towards Autonomous Micromobility through Scalable Urban Simulation"
    link: https://metadriverse.github.io/urbansim/
  - teaser_video: /assets/video/vid2sim_demo.mp4
    teaser_img: 
    caption: 
    title: "Vid2Sim: Realistic and Interactive Simulation from Video for Urban Navigation"
    link: https://metadriverse.github.io/vid2sim/
  - teaser_video: /assets/video/dreamland_demo.mp4
    teaser_img: 
    caption: 
    title: "Dreamland: Controllable World Creation with Simulator and Generative Models"
    link: https://metadriverse.github.io/dreamland/
  - teaser_video: /assets/video/ppl_demo.mp4
    teaser_img: 
    caption: 
    title: "Predictive Preference Learning from Human Interventions"
    
---

<style>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    margin-top: 1rem;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .logo-container img {
    height: 60px;
    width: auto;
    object-fit: contain;
  }
  
  .lab-title {
    font-size: 2rem;
    font-weight: bold;
    color: var(--global-text-color);
    text-align: right;
  }
</style>

<div class="header-container">
  <div class="logo-container">
    <img src="/assets/img/logo.png" alt="Logo 2">
  </div>
  <div class="lab-title">
    Vision and Autonomy Intelligence Lab
  </div>
</div>

<!-- ============================================ -->
<div class="clearfix">
<!-- Want to say something here? -->
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
    background: var(--global-card-bg-color);
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
    color: var(--global-text-color);
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
    loop: false,
    watchSlidesProgress: true,
    speed: 1000,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: {{ page.carousel_autoplay_delay | default: 3500 }},
      disableOnInteraction: false,
      reverseDirection: false,
      stopOnLastSlide: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: false,
      type: 'bullets',
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      slideChangeTransitionStart: function () {
        // Play the next slide's video at the start of transition
        const activeSlide = this.slides[this.activeIndex];
        const activeVideo = activeSlide.querySelector('video');
        if (activeVideo) {
          activeVideo.currentTime = 0;
          activeVideo.play();
        }
      },
      slideChangeTransitionEnd: function () {
        // Pause and reset non-active videos after transition completes
        const videos = document.querySelectorAll('.swiper-slide video');
        videos.forEach((video, index) => {
          if (index !== this.activeIndex) {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      init: function () {
        // Play first video on init
        const firstVideo = this.slides[0].querySelector('video');
        if (firstVideo) {
          firstVideo.currentTime = 0;
          firstVideo.play();
        }
      },
      reachEnd: function () {
        setTimeout(() => {
          this.slideTo(0);
        }, {{ page.carousel_autoplay_delay | default: 3500 }});
      }
    }
  });
</script>


<!-- ============================================ -->
<!-- News -->
<h2>
News
</h2>
{% include news.liquid limit=true %}
<!-- ============================================ -->


{% include recent_publications.liquid %}


<!-- ============================================ -->
<!-- Sponsors Section -->
<hr>
<h2>Research Sponsors & Industry Collaborators</h2>
<p>We thank the following organizations for supporting our research through grants, gifts, sponsored research, and collaborative projects.</p>

<style>
  .sponsors-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  
  .sponsor-logo {
    height: 60px;
    width: auto;
    object-fit: contain;
  }
</style>

<div class="sponsors-container">
  <img src="/assets/img/nsf_logo.svg" class="sponsor-logo" alt="NSF">
  <img src="/assets/img/onr_logo.png" class="sponsor-logo" alt="ONR">
  <img src="/assets/img/amazon.png" class="sponsor-logo" alt="Amazon">
  <img src="/assets/img/sony.jpeg" class="sponsor-logo" alt="Sony">
  <img src="/assets/img/intel.png" class="sponsor-logo" alt="Intel">
  <img src="/assets/img/samsung.jpeg" class="sponsor-logo" alt="Samsung">
  <img src="/assets/img/cisco.jpeg" class="sponsor-logo" alt="Cisco">
  <img src="/assets/img/coco-logo.png" class="sponsor-logo" alt="COCO">
  <img src="/assets/img/tri-logo.png" class="sponsor-logo" alt="TRI">
  <img src="/assets/img/adobe-logo.jpg" class="sponsor-logo" alt="Adobe">
  <!-- Add more sponsor logos as needed -->
</div>
<!-- ============================================ -->
