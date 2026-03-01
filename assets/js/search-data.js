// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-lab",
    title: "Lab",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-awards",
          title: "Awards",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/awards/";
          },
        },{id: "nav-team",
          title: "Team",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/team/";
          },
        },{id: "post-a-post-with-plotly-js",
        
          title: "a post with plotly.js",
        
        description: "this is what included plotly.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/plotly/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-prof-zhou-won-the-nsf-career-award",
          title: 'Prof. Zhou won the NSF CAREER Award.',
          description: "",
          section: "News",},{id: "news-prof-zhou-gave-talks-at-workshop-on-autonomous-driving-wad-and-workshop-on-robot-visual-perception-in-human-crowded-environment-at-cvpr-2024",
          title: 'Prof. Zhou gave talks at Workshop on Autonomous Driving (WAD) and Workshop on...',
          description: "",
          section: "News",},{id: "news-we-co-organized-workshop-on-populating-empty-cities-at-cvpr-2024",
          title: 'We co-organized Workshop on Populating Empty Cities at CVPR 2024.',
          description: "",
          section: "News",},{id: "news-zhenghao-peng-won-the-amazon-fellowship",
          title: 'Zhenghao Peng won the Amazon Fellowship.',
          description: "",
          section: "News",},{id: "news-prof-zhou-won-the-2025-onr-young-investigator-award",
          title: 'Prof. Zhou won the 2025 ONR Young Investigator Award.',
          description: "",
          section: "News",},{id: "news-urban-sim-highlight-vid2sim-and-metavqa-were-accepted-to-cvpr-2025",
          title: 'Urban-Sim (Highlight), Vid2Sim, and MetaVQA were accepted to CVPR 2025.',
          description: "",
          section: "News",},{id: "news-jordan-lin-named-2024-2025-cra-outstanding-undergraduate-researcher-award-finalist",
          title: 'Jordan Lin named 2024–2025 CRA Outstanding Undergraduate Researcher Award Finalist.',
          description: "",
          section: "News",},{id: "news-zhenghao-peng-won-the-dissertation-year-award-dya-at-ucla",
          title: 'Zhenghao Peng won the Dissertation Year Award (DYA) at UCLA.',
          description: "",
          section: "News",},{id: "news-aim-was-accepted-to-icml-2025",
          title: 'AIM was accepted to ICML 2025.',
          description: "",
          section: "News",},{id: "news-prof-zhou-gave-talks-at-synthetic-data-for-computer-vision-workshop-ava-accessbility-vision-and-autonomy-workshop-4th-workshop-on-uncertainty-quantification-for-computer-vision-at-cvpr-2025",
          title: 'Prof. Zhou gave talks at Synthetic Data for Computer Vision Workshop, AVA: Accessbility,...',
          description: "",
          section: "News",},{id: "news-we-co-organized-workshop-on-populating-empty-cities-and-workshop-on-real-to-sim-bridging-the-gap-between-neural-rendering-and-robot-learning-at-cvpr-2025",
          title: 'We co-organized Workshop on Populating Empty Cities and Workshop on Real-to-Sim: Bridging the...',
          description: "",
          section: "News",},{id: "news-x-fusion-and-st-occ-were-accepted-to-iccv-2025",
          title: 'X-Fusion and ST-Occ were accepted to ICCV 2025.',
          description: "",
          section: "News",},{id: "news-we-released-code-for-urban-sim-the-newest-simulator-for-embodied-ai-research-in-urban-micromobility",
          title: 'We released code for Urban-Sim, the newest simulator for embodied AI research in...',
          description: "",
          section: "News",},{id: "news-sicheng-mo-won-the-amazon-ai-fellowship",
          title: 'Sicheng Mo won the Amazon AI Fellowship.',
          description: "",
          section: "News",},{id: "news-honglin-he-won-the-amazon-trainium-fellowship",
          title: 'Honglin He won the Amazon Trainium Fellowship.',
          description: "",
          section: "News",},{id: "news-ppl-spotlight-adv-bmt-and-autovla-were-accepted-to-neurips-2025",
          title: 'PPL (Spotlight), Adv-BMT, and AutoVLA were accepted to NeurIPS 2025.',
          description: "",
          section: "News",},{id: "news-wayne-wu-won-the-2025-chancellor-s-award-for-postdoctoral-research-at-ucla",
          title: 'Wayne Wu won the 2025 Chancellor’s Award for Postdoctoral Research at UCLA.',
          description: "",
          section: "News",},{id: "news-our-lab-is-honored-to-receive-an-nvidia-academic-grant-to-advance-physical-ai-for-micromobility-excited-to-build-our-urban-simulation-with-rtx-pro-6000-jetson-orin-and-ominiverse",
          title: 'Our lab is honored to receive an NVIDIA Academic Grant to Advance Physical...',
          description: "",
          section: "News",},{id: "news-joe-lin-won-the-2025-2026-cra-outstanding-undergraduate-researcher-award-honorable-mention",
          title: 'Joe Lin won the 2025–2026 CRA Outstanding Undergraduate Researcher Award Honorable Mention.',
          description: "",
          section: "News",},{id: "news-josh-s2e-urbanverse-and-scenestreamer-were-accepted-to-iclr-2026",
          title: 'JOSH, S2E, UrbanVerse and SceneStreamer were accepted to ICLR 2026.',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
