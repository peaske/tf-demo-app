const { useState, useEffect } = React;
const { DragDropContext, Droppable, Draggable } = window.DragDropContext ? window : { DragDropContext: null, Droppable: null, Draggable: null };

// API関数
const api = {
  async getTasks() {
    const response = await fetch('/api/tasks');
    return response.json();
  },
  
  async createTask(task) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return response.json();
  },
  
  async updateTask(id, task) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return response.json();
  },
  
  async deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// 優先度ラベル
const priorityLabels = {
  1: '高',
  2: '中', 
  3: '低'
};

// タスクアイテムコンポーネント（シンプル版）
function TaskItem({ task, index, onComplete, onEdit, onDelete }) {
  return React.createElement('div', {
    className: `task-item priority-${task.priority} ${task.status === 'completed' ? 'completed' : ''}`
  }, [
    React.createElement('div', { key: 'header', className: 'task-header' }, [
      React.createElement('h3', { key: 'title', className: 'task-title' }, task.title),
      React.createElement('span', { 
        key: 'priority',
        className: 'task-priority' 
      }, priorityLabels[task.priority])
    ]),
    task.description && React.createElement('p', { 
      key: 'description',
      className: 'task-description' 
    }, task.description),
    React.createElement('div', { key: 'actions', className: 'task-actions' }, [
      React.createElement('button', {
        key: 'complete',
        className: 'task-action complete',
        onClick: () => onComplete(task.id, task.status === 'pending' ? 'completed' : 'pending'),
        title: task.status === 'pending' ? '完了にする' : '未完了に戻す'
      }, React.createElement('i', { 
        className: task.status === 'pending' ? 'fas fa-check' : 'fas fa-undo'
      })),
      React.createElement('button', {
        key: 'edit',
        className: 'task-action edit',
        onClick: () => onEdit(task),
        title: '編集'
      }, React.createElement('i', { className: 'fas fa-edit' })),
      React.createElement('button', {
        key: 'delete',
        className: 'task-action delete',
        onClick: () => onDelete(task.id),
        title: '削除'
      }, React.createElement('i', { className: 'fas fa-trash' }))
    ])
  ]);
}

// タスクフォームコンポーネント
function TaskForm({ isOpen, editingTask, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 1);
    } else {
      setTitle('');
      setDescription('');
      setPriority(1);
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority: parseInt(priority)
    });
    
    setTitle('');
    setDescription('');
    setPriority(1);
  };

  if (!isOpen) return null;

  return React.createElement('form', {
    className: 'task-form show',
    onSubmit: handleSubmit
  }, [
    React.createElement('div', { key: 'title-group', className: 'form-group' }, [
      React.createElement('label', { key: 'title-label' }, 'タスク名 *'),
      React.createElement('input', {
        key: 'title-input',
        type: 'text',
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: 'やることを入力してください',
        required: true,
        autoFocus: true
      })
    ]),
    React.createElement('div', { key: 'description-group', className: 'form-group' }, [
      React.createElement('label', { key: 'description-label' }, '詳細'),
      React.createElement('textarea', {
        key: 'description-input',
        value: description,
        onChange: (e) => setDescription(e.target.value),
        placeholder: '詳細があれば入力してください',
        rows: 3
      })
    ]),
    React.createElement('div', { key: 'priority-group', className: 'form-group' }, [
      React.createElement('label', { key: 'priority-label' }, '優先度'),
      React.createElement('select', {
        key: 'priority-select',
        className: 'priority-select',
        value: priority,
        onChange: (e) => setPriority(parseInt(e.target.value))
      }, [
        React.createElement('option', { key: '1', value: 1 }, '🔥 高'),
        React.createElement('option', { key: '2', value: 2 }, '⚡ 中'),
        React.createElement('option', { key: '3', value: 3 }, '📝 低')
      ])
    ]),
    React.createElement('div', { key: 'actions', className: 'form-actions' }, [
      React.createElement('button', {
        key: 'cancel',
        type: 'button',
        className: 'btn btn-secondary',
        onClick: onCancel
      }, 'キャンセル'),
      React.createElement('button', {
        key: 'submit',
        type: 'submit',
        className: 'btn btn-primary'
      }, editingTask ? '更新' : '追加')
    ])
  ]);
}

