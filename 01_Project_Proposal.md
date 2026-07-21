# 01. Project Proposal: LIGHT & SHADOW

**Project Title:** LIGHT & SHADOW (Two Souls. One Heist.)  
**Repository Directory:** `/home/meoclavezz/Projects/P-Game`  
**Phase:** Phase 2 – Requirement Analysis & Feasibility Review  
**Date:** July 2026  

---

## 1. Executive Summary

**LIGHT & SHADOW** is a premium top-down, puzzle-stealth heist game developed for PC, Web, and handheld consoles. Inspired by the responsive stealth dynamics of *Robbery Bob* and the cooperative heist coordination of *Monaco*, the game introduces a dual-character traversal mechanic centered entirely on the physical manipulation of light and shadow.

Players control two spectral thief entities with mutually exclusive navigation rules:
* **Light (The Lightwalker):** Can only traverse terrain illuminated by active light sources. Stepping into shadows is an impassable hazard.
* **Shadow (The Shadowweaver):** Can only traverse dark, unlit areas. Active light beams act as solid, impassable light walls.

By manipulating shifting spotlights, rotating mirrors, pushing shadow-casting crates, and aligning prisms to refract light into colored spectra, players coordinate both characters to bypass security systems, steal high-value artifacts, and reach the exit portal.

---

## 2. Problem Statement & Motivation

Traditional stealth-puzzle titles exhibit mechanical limitations:
1. **Binary Stealth Predictability:** Light usually acts as a simple visibility modifier (hiding in darkness makes you invisible), leaving floor terrain identical regardless of lighting.
2. **Passive Environments:** Players rarely manipulate light optics to *sculpt their own walkable paths* in real-time.
3. **Symmetric Co-op:** Asymmetric characters in puzzle games rarely feature inverse terrain rules where one player's path is the other's hazard.

**LIGHT & SHADOW** resolves these issues by turning light rays into dynamic physical paths for Light and physical barriers for Shadow.

---

## 3. Scope & Key Features

* **Dual-Character Mechanics:** Seamless character swapping (`Tab` / `Space`) or local co-op.
* **Real-Time 2D Raycasting Engine:** Fast visibility polygon calculations supporting dynamic light sources, rotatable mirrors, and prisms.
* **Prism Spectrum Refraction:** Splitting white light into Red, Green, and Blue rays to activate color-coded receptors and gates.
* **Interactive Guard AI:** Lumen Guards patrol lit zones; Nyx Guards patrol dark zones and can be temporarily stunned by redirected light beams.
* **Anti-Frustration Features:** 0.5s grace period and instant tactical rewind (`Z` key).
* **Glassmorphism Noir UI & Web Audio Sound Design:** High-contrast aesthetics with dynamic sound synthesis.

---

## 4. Phase 2 Objectives

This document forms part of the Phase 2 submission package, establishing the system functional/non-functional requirements, literature survey, feasibility study, and work allocation, backed by a fully functional web prototype.
