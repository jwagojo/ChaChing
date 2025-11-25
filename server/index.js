const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'logs.json');

app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Get all logs
app.get('/api/logs', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const logs = JSON.parse(data);
    res.json(logs);
  } catch (error) {
    console.error('Error reading logs:', error);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// Get logs by date
app.get('/api/logs/:date', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const logs = JSON.parse(data);
    const filteredLogs = logs.filter(log => log.date === req.params.date);
    res.json(filteredLogs);
  } catch (error) {
    console.error('Error reading logs:', error);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// Save new log
app.post('/api/logs', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const logs = JSON.parse(data);
    
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...req.body
    };
    
    logs.push(newLog);
    await fs.writeFile(DATA_FILE, JSON.stringify(logs, null, 2));
    res.json(newLog);
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

// Update log
app.put('/api/logs/:id', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const logs = JSON.parse(data);
    
    const index = logs.findIndex(log => log.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Log not found' });
    }
    
    logs[index] = {
      ...logs[index],
      ...req.body,
      timestamp: new Date().toISOString()
    };
    
    await fs.writeFile(DATA_FILE, JSON.stringify(logs, null, 2));
    res.json(logs[index]);
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ error: 'Failed to update log' });
  }
});

// Delete log
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const logs = JSON.parse(data);
    
    const filteredLogs = logs.filter(log => log.id !== req.params.id);
    await fs.writeFile(DATA_FILE, JSON.stringify(filteredLogs, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

initDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
