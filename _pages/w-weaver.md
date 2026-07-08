---
layout: research
permalink: /w-weaver/
title: "W-Weaver"
page_title: '<span class="wweaver-title-line">From Context to State: Streaming Multi-Agent</span><br><span class="wweaver-title-line">Autoregressive Diffusion with World State Registers</span>'
description: ""

authors:

- {name: "Sicheng Mo*", url: "https://sichengmo.github.io/", institution: "1"}
- {name: "Yuheng Li*", url: "#", institution: "2"}
- {name: "Ziyang Leng", url: "#", institution: "1"}
- {name: "Krishna Kumar Singh", url: "https://krsingh.cs.ucdavis.edu/", institution: "2"}
- {name: "Bolei Zhou", url: "https://boleizhou.github.io/", institution: "1"}

institutions:

- {name: "University of California, Los Angeles", institution: "1"}
- {name: "Adobe Research", institution: "2"}

nav: false
nav_order: 1

---

<style>
  body {
    background: #f7f8fb;
  }

  .post-header {
    max-width: 800pt;
    margin: 0 auto;
    padding: 2rem 1.5rem 0;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(30, 41, 59, 0.08);
    border-bottom: 0;
    border-radius: 8px 8px 0 0;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.045);
  }

  .post > article > .research-section {
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(30, 41, 59, 0.08);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.045);
    margin-top: 1.35rem;
    margin-bottom: 1.35rem;
    padding: 1.25rem 1.5rem;
  }

  .post > article > .research-section:first-child {
    border-top: 0;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 14px 26px rgba(15, 23, 42, 0.045);
    margin-top: -0.5rem;
    padding-top: 0;
  }

  .post > article > .research-section h2 {
    border-bottom: 1px solid rgba(30, 41, 59, 0.09);
    margin-top: 0.2rem;
    margin-bottom: 1.15rem;
    padding-bottom: 0.55rem;
  }

  .post-header .post-title {
    font-size: 2.25rem;
    line-height: 1.16;
    margin-bottom: 1.35rem;
  }

  .post-header > .col-12 {
    margin-bottom: 0.35rem !important;
  }

  .post-header > .col-12[align="center"] {
    display: none;
  }

  .post-header .post-title .wweaver-title-line {
    display: inline-block;
    white-space: nowrap;
  }

  .post-header h6 a:nth-of-type(1) b,
  .post-header h6 a:nth-of-type(2) b {
    font-weight: 900 !important;
  }

  .wweaver-hero-image {
    margin-top: 1.15rem;
  }

  .wweaver-hero-image img,
  .wweaver-media-frame img,
  .wweaver-gallery video {
    background: #fff;
    border: 1px solid rgba(30, 41, 59, 0.1);
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .wweaver-tldr {
    background: #f8fbff;
    border: 1px solid rgba(39, 116, 174, 0.13);
    border-left: 3px solid rgba(39, 116, 174, 0.55);
    border-radius: 8px;
    margin: 1.15rem auto 0;
    padding: 1rem 1.15rem;
  }

  .wweaver-tldr h3 {
    margin-top: 0;
    margin-bottom: 0.6rem;
  }

  .wweaver-equal-note {
    color: #444;
    font-size: 1rem;
    margin: 0 0 0.45rem;
    text-align: center;
  }

  .wweaver-resource-links {
    color: var(--global-text-color);
    font-size: 1.15rem;
    margin: 0.2rem 0 0.4rem;
    text-align: center;
  }

  .wweaver-resource-links a {
    color: var(--global-theme-color);
    font-weight: 700;
  }

  .wweaver-resource-links a:hover,
  .wweaver-resource-links a:focus {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .post-header {
      padding: 1.25rem 1rem 0;
    }

    .post > article > .research-section {
      padding: 1rem;
    }

    .post-header .post-title {
      font-size: 1.55rem;
    }
  }
</style>

<p class="wweaver-equal-note">
  <sup>*</sup>Equal contribution.
</p>

<p class="wweaver-resource-links">
  <a href="#"><b>Paper</b></a> | <a href="#"><b>Code</b></a> | <a href="#"><b>Project</b></a>
</p>

<div class="img-container wweaver-hero-image" style="width: 100%; margin: 0 auto;">
  <img src="../assets/projects/w-weaver/img/teaser_v1.jpg" style="width: 100%; height: auto;" alt="W-Weaver teaser" />
</div>

<div class="wweaver-tldr">
    <h3 style="text-align: center">TL;DR</h3>
    <p style="margin-bottom: 0;">
      <strong>W-Weaver</strong> is a streaming multi-agent video diffusion model that explicitly models persistent world states with <strong>world state registers</strong>: learnable tokens that store shared world information, track individual agent status, and are dynamically updated after each generated chunk. These registers are grounded with agent statistics, bird's-eye views, and scene text to improve long-horizon consistency across agents.
    </p>
</div>

<!--research-section-splitter-->

## Gallery

<style>
  .wweaver-gallery {
    position: relative;
    width: 82%;
    margin: 0 auto;
  }

  .wweaver-gallery video {
    width: 100%;
    height: auto;
  }

  .wweaver-gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: var(--global-theme-color);
    font-size: 30px;
    line-height: 1;
    cursor: pointer;
  }

  .wweaver-gallery-nav:hover,
  .wweaver-gallery-nav:focus {
    color: var(--global-hover-color);
    outline: none;
  }

  .wweaver-gallery-prev {
    left: -54px;
  }

  .wweaver-gallery-next {
    right: -54px;
  }

  .wweaver-gallery-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 0.8rem;
  }

  .wweaver-gallery-dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgba(128, 128, 128, 0.35);
    cursor: pointer;
  }

  .wweaver-gallery-dot.active {
    background: var(--global-theme-color);
  }

  .wweaver-results-table {
    overflow-x: visible;
    margin-top: 1rem;
    margin-bottom: 1.25rem;
  }

  .wweaver-results-table table {
    width: 94%;
    margin: 0 auto;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 0.74rem;
    line-height: 1.2;
  }

  .wweaver-results-table th,
  .wweaver-results-table td {
    padding: 0.22rem 0.18rem;
    text-align: center;
    vertical-align: middle;
    word-break: normal;
  }

  .wweaver-results-table th:first-child,
  .wweaver-results-table td:first-child {
    width: 15%;
    text-align: left;
  }

  .wweaver-results-table .metric-group {
    border-bottom: 1px solid var(--global-divider-color);
    font-weight: 700;
  }

  .wweaver-results-table .metric-subhead {
    font-weight: 600;
  }

  .wweaver-results-table .world-score {
    width: 9%;
  }

  .wweaver-results-table .highlight-row {
    background: rgba(39, 116, 174, 0.07);
  }

  @media (max-width: 768px) {
    .wweaver-gallery {
      width: 88%;
    }

    .wweaver-gallery-prev {
      left: -38px;
    }

    .wweaver-gallery-next {
      right: -38px;
    }

    .wweaver-results-table table {
      font-size: 0.62rem;
    }

    .wweaver-results-table th,
    .wweaver-results-table td {
      padding: 0.18rem 0.08rem;
    }
  }

  .wweaver-equation {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    text-align: center;
    margin: 1rem 0;
  }
