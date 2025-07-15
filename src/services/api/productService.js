import productsData from "@/services/mockData/products.json";

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll(filters = {}) {
    await this.delay();
    let filteredProducts = [...this.products];

    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice);
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    if (filters.featured) {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    return filteredProducts;
  }

  async getById(id) {
    await this.delay();
    const product = this.products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  }

  async getFeatured() {
    await this.delay();
    return this.products.filter(product => product.featured).map(p => ({ ...p }));
  }

  async getCategories() {
    await this.delay();
    const categories = [...new Set(this.products.map(p => p.category))];
    return categories.map(category => ({
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      count: this.products.filter(p => p.category === category).length
    }));
  }

  async searchProducts(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }));
  }
}

export default new ProductService();