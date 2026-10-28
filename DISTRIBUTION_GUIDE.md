# 🚀 VidFlow — Commercial Desktop & Android Distribution Guide

Developed by **ZapyTeam** (WhatsApp: `+8801911444546`)

---

## 📌 ১. ওভারভিউ ও নতুন আপগ্রেডসমূহ (Summary of Implemented Architecture)

VidFlow এখন একটি পূর্ণাঙ্গ কমার্শিয়াল আর্কিটেকচারে রূপান্তরিত হয়েছে:
1. **অডিও সহ ক্রিস্টাল-ক্লিয়ার এক্সপোর্ট ইঞ্জিন:** [exporter.ts](file:///d:/MotionClinic/src/services/exporter.ts)-এ Web Audio API ইন্টিগ্রেট করা হয়েছে। ফলে ভয়েসওভার ও ব্যাকগ্রাউন্ড মিউজিক সহ MP4 ও WebM ভিডিও এক্সপোর্ট হয়।
2. **সেন্ট্রাল ক্লাউড লাইসেন্সিং ও সিকিউর এআই প্রক্সি সার্ভার:** [server/](file:///d:/MotionClinic/server)-এ নোড/এক্সপ্রেস ব্যাকএন্ড তৈরি করা হয়েছে যা লাইসেন্স কী যাচাই, হার্ডওয়্যার ডিভাইস লিমিট বাইন্ডিং, bKash/Nagad পেমেন্ট ও সার্ভার-সাইড মাস্টার AI কী প্রটেকশন হ্যান্ডেল করে।
3. **অ্যাডমিন প্যানেল প্রটেকশন (Master PIN Gate):** [AdminPinModal.tsx](file:///d:/MotionClinic/src/studio/components/AdminPinModal.tsx) দিয়ে অ্যাডমিন প্যানেল লক করা হয়েছে। মাস্টার পিন ছাড়া কেউ লাইসেন্স জেনারেট বা রেভিনিউ দেখতে পারবে না (ডিফল্ট মাস্টার পিন: `7788`)।
4. **অ্যান্ড্রয়েড ও মোবাইল রেসপনসিভ লেআউট:** [VidFlowApp.tsx](file:///d:/MotionClinic/src/studio/VidFlowApp.tsx)-এ অ্যান্ড্রয়েড ফোন ও ট্যাবলেটের জন্য টাচ-ফ্রেন্ডলি বটম ন্যাভিগেশন বার (`Canvas`, `Timeline`, `Inspector`, `AI Prompt`) যুক্ত করা হয়েছে।
5. **Tauri v2 ডেস্কটপ ও অ্যান্ড্রয়েড সাপোর্ট:** [src-tauri/Cargo.toml](file:///d:/MotionClinic/src-tauri/Cargo.toml), [src-tauri/src/lib.rs](file:///d:/MotionClinic/src-tauri/src/lib.rs), এবং [.github/workflows/build-desktop-android.yml](file:///d:/MotionClinic/.github/workflows/build-desktop-android.yml) প্রস্তুত করা হয়েছে।

---

## 💻 ২. Desktop Software (.exe / .msi) বিতরণ প্রক্রিয়া

### অপশন A: GitHub Actions দিয়ে ১-ক্লিক অটো বিল্ড (প্রস্তাবিত)
আপনার প্রজেক্টে [.github/workflows/build-desktop-android.yml](file:///d:/MotionClinic/.github/workflows/build-desktop-android.yml) রয়েছে। 
* আপনি যখন গিটহাবে কোড পুশ করবেন অথবা গিটহাবে রিলিজ ট্যাগ (যেমন: `v1.0.0`) দিবেন, GitHub Actions স্বয়ংক্রিয়ভাবে ক্লাউডে Windows `.exe` ও `.msi` তৈরি করে দেবে।
* GitHub Releases থেকে সরাসরি ফাইলটি ডাউনলোড করে কাস্টমারকে দিতে পারবেন।

### অপশন B: লোকাল মেশিনে বিল্ড
মেশিনে Rust ইনস্টল থাকলে:
```bash
npm run tauri build
```
ফাইল তৈরি হবে:
`src-tauri/target/release/bundle/msi/VidFlow_1.0.0_x64_en-US.msi`

---

## 📱 ৩. Android Software (.apk / .aab) বিতরণ প্রক্রিয়া

### অপশন A: GitHub Actions অটোমেটিক APK জেনারেশন
একই CI/CD পাইপলাইনে Android NDK ও Rust আর্কিটেকচার সেটআপ রয়েছে। এটি সরাসরি `arm64-v8a` এবং ইউনিভার্সাল রিলিজ `.apk` ফাইল তৈরি করে GitHub Artifacts-এ আপলোড করে দেবে।

### অপশন B: লোকাল পিসিতে Android Studio / CLI দিয়ে বিল্ড
আপনার পিসিতে Android Studio এবং NDK ইনস্টল থাকলে:
```bash
# ১. অ্যান্ড্রয়েড প্ল্যাটফর্ম শুরু করা
npm run tauri:android init

# ২. রিলিজ APK বিল্ড করা
npm run tauri:android build -- --apk
```
ফাইল তৈরি হবে:
`src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk`
এই APK ফাইলটি সরাসরি যেকোনো অ্যান্ড্রয়েড স্মার্টফোনে ইনস্টল করা যাবে এবং Google Play Store-এ আপলোড করতে চাইলে `--aab` দিয়ে `.aab` বান্ডেল তৈরি করতে পারবেন।

---

## 🌐 ৪. ক্লাউড ব্যাকএন্ড ও লাইসেন্সিং সার্ভার ডিপ্লয়মেন্ট

VidFlow Cloud Server ফোল্ডার: `server/`

### লোকাল টেস্ট রান:
```bash
npm run server:dev
# সার্ভার চালু হবে: http://localhost:4000
```

### যেকোনো ফ্রি ক্লাউড বা VPS-এ ডিপ্লয় (Render / Railway / VPS):
1. `server/.env.example` কে `.env` করে আপনার Gemini API Key বসান:
   ```env
   PORT=4000
   GEMINI_API_KEY=your_actual_gemini_api_key
   ADMIN_PIN=7788
   ```
2. Render.com বা Railway-তে নতুন Web Service হিসেবে `server/` ডিরেক্টরি লিংক করে দিন।
3. বিল্ড কমান্ড: `npm install && npm run build`
4. স্টার্ট কমান্ড: `npm run start`

---

## 🔒 ৫. সিকিউরিটি ও লাইসেন্সিং কি-পয়েন্টস

* **অফলাইন সাপোর্ট:** কাস্টমার প্রথমবার ইন্টারনেট কানেকশন দিয়ে লাইসেন্স কী ভ্যালিডেট করলে তা ডিভাইসের হার্ডওয়্যার আইডির সাথে এনক্রিপ্টেড হয়ে ক্যাশ থাকবে। এরপর নেট ছাড়াও সফটওয়্যার চলবে।
* **ডিভাইস লিমিটেশন:** প্রো প্ল্যানে সর্বোচ্চ ২টি ডিভাইস, এজেন্সি প্ল্যানে ১০টি ডিভাইস লক এনফোর্সড।
* **মাস্টার অ্যাডমিন পিন:** `7788` (যা আপনি `VidFlowApp.tsx` বা ব্যাকএন্ডের `.env`-এ পরিবর্তন করতে পারবেন)।
