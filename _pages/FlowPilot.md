---
layout: research
permalink: /FlowPilot/
title: "FlowPilot"
page_title: "From Imitation to Alignment:<br>Human-Preference Flow Policies for<br>Long-Horizon Sidewalk Navigation"
description: ""

authors:

- {name: "Honglin He", url: "https://dhlinv.github.io/"}
- {name: "Zhizheng Liu", url: "https://bosmallear.github.io/"}
- {name: "Yukai Ma", url: "https://yukai-ma.github.io/"}
- {name: "Bolei Zhou", url: "https://boleizhou.github.io/"}

institutions:

- {name: "University of California, Los Angeles"}

nav: false
nav_order: 1
code_link: https://github.com/VAIL-UCLA/FlowPilot
pdf_link: ../assets/projects/flowpilot/_Arxiv__FlowPilot.pdf

---

<div class="embed-responsive embed-responsive-16by9">
  <video muted autoplay playsinline controls loop style="position: absolute; top: 0%; left: 0%; width: 100%; height: 100%;">
        <source src="../assets/projects/flowpilot/teaser_video.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

<div class="research-section">
    <h3 style="text-align: center">TL;DR</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      <strong>FlowPilot</strong> is a mapless, monocular-camera navigation policy that goes <em>from imitation to alignment</em>. We first pretrain the policy on large-scale offline demonstrations, then align it with only a few human-preference samples for safe, socially compliant behavior required by long-horizon sidewalk navigation.<br><br>
    1. 🌊 Introduces <strong>Anchored Flow Matching</strong> with gated conditioning to provide an expressive, multi-modal action representation that captures diverse sidewalk behaviors while suppressing goal-driven shortcuts.<br>
    2. 🤝 Proposes a reward-free <strong>human-in-the-loop preference learning</strong> scheme that aligns the policy with socially compliant behavior from a small amount of human intervention data, while preserving its imitation priors.<br>
    3. 🛣️ Validated in both simulation and real-world experiments: <strong>FlowPilot-Base</strong> reaches 42% success rate and 66% route completion in simulation, and human-preference fine-tuned <strong>FlowPilot-HP</strong> cuts the real-world intervention rate by 40.0% and normalized intervention rate by 52.1%.
  </ul>
</div>

<!--research-section-splitter-->

## FlowPilot Model Architecture

<div class="img-container" style="width: 100%; margin: 0 auto;">
    <img src="../assets/projects/flowpilot/framework.png" class="my-image" alt="Image" />
</div>
<br>
FlowPilot consists of two key components:<br>
(1) Anchored Flow Matching: A conditional flow-matching policy anchored to clustered prototypical behaviors, learning smooth, multi-modal trajectories from offline demonstrations, with gated cross-attention that grounds decisions in scene context and avoids goal-driven shortcuts.<br>
(2) Human-Preference Alignment: A reward-free, human-in-the-loop scheme that fine-tunes the pretrained policy from corrective interventions toward safe, socially compliant behavior while preserving the imitation prior.

<!--research-section-splitter-->

## Long-Horizon Sidewalk Navigation Results

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
  <div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Daytime (9X Speed)</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/Long_01_morning_4_2x_processed.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto;">
  <div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Nighttime (9X Speed)</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/Long_02_night_2_8x_processed.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  Long-horizon results in real-world sidewalk environments: using only a monocular RGB camera and coarse GPS, FlowPilot stays on the walkway while avoiding obstacles and pedestrians.
</p>

<!--research-section-splitter-->

## Capability Demonstrations

<p style="text-align: center; font-size: 0.85em; font-style: italic; color: #888; margin-top: 4px;">
  All videos in this section are played at 6× speed.
</p>

### Sidewalk Lane Keeping

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Dusk Commercial District</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/morn_02_traj_vel_lr_6x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Dusk Commercial District</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/morn_03_traj_vel_lr_6x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  FlowPilot keeps the robot centered on the sidewalk, smoothly following the walkable path through curves and intersections while staying clear of the road and grass margins.
</p>

### Obstacle Avoidance
<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Daytime Campus</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/day_01_traj_vel_lr_3x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Dusk Campus</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/day_06_traj_vel_lr_3x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  FlowPilot detects obstacles ahead like parked scooters and steers smoothly around them before returning to the sidewalk, without stalling or veering into the road.
</p>

### Pedestrian Awareness
<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Daytime Commercial District</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/day_03_traj_vel_lr_3x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Daytime Commercial District</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/day_04_traj_vel_lr_3x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Dusk Residential Neighborhood</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/day_08_traj_vel_lr_3x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Nighttime Commercial District</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/ped_night_00.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  When pedestrians share or cross the walkway, FlowPilot anticipates their motion and responds in a socially compliant way: slowing, yielding, and keeping a safe clearance.
</p>

### Robustness under Varying Lighting
<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Dusk</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/day_09_traj_vel_lr_3x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Nighttime</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/general_night_00.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 0 auto 18px auto;">
<div style="flex: 0 0 30px; display: flex; align-items: center; justify-content: center; font-weight: 600;"><span style="writing-mode: vertical-rl; transform: rotate(180deg);">Nighttime</span></div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/general_night_01.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  At night, headlight glare, streetlamp halos, deep shadows, and low contrast severely degrade monocular RGB perception. Without any depth sensor, LiDAR, or pre-built map, FlowPilot still follows the sidewalk and avoids obstacles and pedestrians, holding stable trajectories across these challenging illumination conditions.
</p>

<!--research-section-splitter-->

## Comparison with State-of-the-Art Methods

<div style="display: flex; gap: 12px; margin: 0 auto 8px auto;">
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">NoMaD</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/temp_idnomad_01_4x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">FlowPilot-HP</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/temp_idnavflow_01_4x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; gap: 12px; margin: 0 auto 8px auto;">
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">CityWalker</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/temp_idcitywalker_02_4x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">FlowPilot-HP</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/temp_idnavflow_02_4x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
   Under identical conditions, FlowPilot-HP stays centered on the walkway and progresses smoothly toward the goal, while the NoMaD and CityWalker baselines drift off the sidewalk or stall.
</p>

<!--research-section-splitter-->

## Cross-Embodiment Generalization

<div style="display: flex; gap: 12px; margin: 0 auto 8px auto;">
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/CoRL_Supplementary_Video_no_art_compressed_seg0.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
  <div style="flex: 1; min-width: 0;">
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/CoRL_Supplementary_Video_no_art_compressed_seg1.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  FlowPilot generalizes across robot embodiments: the same policy controls robots with different dynamics, footprints, and camera viewpoints, maintaining consistent behaviors.
</p>

<!--research-section-splitter-->

## Ablation Studies

### Effectiveness of Robot-Agnostic Pretraining

<div class="img-container" style="width: 100%; margin: 0 auto;">
    <img src="../assets/projects/flowpilot/F5-scaling.png" class="my-image" alt="Scaling of web-scale visual-odometry pretraining" />
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  Pretraining on the large-scale robot-agnostic dataset with diverse dynamics improves downstream navigation for both goal-less and point-goal navigation, showing that robot-agnostic dataset is an effective, scalable pretraining signal.
</p>

### Effectiveness of Gated Attention

<div class="img-container" style="width: 100%; margin: 0 auto;">
    <img src="../assets/projects/flowpilot/figure_attention_layers.png" class="my-image" alt="Goal-point attention with and without gated attention" />
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  Fraction of attention placed on the goal token across decoder layers. Without gating, attention increasingly concentrates on the goal (an attention sink) that encourages goal-driven shortcuts; gated attention markedly reduces this concentration in both mean and max, letting the policy attend to scene context.
</p>

### Effectiveness of Preference Learning
<div style="display: flex; gap: 12px; margin: 0 auto 8px auto;">
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">Preference Data Collection-1</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/tele_00_traj_vel_lr_2x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">Preference Data Collection-2</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/tele_01_traj_vel_lr_2x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style="display: flex; gap: 12px; margin: 0 auto 8px auto;">
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">FlowPilot-Base (Collision)</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/temp_idnavflow_base_03_4x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
  <div style="flex: 1; min-width: 0;">
    <p style="text-align: center; font-weight: 600; margin: 0 0 6px 0;">FlowPilot-HP (Success)</p>
    <video muted autoplay playsinline controls loop style="width: 100%; height: auto; display: block;">
        <source src="../assets/projects/flowpilot/temp_idnavflow_03_4x.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
  </div>
</div>

<p style="text-align: center; font-style: italic; color: #555; margin-top: 10px;">
  Top: preference data is gathered from brief human interventions during teleoperation. Bottom: starting from the same imitation prior, the preference-aligned FlowPilot-HP behaves more cautiously and is more socially compliant than FlowPilot-Base, requiring fewer interventions while retaining the base policy's navigation skills.
</p>

<!--research-section-splitter-->

## Reference

```
@article{he2026from,
         title={From Imitation to Alignment: Human-Preference Flow Policies for Long-Horizon Sidewalk Navigation},
         author={He, Honglin and Liu, Zhizheng and Ma, Yukai and Zhou, Bolei},
         journal={arXiv preprint},
         year={2026},
}
```

<script>
// This page has many videos. Browsers cap how many can decode at once, so
// blanket autoplay silently drops the largest clips. Instead, play each
// video only while it is on screen and pause it when it scrolls away.
(function () {
  function init() {
    var vids = [].slice.call(document.querySelectorAll('video'));
    vids.forEach(function (v) {
      v.removeAttribute('autoplay');
      v.muted = true;
      v.setAttribute('playsinline', '');
      try { v.preload = 'metadata'; } catch (e) {}
    });
    if (!('IntersectionObserver' in window)) {
      vids.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.2 });
    vids.forEach(function (v) { io.observe(v); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
</script>

