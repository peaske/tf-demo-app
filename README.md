# Task Manager - フルスタック Web アプリケーション

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

**シンプルで美しいタスク管理アプリケーション**

[🚀 Live Demo](#) | [📖 Documentation](#installation) | [🐛 Report Bug](https://github.com/peaske/tf-demo-app/issues)

</div>

---

## 🌟 Features

- ✅ **CRUD Operations** - タスクの作成、読み取り、更新、削除
- 🎯 **Drag & Drop** - React Beautiful DnDによる直感的な並び替え
- 📱 **Responsive Design** - モバイル・デスクトップ完全対応
- 🎨 **Clean UI** - シンプル白背景デザイン
- ⚡ **Real-time Updates** - 即座に反映されるUI
- 🗃️ **SQLite Database** - 軽量で高速なローカルDB
- 🔒 **Input Validation** - 安全な入力検証
- 📊 **Priority Management** - 優先度レベル管理

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing

### Frontend  
- **React** (vanilla) - UI library
- **React Beautiful DnD** - Drag and drop
- **HTML/CSS/JavaScript** - Core web technologies

### Development
- **Nodemon** - Auto-restart development server
- **dotenv** - Environment variable management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/peaske/tf-demo-app.git
cd tf-demo-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize database with sample data**
```bash
npm run init-db
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3005
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get specific task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Example API Usage

**Create a task:**
```bash
curl -X POST http://localhost:3005/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"買い物","description":"週末の買い物","priority":2}'
```

**Get all tasks:**
```bash
curl http://localhost:3005/api/tasks
```

## 🏗️ Project Structure

```
tf-demo-app/
├── 📁 data/              # SQLite database files
├── 📁 middleware/        # Express middlewares
├── 📁 models/           # Database models & schema
├── 📁 public/           # Frontend static files
│   ├── index.html       # Main HTML file
│   └── app.js          # React application
├── 📁 routes/           # API route handlers
├── 📁 scripts/          # Utility scripts
├── 📄 server.js         # Express server entry point
├── 📄 package.json      # Dependencies and scripts
├── 📄 .env             # Environment variables
└── 📄 README.md        # Project documentation
```

## 🧪 Testing

Run the built-in API test suite:
```bash
npm test
```

Test individual endpoints:
```bash
node scripts/testApi.js
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_PATH=./data/tasks.db

# Server Configuration  
PORT=3005
NODE_ENV=development

# API Configuration
API_BASE_URL=http://localhost:3005/api
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run init-db` | Initialize SQLite database with sample data |
| `npm test` | Run API test suite |

## 🌍 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**peaske**
- GitHub: [@peaske](https://github.com/peaske)

## 🙏 Acknowledgments

- React Beautiful DnD for drag & drop functionality
- Express.js community for excellent documentation
- SQLite for lightweight database solution

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [peaske](https://github.com/peaske)

</div>
