const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

Deno.serve(_request => {
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
      'Access-Control-Allow-Origin': '*',
    },
  });
});
