<div align="center">

# 🌟 LiteNeTX Frontend

**React · Vite · Tailwind CSS · Three.js**

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

<br />

🌐 [Live Demo](https://litenetx.in) · 🎥 [Demo](https://youtu.be/wyhVdyEy1v0) · 📝 [Kaggle Writeup](https://www.kaggle.com/writeups/ameyac11/litenetx) · 🔗 [DOI](https://doi.org/10.34740/kaggle/w/86629)

<br />

### 📸 Preview

<table align="center">
  <tr>
    <td align="center" width="50%">
      <a href="https://youtu.be/wyhVdyEy1v0">
        <img src="./assets/lietnetx_thumnail_1.png" alt="LiteNeTX Home Page" width="500" style="border-radius: 12px; border: 1px solid #e5e7eb;" />
      </a>
      <br />
      <sub><b>🏠 Home Page</b> · <a href="https://youtu.be/wyhVdyEy1v0">Watch Demo</a></sub>
    </td>
    <td align="center" width="50%">
      <a href="https://youtu.be/wyhVdyEy1v0">
        <img src="./assets/lietnetx_thumnail_2.png" alt="LiteNeTX Model Playground" width="500" style="border-radius: 12px; border: 1px solid #e5e7eb;" />
      </a>
      <br />
      <sub><b>🧪 Model Playground</b> · <a href="https://youtu.be/wyhVdyEy1v0">Watch Demo</a></sub>
    </td>
  </tr>
</table>

</div>

<br />

The client app for **LiteNeTX** — a lightweight CNN family built entirely from scratch (no pretrained models or transfer learning). Explore architectures, run live inference, and visualize model performance through an interactive web UI.

**Related repository:** [LiteNeTX Backend](https://github.com/ameyac11/LiteNeTX_Backend) — FastAPI inference API that powers this app.

---

## 📖 About

LiteNeTX is a research-driven image classification project with three custom models for **FashionMNIST**, **CIFAR-10**, and **CIFAR-100**. This repo is the React frontend deployed at [litenetx.in](https://litenetx.in); it connects to the backend for uploads, predictions, and example galleries.

| Model | Dataset | Highlights |
|:---|:---|:---|
| LiteNeTX-FMNIST | FashionMNIST | Compact conv blocks · grayscale 28×28 |
| LiteNeTX-C10 | CIFAR-10 | Residual stages · 32×32 RGB |
| LiteNeTX-C100 | CIFAR-100 | Wide SE-ResNet · 100-class head |

**Training hardware:** NVIDIA Tesla T4 ×2 (30 GB VRAM)

---

## ✨ Features

- 🛠️ **Scratch-Built CNNs** — Showcases LiteNeTX models developed from scratch — no pretrained weights
- 🧪 **Model Laboratory** — Interactive playground with upload & real-time inference
- 🏗️ **Architecture Explorer** — Layer-by-layer breakdown of all three LiteNeTX models
- 🌐 **3D Neural Network** — Immersive Three.js visualization of network topology
- 📈 **Performance Insights** — Accuracy & parameter reduction charts vs. baselines
- 📊 **Model Comparison** — Side-by-side specs for FMNIST · CIFAR-10 · CIFAR-100
- 🌓 **Dark / Light Theme** — Polished UI with smooth page transitions
- 📱 **Responsive** — Desktop & mobile ready
- 📡 **Keep-Alive** — Backend warm-up for faster cold-start inference

---

## 🛠️ Tech Stack

| | |
|:---:|:---|
| ⚛️ | **React 18** · TypeScript · Vite |
| 🎨 | **Tailwind CSS** · Radix UI · Framer Motion |
| 🌐 | **React Three Fiber** · Drei · Three.js |
| 🔄 | **React Query** · React Hook Form · Zod |
| 📊 | **Recharts** — performance visualizations |
| 🗺️ | **React Router** · Vercel Analytics |

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Create a `.env` file and point the app at your local or deployed API:

```env
VITE_API_BASE_URL=http://localhost:8000
```

🌐 App → [`http://localhost:8080`](http://localhost:8080)  
⚡ Backend → [LiteNeTX_Backend](https://github.com/ameyac11/LiteNeTX_Backend)

---

## 📜 License

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue?style=for-the-badge)](./LICENSE)

Licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.  
Copyright © 2026 Ameya Sanjay Chopade · See [LICENSE](./LICENSE) for details.
