export const getHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Source Finder</title>
    <style>
        :root {
            --apple-blue: #007AFF;
            --apple-gray: #8E8E93;
            --apple-light-gray: #F2F2F7;
            --apple-white: #FFFFFF;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background-color: var(--apple-light-gray);
            padding: 2rem;
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: var(--apple-white);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            position: relative;
        }

        .language-switch {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
        }

        .language-btn {
            background: none;
            border: 1px solid var(--apple-gray);
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.6;
        }

        .language-btn.active {
            border-color: var(--apple-blue);
            color: var(--apple-blue);
            opacity: 1;
        }

        h1 {
            text-align: center;
            margin-bottom: 2rem;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            margin: 2rem 0;
            padding: 1rem;
            background-color: var(--apple-light-gray);
            border-radius: 8px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--apple-blue);
        }

        .input-group {
            margin: 2rem 0;
        }

        input[type="url"] {
            width: 100%;
            padding: 12px;
            border: 2px solid var(--apple-gray);
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }

        button {
            background-color: var(--apple-blue);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
        }

        .result {
            margin-top: 2rem;
            padding: 1rem;
            background-color: var(--apple-light-gray);
            border-radius: 8px;
            display: none;
        }

        .result.show {
            display: block;
        }

        .legal-notice {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--apple-gray);
            font-size: 0.9rem;
            color: var(--apple-gray);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="language-switch">
            <button class="language-btn" data-lang="en" onclick="switchLanguage('en')">EN</button>
            <button class="language-btn active" data-lang="zh" onclick="switchLanguage('zh')">中文</button>
        </div>

        <h1 data-i18n="title">Game Source Finder</h1>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number" id="totalRequests">0</div>
                <div data-i18n="totalRequests">总请求数</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="todayRequests">0</div>
                <div data-i18n="todayRequests">今日请求</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="successRate">0%</div>
                <div data-i18n="successRate">成功率</div>
            </div>
        </div>

        <div class="input-group">
            <input type="url" id="gameUrl" data-i18n-placeholder="urlPlaceholder" 
                   placeholder="输入游戏URL（例如：https://www.onlinegames.io/game-name/）" required>
            <button onclick="findSource()" data-i18n="findButton">查找源地址</button>
        </div>

        <div class="result" id="result">
            <p data-i18n="sourceUrlLabel">源地址：</p>
            <p id="sourceUrl"></p>
            <button onclick="copyToClipboard()" data-i18n="copyButton">复制地址</button>
        </div>

        <div class="legal-notice">
            <h3 data-i18n="legalTitle">法律声明</h3>
            <p data-i18n="legalDescription">本工具仅用于技术研究和学习目的。使用本工具时请注意：</p>
            <ul>
                <li data-i18n="legal1">遵守相关法律法规和游戏平台的使用条款</li>
                <li data-i18n="legal2">不得用于商业用途或违法行为</li>
                <li data-i18n="legal3">源地址的使用需遵守原始网站的版权规定</li>
            </ul>
            <p data-i18n="copyright">© 2024 Game Source Finder. All rights reserved.</p>
        </div>
    </div>

    <script>
        const i18n = {
            en: {
                title: "Game Source Finder",
                totalRequests: "Total Requests",
                todayRequests: "Today's Requests",
                successRate: "Success Rate",
                urlPlaceholder: "Enter game URL (e.g., https://www.onlinegames.io/game-name/)",
                findButton: "Find Source",
                sourceUrlLabel: "Source URL:",
                copyButton: "Copy URL",
                legalTitle: "Legal Notice",
                legalDescription: "This tool is for technical research and learning purposes only. Please note:",
                legal1: "Comply with relevant laws and game platform terms of use",
                legal2: "Not for commercial use or illegal activities",
                legal3: "Usage of source URLs must comply with original website copyright terms",
                copyright: "© 2024 Game Source Finder. All rights reserved."
            },
            zh: {
                title: "游戏源地址查找器",
                totalRequests: "总请求数",
                todayRequests: "今日请求",
                successRate: "成功率",
                urlPlaceholder: "输入游戏URL（例如：https://www.onlinegames.io/game-name/）",
                findButton: "查找源地址",
                sourceUrlLabel: "源地址：",
                copyButton: "复制地址",
                legalTitle: "法律声明",
                legalDescription: "本工具仅用于技术研究和学习目的。使用本工具时请注意：",
                legal1: "遵守相关法律法规和游戏平台的使用条款",
                legal2: "不得用于商业用途或违法行为",
                legal3: "源地址的使用需遵守原始网站的版权规定",
                copyright: "© 2024 Game Source Finder. 保留所有权利。"
            }
        };

        async function findSource() {
            const gameUrl = document.getElementById('gameUrl').value;
            const result = document.getElementById('result');
            const sourceUrl = document.getElementById('sourceUrl');

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: gameUrl })
                });

                const data = await response.json();
                
                if (data.source) {
                    sourceUrl.textContent = data.source;
                    result.classList.add('show');
                }
            } catch (err) {
                console.error('Error:', err);
            }
        }

        function switchLanguage(lang) {
            document.querySelectorAll('.language-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (i18n[lang][key]) {
                    element.textContent = i18n[lang][key];
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (i18n[lang][key]) {
                    element.placeholder = i18n[lang][key];
                }
            });

            localStorage.setItem('preferred-language', lang);
        }

        function copyToClipboard() {
            const sourceUrl = document.getElementById('sourceUrl').textContent;
            navigator.clipboard.writeText(sourceUrl);
            const copyBtn = document.querySelector('.result button');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制!';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        }

        // 初始化语言
        document.addEventListener('DOMContentLoaded', () => {
            const savedLang = localStorage.getItem('preferred-language') || 'zh';
            switchLanguage(savedLang);
            updateStats();
        });

        // 更新统计数据
        async function updateStats() {
            try {
                const response = await fetch('/stats');
                const stats = await response.json();
                
                document.getElementById('totalRequests').textContent = stats.total;
                document.getElementById('todayRequests').textContent = stats.today;
                document.getElementById('successRate').textContent = stats.successRate + '%';
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        }

        // 定期更新统计数据
        setInterval(updateStats, 60000);
    </script>
</body>
</html>
`; 