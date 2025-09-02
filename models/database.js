const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    const dbPath = process.env.DATABASE_PATH || './data/tasks.db';
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection error:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
        this.init();
      }
    });
  }

  init() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
        priority INTEGER DEFAULT 1 CHECK(priority BETWEEN 1 AND 3),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error('❌ Table creation error:', err.message);
      } else {
        console.log('✅ Tasks table ready');
      }
    });
  }

  // すべてのタスクを取得
  getAllTasks() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM tasks ORDER BY created_at DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // IDでタスクを取得
  getTaskById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM tasks WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // タスクを作成
  createTask(task) {
    return new Promise((resolve, reject) => {
      const { title, description, priority = 1 } = task;
      const sql = `
        INSERT INTO tasks (title, description, priority) 
        VALUES (?, ?, ?)
      `;
      this.db.run(sql, [title, description, priority], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...task });
        }
      });
    });
  }

  // タスクを更新
  updateTask(id, task) {
    return new Promise((resolve, reject) => {
      const { title, description, status, priority } = task;
      const sql = `
        UPDATE tasks 
        SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      this.db.run(sql, [title, description, status, priority, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  // タスクを削除
  deleteTask(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM tasks WHERE id = ?`;
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  // データベースを閉じる
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('📦 Database connection closed');
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();