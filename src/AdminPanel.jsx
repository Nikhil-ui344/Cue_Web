import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './AdminPanel.css'

const AdminPanel = ({ onBack }) => {
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('eventBookings')
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }
  }, [])

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    return matchesSearch && booking.eventType === filter
  })

  const getEventTypeIcon = (eventType) => {
    const icons = {
      'birthday': '🎂',
      'anniversary': '💑', 
      'wedding': '💒',
      'corporate': '🏢',
      'conference': '📊',
      'workshop': '🛠️',
      'graduation': '🎓',
      'baby-shower': '👶',
      'reunion': '👥',
      'charity': '❤️',
      'others': '🎉'
    }
    return icons[eventType] || '🎉'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalGiftPrice = (selectedGifts) => {
    const giftPrices = {
      'welcome-hamper': 25,
      'flower-bouquet': 35,
      'wine-collection': 75,
      'chocolate-box': 45,
      'spa-voucher': 100,
      'photo-frame': 30,
      'champagne-set': 95,
      'dessert-platter': 65,
      'gift-card': 50,
      'memory-book': 40,
      'candle-set': 35,
      'jewelry-box': 85,
      'tea-coffee-set': 55,
      'plant-arrangement': 40
    }
    
    const total = selectedGifts.reduce((sum, giftId) => {
      return sum + (giftPrices[giftId] || 0)
    }, 0)
    
    return total
  }

  const deleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const updatedBookings = bookings.filter(booking => booking.id !== bookingId)
      setBookings(updatedBookings)
      localStorage.setItem('eventBookings', JSON.stringify(updatedBookings))
      setSelectedBooking(null)
    }
  }

  const exportBookingsToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    
    // Header
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CUE CLUB - EVENT BOOKINGS REPORT', pageWidth / 2, 30, { align: 'center' })
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    })}`, pageWidth / 2, 40, { align: 'center' })
    
    pdf.text(`Total Bookings: ${bookings.length}`, pageWidth / 2, 50, { align: 'center' })
    
    let yPos = 70
    
    bookings.forEach((booking, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 80) {
        pdf.addPage()
        yPos = 30
      }
      
      // Booking header
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`BOOKING #${index + 1}`, margin, yPos)
      yPos += 10
      
      // Booking details
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      
      const details = [
        [`Event Name:`, booking.eventName],
        [`Event Type:`, booking.eventType],
        [`Contact Person:`, booking.contactName],
        [`Email:`, booking.email],
        [`Phone:`, booking.phone],
        [`Event Date:`, formatDate(booking.eventDate)],
        [`Time:`, `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`],
        [`Guests:`, `${booking.guestCount} people`],
        [`Theme:`, booking.decorationTheme === 'Custom' ? booking.customTheme : booking.decorationTheme],
        [`Food Service:`, booking.foodService],
        [`Photography:`, booking.photography ? 'Yes' : 'No'],
        [`Videography:`, booking.videography ? 'Yes' : 'No'],
        [`Selected Gifts:`, booking.selectedGifts?.join(', ') || 'None'],
        [`Special Requests:`, booking.specialRequests || 'None'],
        [`Submitted:`, formatDate(booking.submittedAt)]
      ]
      
      details.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold')
        pdf.text(label, margin, yPos)
        pdf.setFont('helvetica', 'normal')
        pdf.text(String(value), margin + 40, yPos)
        yPos += 6
      })
      
      yPos += 10 // Space between bookings
    })
    
    pdf.save(`cue-club-bookings-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const exportBookingsToWord = () => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Cue Club Event Bookings Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .booking { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .booking-title { background: #667eea; color: white; padding: 10px; margin: -20px -20px 15px -20px; border-radius: 5px 5px 0 0; }
          .detail-row { display: flex; margin-bottom: 8px; }
          .label { font-weight: bold; width: 150px; color: #333; }
          .value { flex: 1; }
          .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CUE CLUB - EVENT BOOKINGS REPORT</h1>
          <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          })}</p>
          <p>Total Bookings: ${bookings.length}</p>
        </div>
    `
    
    bookings.forEach((booking, index) => {
      htmlContent += `
        <div class="booking">
          <div class="booking-title">
            <h3>Booking #${index + 1} - ${booking.eventName}</h3>
          </div>
          <div class="detail-row"><span class="label">Event Type:</span><span class="value">${booking.eventType}</span></div>
          <div class="detail-row"><span class="label">Contact Person:</span><span class="value">${booking.contactName}</span></div>
          <div class="detail-row"><span class="label">Email:</span><span class="value">${booking.email}</span></div>
          <div class="detail-row"><span class="label">Phone:</span><span class="value">${booking.phone}</span></div>
          <div class="detail-row"><span class="label">Event Date:</span><span class="value">${formatDate(booking.eventDate)}</span></div>
          <div class="detail-row"><span class="label">Time:</span><span class="value">${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</span></div>
          <div class="detail-row"><span class="label">Guests:</span><span class="value">${booking.guestCount} people</span></div>
          <div class="detail-row"><span class="label">Theme:</span><span class="value">${booking.decorationTheme === 'Custom' ? booking.customTheme : booking.decorationTheme}</span></div>
          <div class="detail-row"><span class="label">Food Service:</span><span class="value">${booking.foodService}</span></div>
          <div class="detail-row"><span class="label">Photography:</span><span class="value">${booking.photography ? 'Yes' : 'No'}</span></div>
          <div class="detail-row"><span class="label">Videography:</span><span class="value">${booking.videography ? 'Yes' : 'No'}</span></div>
          <div class="detail-row"><span class="label">Selected Gifts:</span><span class="value">${booking.selectedGifts?.join(', ') || 'None'}</span></div>
          <div class="detail-row"><span class="label">Custom Gift Details:</span><span class="value">${booking.customGiftDetails || 'None'}</span></div>
          <div class="detail-row"><span class="label">Special Requests:</span><span class="value">${booking.specialRequests || 'None'}</span></div>
          <div class="detail-row"><span class="label">Accessibility Needs:</span><span class="value">${booking.accessibility ? 'Yes' : 'No'}</span></div>
          <div class="detail-row"><span class="label">Additional Services:</span><span class="value">${booking.additionalServices?.join(', ') || 'None'}</span></div>
          <div class="detail-row"><span class="label">Submitted:</span><span class="value">${formatDate(booking.submittedAt)}</span></div>
        </div>
      `
    })
    
    htmlContent += `
        <div class="summary">
          <h3>Summary Statistics</h3>
          <div class="detail-row"><span class="label">Total Bookings:</span><span class="value">${bookings.length}</span></div>
          <div class="detail-row"><span class="label">Upcoming Events:</span><span class="value">${bookings.filter(b => new Date(b.eventDate) > new Date()).length}</span></div>
          <div class="detail-row"><span class="label">Event Types:</span><span class="value">${new Set(bookings.map(b => b.eventType)).size}</span></div>
          <div class="detail-row"><span class="label">Report Generated:</span><span class="value">${new Date().toLocaleString()}</span></div>
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cue-club-bookings-${new Date().toISOString().split('T')[0]}.doc`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportBookings = () => {
    const dataStr = JSON.stringify(bookings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `event-bookings-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  return (
    <div className="admin-panel">
      <div className="admin-content">
        <div className="admin-sidebar">
          <div className="export-section">
            <h3>📤 Export Options</h3>
            <div className="export-buttons">
              <button className="export-btn pdf" onClick={exportBookingsToPDF}>
                📄 Export PDF
              </button>
              <button className="export-btn word" onClick={exportBookingsToWord}>
                📝 Export Word
              </button>
              <button className="export-btn json" onClick={exportBookings}>
                📥 Export JSON
              </button>
            </div>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
            <div className="stat-card">
              <h3>{bookings.filter(b => new Date(b.eventDate) > new Date()).length}</h3>
              <p>Upcoming Events</p>
            </div>
            <div className="stat-card">
              <h3>{new Set(bookings.map(b => b.eventType)).size}</h3>
              <p>Event Types</p>
            </div>
          </div>

          <div className="admin-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Events
              </button>
              <button
                className={`filter-btn ${filter === 'birthday' ? 'active' : ''}`}
                onClick={() => setFilter('birthday')}
              >
                🎂 Birthdays
              </button>
              <button
                className={`filter-btn ${filter === 'corporate' ? 'active' : ''}`}
                onClick={() => setFilter('corporate')}
              >
                🏢 Corporate
              </button>
              <button
                className={`filter-btn ${filter === 'wedding' ? 'active' : ''}`}
                onClick={() => setFilter('wedding')}
              >
                💒 Weddings
              </button>
              <button
                className={`filter-btn ${filter === 'others' ? 'active' : ''}`}
                onClick={() => setFilter('others')}
              >
                🎉 Others
              </button>
            </div>
          </div>

          <div className="bookings-list">
            {filteredBookings.length === 0 ? (
              <div className="no-bookings">
                <p>No bookings found</p>
              </div>
            ) : (
              filteredBookings.map(booking => (
                <div
                  key={booking.id}
                  className={`booking-item ${selectedBooking?.id === booking.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="booking-header">
                    <span className="event-icon">{getEventTypeIcon(booking.eventType)}</span>
                    <div className="booking-info">
                      <h4>{booking.eventName}</h4>
                      <p>{booking.contactName}</p>
                    </div>
                  </div>
                  <div className="booking-details">
                    <span className="event-date">{formatDate(booking.eventDate)}</span>
                    <span className="guest-count">{booking.guestCount} guests</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-main">
          {selectedBooking ? (
            <div className="booking-details-panel">
              <div className="booking-details-header">
                <div className="booking-title">
                  <span className="event-icon-large">{getEventTypeIcon(selectedBooking.eventType)}</span>
                  <div>
                    <h2>{selectedBooking.eventName}</h2>
                    <p className="event-type-label">{selectedBooking.eventType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => deleteBooking(selectedBooking.id)}
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="booking-sections">
                {/* Contact Information */}
                <div className="detail-section">
                  <h3>📞 Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Contact Name</label>
                      <span>{selectedBooking.contactName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <span>{selectedBooking.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <span>{selectedBooking.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="detail-section">
                  <h3>📅 Event Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Event Date</label>
                      <span>{formatDate(selectedBooking.eventDate)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Time</label>
                      <span>{formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Guest Count</label>
                      <span>{selectedBooking.guestCount} guests</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="detail-section">
                  <h3>🍽️ Services</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Food Service</label>
                      <span>{selectedBooking.foodService || 'None'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Food Type</label>
                      <span>{selectedBooking.foodType || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Photography</label>
                      <span>{selectedBooking.photography ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Videography</label>
                      <span>{selectedBooking.videography ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Theme & Decoration */}
                <div className="detail-section">
                  <h3>🎨 Theme & Decoration</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Theme</label>
                      <span>{selectedBooking.finalDecorationTheme || selectedBooking.decorationTheme}</span>
                    </div>
                    {selectedBooking.themeDescription && (
                      <div className="detail-item full-width">
                        <label>Theme Description</label>
                        <span>{selectedBooking.themeDescription}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gifts */}
                {selectedBooking.selectedGifts && selectedBooking.selectedGifts.length > 0 && (
                  <div className="detail-section">
                    <h3>🎁 Selected Gifts</h3>
                    <div className="gifts-list">
                      {selectedBooking.selectedGifts.map(giftId => {
                        const giftNames = {
                          'welcome-hamper': 'Welcome Hamper ($25)',
                          'flower-bouquet': 'Fresh Flower Bouquet ($35)',
                          'wine-collection': 'Wine Collection ($75)',
                          'chocolate-box': 'Luxury Chocolate Box ($45)',
                          'spa-voucher': 'Spa Voucher ($100)',
                          'photo-frame': 'Custom Photo Frame ($30)',
                          'champagne-set': 'Champagne Celebration Set ($95)',
                          'dessert-platter': 'Gourmet Dessert Platter ($65)',
                          'gift-card': 'Gift Card Collection ($50)',
                          'memory-book': 'Memory Book ($40)',
                          'candle-set': 'Luxury Candle Set ($35)',
                          'jewelry-box': 'Jewelry Gift Box ($85)',
                          'tea-coffee-set': 'Premium Tea & Coffee Set ($55)',
                          'plant-arrangement': 'Plant Arrangement ($40)',
                          'custom': 'Custom Gift (Variable)'
                        }
                        return (
                          <span key={giftId} className="gift-tag-admin">
                            {giftNames[giftId] || giftId}
                          </span>
                        )
                      })}
                    </div>
                    <div className="gifts-total">
                      <strong>Total Gift Value: ${getTotalGiftPrice(selectedBooking.selectedGifts)}</strong>
                      {selectedBooking.selectedGifts.includes('custom') && <span> + Custom items</span>}
                    </div>
                    {selectedBooking.customGiftDetails && (
                      <div className="custom-gift-details">
                        <label>Custom Gift Requirements</label>
                        <p>{selectedBooking.customGiftDetails}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Special Requirements */}
                {selectedBooking.specialRequests && (
                  <div className="detail-section">
                    <h3>📝 Special Requirements</h3>
                    <div className="special-requests">
                      <p>{selectedBooking.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Submission Info */}
                <div className="detail-section">
                  <h3>📊 Submission Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Submitted On</label>
                      <span>{new Date(selectedBooking.submittedAt).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Booking ID</label>
                      <span>{selectedBooking.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-content">
                <h2>📋 Select a Booking</h2>
                <p>Choose a booking from the list to view detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
