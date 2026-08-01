---
layout: page
permalink: /team/
title: Team
nav: true
nav_order: 5
_styles: >
  .post-header { display: none; }
---


<section class="our-webcoderskull">
<div class="container-fluid">
  {% assign role_groups = site.data.team | group_by: 'role' %}
  {% assign total_groups = role_groups.size %}
  {% assign current_group = 0 %}
  {% assign alumni_groups = '' %}
  {% assign alumni_count = 0 %}
  
  {% for group in role_groups %}
    {% unless group.name contains 'Alumni' %}
      {% assign current_group = current_group | plus: 1 %}
      <h3 class="text-left mb-1" style="margin-bottom: 0.5rem;">{{ group.name }}</h3>
      {% if current_group < total_groups %}
        <ul class="row mb-0" style="margin-bottom: 1rem !important;">
      {% else %}
        <ul class="row" style="margin-bottom: 0 !important;">
      {% endif %}
        {% for member in group.items %}
          <li class="col-12 col-md-3 col-lg-3 mb-2">
                <div class="cnt-block equal-hight" style="padding: 15px 10px; margin-bottom: 0;">
                    {% if member.link and member.link != false and member.link != "" %}
                    <a href="{{ member.link }}" target="_blank">
                              <figure><img src="{{ member.image }}" class="img-responsive" alt="{{ member.name }}" /></figure>
                    </a>
                    {% else %}
                              <figure><img src="{{ member.image }}" class="img-responsive" alt="{{ member.name }}" /></figure>
                    {% endif %}
                    <div style="text-align: center;">
                        {% if member.link and member.link != false and member.link != "" %}
                        <h6><a href="{{ member.link }}" target="_blank" style="text-decoration: none;">{{ member.name }}</a></h6>
                        {% else %}
                        <h6 style="color: var(--global-text-color);">{{ member.name }}</h6>
                        {% endif %}
                    </div>
                    {% unless member.affiliation == "UCLA" %}
                    <small>{{ member.affiliation }}</small>
                    {% endunless %}
                </div>
          </li>
        {% endfor %}
      </ul>
    {% endunless %}
  {% endfor %}
  
  {% comment %} Handle Alumni section separately with subsections {% endcomment %}
  {% assign alumni_groups = '' %}
  {% for group in role_groups %}
    {% if group.name contains 'Alumni' %}
      {% assign alumni_groups = alumni_groups | append: group.name | append: ',' %}
    {% endif %}
  {% endfor %}
  
  {% if alumni_groups != '' %}
    <h3 class="text-left mb-1" style="margin-top: 1rem; margin-bottom: 0.5rem;">Alumni</h3>
    {% assign alumni_array = alumni_groups | split: ',' %}
    {% for alumni_group_name in alumni_array %}
      {% if alumni_group_name != '' %}
        {% for group in role_groups %}
                   {% if group.name == alumni_group_name %}
          <h5 class="text-left mb-2" style="color: var(--global-text-color); font-size: 1em; font-weight: 400; margin-top: 1rem; margin-bottom: 0.5rem;">• {{ group.name | replace: 'Alumni - ', '' }}:</h5>
            <ul style="list-style-type: none; padding-left: 1rem; margin-bottom: 1.5rem; line-height: 1.3;">
              {% for member in group.items %}
                <li style="margin-bottom: 0.1rem;">
                  {% if member.link and member.link != false and member.link != "" %}
                    <a href="{{ member.link }}" target="_blank" style="text-decoration: none;">{{ member.name }}</a>
                  {% else %}
                    {{ member.name }}
                  {% endif %}
                  {% if member.year %}
                    ({{ member.year }}{% if member.affiliation and member.affiliation != "UCLA" %}, {% endif %}
                  {% endif %}
                  {% if member.affiliation and member.affiliation != "UCLA" %}
                    {% unless member.year %}({% endunless %}{{ member.affiliation }})
                  {% elsif member.year %}
                    )
                  {% endif %}
                </li>
              {% endfor %}
            </ul>
          {% endif %}
        {% endfor %}
      {% endif %}
    {% endfor %}
  {% endif %}
</div>



</section>