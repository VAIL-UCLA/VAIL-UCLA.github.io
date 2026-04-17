---
layout: research
permalink: /BridgeSim/
title:  "BridgeSim: Unveiling the OL-CL Gap in End-to-End Autonomous Driving"
page_title: '<img src="/assets/projects/bridgesim/bridgesim_logo.png" style="height:1.2em;"> BridgeSim: Unveiling the OL-CL Gap in End-to-End Autonomous Driving'
authors:
  - {name: "Seth Z. Zhao*", url: "https://sethzhao506.github.io", institution: "1"}
  - {name: "Luobin Wang*", url: "https://scholar.google.com/citations?user=rbmtcYsAAAAJ&hl=en", institution: "2"}
  - {name: "Hongwei Ruan", url: "https://www.linkedin.com/in/hongwei-ruan/", institution: "2"}
  - {name: "Yuxin Bao", url: "https://www.linkedin.com/in/rebecca-bao-c13752hz/", institution: "1"}
  - {name: "Yilan Chen", url: "https://yilanchen6.github.io", institution: "2"}
  - {name: "Ziyang Leng", url: "https://scholar.google.com/citations?user=Lwz4be0AAAAJ&hl=en", institution: "1"}
  - {name: "Abhijit Ravichandran", url: "https://www.linkedin.com/in/rabhijit/", institution: "2"}
  - {name: "Honglin He", url: "https://dhlinv.github.io", institution: "1"}
  - {name: "Zewei Zhou", url: "https://scholar.google.com/citations?user=TzhyHbYAAAAJ&hl=zh-CN", institution: "1"}
  - {name: "Xu Han", url: "https://scholar.google.com/citations?user=Ndgk55IAAAAJ&hl=en", institution: "1"}
  - {name: "Abhishek Peri", url: "https://www.linkedin.com/in/abhishek-peri/", institution: "3"}
  - {name: "Zhiyu Huang", url: "https://mczhi.github.io", institution: "1"}
  - {name: "Pranav Desai", url: "https://www.linkedin.com/in/pndesai2/", institution: "3"}
  - {name: "Henrik Christensen", url: "https://scholar.google.com/citations?user=MA8rI0MAAAAJ&hl=en", institution: "2"}
  - {name: "Jiaqi Ma", url: "https://mobility-lab.seas.ucla.edu/about/", institution: "1"}
  - {name: "Bolei Zhou", url: "https://boleizhou.github.io/", institution: "1"}
institutions:
    - {name: "UCLA", institution: "1"}
    - {name: "UCSD", institution: "2"}
    - {name: "Qualcomm", institution: "3"}
nav: false
nav_order: 1
code_link: https://github.com/VAIL-UCLA/BridgeSim
pdf_link: https://arxiv.org/abs/2604.10856
---

<style>
.video-container {
  position: relative;
  max-width: 100%;
  margin: 0 auto 0;
}

.video-container video {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}

.video-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}
.video iframe {
    width: 100%;
    height: 250px;
}

