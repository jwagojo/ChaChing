import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002; // Changed from 3001

app.use(cors());
app.use(express.json());

const LOGS_DIR = path.join(__dirname, '..', 'Logs');

// Ensure Logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Get log filename for a specific date
const getLogFilename = (date) => {
  return path.join(LOGS_DIR, `${date}.json`);
};

// Get all log files
app.get('/api/logs', (req, res) => {
  try {
    const files = fs.readdirSync(LOGS_DIR)
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse();
    
    const allLogs = [];
    files.forEach(file => {
      const filePath = path.join(LOGS_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      allLogs.push(...data);
    });
    
    res.json(allLogs);
  } catch (error) {
    console.error('Error reading logs:', error);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// Get logs for a specific date
app.get('/api/logs/:date', (req, res) => {
  try {
    const filename = getLogFilename(req.params.date);
    
    if (!fs.existsSync(filename)) {
      return res.json([]);
    }
    
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading log file:', error);
    res.status(500).json({ error: 'Failed to read log file' });
  }
});

// Save a new closing
app.post('/api/logs', (req, res) => {
  try {
    const closingData = req.body;
    const date = new Date().toISOString().split('T')[0];
    const filename = getLogFilename(date);
    
    let logs = [];
    if (fs.existsSync(filename)) {
      logs = JSON.parse(fs.readFileSync(filename, 'utf8'));
    }
    
    const closing = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...closingData,
      timestamp: new Date().toISOString(),
      date: date
    };
    
    logs.push(closing);
    fs.writeFileSync(filename, JSON.stringify(logs, null, 2));
    
    res.json(closing);
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

// Update an existing closing
app.put('/api/logs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    const files = fs.readdirSync(LOGS_DIR).filter(file => file.endsWith('.json'));
    let found = false;
    
    for (const file of files) {
      const filePath = path.join(LOGS_DIR, file);
      let logs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const index = logs.findIndex(log => log.id === id);
      if (index !== -1) {
        // Keep original id, timestamp, and date, but update everything else
        logs[index] = { 
          ...logs[index], 
          ...updatedData, 
          id,
          timestamp: logs[index].timestamp,
          date: logs[index].date
        };
        fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
        found = true;
        res.json(logs[index]);
        break;
      }
    }
    
    if (!found) {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ error: 'Failed to update log' });
  }
});

// Delete a closing
app.delete('/api/logs/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const files = fs.readdirSync(LOGS_DIR).filter(file => file.endsWith('.json'));
    let found = false;
    
    for (const file of files) {
      const filePath = path.join(LOGS_DIR, file);
      let logs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const filteredLogs = logs.filter(log => log.id !== id);
      if (filteredLogs.length !== logs.length) {
        fs.writeFileSync(filePath, JSON.stringify(filteredLogs, null, 2));
        found = true;
        res.json({ success: true });
        break;
      }
    }
    
    if (!found) {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
