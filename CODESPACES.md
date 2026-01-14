# 🚀 GitHub Codespaces Setup Guide for ToraShaout

**Perfect for developers without a local machine!** GitHub Codespaces gives you a full development environment in your browser.

---

## 🎯 What is GitHub Codespaces?

A **cloud-based development environment** that runs VS Code in your browser. You get:
- ✅ Full Linux environment
- ✅ Node.js 18 pre-installed
- ✅ VS Code with extensions
- ✅ Terminal access
- ✅ Port forwarding (to view your app)
- ✅ **60 hours FREE per month** (on free plan)

---

## 📋 Prerequisites

1. **GitHub Account** (free)
   - If you don't have one: https://github.com/signup

2. **Internet Connection**
   - Any device with a browser (PC, Mac, tablet, even Chromebook)

That's it! No other software needed.

---

## 🚀 STEP-BY-STEP SETUP

### **Step 1: Create GitHub Repository**

1. **Go to GitHub**: https://github.com
2. **Click** the "+" icon (top right) → "New repository"
3. **Fill in**:
   ```
   Repository name: torashaout
   Description: Celebrity video marketplace for Zimbabwe
   Privacy: Private (recommended) or Public
   ✅ Add a README file
   ```
4. **Click** "Create repository"

---

### **Step 2: Upload Your Project**

**Option A: Via Web Interface (Easiest)**

1. **Download** the `torashaout-nextjs.tar.gz` file I gave you
2. **Extract it** on your computer
3. **In your GitHub repo**, click "Add file" → "Upload files"
4. **Drag and drop** all files from the `torashaout-nextjs` folder
5. **Important**: Make sure you upload:
   - All `.tsx`, `.ts`, `.json` files
   - The `.devcontainer` folder (this is crucial!)
   - The `.vscode` folder
   - All documentation files
6. **Add commit message**: "Initial commit - ToraShaout frontend"
7. **Click** "Commit changes"

**Option B: Via Git (If you have Git locally)**

```bash
# Extract the archive
tar -xzf torashaout-nextjs.tar.gz
cd torashaout-nextjs

# Initialize git
git init
git add .
git commit -m "Initial commit - ToraShaout frontend"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/torashaout.git
git branch -M main
git push -u origin main
```

---

### **Step 3: Launch Codespaces**

1. **Go to your repository** on GitHub
2. **Click** the green "Code" button
3. **Switch to "Codespaces" tab**
4. **Click** "Create codespace on main"

**Wait 2-3 minutes** while GitHub:
- Creates your environment
- Installs Node.js 18
- Runs `npm install` automatically
- Sets up VS Code extensions
- Creates `.env.local` from template

---

### **Step 4: Verify Setup**

Once Codespaces loads, you should see:

