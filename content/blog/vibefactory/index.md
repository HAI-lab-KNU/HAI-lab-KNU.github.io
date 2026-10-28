---
title: "VibeFactory: Conversational and Visual App Creation for Non-Programmers"
date: "2026-10-28"
description: "VibeFactory is an ongoing research project exploring how people without programming experience can create and iteratively refine native Android apps through conversation and visual annotations. Users describe their goals, attach reference images, and review a clarified specification before requesting app generation. An Android host app brings together conversations, build progress, APK downloads, and a visual editing tool. In an interface preview, users can mark elements to delete, move, change, or add, combining these annotations with sketches, reference images, and written explanations. A FastAPI server prepares task-specific instructions and coordinates Codex CLI to generate Kotlin and Android Views/XML source code. The server checks and builds the generated project, delivers an installable APK, and preserves source revisions and previous successful builds for subsequent updates. Common runtime components support server-managed AI features, app data storage, and error reporting. When the host receives an execution error from a generated app, users can confirm a follow-up repair request. The project focuses on supporting the broader process of specifying, trying, and revising personal software beyond the initial generation of code."
thumbnail: "/images/vibefactory-overview.svg"
people:
  - name: "Jungmin Lee"
    affiliation: "Kangwon National University"
    photo: "/images/members/jungmin-lee.png"
    homepage: "https://lsom5064.github.io/"
tags: ["Human-Computer Interaction", "Human-AI Interaction", "End-User Programming", "LLM"]
---
