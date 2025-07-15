import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProductGrid from "@/components/organisms/ProductGrid";
import Button from "@/components/atoms/Button";
import productService from "@/services/api/productService";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const featured = await productService.getFeatured();
      setFeaturedProducts(featured);
    } catch (error) {
      console.error("Failed to load featured products:", error);
    }
    setLoading(false);
  };

  // If there's a search query or category, show filtered results
  if (searchQuery || selectedCategory) {
    return <ProductGrid searchQuery={searchQuery} selectedCategory={selectedCategory} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold"
            >
              Shop with
              <span className="block bg-gradient-to-r from-accent-300 to-yellow-300 bg-clip-text text-transparent">
                Confidence
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto"
            >
              Discover amazing products at unbeatable prices. Fast shipping, easy returns, and premium quality guaranteed.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="accent"
                size="lg"
                onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4"
              >
                <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
                Start Shopping
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <ApperIcon name="Grid3X3" size={20} className="mr-2" />
                Browse Categories
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: "Truck",
                title: "Free Shipping",
                description: "Free shipping on all orders over $50. Fast delivery worldwide."
              },
              {
                icon: "Shield",
                title: "Secure Payment",
                description: "Your payment information is encrypted and secure."
              },
              {
                icon: "RotateCcw",
                title: "Easy Returns",
                description: "30-day hassle-free returns and exchanges."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked items that our customers love most
            </p>
          </motion.div>
          
          <ProductGrid searchQuery="" selectedCategory="" />
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Electronics",
                slug: "electronics",
                image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
                icon: "Smartphone"
              },
              {
                name: "Clothing",
                slug: "clothing",
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                icon: "ShirtIcon"
              },
              {
                name: "Home & Kitchen",
                slug: "home-kitchen",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
                icon: "Home"
              },
              {
                name: "Accessories",
                slug: "accessories",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
                icon: "Watch"
              },
              {
                name: "Sports & Outdoors",
                slug: "sports-outdoors",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                icon: "Dumbbell"
              },
              {
                name: "Food & Beverage",
                slug: "food-beverage",
                image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
                icon: "Coffee"
              }
            ].map((category, index) => (
<motion.a
                key={category.slug}
                href={`/?category=${category.slug}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name={category.icon} size={20} />
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                  <p className="text-sm text-gray-200 group-hover:text-white transition-colors">
                    Explore collection
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-gray-100">
              Join thousands of satisfied customers and discover amazing deals today.
            </p>
<Button
              variant="accent"
              size="lg"
              onClick={() => navigate("/products")}
              className="px-8 py-4"
            >
              <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
              Shop Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;