name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    # 强制使用 Node.js 24，消除弃用警告
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22 # 稳定版，兼容 Cloudflare

      - name: Setup PNPM
        uses: pnpm/action-setup@v4
        with:
          version: latest
          run_install: false

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build project
        run: pnpm build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy --project-name=moontv-plus dist
