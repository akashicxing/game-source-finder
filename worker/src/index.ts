/**
 * Game Source Finder Worker
 * 
 * This worker is responsible for finding the source URL of game iframes
 * from online gaming websites. It handles the extraction of iframe sources
 * while respecting CORS and providing proper error handling.
 *
 * @author Your Name
 * @license MIT
 */

import { findGameSource } from './handlers/gameSourceFinder';
import { StatsManager } from './handlers/stats';
import { getHtml } from './static/html';

// Type definitions
interface GameSourceResponse {
	source?: string;
	error?: string;
}

interface GameSourceRequest {
	url: string;
}

interface Env {
	// Add environment variables if needed
}

/**
 * Creates a CORS-enabled response
 * @param body Response body
 * @param status HTTP status code
 * @returns Response with CORS headers
 */
function createCorsResponse(body: GameSourceResponse, status: number = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}

/**
 * Extracts game source URL from HTML content
 * @param html HTML content to search
 * @returns Source URL if found, null otherwise
 */
function extractGameSource(html: string): string | null {
	const iframePattern = /<iframe[^>]*src=["']([^"']*(?:cloud\.onlinegames\.io|html5\.gamedistribution\.com|games\.cdn\.famobi\.com)[^"']*)["'][^>]*>/i;
	const match = html.match(iframePattern);
	return match ? match[1] : null;
}

export default {
	/**
	 * Handles incoming requests to find game source URLs
	 * @param request Request object
	 * @param env Environment variables
	 * @param ctx Execution context
	 * @returns Response with game source or error
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const statsManager = StatsManager.getInstance();

		// 处理 OPTIONS 请求
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// 返回主页
		if (url.pathname === '/' && request.method === 'GET') {
			return new Response(getHtml(), {
				headers: { 'Content-Type': 'text/html;charset=UTF-8' },
			});
		}

		// 处理 API 请求
		if (url.pathname === '/' && request.method === 'POST') {
			const response = await findGameSource(request);
			statsManager.recordRequest(response.status === 200);
			return response;
		}

		// 获取统计数据
		if (url.pathname === '/stats') {
			return new Response(JSON.stringify(statsManager.getStats()), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// 健康检查
		if (url.pathname === '/health') {
			return new Response(JSON.stringify({ status: 'ok' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
