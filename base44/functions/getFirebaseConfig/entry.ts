import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const databaseURL = Deno.env.get('FIREBASE_DATABASE_URL');
    if (!databaseURL) return Response.json({ error: 'Firebase database URL not configured' }, { status: 500 });

    return Response.json({ databaseURL });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});