1. **VS Code in browser** with your code
2. **Terminal at bottom** (if not visible, press `` Ctrl+` ``)
3. **Message**: "🎬 ToraShaout is ready! Run: npm run dev"

---

### **Step 5: Start Development Server**

In the terminal, type:

```bash
npm run dev
```

**You'll see**:
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Network:      http://0.0.0.0:3000

✓ Ready in 2.3s
```

**A popup will appear**: "Your application running on port 3000 is available"
- **Click** "Open in Browser"

**🎉 Your ToraShaout app is now LIVE!**

---

## 🎨 What You'll See in Codespaces

### **Left Sidebar**
- 📁 **Explorer**: All your project files
- 🔍 **Search**: Find across all files
- 🔄 **Source Control**: Git integration
- 🐛 **Debug**: Debugging tools

### **Main Area**
- **Editor**: Write your code
- **Tabs**: Multiple files open

### **Bottom**
- **Terminal**: Run commands (like `npm run dev`)
- **Problems**: TypeScript errors
- **Output**: Build logs
- **Debug Console**: Runtime logs

---

## 💡 Essential Codespaces Commands

### **Start Development Server**
```bash
npm run dev
```
Opens on port 3000 (automatically forwarded)

### **Stop Server**
Press `Ctrl+C` in terminal

### **Install New Package**
```bash
npm install package-name
```

### **Run TypeScript Check**
```bash
npm run lint
```

### **Build for Production**
```bash
npm run build
```

---

## 🔧 Editing Your Code

### **Open a File**
1. Click on any file in the left sidebar (e.g., `app/page.tsx`)
2. Edit the code
3. Save with `Ctrl+S` (Windows) or `Cmd+S` (Mac)
4. **The page auto-refreshes!** (Hot Module Replacement)

### **Example Edit**

1. **Open** `app/page.tsx`
2. **Find** line with "Your Favorite Stars"
3. **Change** to "Zimbabwe's Biggest Stars"
4. **Save** - see instant update in browser!

---

## 📱 Viewing on Mobile

1. **Click** "Ports" tab (bottom panel)
2. **Find** port 3000
3. **Right-click** → "Port Visibility" → "Public"
4. **Copy** the URL (looks like: `https://xxxxx-3000.app.github.dev`)
5. **Open** on your phone/tablet

---

## 🔒 Security: Environment Variables

Your `.env.local` file is created automatically but **needs your API keys**.

### **To Edit Environment Variables**:

1. **Open** `.env.local` in the editor
2. **Replace** placeholder values:
   ```env
   # Before
   PAYNOW_INTEGRATION_ID=your_integration_id
   
   # After (example)
   PAYNOW_INTEGRATION_ID=12345
   ```
3. **Save** the file
4. **Restart** the dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

**⚠️ IMPORTANT**: Never commit `.env.local` to Git!
(It's already in `.gitignore`)

---

## 💾 Saving Your Work

Codespaces **auto-saves** your files, but to commit to Git:

1. **Click** Source Control icon (left sidebar)
2. **Review** changed files
3. **Type** commit message (e.g., "Updated hero section")
4. **Click** ✓ (checkmark) to commit
5. **Click** "Sync Changes" to push to GitHub

---

## ⏸️ Pausing & Resuming

### **When You're Done Working**:
Just close the browser tab. Codespaces will:
- Auto-save your work
- Stop after 30 minutes of inactivity
- **You don't lose anything!**

### **To Resume**:
1. Go to https://github.com/codespaces
2. **Click** on your codespace
3. **Everything is exactly as you left it!**

---

## 💰 GitHub Codespaces Pricing

### **Free Tier** (What You Get)
- **60 hours/month** of usage
- **15 GB storage**
- **2-core machine** (perfect for ToraShaout)

### **Usage Tips to Stay Free**:
- Stop codespace when not working (closes auto after 30 min)
- Use prebuilds (we've configured this)
- Delete old codespaces you don't need

### **If You Need More**:
- $0.18/hour for additional time
- Still **way cheaper** than buying a dev machine!

**Check usage**: https://github.com/settings/billing

---

## 🐛 Troubleshooting

### **"npm install failed"**
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm install
```

### **"Port 3000 already in use"**
```bash
# Kill the process
npx kill-port 3000
npm run dev
```

### **"Can't see my changes"**
1. Make sure you saved the file (`Ctrl+S`)
2. Check terminal for errors
3. Hard refresh browser (`Ctrl+Shift+R`)

### **"Codespace won't start"**
1. Check GitHub status: https://www.githubstatus.com
2. Try creating a new codespace
3. Contact GitHub support (free, very responsive)

---

## 📚 Useful VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Quick file open |
| `Ctrl+Shift+P` | Command palette |
| ``Ctrl+` `` | Toggle terminal |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+/` | Comment/uncomment |
| `Alt+Up/Down` | Move line up/down |
| `Ctrl+D` | Select next occurrence |
| `Ctrl+F` | Find in file |
| `Ctrl+Shift+F` | Find in all files |

---

## 🎯 Next Steps in Codespaces

### **1. Explore the Code**
- Open `app/page.tsx` - main landing page
- Open `components/TalentCard.tsx` - see how cards work
- Open `types/index.ts` - see data structure

### **2. Make a Small Change**
- Edit the hero text
- Change a color in `tailwind.config.ts`
- Add a new category to `lib/mock-data.ts`

### **3. Preview Changes**
- Run `npm run dev`
- Open the forwarded port
- See your changes live!

### **4. Learn Next.js**
- Docs: https://nextjs.org/docs
- Everything works the same in Codespaces!

---

## 🚀 Advanced: Running Backend in Codespaces

Later, when we build your NestJS backend:

```bash
# In the same Codespace
cd ../
git clone https://github.com/YOUR_USERNAME/torashaout-backend.git
cd torashaout-backend
npm install
npm run start:dev
```

Port 4000 will auto-forward for your API! 🎉

---

## 📞 Need Help?

### **Common Resources**:
- **Codespaces Docs**: https://docs.github.com/en/codespaces
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

### **Ask Me**:
If you get stuck, just tell me:
1. What you were trying to do
2. What error you see
3. Screenshot if possible

I'll help you fix it! 🤝

---

## ✅ Setup Checklist

Before you start coding, verify:

- [ ] Created GitHub account
- [ ] Created repository (public or private)
- [ ] Uploaded all project files (including `.devcontainer`)
- [ ] Created codespace
- [ ] Saw "ToraShaout is ready!" message
- [ ] Ran `npm run dev`
- [ ] Opened app in browser (port 3000)
- [ ] Can see the landing page
- [ ] Made a test edit and saw it update

---

## 🎉 You're Ready!

**GitHub Codespaces gives you a full development environment** without needing a powerful computer. You can code from:
- Old laptop
- Chromebook
- Tablet with keyboard
- Even a phone (though not ideal)

**Your code lives in the cloud, accessible anywhere!** 🌍

---

## 🔜 What's Next?

Once you're comfortable in Codespaces:

1. **Tell me what page to build next**
   - Talent profile page?
   - Booking form?
   - Dashboard?

2. **We'll add features together**
   - I'll create the code
   - You test it in Codespaces
   - We iterate until perfect

3. **Deploy to production**
   - Connect to Vercel from Codespaces
   - Push to live in minutes

**Let's build ToraShaout together! 🚀**

---

**Questions? Just ask! I'm here to help you succeed.** 💪
