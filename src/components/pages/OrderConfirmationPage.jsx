import { useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const orderData = location.state;

  if (!orderData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="Check" size={40} className="text-white" />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold text-gray-900">#{orderData.orderNumber}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-gray-900">${orderData.total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items:</span>
              <span className="font-semibold text-gray-900">
                {orderData.items.reduce((total, item) => total + item.quantity, 0)} items
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-card p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.Id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  {item.variant && (
                    <p className="text-sm text-gray-600">
                      {item.variant.size && `${item.variant.size}`}
                      {item.variant.size && item.variant.color && " • "}
                      {item.variant.color}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
          <div className="text-blue-800 space-y-2 text-left">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Mail" size={16} />
              <span>You'll receive an email confirmation shortly</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Package" size={16} />
              <span>Your order will be processed within 1-2 business days</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Truck" size={16} />
              <span>Shipping typically takes 3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = "/"}
            className="px-8"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Continue Shopping
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.print()}
            className="px-8"
          >
            <ApperIcon name="Printer" size={20} className="mr-2" />
            Print Receipt
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;