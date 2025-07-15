import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import productService from "@/services/api/productService";

const ProductGrid = ({ searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, sortBy]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll({
          search: searchQuery,
          category: selectedCategory,
        }),
        productService.getCategories()
      ]);
      
      let sortedProducts = [...productsData];
      
      switch (sortBy) {
        case "price-low":
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case "name":
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "featured":
        default:
          sortedProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
      
      setProducts(sortedProducts);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const handleCartUpdate = () => {
    // Trigger cart count update in header
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) {
    return <Loading type="products" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0">
<CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              // This will be handled by the parent component (HomePage)
              // that manages the selectedCategory state
              if (window.onCategoryChange) {
                window.onCategoryChange(category);
              }
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
<h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 
                 selectedCategory ? `${selectedCategory.replace(/[-_]/g, " ")} Products` : 
                 "All Products"}
              </h2>
              <span className="text-sm text-gray-600">
                ({products.length} {products.length === 1 ? "product" : "products"})
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto min-w-[160px]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <ApperIcon name="Grid3X3" size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <ApperIcon name="List" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          {products.length === 0 ? (
            <Empty
              icon="ShoppingBag"
              title="No products found"
              message={searchQuery ? 
                `We couldn't find any products matching "${searchQuery}". Try adjusting your search terms.` :
                "No products available in this category right now."
              }
              actionLabel="Browse All Products"
              onAction={() => {
                window.history.pushState({}, "", "/");
                window.location.reload();
              }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onCartUpdate={handleCartUpdate}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;