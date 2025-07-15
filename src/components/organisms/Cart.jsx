import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CartItem from "@/components/molecules/CartItem";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import cartService from "@/services/api/cartService";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [cartData, totalAmount] = await Promise.all([
        cartService.getCart(),
        cartService.getCartTotal()
      ]);
      setCart(cartData);
      setTotal(totalAmount);
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const handleCartUpdate = () => {
    loadCart();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="cart" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadCart} />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="ShoppingCart"
          title="Your cart is empty"
          message="Add some products to your cart and they will appear here."
          actionLabel="Start Shopping"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-lg text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <CartItem
                  key={item.Id}
                  item={item}
                  onUpdate={handleCartUpdate}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-50 rounded-lg p-6 h-fit space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/checkout" className="block">
                <Button variant="primary" size="lg" className="w-full">
                  <ApperIcon name="CreditCard" size={20} className="mr-2" />
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link to="/" className="block">
                <Button variant="secondary" size="lg" className="w-full">
                  <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Security Features */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" size={16} className="text-green-600" />
                <span className="text-sm text-gray-600">Secure checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Truck" size={16} className="text-green-600" />
                <span className="text-sm text-gray-600">Free shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="RotateCcw" size={16} className="text-green-600" />
                <span className="text-sm text-gray-600">30-day returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;