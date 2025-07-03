import { ArrowLeft, CheckCircle, Home, RefreshCw, Sparkles, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

const PaymentSuccessPage = ({ onBack, onGoHome }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <View className="payment-container success-bg">
      {/* Animated Background Elements */}
      <View className="floating-particles">
        <View className="particle particle-1"></View>
        <View className="particle particle-2"></View>
        <View className="particle particle-3"></View>
        <View className="particle particle-4"></View>
        <View className="particle particle-5"></View>
      </View>
      
      <View className="background-shapes">
        <View className="bg-circle bg-circle-1"></View>
        <View className="bg-circle bg-circle-2"></View>
      </View>

      <View className={`content-wrapper ${isVisible ? 'animate-in' : ''}`}>
        {/* Success Icon with Animation */}
        <View className="icon-container success-icon">
          <View className="icon-bg success-bg-icon">
            <CheckCircle size={60} className="check-icon" />
          </View>
          <View className="success-ripple"></View>
        </View>

        {/* Sparkle Effects */}
        <View className="sparkle-container">
          <Sparkles className="sparkle sparkle-1" size={20} />
          <Sparkles className="sparkle sparkle-2" size={16} />
          <Sparkles className="sparkle sparkle-3" size={24} />
        </View>

        {/* Success Content */}
        <View className="text-content">
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-subtitle">
            Your transaction has been completed successfully
          </p>
          
          <View className="payment-details">
            <View className="detail-card">
              <View className="detail-row">
                <span className="detail-label">Amount</span>
                <span className="detail-value success-amount">$89.99</span>
              </View>
              <View className="detail-row">
                <span className="detail-label">Transaction ID</span>
                <span className="detail-value">#TXN123456789</span>
              </View>
              <View className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">June 13, 2025</span>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="button-group">
          <button className="btn btn-primary success-btn" onClick={onGoHome}>
            <Home size={20} />
            <span>Go to Home</span>
          </button>
          
          <button className="btn btn-secondary success-secondary" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </View>
      </View>
    </View>
  );
};

const PaymentFailedPage = ({ onBack, onRetry }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5F7FA' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
    <View className="payment-container error-bg">
      {/* Animated Background Elements */}
      <View className="error-waves">
        <View className="wave wave-1"></View>
        <View className="wave wave-2"></View>
        <View className="wave wave-3"></View>
      </View>
      
      <View className="background-shapes">
        <View className="bg-circle error-circle-1"></View>
        <View className="bg-circle error-circle-2"></View>
      </View>

      <View className={`content-wrapper ${isVisible ? 'animate-in' : ''}`}>
        {/* Failed Icon with Animation */}
        <View className="icon-container error-icon">
          <View className="icon-bg error-bg-icon">
            <XCircle size={60} className="x-icon" />
          </View>
          <View className="error-pulse"></View>
        </View>

        {/* Failed Content */}
        <View className="text-content">
          <h1 className="error-title">Payment Failed</h1>
          <p className="error-subtitle">
            We couldn't process your payment. Please try again.
          </p>
          
          <View className="error-details">
            <View className="error-card">
              <View className="error-indicator"></View>
              <View className="error-info">
                <p className="error-reason">Reason: Insufficient funds</p>
                <p className="error-code">Error Code: #ERR_4001</p>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="button-group">
          <button className="btn btn-primary error-btn" onClick={onRetry}>
            <RefreshCw size={20} className="retry-icon" />
            <span>Try Again</span>
          </button>
          
          <button className="btn btn-secondary error-secondary" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
};

