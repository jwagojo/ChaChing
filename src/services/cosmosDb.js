import { CosmosClient } from "@azure/cosmos";

const endpoint = import.meta.env.VITE_COSMOS_ENDPOINT;
const key = import.meta.env.VITE_COSMOS_KEY;
const databaseId = import.meta.env.VITE_COSMOS_DATABASE_ID;
const containerId = import.meta.env.VITE_COSMOS_CONTAINER_ID;

class CosmosDbService {
  constructor() {
    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(databaseId);
    this.container = this.database.container(containerId);
  }

  async createRegisterClosing(closingData) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const { resource: createdItem } = await this.container.items.create({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...closingData,
        createdAt: new Date().toISOString(),
        date: date,
        type: 'register-closing'
      });
      return createdItem;
    } catch (error) {
      console.error('Error creating register closing:', error);
      throw error;
    }
  }

  async getRegisterClosings(limit = 100) {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.type = @type ORDER BY c.createdAt DESC",
        parameters: [{ name: "@type", value: "register-closing" }]
      };
      
      const { resources: items } = await this.container.items
        .query(querySpec)
        .fetchAll();
      
      return items.slice(0, limit);
    } catch (error) {
      console.error('Error fetching register closings:', error);
      throw error;
    }
  }

  async getRegisterClosingsByDate(date) {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.type = @type AND c.date = @date ORDER BY c.createdAt DESC",
        parameters: [
          { name: "@type", value: "register-closing" },
          { name: "@date", value: date }
        ]
      };
      
      const { resources: items } = await this.container.items
        .query(querySpec)
        .fetchAll();
      
      return items;
    } catch (error) {
      console.error('Error fetching closings by date:', error);
      throw error;
    }
  }

  async getRegisterClosingsByCloser(closerName) {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.type = @type AND CONTAINS(LOWER(c.closer), LOWER(@closer)) ORDER BY c.createdAt DESC",
        parameters: [
          { name: "@type", value: "register-closing" },
          { name: "@closer", value: closerName }
        ]
      };
      
      const { resources: items } = await this.container.items
        .query(querySpec)
        .fetchAll();
      
      return items;
    } catch (error) {
      console.error('Error fetching closings by closer:', error);
      throw error;
    }
  }

  async updateRegisterClosing(id, updatedData) {
    try {
      // First, get the existing item to retrieve its partition key
      const querySpec = {
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }]
      };
      
      const { resources: items } = await this.container.items
        .query(querySpec)
        .fetchAll();
      
      if (items.length === 0) {
        throw new Error('Item not found');
      }

      const existingItem = items[0];
      
      // Update the item while preserving original metadata
      const updatedItem = {
        ...existingItem,
        ...updatedData,
        id: existingItem.id,
        createdAt: existingItem.createdAt,
        date: existingItem.date,
        type: existingItem.type,
        updatedAt: new Date().toISOString()
      };

      const { resource: result } = await this.container
        .item(id, id)
        .replace(updatedItem);
      
      return result;
    } catch (error) {
      console.error('Error updating register closing:', error);
      throw error;
    }
  }

  async deleteRegisterClosing(id) {
    try {
      await this.container.item(id, id).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting register closing:', error);
      throw error;
    }
  }
}

export const cosmosDbService = new CosmosDbService();
