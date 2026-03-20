/**
 * LoadingSpinner - Full-page loading animation
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <div className="spinner mb-4"></div>
      <p className="text-gray-500 text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
