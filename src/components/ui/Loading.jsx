import { motion } from "framer-motion";

const Loading = ({ type = "products" }) => {
  const ProductCardSkeleton = () => (
    <div className="card p-4 space-y-4">
      <div className="bg-gray-200 rounded-lg w-full h-48 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
      </div>
    </div>
  );

  const ProductDetailSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="bg-gray-200 rounded-lg w-full h-96 animate-pulse"></div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg w-full h-20 animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );

  const CartSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg">
          <div className="bg-gray-200 rounded-lg w-16 h-16 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "products":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        );
      case "product-detail":
        return <ProductDetailSkeleton />;
      case "cart":
        return <CartSkeleton />;
      default:
        return (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {renderSkeleton()}
    </motion.div>
  );
};

export default Loading;