import { Hono } from 'https://deno.land/x/hono@v3.12.11/mod.ts';
import { serveStatic } from 'https://deno.land/x/hono@v3.12.11/middleware.ts';

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const app = new Hono();

app.use('*', serveStatic({ root: './static' }));

app.get('/server', c => {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('one'));
      await sleep(2000);
      controller.enqueue(encoder.encode('two'));
      await sleep(2000);
      controller.enqueue(encoder.encode('three'));
      await sleep(2000);
      controller.enqueue(encoder.encode('four'));
      controller.close();
    },
    cancel() {
      console.log('Cancelled without finishing!');
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
});

Deno.serve(app.fetch);
