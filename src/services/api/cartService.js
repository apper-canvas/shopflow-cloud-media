class CartService {
  constructor() {
    this.tableName = 'cart_item';
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getCart() {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "quantity" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "product_id" } },
          { field: { Name: "variant_id" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match expected format
      return response.data.map(item => ({
        ...item,
        name: item.Name,
        productId: item.product_id,
        variant: item.variant_id ? { id: item.variant_id } : null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching cart:", error?.response?.data?.message);
      } else {
        console.error("Error fetching cart:", error.message);
      }
      return [];
    }
  }

  async addToCart(item) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      // Check if item already exists
      const existingItems = await this.getCart();
      const existingItem = existingItems.find(cartItem => 
        cartItem.productId === item.productId && 
        cartItem.variant?.size === item.variant?.size && 
        cartItem.variant?.color === item.variant?.color
      );

      if (existingItem) {
        // Update existing item quantity
        return await this.updateQuantity(existingItem.Id, existingItem.quantity + item.quantity);
      }

      // Create new cart item
      const params = {
        records: [{
          Name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          product_id: item.productId,
          variant_id: item.variant?.id || null
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to add item to cart");
      }

      return await this.getCart();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding to cart:", error?.response?.data?.message);
      } else {
        console.error("Error adding to cart:", error.message);
      }
      throw error;
    }
  }

  async updateQuantity(itemId, quantity) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      if (quantity <= 0) {
        return await this.removeFromCart(itemId);
      }

      const params = {
        records: [{
          Id: itemId,
          quantity: quantity
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to update cart item");
      }

      return await this.getCart();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating cart quantity:", error?.response?.data?.message);
      } else {
        console.error("Error updating cart quantity:", error.message);
      }
      throw error;
    }
  }

  async removeFromCart(itemId) {
    await this.delay();
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [itemId]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to remove item from cart");
      }

      return await this.getCart();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing from cart:", error?.response?.data?.message);
      } else {
        console.error("Error removing from cart:", error.message);
      }
      throw error;
    }
  }

  async clearCart() {
    await this.delay();
    try {
      const cart = await this.getCart();
      const itemIds = cart.map(item => item.Id);
      
      if (itemIds.length === 0) {
        return [];
      }

      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: itemIds
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to clear cart");
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error clearing cart:", error?.response?.data?.message);
      } else {
        console.error("Error clearing cart:", error.message);
      }
      throw error;
    }
  }

  async getCartTotal() {
    const cart = await this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  async getCartItemCount() {
    const cart = await this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}

export default new CartService();