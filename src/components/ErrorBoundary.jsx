import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-red-50 rounded-lg"
        >
          <h2 className="text-red-600 font-semibold mb-2">Voice Recognition Error</h2>
          <p className="text-gray-600">
            Sorry, there was an error with the voice recognition. Please try again or use text search.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;