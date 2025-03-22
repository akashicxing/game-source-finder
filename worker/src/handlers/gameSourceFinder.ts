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
    
    // 确保获取完整页面内容
    const response = await fetch(body.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    console.log("页面内容长度:", html.length);

    let source = null;

    // 1. 先从页面内容中查找
    // 查找所有可能的iframe
    const iframeMatches = html.matchAll(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi);
    for (const match of iframeMatches) {
      const iframeSrc = match[1];
      console.log("找到iframe源:", iframeSrc);
      if (iframeSrc.includes('cloud.onlinegames.io') || 
          iframeSrc.includes('onlinegames.io/games') ||
          iframeSrc.includes('games.cdn')) {
        source = iframeSrc;
        break;
      }
    }

    // 查找可能包含游戏ID的内容
    if (!source) {
      const idMatch = html.match(/\/(\d+)\/[^/"']+\/index/);
      if (idMatch) {
        const gameId = idMatch[1];
        console.log("找到游戏ID:", gameId);
        
        const urlParts = body.url.split('/');
        const gameName = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
        gameName.replace('/', '');

        // 尝试带ID的构建
        const paths = [
          `/games/2024/construct/${gameId}/${gameName}/index-og.html`,
          `/games/2024/construct/${gameId}/${gameName}/index.html`,
          `/games/2024/unity/${gameId}/${gameName}/index.html`
        ];

        for (const path of paths) {
          const gameUrl = new URL(path, 'https://cloud.onlinegames.io').href;
          try {
            console.log("尝试带ID访问:", gameUrl);
            const checkResponse = await fetch(gameUrl);
            if (checkResponse.ok) {
              source = gameUrl;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }

    // 2. 如果页面中没找到,再尝试构建URL
    if (!source) {
      const urlParts = body.url.split('/');
      const gameName = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
      gameName.replace('/', '');

      const possiblePaths = [
        `/games/2024/gm/${gameName}/index.html`,
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
            source = gameUrl;
            break;
          }
        } catch (e) {
          continue;
        }
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
