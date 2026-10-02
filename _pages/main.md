---
layout: page
permalink: /
title: Lab
description:

highlighted_projects:

  - teaser_video: /assets/video/worldweaver_teaser.mp4
    teaser_img: /assets/video/worldweaver_teaser.jpg
    title: "WorldWeaver: Streaming Multi-Agent Autoregressive Diffusion Model with World State Registers"
    link: https://vail-ucla.github.io/worldweaver/
  - teaser_video: /assets/video/flowpilot_teaser.mp4
    teaser_img: /assets/video/flowpilot_teaser.jpg
    title: "FlowPilot: From Imitation to Alignment for Long-Horizon Sidewalk Navigation"
    link: https://vail-ucla.github.io/FlowPilot/
  - teaser_video: /assets/video/sidewalkbench_teaser.mp4
    teaser_img: /assets/video/sidewalkbench_teaser.jpg
    title: "SidewalkBench: Benchmarking Visual Navigation on Urban Sidewalks"
    link: https://vail-ucla.github.io/SidewalkBench/
  - teaser_video: /assets/video/dreamstream_teaser.mp4
    teaser_img: /assets/video/dreamstream_teaser.jpg
    title: "DreamStream: Towards Policy-Oriented Generative Simulation for End-to-End Driving"
    link: https://vail-ucla.github.io/DreamStream/
  - teaser_video: /assets/video/cue_the_flow_teaser.mp4
    teaser_img: /assets/video/cue_the_flow_teaser.jpg
    title: "Cue the Flow: Steering Flow-Matching Policies for Open-World Delivery Manipulation"
    link: https://hatchetproject.github.io/delivery_steer/
  - teaser_video: /assets/video/chairnav_teaser.mp4
    teaser_img: /assets/video/chairnav_teaser.jpg
    title: "ChairNav: Cross-Embodiment Pretraining and Personalization for Long-Horizon Wheelchair Navigation"
  - teaser_video: /assets/video/aura_teaser.mp4
    teaser_img: /assets/video/aura_teaser.jpg
    title: "AURA: Multi-modal Shared Autonomy for Urban Navigation"
    link: https://vail-ucla.github.io/aura/
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

  .swiper-slide > a {
    width: 100%;
  }

  .swiper-slide video,
  .swiper-slide img {
    width: 100%;
    height: 100%;
    max-height: 400px;
    object-fit: contain;
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
            data-src="{{ item.teaser_video | relative_url }}"
            preload="none"
            muted
            playsinline
            poster="{{ item.teaser_img | relative_url }}"
            aria-label="{{ item.title | escape }}"
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
  let teaserPlayback = 0;

  function waitForTeaser(video, eventName) {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener(eventName, ready);
        video.removeEventListener('error', failed);
      };
      const ready = () => {
        cleanup();
        resolve();
      };
      const failed = () => {
        cleanup();
        reject(video.error);
      };
      video.addEventListener(eventName, ready, { once: true });
      video.addEventListener('error', failed, { once: true });
    });
  }

  function pauseTeasers(carousel) {
    // Cancel pending playback when a visitor changes slides while loading.
    teaserPlayback += 1;
    carousel.slides.forEach((slide) => {
      const video = slide.querySelector('video');
      if (video) video.pause();
    });
  }

  async function playTeaser(carousel) {
    const video = carousel.slides[carousel.activeIndex].querySelector('video');
    if (!video) return;
    const playback = ++teaserPlayback;
    const isActive = () => playback === teaserPlayback &&
      !carousel.destroyed && !carousel.animating &&
      carousel.slides[carousel.activeIndex].querySelector('video') === video;

    try {
      // Download each teaser only when its slide is shown.
      if (!video.getAttribute('src')) {
        video.preload = 'auto';
        video.src = video.dataset.src;
        video.load();
      }
      if (video.readyState === 0) await waitForTeaser(video, 'loadedmetadata');
      if (!isActive()) return;

      // Finish rewinding before playback, including on repeat visits.
      if (video.currentTime !== 0) video.currentTime = 0;
      if (video.seeking) await waitForTeaser(video, 'seeked');
      if (!isActive()) return;
      await video.play();
    } catch (error) {
      if (isActive()) console.warn('Unable to play teaser:', error);
    }
  }

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
        pauseTeasers(this);
      },
      slideChangeTransitionEnd: function () {
        // Start at frame zero after the slide has fully faded into view.
        playTeaser(this);
      },
      init: function () {
        this.slides.forEach((slide) => {
          const video = slide.querySelector('video');
          if (!video) return;
          video.addEventListener('ended', () => {
            if (this.animating || this.slides[this.activeIndex] !== slide) return;
            // Advance once the whole clip finishes, then wrap to the first slide.
            this.slideTo((this.activeIndex + 1) % this.slides.length);
          });
        });
        playTeaser(this);
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
  <img src="/assets/img/nvidia-logo-horiz.png" class="sponsor-logo" alt="NVIDIA">
  <img src="/assets/img/tri-logo.png" class="sponsor-logo" alt="TRI">
  <img src="/assets/img/adobe-logo.jpg" class="sponsor-logo" alt="Adobe">
  <img src="/assets/img/qualcomm.png" class="sponsor-logo" alt="Qualcomm">
  <!-- Add more sponsor logos as needed -->
</div>
<!-- ============================================ -->