</style>

<div class="wweaver-gallery">
  <video id="wweaver-gallery-player" muted autoplay playsinline controls loop>
    <source src="../assets/projects/w-weaver/videos/sample_00.mov">
    Your browser does not support the video tag.
  </video>
  <button id="wweaver-gallery-prev" class="wweaver-gallery-nav wweaver-gallery-prev" type="button" aria-label="Previous sample">&#10094;</button>
  <button id="wweaver-gallery-next" class="wweaver-gallery-nav wweaver-gallery-next" type="button" aria-label="Next sample">&#10095;</button>
</div>

<div class="wweaver-gallery-pagination" aria-label="Gallery sample selector">
  <button class="wweaver-gallery-dot active" type="button" data-wweaver-gallery-index="0" aria-label="Show sample 1"></button>
  <button class="wweaver-gallery-dot" type="button" data-wweaver-gallery-index="1" aria-label="Show sample 2"></button>
</div>

<script>
  (function() {
    const videos = [
      {
        src: "../assets/projects/w-weaver/videos/sample_00.mov"
      },
      {
        src: "../assets/projects/w-weaver/videos/sample_01.mov"
      }
    ];
    let idx = 0;

    const player = document.getElementById("wweaver-gallery-player");
    const prevBtn = document.getElementById("wweaver-gallery-prev");
    const nextBtn = document.getElementById("wweaver-gallery-next");
    const dots = document.querySelectorAll("[data-wweaver-gallery-index]");
    if (!player || !prevBtn || !nextBtn) return;

    function render() {
      player.src = videos[idx].src;
      player.load();
      const playPromise = player.play();
      if (playPromise && typeof playPromise.catch === "function") playPromise.catch(function() {});
      dots.forEach(function(dot, dotIdx) {
        dot.classList.toggle("active", dotIdx === idx);
      });
    }

    prevBtn.addEventListener("click", function() {
      idx = (idx - 1 + videos.length) % videos.length;
      render();
    });
    nextBtn.addEventListener("click", function() {
      idx = (idx + 1) % videos.length;
      render();
    });
    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        idx = Number(dot.getAttribute("data-wweaver-gallery-index")) || 0;
        render();
      });
    });
    player.addEventListener("ended", function() {
      idx = (idx + 1) % videos.length;
      render();
    });
  })();
