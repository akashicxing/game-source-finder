# 游戏源地址查找器game-source-finder

一个使用 Cloudflare Workers 查找在线游戏 iframe 源地址的工具。

## 在线使用

访问：[https://gamesource-finder.online](https://gamesource-finder.online)

## 功能特点

- 提取在线游戏网站的游戏源地址
- 提供Web界面进行测试
- 支持API接口调用
- 支持多个游戏平台

## 本地开发

### 环境要求

- Node.js (LTS版本)
- npm 或 yarn
- Cloudflare 账号

### 代码仓库同步说明

本项目同时托管在 Gitee 和 GitHub 上：

- Gitee: https://gitee.com/akashicxing/game-source-finder
- GitHub: https://github.com/akashicxing/game-source-finder

#### 本地仓库设置

1. 克隆 Gitee 仓库：
```bash
git clone https://gitee.com/akashicxing/game-source-finder.git
cd game-source-finder
```

2. 添加 GitHub 远程仓库（可选）：
```bash
git remote add github https://github.com/akashicxing/game-source-finder.git
```

#### Gitee 和 GitHub 自动同步

本项目使用 Gitee 的仓库镜像功能实现自动同步：

1. Gitee 更新会自动同步到 GitHub
2. 同步周期：实时触发，最长等待时间 30 分钟
3. 同步方向：Gitee -> GitHub（单向）

注意：请优先向 Gitee 仓库提交代码，系统会自动同步到 GitHub。

### 安装步骤

1. 克隆仓库：
```bash
git clone <仓库地址>
cd game-source-finder
```

2. 安装依赖：
```bash
cd worker
npm install
```

3. 运行开发服务器：
```bash
npm run dev
```

访问 `http://localhost:8787` 进行本地测试。

## 部署流程

### 1. Cloudflare 设置

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com)
2. 进入 Workers & Pages
3. 创建新项目

### 2. 部署命令

1. 登录 Cloudflare（如果还未登录）：
```bash
npx wrangler login
```

2. 部署到 Cloudflare Workers：
```bash
cd worker
npm run deploy
```

### 3. 自定义域名设置（可选）

1. 进入 Cloudflare 控制台
2. 选择你的域名
3. 进入 DNS 设置
4. 添加新记录：
   - 类型：CNAME
   - 名称：game-finder（或你想要的子域名）
   - 目标：your-worker.your-subdomain.workers.dev
   - 代理状态：已代理

## API 使用说明

### 查找游戏源地址

```bash
curl -X POST https://gamesource-finder.online \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.onlinegames.io/monster-survivors/"}'
```

返回示例：
```json
{
  "source": "https://cloud.onlinegames.io/games/2025/unity/monster-survivors/index-og.html"
}
```

### 健康检查

```bash
curl https://gamesource-finder.online/health
```

## 错误处理

- 400: URL 参数缺失
- 403: 访问被拒绝
- 404: 未找到游戏源地址
- 500: 服务器内部错误

## 开发说明

- 源代码在 `worker/src` 目录下
- 使用 TypeScript 开发
- 支持本地开发和调试
- 自动部署到 Cloudflare Workers

## 许可证

MIT 