@media (max-width: 600px) {
    .video-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<div class="img-container" style="width: 100%; margin: 0 auto;">
    <img src="../assets/projects/bridgesim/bridgesim_hero.png" class="my-image" alt="Image" />
</div>

## Abstract

Open-loop (OL) to closed-loop (CL) gap (OL-CL gap) exists when OL-pretrained policies scoring high in OL evaluations fail to transfer effectively in closed-loop deployment. In this paper, we unveil the root causes of this systemic failure and propose a practical remedy. Specifically, we demonstrate that OL policies suffer from Observational Domain Shift and Objective Mismatch. We show that while the former is largely recoverable with adaptation techniques, the latter creates a structural inability to model complex reactive behaviors, which forms the primary OL-CL gap. We find that a wide range of OL policies learn a biased Q-value estimator that neglects both the reactive nature of CL simulations and the temporal awareness needed to reduce compounding errors. To this end, we propose a Test-Time Adaptation (TTA) framework that calibrates observational shift, reduces state-action biases, and enforces temporal consistency. Extensive experiments show that TTA effectively mitigates planning biases and yields superior scaling dynamics than its baseline counterparts. Furthermore, our analysis highlights the existence of blind spots in standard OL evaluation protocols that fail to capture the realities of closed-loop deployment.

<!--research-section-splitter-->


## Decomposing OL-CL Gap

<!-- <div class="img-container" style="width: 100%; margin: 0 auto;">
    <img src="../assets/projects/scenestreamer/framework.png" class="my-image" alt="Image" />
</div> -->

We define E2E policy as: 

<div>
$$\bar{\pi}^{d}_{\theta,\phi}(a,z,o \mid s) \triangleq \pi_{\phi}(a\mid z)\,P_\theta(z\mid o)\,\Omega^d(o\mid s)$$
</div>

The root causes of the OL-CL deployment gap are decomposed into two key factors:

- **Observational Domain Shift** occurs when there exists an observational domain shift and the source policy receives collapsed partially observable states in the target simulator.

<div>
$$\Delta_{\mathrm{obs}}(\theta, \phi) \triangleq J(\pi^{\mathrm{source}}_{\theta,\phi}) - J(\pi^{\mathrm{target}}_{\theta,\phi})$$
</div>

<div class="img-container" style="width: 100%; margin: auto auto;">
    <img src="../assets/projects/bridgesim/3.2_empirical.png" class="my-image" alt="Image" />
</div>



- **Objective Mismatch** occurs when OL policies, which is optimized against OL proxy reward during the training time, encounters the CL objective that the learned Q-function gives deviated estimates of true state-action values.

<div>
$$\Delta_{\mathrm{obj}}(\theta) \triangleq J_{k^*}(\bar{\pi}_{\theta, \phi_{\mathrm{CL}}}) - J_{k=H}(\bar{\pi}_{\theta, \phi_{\mathrm{OL}}})$$
</div>

<div class="img-container" style="width: 100%; margin: auto auto;">
    <img src="../assets/projects/bridgesim/3.3_empirical.png" class="my-image" alt="Image" />
</div>

<!--research-section-splitter-->


## Test-time Adaptation (TTA) Framework

We propose a test-time adaptation (TTA) framework to improve closed-loop robustness of pretrained E2E policies without retraining, consisting of an **Observational Calibrator** and a **Test-time Policy Adaptation** procedure.

### Observational Calibrator

Source and target domains induce different latent distributions due to domain-dependent sensing, causing the pretrained policy to receive out-of-distribution representations. We use flow matching to learn a transport map that aligns the source latent distribution to the target, mapping source observations into representations compatible with the downstream policy and effectively recovering open-loop performance.

<div class="img-container" style="width: 100%; margin: auto auto;">
    <img src="../assets/projects/bridgesim/4.1.png" class="my-image" alt="Image" />
</div>

### Test-time Policy Adaptation

**Truncated Q-value Estimation**

Standard Q-value estimation accumulates rewards infinitely, making it intractable under an open-loop model beyond the planning horizon $H$. We introduce a truncated action-value estimator that explicitly cancels the infinite tail:

<div>
$$\hat{Q}^{\pi}(s_t, \mathbf{a}_t) \triangleq R_k(s_t, \mathbf{a}_t) + \gamma^k \mathbb{E} \left[ V^\pi(s_{t+k}) \right] - \gamma^H \mathbb{E} \left[ V^\pi(s_{t+H}) \right]$$
</div>

At each step, the agent selects the candidate trajectory maximizing $\hat{Q}^{\pi}$, dynamically filtering out plans suffering from biased open-loop estimation.

**Adaptive Replan**

Standard test-time scorers operate memorylessly, selecting from the current candidate set at every step and causing action chattering. Instead, we carry forward the unexecuted remainder of the previous plan and retain it unless a new candidate yields a strictly higher estimated return, promoting temporal consistency and reducing unnecessary replanning across consecutive decision steps.

<div class="img-container" style="width: 100%; margin: auto auto;">
    <img src="../assets/projects/bridgesim/4.2.png" class="my-image" alt="Image" />
</div>

<!--research-section-splitter-->

## BridgeSim Simulator

<div class="img-container" style="width: 80%; margin: auto auto;">
    <img src="../assets/projects/bridgesim/bridgesim.png" class="my-image" alt="Image" />
</div>


**BridgeSim** is a unified cross-simulator platform designed to evaluate OL pretrained E2E driving policies within high-fidelity CL environments in the MetaDrive simulator. BridgeSim designs a  Furthermore, BridgeSim offers a flexible deployment setting to simulate open-loop policy with varying execution frequencies and simulation horizons, providing the functional depth necessary for systematic and rigorous diagnosis of OL-CL gap. Consequently, BridgeSim bridges the critical divide between open-loop benchmarks limited to short-term static prediction and existing closed-loop frameworks that often lack the comprehensive functionality and annotations required for complex, reactive stress-testing.

&nbsp;
&nbsp;
:traffic_light: Unified structural framework on low-level control for policy transfer to maintain state-action compatibility across domains

&nbsp;
&nbsp;
:mag: Unified scenario protocol to incorporate diverse map scenarios (e.g., nuPlan, WOMD, and nuScenes) with heterogeneous traffic modes (e.g., log-replay, IDM and adversarial policies) to stress-test E2E driving policies under closed-loop simulation environment.

&nbsp;
&nbsp;
:rocket: Unified open-loop and closed-loop simulation modes and metrics for comprehensive evaluations.


<!--research-section-splitter-->

## Citation

```
@article{zhao2026bridgesim,
 title={BridgeSim: Unveiling the OL-CL Gap in End-to-End Autonomous Driving},
 author={Zhao, Seth Z and Wang, Luobin and Ruan, Hongwei and Bao, Yuxin and Chen, Yilan and Leng, Ziyang and Ravichandran, Abhijit and He, Honglin and Zhou, Zewei and Han, Xu and others},
 journal={arXiv preprint arXiv:2604.10856},
 year={2026}
}
```

