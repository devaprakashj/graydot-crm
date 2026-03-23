# 🚀 GrayDot OS - Deployment Guide (GitHub & Vercel)

Follow these steps to host your GrayDot CRM on the web for free!

---

## 🛠️ Phase 1: Push to GitHub

1.  **Open Terminal** in your project folder (`c:\GrayDot Team Members`).
2.  **Initialize Git:**
    ```bash
    git init
    ```
3.  **Add all files:**
    ```bash
    git add .
    ```
4.  **Create your first commit:**
    ```bash
    git commit -m "Initial commit for GrayDot OS CRM"
    ```
5.  **Create a New Repository on GitHub:**
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `graydot-crm`.
    *   Set it to **Private** for internal company security.
6.  **Connect Local to GitHub:**
    *(Replace 'USERNAME' with your GitHub username)*
    ```bash
    git remote add origin https://github.com/USERNAME/graydot-crm.git
    git branch -M main
    git push -u origin main
    ```

---

## 🏗️ Phase 2: Deploy to Vercel

1.  **Sign in to Vercel:** Go to [vercel.com](https://vercel.com) and sign up with your **GitHub account**.
2.  **Import Project:**
    *   Click **"Add New"** -> **"Project"**.
    *   Find your `graydot-crm` repository and click **Import**.
3.  **Configure Build Settings:**
    *   Vercel usually auto-detects Vite/Next.js. 
    *   Ensure the **Root Directory** is `./`.
4.  **Important: Environment Variables**
    *   If you have any specific API URLs in a `.env` file, click **Environment Variables** and add them (e.g., `VITE_API_URL`).
5.  **Deploy:** Click **Deploy**. In ~1 minute, your site is LIVE!

---

## 🔄 How to Update Your CRM
Whenever you make a change in the code, just run these 3 commands:
```bash
git add .
git commit -m "Update: [Brief description of change]"
git push origin main
```
*Vercel will automatically re-deploy your site within seconds of every push!* ⚡

---
*Created with care by the GrayDot Dev Team.*
