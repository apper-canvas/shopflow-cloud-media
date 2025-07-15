import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "ShoppingBag", 
  title = "No items found", 
  message = "We couldn't find what you're looking for.", 
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;