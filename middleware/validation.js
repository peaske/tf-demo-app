// リクエストログ用ミドルウェア
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📡 [${timestamp}] ${req.method} ${req.path}`);
  
  if (Object.keys(req.body).length > 0) {
    console.log(`📝 Body:`, req.body);
  }
  
  next();
};

// タスクバリデーション用ミドルウェア
const validateTask = (req, res, next) => {
  const { title, priority, status } = req.body;
  
  // タイトルの検証
  if (req.method === 'POST' && !title) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Title is required'
    });
  }
  
  if (title && typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Title must be a string'
    });
  }
  
  if (title && title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Title cannot be empty'
    });
  }
  
  // 優先度の検証
  if (priority !== undefined) {
    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 3) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Priority must be 1, 2, or 3'
      });
    }
    req.body.priority = priorityNum;
  }
  
  // ステータスの検証
  if (status && !['pending', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Status must be either "pending" or "completed"'
    });
  }
  
  next();
};

// ID パラメータ検証用ミドルウェア
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Invalid ID parameter'
    });
  }
  
  req.params.id = parseInt(id);
  next();
};

module.exports = {
  requestLogger,
  validateTask,
  validateId
};