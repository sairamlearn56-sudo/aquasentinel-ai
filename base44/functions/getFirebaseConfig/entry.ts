import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    // Database URL is public config (security is in Firebase DB rules), no auth needed
    const databaseURL = Deno.env.get('FIREBASE_DATABASE_URL');
    if (!databaseURL) return Response.json({ error: 'Firebase database URL not configured' }, { status: 500 });

    return Response.json({ databaseURL });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});