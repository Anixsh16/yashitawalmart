import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HeartIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  MicrophoneIcon,
  StopIcon,
  ArrowUpIcon
} from '@heroicons/react/24/solid';
import ErrorBoundary from './components/ErrorBoundary';
import VoiceSearchResults from './components/VoiceSearchResults';
import "./App.css";

function KeyboardShortcutHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
    >
      Press "/" to start voice search, "Esc" to stop
    </motion.div>
  );
}

const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};

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

const HeroImage = ({ image, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${image})` }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      >
        {error ? (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
            {children}
          </>
        )}
      </div>
    </div>
  );
};

const HeroSlide = ({ slide, isActive }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = slide.image;
    img.onload = () => setIsLoading(false);
    img.onerror = () => setError(true);
  }, [slide.image]);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      ) : error ? (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-4xl">🖼️</span>
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-lg text-white">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold mb-4 shadow-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl mb-8 shadow-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.button 
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slide.buttonText}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-[#0071DC] text-white rounded-full shadow-lg z-50 hover:bg-[#004F9A] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUpIcon className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(3);
  const [searchResults, setSearchResults] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleVoiceSearch = useCallback(async () => {
    try {
      if (!isListening) {
        setError(null);
        setIsLoading(true);
        await SpeechRecognition.startListening({ continuous: true });
        setIsListening(true);
      } else {
        await SpeechRecognition.stopListening();
        setIsListening(false);
      }
    } catch (err) {
      setError('Could not access microphone. Please check your browser permissions.');
    } finally {
      setIsLoading(false);
    }
  }, [isListening]);

  const handleStopListening = useCallback(() => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    resetTranscript();
  }, [resetTranscript]);

  // Effect for handling voice search results
  useEffect(() => {
    if (transcript) {
      // Simulate API call with loading state
      setIsLoading(true);
      setTimeout(() => {
        const mockResults = [
          {
            id: 1,
            name: `${transcript} - Patriotic Decorations`,
            price: "$19.99",
            image: "https://images.pexels.com/photos/1105325/pexels-photo-1105325.jpeg",
            rating: "⭐⭐⭐⭐⭐",
            reviews: "4.8 (241 reviews)",
            originalPrice: "$39.99",
            discount: "50% OFF"
          },
          {
            id: 2,
            name: `${transcript} - BBQ Essentials`,
            price: "$24.99",
            image: "https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg",
            rating: "⭐⭐⭐⭐½",
            reviews: "4.6 (185 reviews)",
            originalPrice: "$49.99",
            discount: "50% OFF"
          },
          {
            id: 3,
            name: `${transcript} - Party Supplies`,
            price: "$15.99",
            image: "https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg",
            rating: "⭐⭐⭐⭐⭐",
            reviews: "4.9 (92 reviews)",
            originalPrice: "$31.99",
            discount: "50% OFF"
          }
        ];
        setSearchResults(mockResults);
        setIsLoading(false);
      }, 1000);
    }
  }, [transcript]);

  const slides = [
    {
      image: "https://media.gettyimages.com/id/2157872163/video/fourth-of-july-independence-day-4th-of-july-poster-with-firework-4k.jpg?s=640x640&k=20&c=-VHLm4u4LEN-e073seqWMAmzsK14XdDsuT6QnuRSdYg=",
      title: "Happy 4th of July! 🎆",
      subtitle: "Celebrate with us and find amazing deals on everything you need!",
      buttonText: "Shop Holiday Deals"
    },
    {
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      title: "BBQ & Grilling Essentials",
      subtitle: "Everything you need for the perfect 4th of July cookout!",
      buttonText: "Shop BBQ Deals"
    },
    {
      image: "https://images.unsplash.com/photo-1556804335-2fa563e93aae?auto=format&fit=crop&w=1200&q=80",
      title: "Red, White & Blue Savings",
      subtitle: "Patriotic party supplies and decorations from $2.99",
      buttonText: "Shop Decorations"
    }
  ];

  const categories = [
    { icon: "🔥", name: "BBQ & Grilling", bgClass: "bg-gradient-to-r from-red-600 to-red-500" },
    { icon: "🎆", name: "Fireworks", bgClass: "bg-gradient-to-r from-amber-400 to-yellow-400" },
    { icon: "🎪", name: "Decorations", bgClass: "bg-gradient-to-r from-red-500 to-pink-500" },
    { icon: "🎉", name: "Party Supplies", bgClass: "bg-gradient-to-r from-rose-400 to-pink-400" },
    { icon: "🏐", name: "Outdoor Games", bgClass: "bg-white border-2 border-red-600" },
    { icon: "👕", name: "Patriotic Apparel", bgClass: "bg-gradient-to-r from-red-400 to-rose-400" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Add keyboard shortcut for voice search
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Press '/' to start voice search
      if (e.key === '/' && !isListening) {
        e.preventDefault();
        handleVoiceSearch();
      }
      // Press 'Escape' to stop voice search
      else if (e.key === 'Escape' && isListening) {
        handleVoiceSearch();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleVoiceSearch, isListening]);

  // Add click outside and escape key handlers
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isListening) {
        handleStopListening();
      }
    };

    const handleClickOutside = (e) => {
      if (isListening && !e.target.closest('.voice-search-dialog')) {
        handleStopListening();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isListening, handleStopListening]);

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageUrls = [
          ...slides.map(slide => slide.image),
          WalmartLogo,
          // Add any other images that need preloading
        ];
        
        await Promise.all(imageUrls.map(url => preloadImage(url)));
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Show content anyway
      }
    };

    loadImages();
  }, []);

  // Show loading state while images are loading
  if (!imagesLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0071DC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-center p-8">Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar with Logo */}
      <div className="bg-[#0071DC] text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-12">
              <div className="flex-shrink-0">
                <img 
                  src="https://tse1.mm.bing.net/th/id/OIP.IJzb_xYqjRLGenO8MOQAsQHaEE?pid=Api&P=0&h=180" 
                  alt="Walmart" 
                  style={{
                    height: '75px',
                    width: 'auto',
                    objectFit: 'contain',
                    backgroundColor: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    margin: '0 20px'
                  }}
                />
              </div>
              <span className="text-sm">Special 4th of July Sale - Save up to 70% | Free Shipping on $35+</span>
            </div>
            <div className="flex gap-4">
              <span className="cursor-pointer hover:text-red-200 text-sm">Account</span>
              <span className="cursor-pointer hover:text-red-200 text-sm">Sign In</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#0071DC] w-full border-t border-white/10">
        <nav className="w-full px-0">
          <div className="flex items-center h-16">
            {/* Left side navigation */}
            <div className="flex items-center">
              <motion.button 
                className="nav-button text-white rounded-full flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '8px' }}
              >
                <Bars3Icon className="h-8 w-8 text-white" />
              </motion.button>
              <div className="flex items-center gap-8 ml-6">
                <motion.button 
                  className="nav-button text-white hover:bg-[#0062BD] px-5 py-2.5 rounded-full flex items-center transition-colors whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium text-base">Departments</span>
                </motion.button>
                <motion.button 
                  className="nav-button text-white hover:bg-[#0062BD] px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium text-base">Services</span>
                </motion.button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={transcript}
                  readOnly
                  className="w-full px-6 py-2 pr-16 rounded-full border-2 border-white/30 focus:outline-none focus:border-white/50 text-base bg-white/10 text-white placeholder-white/70"
                  placeholder={isLoading ? "Listening..." : "Search for 4th of July deals..."}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceSearch}
                  disabled={isLoading}
                  className={`mic-button p-2 rounded-full ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isListening ? (
                    <div className="relative flex items-center justify-center">
                      <StopIcon className="h-5 w-5 text-white" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
                    </div>
                  ) : (
                    <MicrophoneIcon className="h-5 w-5 text-white" />
                  )}
                </motion.button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <motion.button 
                className="nav-button text-white hover:bg-[#0062BD] px-6 py-2.5 rounded-full flex items-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                <span className="hidden md:inline font-medium">Cart</span>
                <motion.span 
                  className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cartCount}
                </motion.span>
              </motion.button>
              <motion.button 
                className="nav-button text-white hover:bg-[#0062BD] px-6 py-2.5 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-medium">Sign In</span>
              </motion.button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-[#0071DC] relative">
        {/* Voice Search Dialog */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center"
              onClick={handleStopListening}
            >
              <motion.div
                className="bg-white rounded-xl p-8 w-[90%] max-w-[400px] relative mx-auto"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={handleStopListening}
                  className="absolute -right-3 -top-3 w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full transition-all duration-200 shadow-lg border-2 border-gray-100"
                  style={{
                    transform: 'translate(0, 0)',
                  }}
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex flex-col items-center pt-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(0, 113, 220, 0.4)",
                        "0 0 0 20px rgba(0, 113, 220, 0)",
                        "0 0 0 0 rgba(0, 113, 220, 0)"
                      ]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      times: [0, 0.5, 1]
                    }}
                    className="w-16 h-16 rounded-full bg-[#0071DC] flex items-center justify-center mb-4"
                  >
                    <MicrophoneIcon className="h-8 w-8 text-white" />
                  </motion.div>

                  <div className="sound-wave">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="sound-wave-bar"
                        initial={{ height: 20 }}
                        animate={{ height: [20, 40, 20] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </div>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-medium text-gray-800 mb-2"
                  >
                    {isLoading ? "Processing..." : "Listening..."}
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-center"
                  >
                    {transcript || "Say something like 'Show me 4th of July decorations'"}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section - Full width */}
        <div className="w-screen relative bg-[#0071DC]">
          <div className="relative h-[500px] overflow-hidden">
            {slides.map((slide, index) => (
              <HeroSlide 
                key={index} 
                slide={slide} 
                isActive={index === currentSlide} 
              />
            ))}
            
            {/* Slider Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                🎆 Shop by Category - 4th of July Specials 🎆
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className={`${category.bgClass} rounded-xl p-6 text-center cursor-pointer shadow-lg`}
                  >
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <div className={`text-sm font-semibold ${
                      category.bgClass.includes('white') ? 'text-red-600' : 'text-white'
                    }`}>
                      {category.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Special Offers Section */}
          <section className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">🇺🇸 4th of July Lightning Deals</h2>
                <p className="text-gray-600">Limited time offers - while supplies last!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: 1,
                    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
                    title: "BBQ Grill Master Set",
                    rating: "⭐⭐⭐⭐⭐",
                    reviews: "4.8 (2,341 reviews)",
                    salePrice: "$89.99",
                    originalPrice: "$199.99",
                    discount: "55% OFF"
                  },
                  {
                    id: 2,
                    image: "https://images.unsplash.com/photo-1532635239-06e08db8f247?auto=format&fit=crop&w=600&q=80",
                    title: "Patriotic Picnic Set",
                    rating: "⭐⭐⭐⭐⭐",
                    reviews: "4.6 (1,205 reviews)",
                    salePrice: "$39.99",
                    originalPrice: "$79.99",
                    discount: "50% OFF"
                  },
                  {
                    id: 3,
                    image: "https://images.unsplash.com/photo-1515876305430-f06edab8282a?auto=format&fit=crop&w=600&q=80",
                    title: "LED String Lights",
                    rating: "⭐⭐⭐⭐⭐",
                    reviews: "4.7 (892 reviews)",
                    salePrice: "$14.99",
                    originalPrice: "$29.99",
                    discount: "50% OFF"
                  },
                  {
                    id: 4,
                    image: "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=600&q=80",
                    title: "Cooler Combo Pack",
                    rating: "⭐⭐⭐⭐⭐",
                    reviews: "4.9 (1,678 reviews)",
                    salePrice: "$79.99",
                    originalPrice: "$149.99",
                    discount: "47% OFF"
                  }
                ].map((offer) => (
                  <motion.div
                    key={offer.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="relative">
                      <ProductImage src={offer.image} alt={offer.title} />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {offer.discount}
                      </div>
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ⏰ Limited Time
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{offer.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span>{offer.rating}</span>
                        <span className="text-sm text-gray-600">{offer.reviews}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-[#0071DC]">{offer.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">{offer.originalPrice}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-[#0071DC] hover:bg-[#004F9A] text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Special Offers Banner */}
          <section className="py-16 bg-gradient-to-r from-red-600 via-white to-blue-600">
            <div className="container mx-auto px-4">
              <div className="bg-white/95 rounded-2xl shadow-xl p-12 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                  🎆 Free Shipping on Orders $35+ 🎆
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  Plus, get same-day delivery on select items. Perfect for last-minute 4th of July preparations!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: "🚚", text: "Free 2-Day Shipping" },
                    { icon: "🎁", text: "Same-Day Delivery" },
                    { icon: "⭐", text: "Member Benefits" }
                  ].map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-center gap-3 bg-gray-50 rounded-full py-3 px-6"
                    >
                      <span className="text-2xl">{benefit.icon}</span>
                      <span className="font-semibold text-gray-800">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white pt-16 pb-6">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-bold mb-4">Walmart</h3>
                  <p className="text-gray-400">Your one-stop shop for all 4th of July celebrations and everyday essentials.</p>
                </div>
                {[
                  {
                    title: "Customer Service",
                    links: ["Contact Us", "Returns & Exchanges", "Shipping Info", "Order Status"]
                  },
                  {
                    title: "Shop",
                    links: ["Weekly Ads", "Store Locator", "Mobile App", "Gift Cards"]
                  },
                  {
                    title: "About",
                    links: ["Careers", "Corporate", "Sustainability", "Press Room"]
                  }
                ].map((column, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-4">{column.title}</h4>
                    <ul className="space-y-2">
                      {column.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
                <p>🇺🇸 &copy; 2025 Walmart Inc. All rights reserved. Happy 4th of July! 🇺🇸</p>
              </div>

              {/* Festive Confetti Animation */}
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(50)].map((_, index) => (
                  <motion.div
                    key={index}
                    className={`absolute w-2 h-2 rounded-full ${
                      index % 3 === 0 ? 'bg-red-500' :
                      index % 3 === 1 ? 'bg-white' : 'bg-blue-500'
                    }`}
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: -20,
                      opacity: 1
                    }}
                    animate={{
                      y: window.innerHeight + 20,
                      opacity: 0
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 3
                    }}
                  />
                ))}
              </div>
            </div>
          </footer>

          <ScrollToTopButton />
        </div>
      </div>
    </div>
  );
}

export default App;
