# ⚡ CODESPACES QUICKSTART - Get Running in 5 Minutes

**Perfect for: Developers without a local development machine**

---

## ✅ What You Need

1. **A GitHub account** (free) - Sign up at https://github.com/signup
2. **A browser** (Chrome, Firefox, Safari, Edge)
3. **Internet connection**

**That's it!** No Node.js, no code editor, no terminal required.

---

## 🚀 5-MINUTE SETUP

### **Step 1: Create GitHub Repository (1 minute)**

1. Go to https://github.com
2. Click **"+"** (top right) → **"New repository"**
3. Fill in:
   - **Name**: `torashaout`
   - **Description**: `Celebrity video marketplace for Zimbabwe`
   - **Privacy**: Private (recommended)
   - ✅ **Check** "Add a README file"
4. Click **"Create repository"**

---

### **Step 2: Upload Project (2 minutes)**

1. **Download** `torashaout-nextjs-codespaces.tar.gz` (the file I gave you)
2. **Extract** it (right-click → Extract on Windows, double-click on Mac)
3. **In your GitHub repo**, click **"Add file"** → **"Upload files"**
4. **Drag ALL folders and files** from `torashaout-nextjs` into the upload area
   
   **✅ IMPORTANT**: Make sure these folders are included:
   - `.devcontainer` (has Codespaces config)
   - `.vscode` (has editor settings)
   - `app` (your pages)
   - `components` (UI components)
   - `lib` (utilities)
   - `types` (TypeScript)
   - All `.md` files (documentation)
   
5. **Scroll down**, add message: `Initial commit - ToraShaout with Codespaces`
6. Click **"Commit changes"**

**⏳ Wait** for upload to complete (green checkmark appears)

---

### **Step 3: Launch Codespaces (2 minutes)**

1. **Click** the green **"Code"** button (top right of repo)
2. **Switch** to the **"Codespaces"** tab
3. **Click** **"Create codespace on main"**

**☕ Now wait 2-3 minutes** while GitHub:
- Creates your cloud computer
- Installs Node.js 18
- Runs `npm install` (downloads 1000+ packages)
- Sets up VS Code extensions
- Copies `.env.example` to `.env.local`

**You'll see**:
- Blue loading screen → "Setting up your codespace"
- Progress messages: "Installing dependencies..."
- Finally: VS Code opens in your browser!

**✅ Success indicator**: Terminal shows "🎬 ToraShaout is ready! Run: npm run dev"

---

## 🎉 YOU'RE IN! Now What?

### **See Your App Running**

In the terminal (bottom of screen), type:

```bash
npm run dev
```

Press **Enter**

**Wait 10-15 seconds**, then you'll see:
```
✓ Ready in 2.1s
○ Compiling / ...
✓ Compiled / in 3.2s
```

**A popup appears**: "Your application running on port 3000 is available"

Click **"Open in Browser"**

**🎊 BOOM!** Your ToraShaout landing page is LIVE!

---

## 🎨 Make Your First Edit

Let's prove this is real - change something!

### **In Codespaces**:

1. **Left sidebar** → Click `app` folder
2. **Click** `page.tsx` to open it
3. **Find** line 45 (approx) that says:
   ```tsx
   <h1 className="text-5xl...">
     Your Favorite
   ```
4. **Change** "Your Favorite" to **"Zimbabwe's Biggest"**
5. **Save**: Press `Ctrl+S` (Windows) or `Cmd+S` (Mac)

### **In Your Browser Tab** (with the running app):

**Watch the text change INSTANTLY!** 🎉

This is called **Hot Module Replacement** - every edit updates live.

---

## 📱 View on Your Phone

Want to show someone on mobile?

1. **Bottom panel** → Click **"Ports"** tab
2. **Find** port `3000`
3. **Right-click** → **"Port Visibility"** → **"Public"**
4. **Copy** the URL (looks like: `https://abcd1234-3000.app.github.dev`)
5. **Open** that URL on your phone

**Now anyone can see your app!** (while Codespace is running)

---

## 💾 Save Your Work (Git Commit)

After making changes:

1. **Click** the **Source Control** icon (left sidebar, looks like a branch)
2. **See** your changed files listed
3. **Type** a message: "Updated hero text"
4. **Click** the **✓ checkmark** to commit
5. **Click** "Sync Changes" to push to GitHub

**Your code is now backed up!** 💪