</script>

The rollout examples show synchronized two-player Minecraft generation, where each player observes a partial first-person view of the same evolving world. W-Weaver maintains a shared world-state representation so future chunks can condition on persistent state rather than relying only on a growing window of visual context.

<!--research-section-splitter-->

## Method Overview

<div class="img-container wweaver-media-frame" style="width: 100%; margin: 0 auto;">
  <img src="../assets/projects/w-weaver/img/overall_pipeline.jpg" style="width: 100%; height: auto;" alt="W-Weaver overview pipeline" />
</div>

Standard streaming autoregressive diffusion models denoise each new frame from a local frame KV cache. This makes rollout practical, but the model must repeatedly re-infer world information from recent frames, and the stored context remains entangled with visual tokens.

<strong>W-Weaver</strong> augments this pipeline with <strong>world state registers</strong> (WSR): persistent register tokens that carry global scene information and individual agent status across rollout steps. After each generated chunk, the model commits an updated register, removes stale state, and uses the latest register to condition the next frame generation.

At each rollout step, the model updates the register from the previous register, the local context window, and the current action, then uses the committed register to generate the next frame:

<div class="wweaver-equation">
\[
\mathbf{r}_i=G_\theta(\mathbf{r}_{i-1},\mathbf{x}_{i-W+1},\ldots,\mathbf{x}_i,a_i),\qquad
p_\theta(\mathbf{x}_{i+1}\mid \mathbf{x}_{i-W+1},\ldots,\mathbf{x}_i,a_{i+1},\mathbf{r}_i).
\]
</div>

During training, W-Weaver interleaves frame/context tokens and register groups as <code>[C1, R1, C2, R2, ...]</code>. The causal mask makes the rollout causal at the state level: frame tokens attend to the local window and the latest committed register, while each register query attends to the local context ending at its commit step and the immediately preceding register.

<!--research-section-splitter-->

## Grounding the World State

A core question is not only how to store state, but what the state should represent. W-Weaver grounds each committed register with auxiliary decoders that make the hidden world state inspectable: per-agent simulator statistics, bird's-eye-view scene layout, and scene text. These heads are used during training and discarded at inference, so the supervision does not increase rollout cost.

The supervision signals encourage the register to preserve complementary aspects of the world:

- <strong>Agent states:</strong> position, velocity, and orientation give the register explicit per-agent motion targets.
- <strong>BEV layout:</strong> bird's-eye-view supervision exposes allocentric geometry shared by both players.
- <strong>Scene text:</strong> language targets ask registers to retain categories, attributes, and semantic state.

<div class="img-container wweaver-media-frame" style="width: 78%; margin: 1rem auto 0;">
  <img src="../assets/projects/w-weaver/img/pipe_decoder.jpg" style="width: 100%; height: auto;" alt="World state register decoder overview" />
</div>

