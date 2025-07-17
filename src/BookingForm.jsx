import { useState } from 'react'
import styles from './BookingForm.module.css'

const BookingForm = ({ eventType, onBack, onShowGifts, onBookingSubmit }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    eventName: '',
    contactName: '',
    email: '',
    phone: '',
    
    // Event Details
    eventDate: '',
    startTime: '',
    endTime: '',
    guestCount: '',
    
    // Event Services
    foodService: '',
    photography: false,
    videography: false,
    decorationTheme: 'Custom',
    customTheme: '',
    themeDescription: '',
    selectedGifts: [],
    customGiftDetails: '',
    
    // Special Requirements
    specialRequests: '',
    accessibility: false,
    additionalServices: []
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (name === 'additionalServices') {
        const updatedServices = checked 
          ? [...formData.additionalServices, value]
          : formData.additionalServices.filter(service => service !== value)
        
        setFormData(prev => ({
          ...prev,
          additionalServices: updatedServices
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleGiftToggle = (giftId) => {
    setFormData(prev => ({
      ...prev,
      selectedGifts: prev.selectedGifts.includes(giftId) 
        ? prev.selectedGifts.filter(id => id !== giftId)
        : [...prev.selectedGifts, giftId]
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required'
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required'
    if (!formData.startTime) newErrors.startTime = 'Start time is required'
    if (!formData.endTime) newErrors.endTime = 'End time is required'
    if (!formData.guestCount) newErrors.guestCount = 'Guest count is required'
    if (!formData.decorationTheme) newErrors.decorationTheme = 'Decoration theme is required'
    
    // Custom theme validation
    if (formData.decorationTheme === 'Custom' && !formData.customTheme.trim()) {
      newErrors.customTheme = 'Please specify your custom theme'
    }
    
    // Custom gift validation
    if (formData.selectedGifts.includes('custom') && !formData.customGiftDetails.trim()) {
      newErrors.customGiftDetails = 'Please provide details for your custom gift requirements'
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Date validation
    if (formData.eventDate) {
      const selectedDate = new Date(formData.eventDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Prepare the final theme information
      const finalTheme = formData.decorationTheme === 'Custom' 
        ? formData.customTheme 
        : formData.decorationTheme

      const submissionData = {
        ...formData,
        eventType: eventType.id,
        finalDecorationTheme: finalTheme,
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        submittedAt: new Date().toISOString()
      }

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('eventBookings') || '[]')
      existingBookings.push(submissionData)
      localStorage.setItem('eventBookings', JSON.stringify(existingBookings))

      console.log('Booking submitted:', submissionData)
      
      // Call the booking submission callback to show confirmation page
      if (onBookingSubmit) {
        onBookingSubmit(submissionData)
      }
    }
  }

  const decorationThemes = [
    'Classic Elegant',
    'Modern Minimalist',
    'Vintage Rustic',
    'Garden Party',
    'Royal Palace',
    'Beach Paradise',
    'Winter Wonderland',
    'Bohemian Chic',
    'Hollywood Glamour',
    'Fairy Tale',
    'Traditional',
    'Contemporary',
    'Custom'
  ]

  const giftOptions = [
    { id: 'welcome-hamper', name: 'Welcome Hamper', price: '$25', description: 'Gourmet snacks and treats in a beautiful basket' },
    { id: 'flower-bouquet', name: 'Fresh Flower Bouquet', price: '$35', description: 'Beautiful seasonal flowers arranged by expert florists' },
    { id: 'wine-collection', name: 'Wine Collection', price: '$75', description: 'Curated selection of premium wines' },
    { id: 'chocolate-box', name: 'Luxury Chocolate Box', price: '$45', description: 'Handcrafted artisan chocolates' },
    { id: 'spa-voucher', name: 'Spa Voucher', price: '$100', description: 'Relaxing spa experience at partner locations' },
    { id: 'photo-frame', name: 'Custom Photo Frame', price: '$30', description: 'Personalized keepsake with event details' },
    { id: 'champagne-set', name: 'Champagne Celebration Set', price: '$95', description: 'Premium champagne with elegant flutes' },
    { id: 'dessert-platter', name: 'Gourmet Dessert Platter', price: '$65', description: 'Assorted mini desserts and pastries' },
    { id: 'gift-card', name: 'Gift Card Collection', price: '$50', description: 'Versatile gift cards for various experiences' },
    { id: 'memory-book', name: 'Memory Book', price: '$40', description: 'Beautiful album for event photos and memories' },
    { id: 'candle-set', name: 'Luxury Candle Set', price: '$35', description: 'Premium scented candles in elegant packaging' },
    { id: 'jewelry-box', name: 'Jewelry Gift Box', price: '$85', description: 'Elegant jewelry pieces for special occasions' },
    { id: 'tea-coffee-set', name: 'Premium Tea & Coffee Set', price: '$55', description: 'Gourmet tea and coffee collection' },
    { id: 'plant-arrangement', name: 'Plant Arrangement', price: '$40', description: 'Beautiful potted plants and succulents' },
    { id: 'custom', name: 'Custom Gift', price: 'Variable', description: 'Tell us your specific requirements' }
  ]

  return (
    <div className={styles.bookingForm}>
      {/* Header with Navigation */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Events
        </button>
        <div className={styles.headerContent}>
          <div className={styles.eventInfo}>
            <span className={styles.eventIcon}>{eventType.icon}</span>
            <h1 className={styles.pageTitle}>Book Your {eventType.name}</h1>
            <p className={styles.pageSubtitle}>Complete the form below to reserve your event</p>
          </div>
        </div>
      </div>

      <div className={styles.bookingFormContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionHeading}>📋 Basic Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="eventName">Event Name *</label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className={errors.eventName ? styles.error : ''}
                  placeholder="Enter your event name"
                />
                {errors.eventName && <span className={styles.errorText}>{errors.eventName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactName">Contact Name *</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className={errors.contactName ? styles.error : ''}
                  placeholder="Your full name"
                />
                {errors.contactName && <span className={styles.errorText}>{errors.contactName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? styles.error : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? styles.error : ''}
                  placeholder="(123) 456-7890"
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionHeading}>📅 Event Details</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="eventDate">Event Date *</label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className={errors.eventDate ? styles.error : ''}
                />
                {errors.eventDate && <span className={styles.errorText}>{errors.eventDate}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="startTime">Start Time *</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={errors.startTime ? styles.error : ''}
                />
                {errors.startTime && <span className={styles.errorText}>{errors.startTime}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endTime">End Time *</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={errors.endTime ? styles.error : ''}
                />
                {errors.endTime && <span className={styles.errorText}>{errors.endTime}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="guestCount">Number of Guests *</label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className={errors.guestCount ? styles.error : ''}
                  placeholder="Enter guest count"
                  min="1"
                />
                {errors.guestCount && <span className={styles.errorText}>{errors.guestCount}</span>}
              </div>
            </div>
          </div>

          {/* Event Services Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionHeading}>🍽️ Event Services</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="foodService">Food Service</label>
                <select
                  id="foodService"
                  name="foodService"
                  value={formData.foodService}
                  onChange={handleInputChange}
                >
                  <option value="">Select food service</option>
                  <option value="full-catering">Full Catering Service</option>
                  <option value="buffet">Buffet Style</option>
                  <option value="cocktail">Cocktail & Appetizers</option>
                  <option value="dessert-only">Dessert Only</option>
                  <option value="beverages-only">Beverages Only</option>
                  <option value="no-food">No Food Service</option>
                </select>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <h4>📸 Professional Services</h4>
              <div className={styles.checkboxGrid}>
                <div className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="photography"
                    checked={formData.photography}
                    onChange={handleInputChange}
                  />
                  <label>Professional Photography</label>
                </div>

                <div className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="videography"
                    checked={formData.videography}
                    onChange={handleInputChange}
                  />
                  <label>Professional Videography</label>
                </div>
              </div>
            </div>
          </div>

          {/* Decoration & Theme Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionHeading}>🎨 Decoration & Theme</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="decorationTheme">Decoration Theme *</label>
                <select
                  id="decorationTheme"
                  name="decorationTheme"
                  value={formData.decorationTheme}
                  onChange={handleInputChange}
                  className={errors.decorationTheme ? styles.error : ''}
                >
                  <option value="">Select decoration theme</option>
                  {decorationThemes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
                {errors.decorationTheme && <span className={styles.errorText}>{errors.decorationTheme}</span>}
              </div>

              {/* Custom Theme Input - Shows when Custom is selected */}
              {formData.decorationTheme === 'Custom' && (
                <div className={styles.formGroup}>
                  <label htmlFor="customTheme">Specify Your Custom Theme *</label>
                  <input
                    type="text"
                    id="customTheme"
                    name="customTheme"
                    value={formData.customTheme}
                    onChange={handleInputChange}
                    className={errors.customTheme ? styles.error : ''}
                    placeholder="Enter your custom theme name"
                  />
                  {errors.customTheme && <span className={styles.errorText}>{errors.customTheme}</span>}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="themeDescription">Theme Description & Special Requests</label>
              <textarea
                id="themeDescription"
                name="themeDescription"
                value={formData.themeDescription}
                onChange={handleInputChange}
                rows="4"
                placeholder={
                  formData.decorationTheme 
                    ? `Describe your ${formData.decorationTheme === 'Custom' ? formData.customTheme || 'custom' : formData.decorationTheme} theme vision, color preferences, special decorative elements, or any specific requirements...`
                    : "Describe your theme vision, color preferences, special decorative elements, or any specific requirements..."
                }
              />
            </div>
          </div>

          {/* Gift Options Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionHeading}>🎁 Gift Options</h3>
            <p className={styles.sectionDescription}>Select multiple gifts to make your event extra special</p>
            
            <div className={styles.giftSelection}>
              <div className={styles.giftGrid}>
                {giftOptions.map(gift => (
                  <div 
                    key={gift.id}
                    className={`${styles.giftCard} ${formData.selectedGifts.includes(gift.id) ? styles.selected : ''}`}
                    onClick={() => handleGiftToggle(gift.id)}
                  >
                    <div className={styles.giftIcon}>{gift.icon}</div>
                    <h4 className={styles.giftName}>{gift.name}</h4>
                    <span className={styles.giftPrice}>{gift.price}</span>
                    <p className={styles.giftDescription}>{gift.description}</p>
                    <div className={styles.giftSelectionIndicator}>
                      {formData.selectedGifts.includes(gift.id) ? '✓ Selected' : 'Click to Select'}
                    </div>
                  </div>
                ))}
              </div>
              
              {formData.selectedGifts.length > 0 && (
                <div className={styles.selectedGiftsSummary}>
                  <div className={styles.summaryContent}>
                    <h4 className={styles.summaryTitle}>Selected Gifts ({formData.selectedGifts.length})</h4>
                    <div className={styles.selectedList}>
                      {formData.selectedGifts.map(giftId => {
                        const gift = giftOptions.find(g => g.id === giftId)
                        return (
                          <span key={giftId} className={styles.selectedGiftTag}>
                            {gift.name} - {gift.price}
                            <button 
                              type="button" 
                              className={styles.removeGift}
                              onClick={() => handleGiftToggle(giftId)}
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}
                    </div>
                    <div className={styles.totalPrice}>
                      <strong>
                        Total Items: {formData.selectedGifts.length}
                        {formData.selectedGifts.includes('custom') && ' (Custom pricing applies)'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {formData.selectedGifts.includes('custom') && (
              <div className={styles.formGroup}>
                <label htmlFor="customGiftDetails">Custom Gift Requirements *</label>
                <textarea
                  id="customGiftDetails"
                  name="customGiftDetails"
                  value={formData.customGiftDetails}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Please describe your custom gift requirements in detail:
• What type of gift are you looking for?
• Any specific preferences (colors, themes, materials)?
• Special packaging or presentation requirements?
• Any other details that would help us create the perfect custom gift..."
                />
              </div>
            )}

            <div className={styles.giftNote}>
              <p><strong>Note:</strong> Visit our <button type="button" className={styles.giftButton} onClick={onShowGifts}>Gift Gallery</button> to explore detailed descriptions and see all available options.</p>
            </div>
          </div>

          {/* Special Requirements Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionHeading}>📋 Special Requirements</h3>
            <div className={styles.specialRequirements}>
              <div className={styles.formGroup}>
                <label htmlFor="specialRequests">Special Requests or Notes</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Any special requirements, dietary restrictions, or additional information..."
                />
              </div>

              <div className={styles.checkboxGroup}>
                <h4>Additional Requirements</h4>
                <div className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="accessibility"
                    checked={formData.accessibility}
                    onChange={handleInputChange}
                  />
                  <label>Accessibility accommodations needed</label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onBack}>
              ← Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Submit Booking Request 🎉
            </button>
          </div>
        </form>

        {/* Background Effects */}
        <div className={styles.backgroundEffects}>
          <div className={styles.floatingOrb}></div>
          <div className={styles.floatingOrb}></div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm
