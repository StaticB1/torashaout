#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function countTalents() {
  const { count: pending } = await supabase
    .from('talent_profiles')
    .select('*', { count: 'exact', head: true })
    .or('verification_status.eq.pending,verification_status.is.null')
    .eq('admin_verified', false)

  const { count: approved } = await supabase
    .from('talent_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'approved')
    .eq('admin_verified', true)

  const { count: rejected } = await supabase
    .from('talent_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'rejected')

  console.log('\n📊 Current Talent Counts:')
  console.log('========================')
  console.log(`Pending:  ${pending}`)
  console.log(`Approved: ${approved}`)
  console.log(`Rejected: ${rejected}`)
  console.log(`Total:    ${pending + approved + rejected}`)
  console.log('\n✅ With page size of 10, you should see:')
  console.log(`  - ${Math.ceil(pending / 10)} pages for Pending talents`)
  console.log(`  - ${Math.ceil(approved / 10)} pages for Active talents`)
  console.log(`  - ${Math.ceil(rejected / 10)} pages for Rejected talents\n`)
}

countTalents().then(() => process.exit(0))
