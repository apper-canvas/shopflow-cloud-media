import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import cartService from "@/services/api/cartService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
const productData = await productService.getById(id);
      setProduct(productData);
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    setIsAddingToCart(true);
    try {
      const cartItem = {
productId: product.Id,
        quantity,
        variant: selectedVariant,
        price: product.price,
        name: product.Name || product.name,
        image: Array.isArray(product.images) ? product.images[0] : product.images
      };
      
      await cartService.addToCart(cartItem);
      toast.success(`${quantity} item(s) added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
    setIsAddingToCart(false);
  };

  if (loading) {
    return <Loading type="product-detail" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return <Error message="Product not found" />;
  }

const availableSizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : [];
  const availableColors = product.variants ? [...new Set(product.variants
    .filter(v => !selectedVariant?.size || v.size === selectedVariant.size)
    .map(v => v.color))] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
<img
              src={Array.isArray(product.images) ? product.images[selectedImage] : product.images}
              alt={product.Name || product.name}
              className="w-full h-full object-cover"
            />
            
            {product.featured && (
              <Badge variant="accent" className="absolute top-4 left-4">
                Featured
              </Badge>
            )}
            
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="error" className="text-lg py-2 px-4">
                  Out of Stock
                </Badge>
              </div>
            )}
          </motion.div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                    selectedImage === index ? "ring-2 ring-primary-500" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="default" className="mb-2">
              {product.category}
            </Badge>
<h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.Name || product.name}
            </h1>
            <p className="text-3xl font-bold text-primary-600">
              ${product.price}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selection */}
          <div className="space-y-4">
            {/* Size Selection */}
            {availableSizes.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedVariant?.size === size ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => {
                        const newVariant = product.variants.find(v => 
                          v.size === size && 
                          (!selectedVariant?.color || v.color === selectedVariant.color)
                        );
                        setSelectedVariant(newVariant || product.variants.find(v => v.size === size));
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedVariant?.color === color ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => {
                        const newVariant = product.variants.find(v => 
                          v.color === color && 
                          (!selectedVariant?.size || v.size === selectedVariant.size)
                        );
                        setSelectedVariant(newVariant || product.variants.find(v => v.color === color));
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
              <p className="text-sm text-gray-600">
                {selectedVariant.stock > 0 ? (
                  <span className="text-green-600">
                    <ApperIcon name="Check" size={16} className="inline mr-1" />
                    {selectedVariant.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-600">
                    <ApperIcon name="X" size={16} className="inline mr-1" />
                    Out of stock
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">
                Quantity:
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2"
                >
                  <ApperIcon name="Minus" size={16} />
                </Button>
                <span className="w-12 text-center font-medium">
                  {quantity}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedVariant && quantity >= selectedVariant.stock}
                  className="p-2"
                >
                  <ApperIcon name="Plus" size={16} />
                </Button>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            isLoading={isAddingToCart}
disabled={!product.inStock || !selectedVariant || (selectedVariant && selectedVariant.stock === 0)}
            className="w-full"
          >
            <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>

          {/* Product Features */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Truck" size={16} className="text-primary-600" />
                <span className="text-sm text-gray-600">Free shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="RotateCcw" size={16} className="text-primary-600" />
                <span className="text-sm text-gray-600">30-day returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" size={16} className="text-primary-600" />
                <span className="text-sm text-gray-600">1-year warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Headphones" size={16} className="text-primary-600" />
                <span className="text-sm text-gray-600">24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;