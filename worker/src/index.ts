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
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return createCorsResponse({}, 204);
		}

		// 处理 GET 请求，返回测试页面
		if (request.method === 'GET') {
			return new Response(
				`<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Game Source Finder - Test Page</title>
					<style>
						body {
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
							max-width: 800px;
							margin: 0 auto;
							padding: 20px;
							background: #f5f5f7;
						}
						.container {
							background: white;
							padding: 20px;
							border-radius: 10px;
							box-shadow: 0 2px 4px rgba(0,0,0,0.1);
						}
						input[type="url"] {
							width: 100%;
							padding: 8px;
							margin: 10px 0;
							border: 1px solid #ccc;
							border-radius: 4px;
						}
						button {
							background: #007AFF;
							color: white;
							border: none;
							padding: 10px 20px;
							border-radius: 6px;
							cursor: pointer;
						}
						button:hover {
							background: #0066CC;
						}
						#result {
							margin-top: 20px;
							padding: 10px;
							border-radius: 4px;
							white-space: pre-wrap;
							word-break: break-all;
						}
						.success {
							background: #E8F5E9;
							border: 1px solid #A5D6A7;
						}
						.error {
							background: #FFEBEE;
							border: 1px solid #FFCDD2;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<h1>Game Source Finder</h1>
						<div>
							<input type="url" id="gameUrl" 
								placeholder="Enter game URL (e.g., https://www.onlinegames.io/monster-survivors/)" 
								value="https://www.onlinegames.io/monster-survivors/">
							<button onclick="findSource()">Find Source</button>
						</div>
						<div id="result"></div>
					</div>

					<script>
					async function findSource() {
						const gameUrl = document.getElementById('gameUrl').value;
						const resultDiv = document.getElementById('result');
						
						try {
							resultDiv.className = '';
							resultDiv.textContent = 'Searching...';
							
							const response = await fetch(window.location.href, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ url: gameUrl })
							});
							
							const data = await response.json();
							
							if (data.source) {
								resultDiv.className = 'success';
								resultDiv.innerHTML = 'Found source URL:<br>' + data.source;
							} else {
								resultDiv.className = 'error';
								resultDiv.textContent = data.error || 'Unknown error occurred';
							}
						} catch (error) {
							resultDiv.className = 'error';
							resultDiv.textContent = 'Error: ' + error.message;
						}
					}
					</script>
				</body>
				</html>`,
				{
					headers: {
						'Content-Type': 'text/html;charset=UTF-8',
					},
				}
			);
		}

		// Validate request method
		if (request.method !== 'POST') {
			return createCorsResponse(
				{ error: 'Method not allowed' },
				405
			);
		}

		try {
			// Parse request body
			const { url } = await request.json() as GameSourceRequest;

			// Validate URL
			if (!url || !url.trim()) {
				return createCorsResponse(
					{ error: 'URL is required' },
					400
				);
			}

			// Fetch target page
			const response = await fetch(url, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
					'Accept-Language': 'en-US,en;q=0.9',
					'Referer': 'https://www.onlinegames.io/',
					'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"'
				}
			});
			if (!response.ok) {
				return createCorsResponse(
					{ error: `Failed to fetch page: ${response.status}` },
					502
				);
			}

			// Extract game source
			const html = await response.text();
			const source = extractGameSource(html);

			if (!source) {
				return createCorsResponse(
					{ error: 'No game source found' },
					404
				);
			}

			// Return successful response
			return createCorsResponse({ source });

		} catch (error) {
			// Log error for debugging
			console.error('Worker error:', error);

			return createCorsResponse(
				{ error: 'Internal server error' },
				500
			);
		}
	},
} satisfies ExportedHandler<Env>;
