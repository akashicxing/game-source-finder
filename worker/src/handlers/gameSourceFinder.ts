export async function findGameSource(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    if (!body.url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("正在处理URL:", body.url);
    const response = await fetch(body.url);
    const html = await response.text();
    console.log("页面内容长度:", html.length);

    let source = null;

    // 1. 保留原有的iframe匹配逻辑
    const iframeMatches = html.matchAll(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi);
    for (const match of iframeMatches) {
      const iframeSrc = match[1];
      console.log("找到iframe源:", iframeSrc);
      if (iframeSrc.includes('onlinegames.io') || 
          iframeSrc.includes('cloud.onlinegames') ||
          iframeSrc.includes('games.cdn')) {
        source = iframeSrc;
        break;
      }
    }

    // 2. 如果没找到,尝试从URL构建游戏路径
    if (!source) {
      const urlParts = body.url.split('/');
      let gameName = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
      gameName = gameName.replace('/', '');

      // 优先尝试 gm 路径
      const gmPath = `/games/2024/gm/${gameName}/index.html`;
      const gmUrl = new URL(gmPath, 'https://www.onlinegames.io').href;
      
      try {
        console.log("尝试gm路径:", gmUrl);
        const checkResponse = await fetch(gmUrl);
        if (checkResponse.ok) {
          console.log("找到有效的gm游戏URL:", gmUrl);
          source = gmUrl;
        }
      } catch (e) {
        console.log("gm路径无效:", gmUrl);
      }

      // 如果gm路径不可用,尝试其他路径
      if (!source) {
        const possiblePaths = [
          `/games/2024/unity/${gameName}/index.html`,
          `/games/2024/unity3/${gameName}/index.html`,
          `/games/2024/construct/${gameName}/index.html`,
          `/games/2024/html5/${gameName}/index.html`,
          `/games/${gameName}/index.html`
        ];

        for (const path of possiblePaths) {
          const gameUrl = new URL(path, 'https://www.onlinegames.io').href;
          try {
            console.log("尝试访问:", gameUrl);
            const checkResponse = await fetch(gameUrl);
            if (checkResponse.ok) {
              console.log("找到有效游戏URL:", gameUrl);
              source = gameUrl;
              break;
            }
          } catch (e) {
            console.log("URL无效:", gameUrl);
            continue;
          }
        }
      }
    }

    // 3. 保留原有的gameFrame匹配
    if (!source) {
      const gameFrameMatch = html.match(/id="gameFrame"[^>]*src="([^"]+)"/i);
      if (gameFrameMatch) {
        console.log("找到gameFrame源:", gameFrameMatch[1]);
        source = gameFrameMatch[1];
      }
    }

    if (!source) {
      return new Response(JSON.stringify({ 
        error: '未找到游戏源',
        url: body.url
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ source }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("处理错误:", error);
    return new Response(JSON.stringify({ 
      error: '服务器错误',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
