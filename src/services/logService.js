const API_URL = 'http://localhost:3001/api';

class LogService {
  async getAllLogs() {
    try {
      const response = await fetch(`${API_URL}/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching logs:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the server is running.');
      }
      throw error;
    }
  }

  async getLogsByDate(date) {
    try {
      const response = await fetch(`${API_URL}/logs/${date}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching logs by date:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the server is running.');
      }
      throw error;
    }
  }

  async saveLog(closingData) {
    try {
      const response = await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(closingData)
      });
      if (!response.ok) throw new Error('Failed to save log');
      return await response.json();
    } catch (error) {
      console.error('Error saving log:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the server is running.');
      }
      throw error;
    }
  }

  async updateLog(id, updatedData) {
    try {
      const response = await fetch(`${API_URL}/logs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Failed to update log');
      return await response.json();
    } catch (error) {
      console.error('Error updating log:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the server is running.');
      }
      throw error;
    }
  }

  async deleteLog(id) {
    try {
      const response = await fetch(`${API_URL}/logs/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete log');
      return await response.json();
    } catch (error) {
      console.error('Error deleting log:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the server is running.');
      }
      throw error;
    }
  }
}

export const logService = new LogService();
