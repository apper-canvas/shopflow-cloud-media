import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import cartService from "@/services/api/cartService";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const [cartData, totalAmount] = await Promise.all([
        cartService.getCart(),
        cartService.getCartTotal()
      ]);
      
if (cartData.length === 0) {
        navigate("/cart");
        return;
      }
      
      setCart(cartData);
      setTotal(totalAmount);
    } catch (error) {
      toast.error("Failed to load cart");
      navigate("/cart");
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Shipping validation
    if (!shippingInfo.firstName.trim()) newErrors.firstName = "First name is required";
    if (!shippingInfo.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    // Payment validation
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
    if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required";
    if (!paymentInfo.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      await cartService.clearCart();
      
      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { 
        state: { 
          orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
          total: total * 1.08,
          items: cart
        }
      });
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
    
    setIsProcessing(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Checkout Form */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ApperIcon name="Truck" size={20} className="mr-2 text-primary-600" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  required
                  value={shippingInfo.firstName}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  error={errors.firstName}
                />
                
                <FormField
                  label="Last Name"
                  required
                  value={shippingInfo.lastName}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  error={errors.lastName}
                />
                
                <FormField
                  label="Email"
                  type="email"
                  required
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                  error={errors.email}
                  className="md:col-span-2"
                />
                
                <FormField
                  label="Phone"
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                  error={errors.phone}
                  className="md:col-span-2"
                />
                
                <FormField
                  label="Address"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                  error={errors.address}
                  className="md:col-span-2"
                />
                
                <FormField
                  label="City"
                  required
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                  error={errors.city}
                />
                
                <FormField
                  label="State"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                  error={errors.state}
                />
                
                <FormField
                  label="Zip Code"
                  required
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                  error={errors.zipCode}
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ApperIcon name="CreditCard" size={20} className="mr-2 text-primary-600" />
                Payment Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Name on Card"
                  required
                  value={paymentInfo.nameOnCard}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                  error={errors.nameOnCard}
                  className="md:col-span-2"
                />
                
                <FormField
                  label="Card Number"
                  required
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                  error={errors.cardNumber}
                  className="md:col-span-2"
                />
                
                <FormField
                  label="Expiry Date"
                  required
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                  error={errors.expiryDate}
                />
                
                <FormField
                  label="CVV"
                  required
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                  error={errors.cvv}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              className="w-full"
            >
              <ApperIcon name="CreditCard" size={20} className="mr-2" />
              {isProcessing ? "Processing Payment..." : `Place Order - $${(total * 1.08).toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 h-fit space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
          
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.Id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {item.name}
                  </h4>
                  {item.variant && (
                    <p className="text-sm text-gray-600">
                      {item.variant.size && `${item.variant.size}`}
                      {item.variant.size && item.variant.color && " • "}
                      {item.variant.color}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
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
            <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
              <span>Total</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Shield" size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">Secure 256-bit SSL encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Truck" size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">Free shipping on all orders</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="RotateCcw" size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;