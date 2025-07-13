import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const ProductImage = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  return (
    <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 image-skeleton" />
      )}
      <img 
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-4xl">🖼️</span>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ result }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-lg">
        <motion.img 
          src={result.image} 
          alt={result.name}
          className="w-full h-48 object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        {result.discount && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {result.discount}
          </motion.div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-medium text-gray-800 line-clamp-2">
          {result.name}
        </h3>
        <div className="flex items-center">
          <span className="text-yellow-400">{result.rating}</span>
          <span className="text-xs text-gray-500 ml-1">
            {result.reviews}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            animate={{ scale: isHovered ? 1.05 : 1 }}
          >
            <span className="text-lg font-bold text-[#0071DC]">
              {result.price}
            </span>
            {result.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {result.originalPrice}
              </span>
            )}
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#0071DC] text-white px-4 py-2 rounded-full text-sm hover:bg-[#004F9A] transition-colors"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const VoiceSearchResults = ({ results, isLoading }) => {
  if (!results.length && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-8 bg-white p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
            />
            Searching...
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            🎯 <span className="ml-2">Voice Search Results</span>
          </motion.div>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Loading skeletons with staggered animation
            Array(3).fill(0).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="animate-pulse space-y-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard result={result} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VoiceSearchResults;