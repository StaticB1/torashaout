# Documentation Workflow Guide

This guide ensures all documentation is updated before every git push.

---

## 📋 Pre-Push Checklist

Before running `git push`, always verify these documentation files are updated:

### Required for ALL Changes

- [ ] **CHANGELOG.md** - Add entry under appropriate version section
  - New features → `### Added`
  - Bug fixes → `### Fixed`
  - Breaking changes → `### Changed`
  - Removed features → `### Removed`

### Required for Feature Changes

- [ ] **ENHANCEMENTS.md** - Document new features with details
  - Add to "Recent Updates" section
  - Include component/file details
  - List key improvements

### Required for Major Changes

- [ ] **README.md** - Update if project structure/setup changed
  - Installation steps
  - Getting started guide
  - Feature list

### Required for Backend/API Changes

- [ ] **docs/BACKEND_README.md** - Update API documentation
  - New API functions
  - New hooks
  - New components
  - Usage examples

- [ ] **docs/SUPABASE_SETUP.md** - Update if database schema changed
  - New tables
  - Modified schemas
  - New RLS policies

- [ ] **docs/AUTHENTICATION_GUIDE.md** - Update if auth flow changed
  - New auth methods
  - Modified flows

### Optional for Significant Updates

- [ ] **RECENT_CHANGES.md** - Create/update for major releases
  - Migration guides
  - Breaking changes
  - Quick reference

---

## 🔄 Git Workflow with Documentation

### 1. Make Code Changes

```bash
# Work on your features/fixes
git add <files>
```

### 2. Update Documentation

Before committing, update relevant documentation:

```bash
# Edit documentation files
code CHANGELOG.md
code ENHANCEMENTS.md
# etc...

# Stage documentation changes
git add CHANGELOG.md ENHANCEMENTS.md
```

### 3. Commit with Descriptive Message

```bash
git commit -m "feat: Add user profile settings

- Added profile update functionality
- Created settings page component
- Integrated with Supabase API

Docs: Updated CHANGELOG.md and ENHANCEMENTS.md"
```

### 4. Pre-Push Hook Verification

When you run `git push`, the pre-push hook will:
1. Check for staged changes
2. Show documentation checklist
3. Ask for confirmation
4. Proceed with push if confirmed

```bash
git push origin backend
```

---

## 📝 Documentation Templates

### CHANGELOG.md Entry Template

```markdown
## [X.X.X] - YYYY-MM-DD

### Added
- **Feature Name** (`path/to/file.ts`) - Brief description
  - Sub-feature 1
  - Sub-feature 2

### Changed
- **Component Name** - What changed and why

### Fixed
- **Bug Description** - How it was fixed

### Removed
- **Deprecated Feature** - Reason for removal
```

### ENHANCEMENTS.md Update Template

```markdown
## 🔄 Recent Updates (Month DD, YYYY)

### Commit: `commit-message-here`

Brief overview of the update.

#### **New Components/Features**

1. **`path/to/file.ts`** (XX lines)
   - Feature description
   - Key functionality
   - Integration points

#### **Summary of Changes**

| Metric | Value |
|--------|-------|
| **Files Changed** | X |
| **Lines Added** | +XXX |
| **Lines Removed** | -XXX |

#### **Key Improvements**

✅ **Category**
- Improvement 1
- Improvement 2
```

---

## 🎯 Quick Reference: What to Update When

| Change Type | Files to Update |
|-------------|-----------------|
| **New Feature** | CHANGELOG.md, ENHANCEMENTS.md |
| **New Component** | CHANGELOG.md, ENHANCEMENTS.md |
| **New API/Hook** | CHANGELOG.md, ENHANCEMENTS.md, docs/BACKEND_README.md |
| **Bug Fix** | CHANGELOG.md |
| **Refactor** | CHANGELOG.md |
| **Database Change** | CHANGELOG.md, docs/SUPABASE_SETUP.md |
| **Auth Change** | CHANGELOG.md, docs/AUTHENTICATION_GUIDE.md |
| **Breaking Change** | CHANGELOG.md, ENHANCEMENTS.md, RECENT_CHANGES.md |
| **Major Release** | All relevant docs + RECENT_CHANGES.md |

---

