# Migration Scripts

Utility scripts for managing database migrations.

---

## Available Scripts

### 1. check-migration.js

**Purpose**: Check if the talent_applications migration needs to be applied

**Usage**:
```bash
node scripts/check-migration.js
```

**What it does**:
- Checks if `talent_applications` table exists
- Tests if UNIQUE constraint exists on email field
- Inserts test records to verify constraint
- Cleans up test data automatically

**Output Examples**:

✅ **Migration Already Applied**:
```
🔍 Checking talent_applications table status...

✅ Table "talent_applications" exists!
🔍 Checking if UNIQUE constraint exists on email field...
✓ First test record inserted
✅ UNIQUE constraint EXISTS on email field!
✅ Migration is already applied - no action needed!
```

❌ **Migration Needed**:
```
🔍 Checking talent_applications table status...

❌ Table "talent_applications" does NOT exist.

📋 You need to create the table first.

🔧 To apply the migration:
1. Go to: https://app.supabase.com/project/fyvqvqzdtuugqcxglwew/sql
2. Copy the entire contents of: supabase/migrations/20260121_create_talent_applications.sql
3. Paste and run in the SQL Editor
```

---

### 2. apply-migration.sql

**Purpose**: SQL file to add UNIQUE constraint to existing table

**Usage**:
```bash
# Option 1: Via Supabase Dashboard
# Copy contents and run in SQL Editor

# Option 2: Via psql
psql $DATABASE_URL < scripts/apply-migration.sql

# Option 3: Via Supabase CLI
supabase db push
```

**What it does**:
- Adds UNIQUE constraint to `talent_applications.email` field
- Verifies constraint was added
- Safe to run multiple times (checks if constraint exists)

**SQL**:
```sql
ALTER TABLE talent_applications
ADD CONSTRAINT talent_applications_email_key UNIQUE (email);
```

---

### 3. apply-migration.js

**Purpose**: Node.js script to apply migration programmatically (advanced)

**Status**: ⚠️ Not recommended - Use Supabase Dashboard instead

**Note**: This script attempts to use `exec_sql` RPC which may not be available. Prefer using the SQL Editor in Supabase Dashboard for reliability.

---

## Quick Start

### First Time Setup

1. **Check if migration is needed**:
```bash
node scripts/check-migration.js
```

2. **If table doesn't exist, apply full migration**:
   - Go to: https://app.supabase.com/project/YOUR_PROJECT_ID/sql
   - Copy: `supabase/migrations/20260121_create_talent_applications.sql`
   - Paste and click **Run**

3. **If table exists but missing UNIQUE constraint**:
   - Go to: https://app.supabase.com/project/YOUR_PROJECT_ID/sql
   - Copy: `scripts/apply-migration.sql`
   - Paste and click **Run**

4. **Verify migration succeeded**:
```bash
node scripts/check-migration.js
```

---

## Troubleshooting

### Script Error: "Missing Supabase credentials"

**Problem**: `.env.local` not found or missing credentials

**Solution**:
1. Ensure `.env.local` exists in project root
2. Add required environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Script Error: "Could not find the table"

**Problem**: Table doesn't exist yet

**Solution**: Apply the full migration first:
1. Go to Supabase SQL Editor
2. Run: `supabase/migrations/20260121_create_talent_applications.sql`

### Script Error: "duplicate key value violates unique constraint"

**Problem**: Constraint already exists (this is good!)

**Solution**: No action needed - constraint is already in place

---

## Script Requirements

### Dependencies

All scripts require:
- Node.js v16+
- `@supabase/supabase-js` package (already installed)
- `dotenv` package (already installed)
- Valid Supabase credentials in `.env.local`

### Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## Best Practices

### 1. Always Check First

Run `check-migration.js` before applying any migration to understand current state.

### 2. Use Supabase Dashboard

The SQL Editor is the most reliable method:
- Visual feedback
- Syntax highlighting
- Error messages are clear
- Can review before running

### 3. Test in Development

Never run scripts directly in production without testing first.

### 4. Backup First

```bash
# Create database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 5. Version Control

Commit all migration files and scripts to git.

---

## Development Workflow

### Typical Flow

1. **Check status**:
```bash
node scripts/check-migration.js
```

2. **Apply migration** (via dashboard):
   - Copy SQL from migration file
   - Paste in Supabase SQL Editor
   - Click Run

3. **Verify success**:
```bash
node scripts/check-migration.js
# Should show: ✅ Migration is already applied
```

4. **Test application**:
```bash
npm run dev
# Visit http://localhost:3000/join
# Submit test application
```

---

## Script Output Reference

### check-migration.js Output

| Output | Meaning | Action |
|--------|---------|--------|
| ✅ Migration is already applied | Table exists with UNIQUE constraint | None - you're good! |
| ❌ Table does NOT exist | Table needs to be created | Run full migration |
| ❌ UNIQUE constraint DOES NOT exist | Table exists but constraint missing | Run `apply-migration.sql` |
| ⚠️ Error checking table | Permission or connection issue | Check credentials |

---

## Related Documentation

- **Migration Guide**: [../docs/MIGRATIONS.md](../docs/MIGRATIONS.md)
- **Talent Applications**: [../docs/TALENT_APPLICATIONS.md](../docs/TALENT_APPLICATIONS.md)
- **Supabase Setup**: [../docs/SUPABASE_SETUP.md](../docs/SUPABASE_SETUP.md)
- **Backend README**: [../docs/BACKEND_README.md](../docs/BACKEND_README.md)

---

## Support

For issues with scripts:
1. Check console error messages
2. Verify environment variables are set
3. Ensure Supabase project is accessible
4. Review related documentation above

---

**Scripts to simplify your migrations!** 🛠️

These utilities help you manage database migrations safely and efficiently.