<!--research-section-splitter-->

## Experiments

We ablate the supervision signals used to ground the world state registers. The aggregate <strong>world score</strong> combines visual quality and logical correctness; higher is better.

<div class="table-container wweaver-results-table">
  <table>
    <thead>
      <tr>
        <th rowspan="2">Variant</th>
        <th class="metric-group" colspan="2">Movement</th>
        <th class="metric-group" colspan="2">Grounding</th>
        <th class="metric-group" colspan="2">Memory</th>
        <th class="metric-group" colspan="2">Building</th>
        <th class="metric-group" colspan="2">Consistency</th>
        <th rowspan="2" class="world-score">World<br>Score ↑</th>
      </tr>
      <tr>
        <th class="metric-subhead">VLM ↑</th>
        <th class="metric-subhead">FID ↓</th>
        <th class="metric-subhead">VLM ↑</th>
        <th class="metric-subhead">FID ↓</th>
        <th class="metric-subhead">VLM ↑</th>
        <th class="metric-subhead">FID ↓</th>
        <th class="metric-subhead">VLM ↑</th>
        <th class="metric-subhead">FID ↓</th>
        <th class="metric-subhead">VLM ↑</th>
        <th class="metric-subhead">FID ↓</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Baseline</td>
        <td>79.7</td>
        <td>43.3</td>
        <td>81.3</td>
        <td>37.2</td>
        <td>43.8</td>
        <td>61.2</td>
        <td>9.4</td>
        <td>83.4</td>
        <td>57.8</td>
        <td>110.7</td>
        <td>81.0</td>
      </tr>
      <tr>
        <td>Registers only</td>
        <td>90.6</td>
        <td>43.2</td>
        <td>81.3</td>
        <td>44.3</td>
        <td>62.5</td>
        <td>66.1</td>
        <td>21.9</td>
        <td>84.3</td>
        <td>62.5</td>
        <td>101.9</td>
        <td>93.8</td>
      </tr>
      <tr>
        <td>+Agent stats</td>
        <td>95.3</td>
        <td>41.0</td>
        <td>59.4</td>
        <td>45.5</td>
        <td>56.3</td>
        <td>60.1</td>
        <td>9.4</td>
        <td>80.8</td>
        <td>75.0</td>
        <td>107.9</td>
        <td>88.1</td>
      </tr>
      <tr>
        <td>+Bird's-eye view</td>
        <td>82.8</td>
        <td>39.1</td>
        <td>96.9</td>
        <td>40.7</td>
        <td>46.9</td>
        <td>64.7</td>
        <td>31.3</td>
        <td>74.2</td>
        <td>71.9</td>
        <td>103.4</td>
        <td>102.4</td>
      </tr>
      <tr>
        <td>+Scene text</td>
        <td>85.9</td>
        <td>40.2</td>
        <td>84.4</td>
        <td>38.4</td>
        <td>62.5</td>
        <td>62.1</td>
        <td>25.0</td>
        <td>78.8</td>
        <td>73.4</td>
        <td>101.6</td>
        <td>103.2</td>
      </tr>
      <tr class="highlight-row">
        <td><strong>+All</strong></td>
        <td>82.8</td>
        <td>34.0</td>
        <td>93.8</td>
        <td>36.8</td>
        <td>46.9</td>
        <td>64.8</td>
        <td>28.1</td>
        <td>75.9</td>
        <td>76.6</td>
        <td>100.7</td>
        <td>105.1</td>
      </tr>
    </tbody>
  </table>
</div>

The ablation shows that persistent registers are useful even without explicit targets, but supervision determines what kind of state they learn to preserve. Agent statistics emphasize per-player motion, bird's-eye views ground global scene layout, and scene text adds semantic state. Combining these signals produces the most balanced world-state representation across motion, geometry, memory, and consistency.

<!--research-section-splitter-->

## Reference

```
@misc{mo2026contexttostate,
  title={From Context to State: Streaming Multi-Agent Autoregressive Diffusion with World State Registers},
  author={Mo, Sicheng and Li, Yuheng and Leng, Ziyang and Singh, Krishna Kumar and Zhou, Bolei},
  year={2026}
}
```
