class ProductService {
  constructor() {
    this.tableName = 'product';
    this.variantTableName = 'product_variant';
    this.categoryTableName = 'category';
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

  async getAll(filters = {}) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "in_stock" } },
          { field: { Name: "featured" } },
          { field: { Name: "Tags" } }
        ]
      };

      // Add search filter
      if (filters.search) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [{
            operator: "OR",
            conditions: [
              {
                fieldName: "Name",
                operator: "Contains",
                values: [filters.search]
              },
              {
                fieldName: "description",
                operator: "Contains",
                values: [filters.search]
              },
              {
                fieldName: "category",
                operator: "Contains",
                values: [filters.search]
              }
            ]
          }]
        }];
      }

      // Add category filter
      if (filters.category) {
        const whereCondition = {
          fieldName: "category",
          operator: "EqualTo",
          values: [filters.category]
        };
        
        if (params.whereGroups) {
          params.whereGroups.push({
            operator: "AND",
            subGroups: [{
              operator: "AND",
              conditions: [whereCondition]
            }]
          });
        } else {
          params.where = [whereCondition];
        }
      }

      // Add price filters
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const priceConditions = [];
        if (filters.minPrice !== undefined) {
          priceConditions.push({
            fieldName: "price",
            operator: "GreaterThanOrEqualTo",
            values: [filters.minPrice.toString()]
          });
        }
        if (filters.maxPrice !== undefined) {
          priceConditions.push({
            fieldName: "price",
            operator: "LessThanOrEqualTo",
            values: [filters.maxPrice.toString()]
          });
        }
        
        if (params.whereGroups) {
          params.whereGroups.push({
            operator: "AND",
            subGroups: [{
              operator: "AND",
              conditions: priceConditions
            }]
          });
        } else {
          params.where = priceConditions;
        }
      }

      // Add stock filter
      if (filters.inStock) {
        const stockCondition = {
          fieldName: "in_stock",
          operator: "EqualTo",
          values: [true]
        };
        
        if (params.whereGroups) {
          params.whereGroups.push({
            operator: "AND",
            subGroups: [{
              operator: "AND",
              conditions: [stockCondition]
            }]
          });
        } else {
          params.where = [stockCondition];
        }
      }

      // Add featured filter
      if (filters.featured) {
        const featuredCondition = {
          fieldName: "featured",
          operator: "EqualTo",
          values: [true]
        };
        
        if (params.whereGroups) {
          params.whereGroups.push({
            operator: "AND",
            subGroups: [{
              operator: "AND",
              conditions: [featuredCondition]
            }]
          });
        } else {
          params.where = [featuredCondition];
        }
      }

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Get variants for each product
      const productsWithVariants = await Promise.all(
        response.data.map(async (product) => {
          const variants = await this.getVariantsByProductId(product.Id);
          return {
            ...product,
            name: product.Name,
            inStock: product.in_stock,
            variants: variants || []
          };
        })
      );

      return productsWithVariants;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products:", error.message);
      }
      return [];
    }
  }

  async getVariantsByProductId(productId) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "size" } },
          { field: { Name: "color" } },
          { field: { Name: "stock" } }
        ],
        where: [
          {
            fieldName: "product_id",
            operator: "EqualTo",
            values: [productId]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.variantTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching variants:", error?.response?.data?.message);
      } else {
        console.error("Error fetching variants:", error.message);
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
          { field: { Name: "price" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "in_stock" } },
          { field: { Name: "featured" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Product not found");
      }

      const product = response.data;
      const variants = await this.getVariantsByProductId(product.Id);
      
      return {
        ...product,
        name: product.Name,
        inStock: product.in_stock,
        variants: variants || []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching product:", error?.response?.data?.message);
      } else {
        console.error("Error fetching product:", error.message);
      }
      throw new Error("Product not found");
    }
  }

  async getFeatured() {
    await this.delay();
    return this.getAll({ featured: true });
  }

  async getCategories() {
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

      const response = await apperClient.fetchRecords(this.categoryTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Get product count for each category
      const categoriesWithCount = await Promise.all(
        response.data.map(async (category) => {
          const products = await this.getAll({ category: category.Name });
          return {
            name: category.Name,
            slug: category.slug,
            count: products.length
          };
        })
      );

      return categoriesWithCount;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
      }
      return [];
    }
  }

  async searchProducts(query) {
    await this.delay();
    return this.getAll({ search: query });
  }
}

export default new ProductService();