## 🚀 Version Numbering (Semantic Versioning)

Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

### Version Increments

- **MAJOR** (X.0.0) - Breaking changes, incompatible API changes
  - Example: 1.0.0 → 2.0.0

- **MINOR** (0.X.0) - New features, backward-compatible
  - Example: 0.2.0 → 0.3.0

- **PATCH** (0.0.X) - Bug fixes, backward-compatible
  - Example: 0.2.0 → 0.2.1

### Current Version: 0.2.0

**Next versions:**
- Bug fix: 0.2.1
- New feature: 0.3.0
- Breaking change: 1.0.0

---

## ⚙️ Git Hook Setup

The pre-push hook is already installed at `.git/hooks/pre-push`

### Manual Installation (if needed)

```bash
# Make the hook executable
chmod +x .git/hooks/pre-push

# Test the hook
git push --dry-run
```

### Bypass Hook (Emergency Only)

```bash
# Skip pre-push hook (NOT RECOMMENDED)
git push --no-verify
```

**⚠️ Warning:** Only bypass the hook in emergencies. Always update documentation!

---

## 📚 Documentation Files Overview

| File | Purpose | Update Frequency |
|------|---------|------------------|
| **CHANGELOG.md** | Version history | Every commit with changes |
| **ENHANCEMENTS.md** | Feature details | Every new feature |
| **README.md** | Project overview | Major changes only |
| **RECENT_CHANGES.md** | Latest update guide | Major releases |
| **docs/BACKEND_README.md** | Backend API guide | API/backend changes |
| **docs/SUPABASE_SETUP.md** | Database setup | Schema changes |
| **docs/AUTHENTICATION_GUIDE.md** | Auth documentation | Auth changes |

---

## 🎯 Best Practices

### 1. Update Documentation While Coding
Don't wait until the end. Update docs as you:
- Create new components
- Add new features
- Make breaking changes

### 2. Write Clear Commit Messages
Include what documentation was updated:
```
feat: Add user search functionality

- Created SearchBar component
- Added search API endpoint
- Integrated with user dashboard

Docs: Updated CHANGELOG.md, ENHANCEMENTS.md, and BACKEND_README.md
```

### 3. Review Before Pushing
```bash
# Review your changes
git diff CHANGELOG.md
git diff ENHANCEMENTS.md

# Ensure accuracy before pushing
```

### 4. Keep It Consistent
- Use the same format across all updates
- Follow existing patterns in documentation
- Maintain chronological order in CHANGELOG.md

### 5. Link to Related Files
Use relative links to make docs navigable:
```markdown
See [CHANGELOG.md](./CHANGELOG.md) for version history.
Refer to [Backend README](./docs/BACKEND_README.md) for API details.
```

---

## 🔧 Troubleshooting

### Hook Not Running

```bash
# Verify hook exists
ls -la .git/hooks/pre-push

# Ensure it's executable
chmod +x .git/hooks/pre-push

# Check if hooks are disabled
git config --get core.hooksPath
```

### Need to Update Hook

```bash
# Edit the hook
nano .git/hooks/pre-push

# Or replace with updated version
# (Re-run the setup script)
```

---

## 📞 Questions?

If you're unsure what to document:
1. Check this guide's "Quick Reference" section
2. Look at recent examples in existing docs
3. When in doubt, document it!

---

## ✅ Example Workflow

### Complete Example: Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/user-notifications

# 2. Code your feature
# ... write code ...

# 3. Update documentation WHILE coding
# Edit CHANGELOG.md - add entry under [Unreleased]
# Edit ENHANCEMENTS.md - add feature details
# Edit docs/BACKEND_README.md - if API changed

# 4. Stage all changes
git add .

# 5. Commit with descriptive message
git commit -m "feat: Add real-time user notifications

- Created NotificationService
- Added WebSocket integration
- Updated user dashboard with notifications panel

Docs: Updated CHANGELOG.md, ENHANCEMENTS.md, BACKEND_README.md"

# 6. Push (pre-push hook will verify)
git push origin feature/user-notifications

# 7. Hook prompts checklist - confirm yes

# 8. Create PR with updated documentation
```

---

**Remember:** Good documentation is as important as good code! 📚

**Last Updated:** January 20, 2026