// メインアプリコンポーネント
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // タスク読み込み
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.getTasks();
      if (response.success) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('タスクの読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 統計計算
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  // タスク作成
  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.createTask(taskData);
      if (response.success) {
        setTasks(prev => [response.data, ...prev]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('タスク作成エラー:', error);
    }
  };

  // タスク更新
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    try {
      const response = await api.updateTask(editingTask.id, taskData);
      if (response.success) {
        setTasks(prev => prev.map(t => 
          t.id === editingTask.id ? { ...t, ...taskData } : t
        ));
        setShowForm(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error('タスク更新エラー:', error);
    }
  };

  // タスク削除
  const handleDeleteTask = async (taskId) => {
    if (!confirm('このタスクを削除しますか？')) return;
    
    try {
      const response = await api.deleteTask(taskId);
      if (response.success) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('タスク削除エラー:', error);
    }
  };

  // タスクステータス変更
  const handleCompleteTask = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await api.updateTask(taskId, { ...task, status: newStatus });
      if (response.success) {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: newStatus } : t
        ));
      }
    } catch (error) {
      console.error('タスクステータス更新エラー:', error);
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  // タスク編集開始
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // フォームキャンセル
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return React.createElement('div', { className: 'app' }, [
    // ヘッダー
    React.createElement('header', { key: 'header', className: 'header' },
      React.createElement('div', { className: 'header-content' }, [
        React.createElement('div', { key: 'logo', className: 'logo' }, '✨ タスク管理'),
        React.createElement('div', { key: 'stats', className: 'dashboard-stats' }, [
          React.createElement('div', { key: 'total', className: 'stat-item' }, [
            React.createElement('span', { className: 'stat-number' }, stats.total),
            React.createElement('span', { className: 'stat-label' }, '総タスク')
          ]),
          React.createElement('div', { key: 'completed', className: 'stat-item' }, [
            React.createElement('span', { className: 'stat-number' }, stats.completed),
            React.createElement('span', { className: 'stat-label' }, '完了')
          ]),
          React.createElement('div', { key: 'rate', className: 'stat-item' }, [
            React.createElement('span', { className: 'stat-number' }, `${stats.completionRate}%`),
            React.createElement('span', { className: 'stat-label' }, '達成率')
          ])
        ]),
        React.createElement('button', {
          key: 'add-btn',
          className: 'add-button',
          onClick: () => setShowForm(true)
        }, [
          React.createElement('i', { key: 'icon', className: 'fas fa-plus' }),
          ' タスク追加'
        ])
      ])
    ),

    // タスクフォーム
    React.createElement(TaskForm, {
      key: 'form',
      isOpen: showForm,
      editingTask,
      onSubmit: editingTask ? handleUpdateTask : handleCreateTask,
      onCancel: handleCancelForm
    }),

    // メインコンテンツ
    React.createElement('main', { key: 'main' }, 
      loading ? 
        React.createElement('div', { className: 'loading' }, [
          React.createElement('i', { key: 'icon', className: 'fas fa-spinner fa-spin', style: { fontSize: '24px', marginBottom: '10px' } }),
          React.createElement('p', { key: 'text' }, '読み込み中...')
        ]) :
      tasks.length === 0 ?
        React.createElement('div', { className: 'empty-state' }, [
          React.createElement('i', { key: 'icon', className: 'fas fa-tasks' }),
          React.createElement('h3', { key: 'title' }, 'タスクがまだありません'),
          React.createElement('p', { key: 'desc' }, '「タスク追加」ボタンから最初のタスクを作成しましょう')
        ]) :
        // ドラッグ&ドロップ一時的に無効化してシンプルなリスト表示
        React.createElement('div', { className: 'task-list' },
          tasks.map((task, index) =>
            React.createElement(TaskItem, {
              key: task.id,
              task,
              index,
              onComplete: handleCompleteTask,
              onEdit: handleEditTask,
              onDelete: handleDeleteTask
            })
          )
        )
    )
  ]);
}

// アプリをマウント
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));