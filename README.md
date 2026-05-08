# 🌐 Personal Website & Portfolio

## 📌 Overview

This repository contains the source code for my personal website and portfolio.

As a software engineering student, I wanted a real place on the web that is mine: somewhere to document what I build, what I learn, and how I think. Not just a CV, but a living record of my growth as a developer. This site is that place.

The site runs entirely on the client side, with no build step, no local dependencies, and no server required.


## 🎯 Objectives

* Build a professional personal portfolio
* Showcase academic and personal projects
* Create a platform for continuous updates and experimentation


## 📈 Personal Development Goals

* Improve front-end development skills
* Experiment with UI/UX design
* Explore modern web technologies and best practices
* Deploy a real-world web project


## 📝 Why Markdown-Based Content

One of the core decisions in this project was to drive all content, blog posts and projects, through plain `.md` files instead of dedicated HTML pages.

The reason is simple: without this system, adding a new project or writing a new post would mean creating a new HTML page from scratch every single time, wiring up the layout, the styles, the navigation. That gets old fast, and it creates a maintenance nightmare as the site grows.

With this approach, adding a new project is just writing a `.md` file and registering its ID in a JSON index. The content engine picks it up, parses the frontmatter, renders the Markdown, and injects everything into a single shared template. One page to maintain, infinite content to add.

It also means content stays completely separate from presentation. Rewriting the layout does not touch the content, and writing new content does not touch a single line of HTML or CSS.


## 🚀 Features

* Fully responsive design (desktop, tablet, mobile)
* Markdown-based content system: posts and projects are written in `.md` files and rendered dynamically, with no new HTML page required per entry
* Dedicated sections:
  * Home
  * About Me
  * Projects / Portfolio
  * Blog
  * Services
  * Uses
  * Contact
* Clean and modern user interface
* Easy navigation and structured layout


## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (vanilla)
* [marked.js](https://marked.js.org/) for Markdown rendering (loaded via CDN)
* Google Fonts: Bebas Neue + Epilogue + DM Mono


## 📁 Project Structure

```
MyWebsite/
├── index.html                        → Homepage
├── pages/
│   ├── about.html                    → About me
│   ├── projects.html                 → Projects list (dynamic)
│   ├── project-detail.html           → Individual project page (dynamic)
│   ├── blog.html                     → Blog post list (dynamic)
│   ├── blog-post.html                → Individual blog post (dynamic)
│   ├── services.html                 → Services
│   ├── uses.html                     → Setup & tools
│   ├── contact.html                  → Contact
│   └── 404.html                      → Error page
├── assets/
│   ├── css/
│   │   ├── style.css                 → Global styles and CSS variables
│   │   ├── content.css               → Content block styles
│   │   └── responsive.css            → Media queries
│   ├── js/
│   │   ├── script.js                 → UI (nav, animations, counters, etc.)
│   │   └── content-engine.js         → Content engine (reads .md, renders)
│   └── images/
│       └── projects/                 → Project images (one folder per project)
├── content/
│   ├── posts/                        → Blog post .md files
│   └── projects/                     → Project .md files
├── data/
│   ├── posts-index.json              → Post ID list
│   └── projects-index.json           → Project ID list
└── README.md
```


## 🌍 Deployment

This website is deployed using **GitHub Pages**.

🔗 Live version: [https://tiagocabaca.github.io](https://tiagocabaca.github.io)


## 📸 Preview

> *(Under construction)*


## 📈 Future Improvements

* Add dynamic project filtering
* Improve animations and interactions
* Optimize performance and SEO


## 🧠 Development Approach

This project follows a modular and scalable structure, allowing easy maintenance and future expansion.

The development focuses on:

* Clean and readable code
* Separation of concerns (HTML / CSS / JS)
* Reusability of components
* User experience and accessibility


## 📄 License

This project is licensed under the MIT License.

⚠️ Note:
The design, content, and branding of this website are personal and should not be copied, reproduced, or reused without explicit permission.


## 👤 Author

**Tiago Cabaça**, also known as **CabacadosInformaticos**

* GitHub: [https://github.com/Cabacadosinformaticos](https://github.com/Cabacadosinformaticos)
* LinkedIn: *(coming soon)*


## ⭐ Notes

This project is continuously evolving and will be updated with new features, improvements, and design changes over time.
