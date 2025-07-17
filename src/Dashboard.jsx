import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import GamesPage from "./GamesPage.jsx";

// Import new event management components
import EventSelector from "./EventSelector.jsx";
import GiftGallery from "./GiftGallery.jsx";
import BookingForm from "./BookingForm.jsx";
import BookingConfirmation from "./BookingConfirmation.jsx";
import AdminPanel from "./AdminPanel.jsx";
import Header from "./Header.jsx";

function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const ads = [
    {
      text: "🎮 Special Offer: 20% OFF on PS5 Gaming Sessions this weekend! 🎮",
      button: "Claim Now"
    },
    {
      text: "🎱 Pool Tournament: Join our weekly championship - Prize: ₹5000! 🏆",
      button: "Register"
    },
    {
      text: "🎉 Birthday Special: Book party packages and get 30% OFF! 🎂",
      button: "Book Now"
    },
    {
      text: "🎯 Darts League: New season starting - Limited spots available! 🎯",
      button: "Join League"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-slide ads every 4 seconds
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

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
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ads.length]);

  const handleCardClick = (section) => {
    console.log(`Navigating to ${section}`);
    setCurrentPage(section);
  };

  const handleAdClick = (direction) => {
    if (direction === 'next') {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    } else {
      setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
    }
  };

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

  // Show Games page if games is selected
  if (currentPage === 'games') {
    return <GamesPage onBack={() => setCurrentPage('dashboard')} />;
  }

  // Show Event Management pages
  if (currentPage === 'events') {
    return (
      <EventSelector 
        onEventSelect={(event) => {
          setSelectedEvent(event);
          setCurrentPage('booking-form');
        }}
        onGiftsSelect={() => setCurrentPage('gifts')}
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }

  if (currentPage === 'booking-form' && selectedEvent) {
    return (
      <BookingForm 
        eventType={selectedEvent}
        onBack={() => setCurrentPage('events')}
        onShowGifts={() => setCurrentPage('gifts')}
        onBookingSubmit={(formData) => {
          console.log('Booking submitted:', formData);
          setBookingData({ ...formData, eventType: selectedEvent });
          setCurrentPage('booking-confirmation');
        }}
      />
    );
  }

  if (currentPage === 'booking-confirmation') {
    return (
      <BookingConfirmation 
        bookingData={bookingData}
        onBackToHome={() => {
          setCurrentPage('dashboard');
          setSelectedEvent(null);
          setBookingData(null);
        }}
      />
    );
  }

  if (currentPage === 'gifts') {
    return (
      <GiftGallery 
        onBack={() => setCurrentPage('events')}
        onHome={() => setCurrentPage('dashboard')}
      />
    );
  }

  // Admin Panel
  if (showAdmin) {
    return (
      <div className={styles.pageWrapper}>
        <Header onShowAdmin={() => setShowAdmin(false)} currentView="admin" />
        <AdminPanel onBack={() => setShowAdmin(false)} />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
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

      {/* Hero Section */}
      <section className={`${styles.heroSection} ${isLoaded ? styles.fadeIn : ''}`}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.highlight}>Cue Club Cafe</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your ultimate destination for gaming, events, and unforgettable experiences
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Games Available</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Open Hours</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
          </div>
        </div>
        <div className={styles.floatingElements}>
          <div className={styles.floatingBubble}></div>
          <div className={styles.floatingBubble}></div>
          <div className={styles.floatingBubble}></div>
        </div>
      </section>

      {/* Ads Banner */}
      <section className={styles.adsBanner}>
        <div className={styles.adsContainer}>
          <button 
            className={styles.adsPrevButton}
            onClick={() => handleAdClick('prev')}
          >
            ←
          </button>
          
          <div className={styles.adsSlider}>
            <div className={styles.adsGlow}></div>
            <div className={styles.adsContent}>
              <span className={styles.adsText}>
                {ads[currentAd].text}
              </span>
              <button className={styles.adsButton}>
                {ads[currentAd].button}
              </button>
            </div>
          </div>
          
          <button 
            className={styles.adsNextButton}
            onClick={() => handleAdClick('next')}
          >
            →
          </button>
        </div>
        
        <div className={styles.adsIndicators}>
          {ads.map((_, index) => (
            <button
              key={index}
              className={`${styles.adsIndicator} ${index === currentAd ? styles.active : ''}`}
              onClick={() => setCurrentAd(index)}
            />
          ))}
        </div>
      </section>

      {/* Main Navigation Cards */}
      <section className={styles.navigationSection}>
        <div className={styles.sectionTitle}>
          <h2>Choose Your Experience</h2>
          <p>Select from our premium services</p>
        </div>
        
        <div className={styles.cardsGrid}>
          {/* Games Card */}
          <div 
            className={`${styles.navCard} ${styles.gamesCard}`}
            onClick={() => handleCardClick('games')}
          >
            <div className={styles.cardGlow}></div>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>🎮</div>
              <h3 className={styles.cardTitle}>Games</h3>
              <p className={styles.cardDescription}>
                PS5, Xbox, Pool, Snooker, Darts & More
              </p>
              <div className={styles.cardFeatures}>
                <span>• Premium Gaming Setup</span>
                <span>• Latest Game Titles</span>
                <span>• Competitive Tournaments</span>
              </div>
            </div>
            <div className={styles.cardArrow}>→</div>
          </div>

          {/* Events Card */}
          <div 
            className={`${styles.navCard} ${styles.eventsCard}`}
            onClick={() => handleCardClick('events')}
          >
            <div className={styles.cardGlow}></div>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>🎉</div>
              <h3 className={styles.cardTitle}>Event Management</h3>
              <p className={styles.cardDescription}>
                Birthday Parties, Corporate Events & Celebrations
              </p>
              <div className={styles.cardFeatures}>
                <span>• Custom Event Planning</span>
                <span>• Premium Gift Options</span>
                <span>• Full Service Management</span>
              </div>
            </div>
            <div className={styles.cardArrow}>→</div>
          </div>

          {/* Hospitality Card */}
          <div 
            className={`${styles.navCard} ${styles.hospitalityCard}`}
            onClick={() => handleCardClick('hospitality')}
          >
            <div className={styles.cardGlow}></div>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>🍽️</div>
              <h3 className={styles.cardTitle}>Food & Hospitality</h3>
              <p className={styles.cardDescription}>
                Premium Dining, Beverages & Catering Services
              </p>
              <div className={styles.cardFeatures}>
                <span>• Group Bookings</span>
                <span>• Special Packages</span>
                <span>• Custom Menus</span>
              </div>
            </div>
            <div className={styles.cardArrow}>→</div>
          </div>

          {/* Gifts Card */}
          <div 
            className={`${styles.navCard} ${styles.giftsCard}`}
            onClick={() => handleCardClick('gifts')}
          >
            <div className={styles.cardGlow}></div>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>🎁</div>
              <h3 className={styles.cardTitle}>Gifts</h3>
              <p className={styles.cardDescription}>
                Gift Cards, Merchandise & Special Vouchers
              </p>
              <div className={styles.cardFeatures}>
                <span>• Digital Gift Cards</span>
                <span>• Custom Amounts</span>
                <span>• Instant Delivery</span>
              </div>
            </div>
            <div className={styles.cardArrow}>→</div>
          </div>

          {/* Cue Cafe Dashboard */}
          <div 
            className={`${styles.navCard} ${styles.dashboardCard}`}
            onClick={() => handleCardClick('dashboard')}
          >
            <div className={styles.cardGlow}></div>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>📊</div>
              <h3 className={styles.cardTitle}>User Dashboard</h3>
              <p className={styles.cardDescription}>
                Manage Bookings, History & Profile Settings
              </p>
              <div className={styles.cardFeatures}>
                <span>• Booking Management</span>
                <span>• Payment History</span>
                <span>• Loyalty Points</span>
              </div>
            </div>
            <div className={styles.cardArrow}>→</div>
          </div>
        </div>
      </section>

      {/* Background Animation Elements */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOrb}></div>
        <div className={styles.gradientOrb}></div>
        <div className={styles.gradientOrb}></div>
      </div>
    </div>
  );
}

export default Dashboard;
