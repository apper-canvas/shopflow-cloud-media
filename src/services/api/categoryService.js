class CategoryService {
  constructor() {
    this.tableName = 'category';
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(category => ({
        ...category,
        name: category.Name
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Category not found");
      }

      return {
        ...response.data,
        name: response.data.Name
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching category:", error?.response?.data?.message);
      } else {
        console.error("Error fetching category:", error.message);
      }
      throw new Error("Category not found");
    }
  }

  async create(categoryData) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create category");
      }

      return response.results[0].data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error("Error creating category:", error.message);
      }
      throw error;
    }
  }

  async update(id, categoryData) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Id: id,
          Name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to update category");
      }

      return response.results[0].data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
      } else {
        console.error("Error updating category:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to delete category");
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error("Error deleting category:", error.message);
      }
      throw error;
    }
  }
}

export default new CategoryService();