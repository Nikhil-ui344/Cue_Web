import styles from './BookingConfirmation.module.css'

const BookingConfirmation = ({ onBackToHome, bookingData }) => {
  return (
    <div className={styles.bookingConfirmation}>
      {/* Header with Navigation */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBackToHome}>
          ← Back to Dashboard
        </button>
      </div>

      <div className={styles.confirmationContent}>
        <div className={styles.successAnimation}>
          <div className={styles.checkmarkCircle}>
            <div className={styles.checkmark}>✓</div>
          </div>
        </div>
        
        <h1 className={styles.confirmationTitle}>🎉 Your Booking is Confirmed!</h1>
        
        <div className={styles.confirmationMessage}>
          <p className={styles.mainMessage}>
            Thank you for choosing <strong>Cue Club Cafe</strong> for your special event!
          </p>
          <p className={styles.subMessage}>
            Your booking request has been successfully submitted and our team will contact you shortly.
          </p>
        </div>

        <div className={styles.contactInfo}>
          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>📞</div>
            <div className={styles.contactDetails}>
              <h3>What's Next?</h3>
              <p>The <strong>Cue Club team</strong> will contact you within 24 hours to:</p>
              <ul>
                <li>Confirm your event details and preferences</li>
                <li>Discuss venue arrangements and availability</li>
                <li>Finalize decoration themes and catering options</li>
                <li>Coordinate your selected gifts and services</li>
                <li>Provide you with a detailed event timeline</li>
              </ul>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>✉️</div>
            <div className={styles.contactDetails}>
              <h3>How We'll Contact You</h3>
              <p>The Cue Club team will reach out to you through:</p>
              <ul>
                <li>📞 Phone call for personal consultation</li>
                <li>📧 Email confirmation with detailed proposal</li>
                <li>💬 WhatsApp updates on your event planning progress</li>
                <li>📝 Text message for quick confirmations</li>
              </ul>
            </div>
          </div>
        </div>

        {bookingData && (
          <div className={styles.bookingSummary}>
            <h3 className={styles.summaryTitle}>📋 Your Booking Summary</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Event Type:</span>
                <span className={styles.value}>{bookingData.eventType?.name || 'N/A'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Event Name:</span>
                <span className={styles.value}>{bookingData.eventName}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Date:</span>
                <span className={styles.value}>{bookingData.eventDate}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Contact:</span>
                <span className={styles.value}>{bookingData.contactName}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Guests:</span>
                <span className={styles.value}>{bookingData.guestCount} people</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>Theme:</span>
                <span className={styles.value}>
                  {bookingData.decorationTheme === 'Custom' 
                    ? bookingData.customTheme || 'Custom Theme' 
                    : bookingData.decorationTheme}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.emergencyContact}>
          <p>
            <strong>Need immediate assistance?</strong><br/>
            Call us at <a href="tel:+1234567890">+1 (234) 567-8900</a> or 
            email <a href="mailto:events@cueclub.com">events@cueclub.com</a>
          </p>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.homeButton} onClick={onBackToHome}>
            🏠 Back to Dashboard
          </button>
        </div>

        <div className={styles.footerMessage}>
          <p>We can't wait to help you create an unforgettable experience! 🎊</p>
        </div>

        {/* Background Effects */}
        <div className={styles.backgroundEffects}>
          <div className={styles.floatingOrb}></div>
          <div className={styles.floatingOrb}></div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
