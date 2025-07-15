import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import cartService from "@/services/api/cartService";

const ProductCard = ({ product, onCartUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      const cartItem = {
        productId: product.Id,
        quantity: 1,
        variant: product.variants[0],
        price: product.price,
        name: product.name,
        image: product.images[0]
      };
      
      await cartService.addToCart(cartItem);
      toast.success("Added to cart!");
      
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
    setIsAddingToCart(false);
  };

  return (
    <motion.div
      className="card p-4 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.Id}`} className="block">
        <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {product.featured && (
            <Badge 
              variant="accent" 
              className="absolute top-2 left-2"
            >
              Featured
            </Badge>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="error">Out of Stock</Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              ${product.price}
            </span>
            
            <Badge variant="default" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
      </Link>
      
      {/* Quick Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isHovered && product.inStock ? 1 : 0, 
          y: isHovered && product.inStock ? 0 : 20 
        }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-4 left-4 right-4"
      >
        <Button
          variant="primary"
          size="sm"
          onClick={handleQuickAdd}
          isLoading={isAddingToCart}
          disabled={!product.inStock}
          className="w-full"
        >
          <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
          Quick Add
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;