---

## ⏸️ Taking a Break?

### **When You're Done for the Day**:
Just **close the browser tab**. That's it!

- Codespaces **auto-saves** your work
- It will **stop automatically** after 30 minutes of inactivity
- **You pay nothing** when it's stopped
- **All your work is saved** in GitHub

### **To Resume Later**:
1. Go to https://github.com/codespaces
2. **Click** on your `torashaout` codespace
3. **Wait 10 seconds** for it to wake up
4. **Everything is exactly as you left it!**

---

## 🆓 Free Usage (Important!)

### **What's Free**:
- **60 hours/month** of Codespaces usage
- **15 GB storage**
- **2-core machine** (perfect for ToraShaout)

### **How to Stay Free**:
- ✅ Close Codespace when not working (auto-stops in 30 min)
- ✅ Delete old Codespaces you don't need
- ✅ One Codespace at a time

### **Check Your Usage**:
Go to: https://github.com/settings/billing

**60 hours = ~2 hours per day** for a month. More than enough! 🎉

---

## 🐛 Troubleshooting

### **"Can't upload files"**
- Check file size (max 100MB per file)
- Try uploading in smaller batches
- Make sure you're in the correct repo

### **"Codespace creation failed"**
- Check GitHub status: https://www.githubstatus.com
- Wait 5 minutes and try again
- Delete the failed codespace and create new one

### **"npm run dev doesn't work"**
```bash
# Try this:
rm -rf node_modules .next
npm install
npm run dev
```

### **"Port not forwarded"**
- Check bottom panel → "Ports" tab
- Make sure 3000 is listed
- Right-click → "Open in Browser"

### **"Changes not showing"**
- Make sure you saved the file (`Ctrl+S`)
- Check terminal for errors
- Hard refresh browser (`Ctrl+Shift+R`)

---

## 🎯 What to Do Next

### **Option 1: Explore the Code**
- Open `components/TalentCard.tsx` - see how cards work
- Open `types/index.ts` - see data structure
- Open `lib/mock-data.ts` - see sample data

### **Option 2: Customize Design**
- Open `tailwind.config.ts` - change colors
- Open `app/page.tsx` - edit hero text
- Open `lib/mock-data.ts` - add more sample talents

### **Option 3: Read Documentation**
- `README.md` - Full project guide
- `CODESPACES.md` - Detailed Codespaces info
- `DEPLOYMENT.md` - How to go live

### **Option 4: Ask Me to Build More**
Tell me what you want next:
- Talent profile pages?
- Booking form?
- Payment integration?
- Customer dashboard?

---

## 📚 Learn More

### **Keyboard Shortcuts**
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+P` - Command palette (search all commands)
- ``Ctrl+` `` - Toggle terminal
- `Ctrl+B` - Toggle sidebar
- `Ctrl+F` - Find in file

### **Useful Commands**
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Check code quality
```

### **VS Code Tips**
- **Multi-cursor**: Hold `Alt` + Click
- **Select word**: Double-click
- **Select line**: Triple-click
- **Duplicate line**: `Alt+Shift+Down`

---

## ✅ Quick Checklist

Before you start coding, verify:

- [ ] GitHub account created
- [ ] Repository created (`torashaout`)
- [ ] All files uploaded (check `.devcontainer` is there)
- [ ] Codespace created and loaded
- [ ] Terminal shows "ToraShaout is ready!"
- [ ] Ran `npm run dev` successfully
- [ ] Opened app in browser
- [ ] Can see the landing page
- [ ] Made a test edit and it updated live

**All checked?** 🎉 **You're ready to build!**

---

## 💪 You Got This!

You just set up a **professional development environment** in the cloud. No expensive computer needed. No complex installation. Just your browser and GitHub.

**This is the same setup used by companies like Shopify, Facebook, and Microsoft.**

Now you can code from:
- ✅ Old laptop
- ✅ Chromebook
- ✅ Tablet with keyboard
- ✅ Library computer
- ✅ Coffee shop
- ✅ Anywhere with internet!

---

## 🚀 What's Next?

Tell me what you want to build and I'll:
1. **Write the code** for new features
2. **Explain** how it works
3. **Help you test** it in Codespaces
4. **Guide you** through deployment

**Let's build ToraShaout together!** 🇿🇼

---

**Need help?** Ask me anything! I'm here to make sure you succeed. 💪
