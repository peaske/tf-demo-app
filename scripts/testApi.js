#!/usr/bin/env node

const BASE_URL = 'http://localhost:3001/api';

// テスト用のヘルパー関数
async function apiTest(method, endpoint, data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    
    console.log(`\n🔍 ${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error testing ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('Make sure the server is running on http://localhost:3001\n');
  
  // Health Check
  await apiTest('GET', '/health');
  
  // Get all tasks
  await apiTest('GET', '/tasks');
  
  // Create a new task
  const newTask = await apiTest('POST', '/tasks', {
    title: 'テスト用タスク',
    description: 'API テスト用のサンプルタスク',
    priority: 2
  });
  
  if (newTask && newTask.data.success) {
    const taskId = newTask.data.data.id;
    
    // Get specific task
    await apiTest('GET', `/tasks/${taskId}`);
    
    // Update task
    await apiTest('PUT', `/tasks/${taskId}`, {
      title: '更新されたタスク',
      status: 'completed',
      priority: 1
    });
    
    // Get updated task
    await apiTest('GET', `/tasks/${taskId}`);
    
    // Delete task
    await apiTest('DELETE', `/tasks/${taskId}`);
  }
  
  // Test validation errors
  console.log('\n🔍 Testing Validation Errors:');
  
  // Invalid task creation
  await apiTest('POST', '/tasks', {
    description: 'タイトルなしのタスク'
  });
  
  // Invalid priority
  await apiTest('POST', '/tasks', {
    title: 'Invalid Priority Task',
    priority: 5
  });
  
  // Invalid ID
  await apiTest('GET', '/tasks/invalid');
  
  console.log('\n✅ API Tests Completed!');
}

// メイン実行
if (require.main === module) {
  // Node.js環境でfetch APIを使用するための設定
  if (!global.fetch) {
    console.log('📦 Installing fetch for Node.js...');
    import('node-fetch').then(({ default: fetch }) => {
      global.fetch = fetch;
      runTests();
    }).catch(() => {
      console.log('❌ Please install node-fetch: npm install node-fetch');
      console.log('Or test manually using curl commands below:\n');
      
      console.log('# Get all tasks');
      console.log(`curl ${BASE_URL}/tasks`);
      
      console.log('\n# Create task');
      console.log(`curl -X POST ${BASE_URL}/tasks -H "Content-Type: application/json" -d '{"title":"Test Task","priority":1}'`);
      
      console.log('\n# Get health');
      console.log(`curl ${BASE_URL}/health`);
    });
  } else {
    runTests();
  }
}

module.exports = { apiTest, runTests };