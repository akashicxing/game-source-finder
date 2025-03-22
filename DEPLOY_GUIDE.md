# Cloudflare Workers 项目部署指南

本指南基于成功部署 game-source-finder 项目的经验，帮助你快速部署新的 Cloudflare Workers 项目。

## 前置条件

### 1. 开发环境
- Node.js (LTS版本)
- Git
- VS Code 或其他编辑器
- 科学上网环境（访问 Cloudflare）

### 2. 账号准备
- Gitee 账号（代码托管）
- GitHub 账号（代码备份）
- Cloudflare 账号（项目部署）
- Spaceship 账号（域名注册，或其他域名注册商）

### 3. 已有配置
- Gitee 和 GitHub 已配置 SSH key
- Gitee 已配置 Personal Access Token
- GitHub 已配置 Personal Access Token（用于 Gitee 同步）

## 部署步骤

### 1. 代码仓库设置

1. 在 Gitee 创建仓库：
   - 选择 "新建仓库"
   - 添加项目描述
   - 选择开源许可证（如 MIT）
   - 初始化仓库

2. 配置 Gitee 和 GitHub 同步：
   - 在 Gitee 仓库管理中选择 "仓库镜像管理"
   - 添加 GitHub 仓库地址
   - 配置 GitHub Personal Access Token

### 2. 本地项目设置

1. 克隆仓库：
```bash
git clone https://gitee.com/your-username/your-project.git
cd your-project
```

2. 创建 Worker 项目：
```bash
npm create cloudflare@latest
# 选择 "Workers"
# 选择项目名称
# 选择 TypeScript
```

3. 项目结构：
```
your-project/
├── worker/
│   ├── src/
│   │   ├── index.ts
│   │   └── handlers/
│   ├── wrangler.toml
│   └── package.json
└── README.md
```

### 3. Cloudflare 配置

1. 登录 Cloudflare：
```bash
npx wrangler login
```

2. 配置 wrangler.toml：
```toml
name = "your-project"
main = "src/index.ts"
compatibility_date = "2024-03-07"

[dev]
port = 8778
```

3. 本地开发：
```bash
cd worker
npm run dev
```

### 4. 域名配置

1. 在域名注册商（如 Spaceship）设置 Cloudflare nameservers：
   - kellen.ns.cloudflare.com
   - olga.ns.cloudflare.com

2. 在 Cloudflare 添加域名：
   - 添加 A 记录
   - 开启代理（橙色云朵）
   - 等待 DNS 生效

3. 配置 Workers 路由：
   - 在 Cloudflare 控制台选择域名
   - 进入 Workers 路由
   - 添加路由规则：`your-domain.com/*`

### 5. 部署

1. 部署到 Cloudflare：
```bash
cd worker
npx wrangler deploy
```

2. 验证部署：
```bash
curl https://your-domain.com/health
```

## 常见问题

### DNS 设置
- 确保 nameservers 正确配置
- 等待 DNS 生效（最长24小时）
- 检查 SSL/TLS 设置

### 部署问题
- 确保在正确目录执行命令
- 检查 wrangler.toml 配置
- 验证 Cloudflare 登录状态

### 代码同步
- 优先推送到 Gitee
- 等待自动同步到 GitHub
- 检查同步状态

## 限制说明

Cloudflare Workers 免费版限制：
- 每天 100,000 请求
- 最多 30 个 Workers
- CPU 时间：10ms/请求

## 维护建议

1. 定期更新依赖
2. 监控请求量
3. 备份代码和配置
4. 保存所有访问凭证

## 参考资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Gitee 文档](https://gitee.com/help)
- [GitHub 文档](https://docs.github.com)