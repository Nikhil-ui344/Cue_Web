import React, { useState } from "react";
import styles from "./BookingPage.module.css";

function BookingPage({ game, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [summaryMinimized, setSummaryMinimized] = useState(false);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isPast = date < today.setHours(0, 0, 0, 0);
      days.push({ date, day, isPast });
    }
    
    return days;
  };

  // Generate 30-minute time slots from 9 AM to 10 PM
  const generateTimeSlots = () => {
    const slots = [];
    let id = 1;
    
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute === 30) break; // Stop at 10:00 PM
        
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        
        // Randomly set some slots as booked for demo
        const isBooked = Math.random() < 0.2; // 20% chance of being booked
        
        slots.push({
          id,
          time24,
          time12,
          available: !isBooked
        });
        id++;
      }
    }
    
    return slots;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlots([]); // Reset slot selection when date changes
  };

  const handleSlotSelect = (slot) => {
    if (!slot.available) return;
    
    setSelectedSlots(prev => {
      const isSelected = prev.some(s => s.id === slot.id);
      if (isSelected) {
        // Remove slot if already selected
        return prev.filter(s => s.id !== slot.id);
      } else {
        // Add slot to selection
        return [...prev, slot].sort((a, b) => a.id - b.id);
      }
    });
  };

  const calculateTotalPrice = () => {
    const pricePerHour = parseInt(game.price.replace(/[^\d]/g, ''));
    const totalHours = selectedSlots.length * 0.5; // Each slot is 30 minutes
    return pricePerHour * totalHours;
  };

  const handleBooking = () => {
    if (selectedDate && selectedSlots.length > 0) {
      setShowBookingPopup(true);
    }
  };

  const confirmFinalBooking = () => {
    const totalPrice = calculateTotalPrice();
    const timeRange = selectedSlots.length > 1 
      ? `${selectedSlots[0].time12} - ${selectedSlots[selectedSlots.length - 1].time12}` 
      : selectedSlots[0].time12;
    
    alert(`Booking confirmed!\nGame: ${game.name}\nDate: ${selectedDate.toDateString()}\nTime: ${timeRange}\nDuration: ${selectedSlots.length * 0.5} hours\nTotal Price: ₹${totalPrice}`);
    setShowBookingPopup(false);
    // Here you would implement actual booking logic
  };

  const cancelBooking = () => {
    setShowBookingPopup(false);
  };

  const calendarDays = generateCalendarDays();
  const timeSlots = generateTimeSlots();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.bookingPage}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Games
        </button>
        <div className={styles.gameInfo}>
          <div className={styles.gameIcon}>{game.icon}</div>
          <div className={styles.gameDetails}>
            <h1 className={styles.gameName}>{game.name}</h1>
            <p className={styles.gamePrice}>{game.price}</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}>
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>Select Date</span>
        </div>
        <div className={`${styles.step} ${selectedDate ? styles.active : ''}`}>
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>Select Time Slots</span>
        </div>
        <div className={`${styles.step} ${selectedDate && selectedSlots.length > 0 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>3</span>
          <span className={styles.stepLabel}>Confirm Booking</span>
        </div>
      </div>

      {/* Booking Container */}
      <div className={styles.bookingContainer}>
        
        {/* Calendar Section */}
        <div className={styles.calendarSection}>
          <h2 className={styles.sectionTitle}>Select Date</h2>
          <div className={styles.calendarHeader}>
            <h3 className={styles.monthYear}>{currentMonth} {currentYear}</h3>
          </div>
          
          <div className={styles.calendar}>
            <div className={styles.weekDays}>
              <div className={styles.weekDay}>Sun</div>
              <div className={styles.weekDay}>Mon</div>
              <div className={styles.weekDay}>Tue</div>
              <div className={styles.weekDay}>Wed</div>
              <div className={styles.weekDay}>Thu</div>
              <div className={styles.weekDay}>Fri</div>
              <div className={styles.weekDay}>Sat</div>
            </div>
            
            <div className={styles.calendarDays}>
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`${styles.calendarDay} 
                    ${day && !day.isPast ? styles.available : ''} 
                    ${day && selectedDate && day.date.toDateString() === selectedDate.toDateString() ? styles.selected : ''}
                    ${day && day.isPast ? styles.past : ''}`}
                  onClick={() => day && !day.isPast && handleDateSelect(day.date)}
                >
                  {day ? day.day : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slots Section - Only show if date is selected */}
        {selectedDate && (
          <div className={styles.slotsSection}>
            <h2 className={styles.sectionTitle}>
              Select Time Slots for {selectedDate.toDateString()}
            </h2>
            <p className={styles.multiSelectHint}>
              💡 You can select multiple 30-minute slots. Click to add/remove slots.
            </p>
            <div className={styles.slotsGrid}>
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`${styles.timeSlot} 
                    ${slot.available ? styles.available : styles.booked}
                    ${selectedSlots.some(s => s.id === slot.id) ? styles.selected : ''}`}
                  onClick={() => handleSlotSelect(slot)}
                >
                  <span className={styles.slotTime}>{slot.time12}</span>
                  <span className={styles.slotStatus}>
                    {slot.available ? '30 min' : 'Booked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions when no date selected */}
        {!selectedDate && (
          <div className={styles.instructionsSection}>
            <div className={styles.instructionsContent}>
              <h2 className={styles.instructionsTitle}>📅 First, Select a Date</h2>
              <p className={styles.instructionsText}>
                Choose an available date from the calendar to see time slots
              </p>
              <div className={styles.instructionsFeatures}>
                <div className={styles.instructionItem}>
                  ⏰ <span>30-minute time slots</span>
                </div>
                <div className={styles.instructionItem}>
                  🔄 <span>Select multiple slots</span>
                </div>
                <div className={styles.instructionItem}>
                  💰 <span>Pay per slot selected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Summary */}
      {selectedDate && selectedSlots.length > 0 && (
        <div className={`${styles.bookingSummary} ${summaryMinimized ? styles.minimized : ''}`}>
          <div className={styles.summaryHeader}>
            <h3 className={styles.summaryTitle}>Booking Summary</h3>
            <button 
              className={styles.minimizeButton}
              onClick={() => setSummaryMinimized(!summaryMinimized)}
              title={summaryMinimized ? "Expand summary" : "Minimize summary"}
            >
              {summaryMinimized ? '📋' : '−'}
            </button>
          </div>
          
          {!summaryMinimized && (
            <div className={styles.summaryContent}>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Game:</span>
                  <span className={styles.summaryValue}>{game.name}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Date:</span>
                  <span className={styles.summaryValue}>{selectedDate.toDateString()}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Time Slots:</span>
                  <span className={styles.summaryValue}>{selectedSlots.length} slots</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Duration:</span>
                  <span className={styles.summaryValue}>{selectedSlots.length * 0.5} hours</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total Price:</span>
                  <span className={styles.summaryValue}>₹{calculateTotalPrice()}</span>
                </div>
              </div>
              
              {/* Selected slots preview */}
              <div className={styles.selectedSlotsPreview}>
                <span className={styles.previewLabel}>Selected Times:</span>
                <div className={styles.selectedSlotsList}>
                  {selectedSlots.map((slot, index) => (
                    <span key={slot.id} className={styles.selectedSlotChip}>
                      {slot.time12}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className={styles.confirmButton} onClick={handleBooking}>
                Review Booking (₹{calculateTotalPrice()})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Booking Confirmation Popup */}
      {showBookingPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.bookingPopup}>
            <div className={styles.popupHeader}>
              <h2 className={styles.popupTitle}>🎯 Confirm Your Booking</h2>
              <button className={styles.closeButton} onClick={cancelBooking}>
                ✕
              </button>
            </div>
            
            <div className={styles.popupContent}>
              <div className={styles.gamePreview}>
                <div className={styles.gameIconLarge}>{game.icon}</div>
                <div className={styles.gameInfo}>
                  <h3 className={styles.gameNameLarge}>{game.name}</h3>
                  <p className={styles.gamePriceLarge}>{game.price} per hour</p>
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>📅 Date:</span>
                  <span className={styles.detailValue}>{selectedDate.toDateString()}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>⏱️ Duration:</span>
                  <span className={styles.detailValue}>{selectedSlots.length * 0.5} hours ({selectedSlots.length} slots)</span>
                </div>
              </div>

              <div className={styles.selectedTimesSection}>
                <h4 className={styles.timesTitle}>🕐 Selected Time Slots:</h4>
                <div className={styles.timeSlotsList}>
                  {selectedSlots.map((slot, index) => (
                    <div key={slot.id} className={styles.timeSlotItem}>
                      <span className={styles.timeSlotNumber}>{index + 1}.</span>
                      <span className={styles.timeSlotTime}>{slot.time12}</span>
                      <span className={styles.timeSlotDuration}>(30 min)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.pricingBreakdown}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Base price per hour:</span>
                  <span className={styles.priceValue}>₹{parseInt(game.price.replace(/[^\d]/g, ''))}</span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Total slots ({selectedSlots.length} × 30 min):</span>
                  <span className={styles.priceValue}>{selectedSlots.length * 0.5} hours</span>
                </div>
                <div className={styles.totalPriceRow}>
                  <span className={styles.totalLabel}>Total Amount:</span>
                  <span className={styles.totalValue}>₹{calculateTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className={styles.popupActions}>
              <button className={styles.cancelButton} onClick={cancelBooking}>
                Cancel
              </button>
              <button className={styles.finalConfirmButton} onClick={confirmFinalBooking}>
                Confirm Booking ₹{calculateTotalPrice()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.floatingOrb}></div>
        <div className={styles.floatingOrb}></div>
      </div>
    </div>
  );
}

export default BookingPage;
