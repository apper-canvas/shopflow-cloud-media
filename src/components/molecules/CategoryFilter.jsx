import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-card p-6"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <ApperIcon name="Filter" size={20} className="mr-2 text-primary-600" />
        Categories
      </h3>
      
      <div className="space-y-2">
<Button
          variant={!selectedCategory ? "primary" : "ghost"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="w-full justify-start"
        >
          <ApperIcon name="Grid3X3" size={16} className="mr-2" />
          All Products
        </Button>
        
{categories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "primary" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange(category.name)}
            className="w-full justify-between"
          >
            <span className="flex items-center">
              <ApperIcon name="Tag" size={16} className="mr-2" />
              {category.name}
            </span>
            <span className="text-xs opacity-70">
              {category.count}
            </span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;