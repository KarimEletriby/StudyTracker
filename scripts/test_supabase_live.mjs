/**
 * Live Supabase Backend Verification Test
 * Tests connectivity, Auth, CRUD, and RLS directly against the live Supabase instance.
 */

import fs from 'fs';
import path from 'path';

// Parse .env file
function loadEnv() {
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found at ' + envPath);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = (env.VITE_SUPABASE_URL || env.SUPABASE_URL || '').replace(/\/$/, '');
const API_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || '';

console.log('====================================================');
console.log('🚀 LIVE SUPABASE END-TO-END VERIFICATION TEST');
console.log('====================================================');
console.log(`Endpoint: ${SUPABASE_URL}`);
console.log(`API Key:  ${API_KEY.slice(0, 16)}...`);
console.log('----------------------------------------------------\n');

if (!SUPABASE_URL || !API_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env');
  process.exit(1);
}

const headers = (token = null) => {
  const h = {
    'apikey': API_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
  if (token) {
    h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

async function runTests() {
  let passed = 0;
  let total = 0;

  function report(testName, success, details = '') {
    total++;
    if (success) {
      passed++;
      console.log(`✅ [${total}] ${testName}`);
      if (details) console.log(`   ↳ ${details}`);
    } else {
      console.log(`❌ [${total}] ${testName}`);
      if (details) console.log(`   ↳ Error: ${details}`);
    }
  }

  // STEP 1: Test Server Reachability
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: headers(),
    });
    const status = res.status;
    const body = await res.text();
    if (status >= 200 && status < 300) {
      report('Supabase Auth Endpoint Reachability', true, `Status ${status} (Auth service online)`);
    } else {
      report('Supabase Auth Endpoint Reachability', false, `Status ${status} - Response: ${body}`);
    }
  } catch (err) {
    report('Supabase Auth Endpoint Reachability', false, err.message);
  }

  // STEP 2: Test Unauthenticated Access Rejection (RLS check)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subjects?select=*`, {
      headers: headers(), // No Bearer token, only anon key
    });
    const data = await res.json();
    // With RLS and REVOKE anon, either status 401/403 or empty array []
    if (res.status === 401 || res.status === 403 || (Array.isArray(data) && data.length === 0)) {
      report('RLS: Unauthenticated request cannot read private data', true, `Status ${res.status}`);
    } else {
      report('RLS: Unauthenticated request cannot read private data', false, `Returned data: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    report('RLS: Unauthenticated request rejection', false, err.message);
  }

  // STEP 3: Register a Test Student Account
  const testEmail = `student_test_${Date.now()}@university.edu`;
  const testPassword = `StudyPlannerTest2026!`;
  let accessToken = null;
  let userId = null;

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        data: { full_name: 'Test Student' },
      }),
    });
    const data = await res.json();

    if (res.ok && (data.user || data.id)) {
      userId = data.user?.id || data.id;
      accessToken = data.access_token || data.session?.access_token;
      report('Auth: Sign Up Test Student', true, `Created user ${testEmail} (ID: ${userId})`);
    } else {
      report('Auth: Sign Up Test Student', false, JSON.stringify(data));
    }
  } catch (err) {
    report('Auth: Sign Up Test Student', false, err.message);
  }

  // If email confirmation is required, attempt sign-in to get token
  if (!accessToken) {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        accessToken = data.access_token;
        userId = data.user?.id || userId;
        report('Auth: Sign In with credentials', true, `Acquired JWT session token`);
      } else {
        report('Auth: Sign In with credentials', false, data.error_description || data.msg || JSON.stringify(data));
      }
    } catch (err) {
      report('Auth: Sign In with credentials', false, err.message);
    }
  } else {
    report('Auth: Auto-authenticated session', true, 'Session token issued directly upon signup');
  }

  if (!accessToken || !userId) {
    console.log('\n⚠️ Authentication token could not be acquired (likely email confirmation is enabled in Supabase).');
    console.log('To allow automated API tests without email verification:');
    console.log('Go to Supabase Dashboard -> Authentication -> Providers -> Email -> Turn off "Confirm email".');
  }

  // STEP 4: Test Subjects CRUD with Authenticated User
  let createdSubjectId = null;
  if (accessToken && userId) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/subjects`, {
        method: 'POST',
        headers: headers(accessToken),
        body: JSON.stringify({
          user_id: userId,
          name: 'Cloud Computing & Distributed Systems',
          color: '#4F46E5',
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data[0]?.id) {
        createdSubjectId = data[0].id;
        report('Database: Create Subject (INSERT into public.subjects)', true, `Created subject ID: ${createdSubjectId}`);
      } else {
        report('Database: Create Subject (INSERT into public.subjects)', false, JSON.stringify(data));
      }
    } catch (err) {
      report('Database: Create Subject', false, err.message);
    }

    // STEP 5: Test Read Subjects
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/subjects?select=*`, {
        headers: headers(accessToken),
      });
      const data = await res.json();
      const found = Array.isArray(data) && data.some(s => s.id === createdSubjectId);
      if (res.ok && found) {
        report('Database: Read Subjects (SELECT from public.subjects via RLS)', true, `Found ${data.length} subject(s) owned by caller`);
      } else {
        report('Database: Read Subjects', false, JSON.stringify(data));
      }
    } catch (err) {
      report('Database: Read Subjects', false, err.message);
    }

    // STEP 6: Test Tasks CRUD with Authenticated User
    let createdTaskId = null;
    if (createdSubjectId) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
          method: 'POST',
          headers: headers(accessToken),
          body: JSON.stringify({
            user_id: userId,
            subject_id: createdSubjectId,
            title: 'Deploy Kubernetes Cluster on GCP',
            priority: 'high',
            due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          }),
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data) && data[0]?.id) {
          createdTaskId = data[0].id;
          report('Database: Create Task (INSERT into public.tasks)', true, `Created task ID: ${createdTaskId}`);
        } else {
          report('Database: Create Task', false, JSON.stringify(data));
        }
      } catch (err) {
        report('Database: Create Task', false, err.message);
      }

      // STEP 7: Test Read Tasks
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*`, {
          headers: headers(accessToken),
        });
        const data = await res.json();
        const found = Array.isArray(data) && data.some(t => t.id === createdTaskId);
        if (res.ok && found) {
          report('Database: Read Tasks (SELECT from public.tasks via RLS)', true, `Found ${data.length} task(s) owned by caller`);
        } else {
          report('Database: Read Tasks', false, JSON.stringify(data));
        }
      } catch (err) {
        report('Database: Read Tasks', false, err.message);
      }

      // STEP 8: Test Update Task (Mark as Completed)
      if (createdTaskId) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${createdTaskId}`, {
            method: 'PATCH',
            headers: headers(accessToken),
            body: JSON.stringify({ is_completed: true }),
          });
          const data = await res.json();
          if (res.ok && Array.isArray(data) && data[0]?.is_completed === true) {
            report('Database: Update Task (PATCH public.tasks is_completed=true)', true, `Task successfully marked completed`);
          } else {
            report('Database: Update Task', false, JSON.stringify(data));
          }
        } catch (err) {
          report('Database: Update Task', false, err.message);
        }
      }

      // STEP 9: Test Constraint Enforcement (ON DELETE RESTRICT)
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/subjects?id=eq.${createdSubjectId}`, {
          method: 'DELETE',
          headers: headers(accessToken),
        });
        // Deleting subject with linked task MUST be rejected!
        if (!res.ok) {
          report('Database Constraint: ON DELETE RESTRICT on subjects with active tasks', true, `Properly rejected deletion (HTTP ${res.status})`);
        } else {
          report('Database Constraint: ON DELETE RESTRICT on subjects with active tasks', false, 'Subject was deleted while linked task existed!');
        }
      } catch (err) {
        report('Database Constraint: ON DELETE RESTRICT', true, `Blocked as expected: ${err.message}`);
      }

      // STEP 10: Clean-up: Delete Task, then Delete Subject
      if (createdTaskId) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${createdTaskId}`, {
            method: 'DELETE',
            headers: headers(accessToken),
          });
          report('Database: Delete Task (DELETE from public.tasks)', res.ok, `Cleaned up task ${createdTaskId}`);
        } catch (err) {
          report('Database: Delete Task', false, err.message);
        }
      }

      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/subjects?id=eq.${createdSubjectId}`, {
          method: 'DELETE',
          headers: headers(accessToken),
        });
        report('Database: Delete Subject (DELETE from public.subjects after tasks removed)', res.ok, `Cleaned up subject ${createdSubjectId}`);
      } catch (err) {
        report('Database: Delete Subject', false, err.message);
      }
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`📊 Live Test Summary: ${passed}/${total} checks passed`);
  console.log('====================================================\n');
}

runTests();
