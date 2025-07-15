import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import cartService from "@/services/api/cartService";

const CartItem = ({ item, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const updateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      setQuantity(newQuantity);
      await cartService.updateQuantity(item.Id, newQuantity);
      onUpdate();
    } catch (error) {
      toast.error("Failed to update quantity");
      setQuantity(item.quantity);
    }
    setIsUpdating(false);
  };

  const removeItem = async () => {
    setIsUpdating(true);
    try {
      await cartService.removeFromCart(item.Id);
      toast.success("Item removed from cart");
      onUpdate();
    } catch (error) {
      toast.error("Failed to remove item");
    }
    setIsUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-card"
    >
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
            {item.variant.size && `Size: ${item.variant.size}`}
            {item.variant.size && item.variant.color && " • "}
            {item.variant.color && `Color: ${item.variant.color}`}
          </p>
        )}
        
        <p className="text-lg font-semibold text-primary-600">
          ${item.price}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
          className="p-2"
        >
          <ApperIcon name="Minus" size={16} />
        </Button>
        
        <span className="w-8 text-center font-medium">
          {quantity}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={isUpdating}
          className="p-2"
        >
          <ApperIcon name="Plus" size={16} />
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={removeItem}
        disabled={isUpdating}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <ApperIcon name="Trash2" size={16} />
      </Button>
    </motion.div>
  );
};

export default CartItem;