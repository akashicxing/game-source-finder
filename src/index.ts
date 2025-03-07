import { findGameSource } from './handlers/gameSourceFinder';

export interface Env {
  // 如果需要添加环境变量，在这里定义
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 添加 CORS 头
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 路由处理
    const url = new URL(request.url);
    
    // 主路由处理游戏源地址查找
    if (url.pathname === '/') {
      return findGameSource(request);
    }

    // 健康检查端点
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 404 处理
    return new Response('Not Found', { status: 404 });
  },
}; 