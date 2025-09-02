const db = require('../models/database');

console.log('🔧 Initializing database...');

// サンプルタスクの作成
const sampleTasks = [
  {
    title: '買い物リスト作成',
    description: '今週の食材をリストアップする',
    priority: 2
  },
  {
    title: '掃除',
    description: 'リビングと寝室の掃除',
    priority: 1
  },
  {
    title: '病院予約',
    description: '来月の健康診断の予約を取る',
    priority: 3
  }
];

async function initializeDatabase() {
  try {
    console.log('📝 Creating sample tasks...');
    
    for (const task of sampleTasks) {
      const result = await db.createTask(task);
      console.log(`✅ Created task: ${task.title} (ID: ${result.id})`);
    }
    
    console.log('🎉 Database initialization completed!');
    console.log('💡 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
}

initializeDatabase();