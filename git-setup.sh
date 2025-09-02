#!/bin/bash

# ✨ tf-demo-app GitHub初回プッシュスクリプト
# Repository: https://github.com/peaske/tf-demo-app

echo "🚀 GitHub初回プッシュを開始します..."

# Git初期化
echo "📁 Git初期化中..."
git init

# リモートリポジトリ設定
echo "🔗 リモートリポジトリ設定中..."
git remote add origin https://github.com/peaske/tf-demo-app.git

# メインブランチ設定
echo "🌟 メインブランチ設定中..."
git branch -M main

# ファイル追加
echo "📝 ファイル追加中..."
git add .

# 初回コミット
echo "💾 初回コミット作成中..."
git commit -m "feat: 初回コミット - フルスタックタスク管理アプリ

✨ Features:
- Node.js + Express + SQLite バックエンド
- React (vanilla) フロントエンド
- ドラッグ&ドロップでタスク並び替え
- CRUD操作完備
- シンプル白背景デザイン
- レスポンシブ対応

🔧 Tech Stack:
- Backend: Node.js, Express, SQLite
- Frontend: React, HTML/CSS/JavaScript
- Dependencies: react-beautiful-dnd, cors, dotenv
- Port: 3005

📋 API Endpoints:
- GET /api/tasks - 全タスク取得
- POST /api/tasks - タスク作成
- PUT /api/tasks/:id - タスク更新
- DELETE /api/tasks/:id - タスク削除

🎯 Ready for production deployment!"

# GitHub プッシュ
echo "⬆️  GitHub プッシュ中..."
git push -u origin main

echo "✅ GitHub プッシュ完了！"
echo "🌐 Repository: https://github.com/peaske/tf-demo-app"
