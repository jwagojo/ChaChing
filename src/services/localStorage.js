class LocalStorageService {
  constructor() {
    this.storageKey = 'register-closings';
  }

  // Get all closings from localStorage
  getAllClosings() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  }

  // Save closing for a specific date
  saveClosing(closingData) {
    try {
      const allClosings = this.getAllClosings();
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!allClosings[date]) {
        allClosings[date] = [];
      }

      const closing = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...closingData,
        timestamp: new Date().toISOString(),
        date: date
      };

      allClosings[date].push(closing);
      localStorage.setItem(this.storageKey, JSON.stringify(allClosings));
      
      return closing;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  // Get closings for a specific date
  getClosingsByDate(date) {
    const allClosings = this.getAllClosings();
    return allClosings[date] || [];
  }

  // Get closings for current date
  getTodaysClosings() {
    const today = new Date().toISOString().split('T')[0];
    return this.getClosingsByDate(today);
  }

  // Get all closings sorted by date (most recent first)
  getAllClosingsSorted() {
    const allClosings = this.getAllClosings();
    const sorted = [];
    
    Object.keys(allClosings)
      .sort()
      .reverse()
      .forEach(date => {
        allClosings[date].forEach(closing => {
          sorted.push(closing);
        });
      });
    
    return sorted;
  }

  // Get closings by closer name
  getClosingsByCloser(closerName) {
    const allClosings = this.getAllClosingsSorted();
    return allClosings.filter(closing => 
      closing.closer.toLowerCase().includes(closerName.toLowerCase())
    );
  }

  // Export data as JSON file
  exportToJSON() {
    const data = this.getAllClosings();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `register-closings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Import data from JSON
  importFromJSON(jsonData) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAll() {
    localStorage.removeItem(this.storageKey);
  }
}

export const localStorageService = new LocalStorageService();
