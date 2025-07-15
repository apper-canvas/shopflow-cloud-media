class CartService {
  constructor() {
    this.cartKey = "shopflow_cart";
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  async getCart() {
    await this.delay();
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  async addToCart(item) {
    await this.delay();
    const cart = await this.getCart();
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.productId === item.productId && 
      cartItem.variant?.size === item.variant?.size && 
      cartItem.variant?.color === item.variant?.color
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push({ ...item, Id: Date.now() });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    return cart;
  }

  async updateQuantity(itemId, quantity) {
    await this.delay();
    const cart = await this.getCart();
    const itemIndex = cart.findIndex(item => item.Id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    return cart;
  }

  async removeFromCart(itemId) {
    await this.delay();
    const cart = await this.getCart();
    const updatedCart = cart.filter(item => item.Id !== itemId);
    localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
    return updatedCart;
  }

  async clearCart() {
    await this.delay();
    localStorage.removeItem(this.cartKey);
    return [];
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