const PaymentResultPages = () => {
  const [currentPage, setCurrentPage] = useState('success');

  const handleBack = () => {
    console.log('Back pressed');
  };

  const handleGoHome = () => {
    console.log('Go home pressed');
  };

  const handleRetry = () => {
    console.log('Retry pressed');
  };

  return (
    <View className="app-wrapper">
      {/* Demo Toggle */}
      <View className="page-toggle">
        <button 
          className={`toggle-btn ${currentPage === 'success' ? 'active' : ''}`}
          onClick={() => setCurrentPage('success')}
        >
          Success Page
        </button>
        <button 
          className={`toggle-btn ${currentPage === 'failed' ? 'active' : ''}`}
          onClick={() => setCurrentPage('failed')}
        >
          Failed Page
        </button>
      </View>

      {/* Page Content */}
      {currentPage === 'success' ? (
        <PaymentSuccessPage key="success" onBack={handleBack} onGoHome={handleGoHome} />
      ) : (
        <PaymentFailedPage key="failed" onBack={handleBack} onRetry={handleRetry} />
      )}

      <style jsx>{`
        .app-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          height: 100vh;
          overflow: hidden;
        }

        .page-toggle {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          padding: 5px;
          border-radius: 25px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .toggle-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 20px;
          background: transparent;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: scale(1.05);
        }

        .payment-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .success-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .error-bg {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        /* Background Animations */
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .particle-1 { width: 6px; height: 6px; top: 20%; left: 20%; animation-delay: 0s; }
        .particle-2 { width: 8px; height: 8px; top: 60%; left: 80%; animation-delay: 1s; }
        .particle-3 { width: 4px; height: 4px; top: 80%; left: 30%; animation-delay: 2s; }
        .particle-4 { width: 10px; height: 10px; top: 30%; left: 70%; animation-delay: 3s; }
        .particle-5 { width: 5px; height: 5px; top: 50%; left: 10%; animation-delay: 4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .background-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }

        .bg-circle-1 {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          top: -150px;
          right: -150px;
        }

        .bg-circle-2 {
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.05);
          bottom: -100px;
          left: -100px;
          animation-direction: reverse;
        }

        .error-circle-1 {
          background: rgba(255, 255, 255, 0.15);
        }

        .error-circle-2 {
          background: rgba(255, 255, 255, 0.1);
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Error Background Waves */
        .error-waves {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .wave {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          animation: pulse 4s ease-in-out infinite;
        }

        .wave-1 { animation-delay: 0s; }
        .wave-2 { animation-delay: 1.3s; }
        .wave-3 { animation-delay: 2.6s; }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Content Wrapper */
        .content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(50px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-wrapper.animate-in {
          transform: translateY(0);
          opacity: 1;
        }

        /* Icon Animations */
        .icon-container {
          position: relative;
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
        }

        .icon-bg {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transform: scale(0);
          animation: iconPop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards;
        }

        .success-bg-icon {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
        }

        .error-bg-icon {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          box-shadow: 0 10px 30px rgba(244, 67, 54, 0.4);
        }

        .check-icon {
          color: white;
          animation: checkDraw 0.5s ease-in-out 1s forwards;
          opacity: 0;
        }

        .x-icon {
          color: white;
          animation: shake 0.5s ease-in-out 1s forwards;
          opacity: 0;
        }

        @keyframes iconPop {
          0% { transform: scale(0) rotate(-180deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes checkDraw {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes shake {
          0% { opacity: 0; transform: translateX(0); }
          25% { opacity: 1; transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        /* Success Effects */
        .success-ripple {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 3px solid #4CAF50;
          border-radius: 50%;
          animation: ripple 2s ease-out infinite 1.5s;
          opacity: 0;
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }

        .sparkle-container {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          color: #FFD700;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: -20px;
          left: -30px;
          animation-delay: 1.8s;
        }

        .sparkle-2 {
          top: -10px;
          right: -25px;
          animation-delay: 2.2s;
        }

        .sparkle-3 {
          bottom: -15px;
          left: -20px;
          animation-delay: 2.6s;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        /* Error Effects */
        .error-pulse {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 3px solid #f44336;
          border-radius: 50%;
          animation: errorPulse 2s ease-out infinite 1.5s;
          opacity: 0;
        }

        @keyframes errorPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* Text Content */
        .text-content {
          margin-bottom: 30px;
        }

        .success-title, .error-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #2c3e50, #34495e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: slideUp 0.6s ease-out 0.8s both;
        }

        .success-subtitle, .error-subtitle {
          font-size: 16px;
          color: #7f8c8d;
          line-height: 1.5;
          margin-bottom: 25px;
          animation: slideUp 0.6s ease-out 1s both;
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Payment Details */
        .payment-details {
          animation: slideUp 0.6s ease-out 1.2s both;
        }

        .detail-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 14px;
          color: #7f8c8d;
          font-weight: 500;
        }

        .detail-value {
          font-size: 14px;
          color: #2c3e50;
          font-weight: 600;
        }

        .success-amount {
          color: #4CAF50;
          font-size: 16px;
          font-weight: 700;
        }

        /* Error Details */
        .error-details {
          animation: slideUp 0.6s ease-out 1.2s both;
        }

        .error-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(10px);
          border-left: 4px solid #f44336;
          box-shadow: 0 8px 32px rgba(244, 67, 54, 0.1);
          position: relative;
          overflow: hidden;
        }

        .error-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #f44336, #d32f2f);
          animation: errorGlow 2s ease-in-out infinite;
        }

        @keyframes errorGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .error-info {
          text-align: left;
        }

        .error-reason {
          font-size: 16px;
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .error-code {
          font-size: 14px;
          color: #7f8c8d;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        /* Buttons */
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: slideUp 0.6s ease-out 1.4s both;
        }

        .btn {
          padding: 16px 24px;
          border-radius: 12px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(0);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        .success-btn {
          background: linear-gradient(135deg, #4CAF50, #45a049);
        }

        .success-btn:hover {
          box-shadow: 0 12px 32px rgba(76, 175, 80, 0.3);
        }

        .error-btn {
          background: linear-gradient(135deg, #f44336, #d32f2f);
        }

        .error-btn:hover {
          box-shadow: 0 12px 32px rgba(244, 67, 54, 0.3);
        }

        .retry-icon {
          animation: spin 2s linear infinite;
        }

        .btn:hover .retry-icon {
          animation-duration: 0.5s;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid;
          color: #666;
        }

        .success-secondary {
          border-color: #4CAF50;
          color: #4CAF50;
        }

        .success-secondary:hover {
          background: #4CAF50;
          color: white;
        }

        .error-secondary {
          border-color: #f44336;
          color: #f44336;
        }

        .error-secondary:hover {
          background: #f44336;
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .content-wrapper {
            padding: 30px 20px;
            margin: 20px;
          }

          .success-title, .error-title {
            font-size: 24px;
          }

          .success-subtitle, .error-subtitle {
            font-size: 14px;
          }

          .icon-bg {
            width: 80px;
            height: 80px;
          }

          .check-icon, .x-icon {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </View>
  );
};

export default PaymentResultPages;