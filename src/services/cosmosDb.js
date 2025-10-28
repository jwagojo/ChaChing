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
      const { resource: createdItem } = await this.container.items.create({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...closingData,
        createdAt: new Date().toISOString(),
        type: 'register-closing'
      });
      return createdItem;
    } catch (error) {
      console.error('Error creating register closing:', error);
      throw error;
    }
  }

  async getRegisterClosings(limit = 50) {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.type = 'register-closing' ORDER BY c.createdAt DESC",
        parameters: []
      };
      
      const { resources: items } = await this.container.items
        .query(querySpec)
        .fetchNext();
      
      return items.slice(0, limit);
    } catch (error) {
      console.error('Error fetching register closings:', error);
      throw error;
    }
  }

  async getRegisterClosingsByCloser(closerName, limit = 20) {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.type = 'register-closing' AND c.closer = @closer ORDER BY c.createdAt DESC",
        parameters: [{ name: "@closer", value: closerName }]
      };
      
      const { resources: items } = await this.container.items
        .query(querySpec)
        .fetchNext();
      
      return items.slice(0, limit);
    } catch (error) {
      console.error('Error fetching closings by closer:', error);
      throw error;
    }
  }
}

export const cosmosDbService = new CosmosDbService();
