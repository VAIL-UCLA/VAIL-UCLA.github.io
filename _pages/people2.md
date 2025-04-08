---
layout: page
permalink: /team/
title: Team
description: "Meet Our Team Member!"
nav: true
nav_order: 4
---


<section class="our-webcoderskull">
<div class="container">
  <ul class="row">
    {% for member in site.data.team %}
      <li class="col-12 col-md-6 col-lg-4">
            <div class="cnt-block equal-hight">
                <a href="{{ member.link }}">
                          <figure><img src="{{ member.image }}" class="img-responsive" alt="{{ member.name }}" /></figure>
                </a>
                <h6>{{ member.role }}</h6>
                <small>{{ member.affiliation }}</small>
            </div>
      </li>
    {% endfor %}
  </ul>
</div>
</section>