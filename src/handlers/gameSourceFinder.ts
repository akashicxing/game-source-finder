interface GameSourceRequest {
  url: string;
}

interface GameSourceResponse {
  source?: string;
  error?: string;
}

export async function findGameSource(request: Request): Promise<Response> {
  // 只接受 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body: GameSourceRequest = await request.json();
    
    if (!body.url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取目标页面内容
    const response = await fetch(body.url);
    const html = await response.text();

    // 查找 iframe 标签
    const iframeMatch = html.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/i);
    const source = iframeMatch ? iframeMatch[1] : null;

    if (!source) {
      return new Response(JSON.stringify({ error: 'No iframe source found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ source }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 