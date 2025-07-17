import React, { useState, useEffect } from "react";
import styles from "./FoodOrderWelcomePage.module.css";
import Dashboard from "./Dashboard.jsx";
import AdminPanel from "./AdminPanel.jsx";

function FoodOrderWelcomePage () {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    // Add keyboard event listener for Ctrl+A admin access
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault(); // Prevent default Ctrl+A behavior
        setShowPasswordModal(true);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePasswordSubmit = () => {
    if (passwordInput === '9398') {
      setShowPasswordModal(false);
      setPasswordInput('');
      setShowAdmin(true);
    } else {
      alert('Incorrect password!');
      setPasswordInput('');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    } else if (e.key === 'Escape') {
      handlePasswordCancel();
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setShowOTP(true);
      // Here you would typically send OTP to phone
      console.log('Sending OTP to:', phoneNumber);
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      // Here you would verify OTP and redirect to booking dashboard
      console.log('Verifying OTP:', otp);
      setIsLoggedIn(true);
    }
  };

  // Show admin panel if admin is selected
  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  // Show dashboard if logged in
  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div
      className={styles.foodOrderWelcomePage}
      style={{ backgroundImage: `url(/Rectangle.png)` }}
    >
      {/* Password Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.passwordModal}>
            <div className={styles.modalHeader}>
              <h3>🔐 Admin Access</h3>
              <button 
                className={styles.closeButton}
                onClick={handlePasswordCancel}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Enter admin password to continue:</p>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={handlePasswordKeyPress}
                placeholder="Enter password"
                className={styles.passwordInput}
                autoFocus
              />
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={handlePasswordCancel}
              >
                Cancel
              </button>
              <button 
                className={styles.submitButton}
                onClick={handlePasswordSubmit}
              >
                Access Admin
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.overlay}>
        <div className={styles.leftSection}>
          <div className={styles.imageWrapper}>
            <b className={styles.welcomeTitle}>WELCOME TO CUE CLUB CAFE</b>
          </div>
          <div className={styles.description}>
            Book your favorite games - PS5, Pool, Snooker, and special events. Fast and easy booking system for the ultimate gaming experience.
          </div>
        </div>
        <div className={styles.rightSection}>
          <b className={styles.getStarted}>
            {showOTP ? 'Verify OTP' : 'Login to Book'}
          </b>
          <div className={styles.enterYourPhone}>
            {showOTP 
              ? 'Enter the 6-digit OTP sent to your phone'
              : 'Enter your phone number to continue'
            }
          </div>
          
          {!showOTP ? (
            <form className={styles.form} onSubmit={handlePhoneSubmit}>
              <label className={styles.phoneLabel} htmlFor="phone">
                Phone Number
              </label>
              <input
                className={styles.phoneInput}
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <button className={styles.otpButton} type="submit">
                Get OTP
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleOTPSubmit}>
              <label className={styles.phoneLabel} htmlFor="otp">
                OTP Code
              </label>
              <input
                className={styles.phoneInput}
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                maxLength="6"
                required
              />
              <button className={styles.otpButton} type="submit">
                Verify & Login
              </button>
              <button 
                className={styles.backButton} 
                type="button"
                onClick={() => setShowOTP(false)}
              >
                Back to Phone Number
              </button>
            </form>
          )}
          
          <div className={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodOrderWelcomePage;