# 🎬 VidFlow — AI-Native Motion Graphics Studio & SaaS

<p align="center">
  <strong>High-Performance Motion Graphics, Ad Reels & Explainer Video Software for Desktop & Android</strong><br>
  <em>Developed by ZapyTeam (WhatsApp: +8801911444546)</em>
</p>

---

## ✨ Features

- ⚡ **AI-Powered Prompt-to-Motion:** Generate mathematically precise motion graphics scenes instantly with Google Gemini 3.8 Flash & Claude 3.5 Sonnet.
- 🎨 **Bangla & English Kinetic Typography:** First-class support for Bengali fonts (*Hind Siliguri*, *Tiro Bangla*) and English typography (*Outfit*, *Inter*, *JetBrains Mono*).
- 📱 **Multi-Platform Support:** Ready for **Windows Desktop (.exe / .msi)**, **macOS**, and **Android (.apk / .aab)** with responsive touch UI.
- ⏱️ **Interactive WYSIWYG Timeline:** Real-time scrubbing, multi-track sequencing, and element transformation.
- 🔊 **Web Audio Synchronized Exporter:** Frame-accurate video export with voiceover tracks, background music ducking, and sound design SFX in MP4/WebM.
- 🔒 **SaaS Licensing & Security:** Central cloud licensing server with hardware machine locking (HWID), bKash/Nagad/Stripe checkout, and PIN-protected Admin Commander (`7788`).

---

## 🚀 Quick Start

### 1. Run the Studio (Vite Development)
```bash
npm install
npm run app
```
The studio opens at `http://localhost:5173`.

### 2. Run the Cloud Licensing & AI Proxy Server
```bash
npm run server:dev
```
The backend API starts at `http://localhost:4000`.

### 3. Build Web Studio
```bash
npm run build:app
```

---

## 📦 Building Desktop & Android Apps

### Windows Desktop App
```bash
npm run tauri build
```
Generates `.msi` and `.exe` under `src-tauri/target/release/bundle/msi/`.

### Android Mobile App
```bash
npm run tauri:android init
npm run tauri:android build -- --apk
```
Generates `.apk` under `src-tauri/gen/android/app/build/outputs/apk/universal/release/`.

---

## 🛠️ Automated Cloud Releases (CI/CD)
Push code or create a tag (e.g., `v1.0.0`) on GitHub, and GitHub Actions automatically builds release artifacts:
- Windows `.msi` / `.exe`
- Android Universal `.apk`

For complete setup and licensing guides, see [DISTRIBUTION_GUIDE.md](DISTRIBUTION_GUIDE.md).

---

## 📄 License & Credits
Developed by **ZapyTeam**  
Direct WhatsApp: [+8801911444546](https://wa.me/8801911444546)
