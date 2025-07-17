import { useState } from 'react'
import styles from './GiftGallery.module.css'

const GiftGallery = ({ onBack, onHome }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedGift, setSelectedGift] = useState(null)

  const giftCategories = [
    { id: 'all', name: 'All Gifts' },
    { id: 'welcome', name: 'Welcome Gifts' },
    { id: 'luxury', name: 'Luxury Items' },
    { id: 'personalized', name: 'Personalized' },
    { id: 'experience', name: 'Experiences' },
    { id: 'hampers', name: 'Gift Hampers' }
  ]

  const giftItems = [
    {
      id: 1,
      name: 'Welcome Hamper Deluxe',
      category: 'welcome',
      price: '$45',
      image: '🧺',
      description: 'Premium welcome hamper with gourmet snacks, artisan crackers, specialty teas, and local honey.',
      features: ['Gourmet snacks', 'Artisan crackers', 'Specialty teas', 'Local honey', 'Beautiful basket']
    },
    {
      id: 2,
      name: 'Fresh Seasonal Bouquet',
      category: 'welcome',
      price: '$35',
      image: '💐',
      description: 'Beautiful arrangement of fresh seasonal flowers with premium wrapping and care card.',
      features: ['Seasonal flowers', 'Professional arrangement', 'Premium wrapping', 'Care instructions']
    },
    {
      id: 3,
      name: 'Premium Wine Collection',
      category: 'luxury',
      price: '$125',
      image: '🍷',
      description: 'Curated selection of premium wines including red, white, and sparkling varieties.',
      features: ['3 premium bottles', 'Tasting notes', 'Wine accessories', 'Storage recommendations']
    },
    {
      id: 4,
      name: 'Artisan Chocolate Box',
      category: 'luxury',
      price: '$55',
      image: '🍫',
      description: 'Hand-crafted chocolates from local artisans with unique flavors and elegant presentation.',
      features: ['12 unique flavors', 'Hand-crafted', 'Elegant packaging', 'Flavor guide']
    },
    {
      id: 5,
      name: 'Luxury Spa Experience',
      category: 'experience',
      price: '$150',
      image: '🧖‍♀️',
      description: 'Full spa day experience including massage, facial, and relaxation treatments.',
      features: ['Full day access', 'Massage therapy', 'Facial treatment', 'Relaxation area', '6-month validity']
    },
    {
      id: 6,
      name: 'Custom Photo Frame Set',
      category: 'personalized',
      price: '$40',
      image: '🖼️',
      description: 'Personalized photo frames with custom engraving and professional photo printing.',
      features: ['Custom engraving', 'Professional printing', 'Multiple sizes', 'Premium materials']
    },
    {
      id: 7,
      name: 'Gourmet Coffee Collection',
      category: 'hampers',
      price: '$65',
      image: '☕',
      description: 'Premium coffee beans from around the world with brewing accessories and tasting guide.',
      features: ['5 coffee varieties', 'Brewing guide', 'Coffee accessories', 'Tasting notes']
    },
    {
      id: 8,
      name: 'Personalized Jewelry Box',
      category: 'personalized',
      price: '$85',
      image: '💎',
      description: 'Elegant jewelry box with custom engraving and premium velvet interior.',
      features: ['Custom engraving', 'Velvet interior', 'Multiple compartments', 'Elegant design']
    },
    {
      id: 9,
      name: 'Adventure Experience Voucher',
      category: 'experience',
      price: '$200',
      image: '🎢',
      description: 'Choose from various adventure experiences like hot air balloon, wine tasting, or cooking classes.',
      features: ['Multiple options', 'Flexible booking', '12-month validity', 'Experience guide']
    },
    {
      id: 10,
      name: 'Luxury Tea & Treats Set',
      category: 'hampers',
      price: '$50',
      image: '🍵',
      description: 'Premium tea collection with artisan cookies, honey, and elegant serving accessories.',
      features: ['Premium teas', 'Artisan treats', 'Serving accessories', 'Recipe cards']
    }
  ]

  const filteredGifts = selectedCategory === 'all' 
    ? giftItems 
    : giftItems.filter(gift => gift.category === selectedCategory)

  const openGiftModal = (gift) => {
    setSelectedGift(gift)
  }

  const closeGiftModal = () => {
    setSelectedGift(null)
  }

  return (
    <div className={styles.giftGallery}>
      {/* Header with Navigation */}
      <div className={styles.header}>
        <div className={styles.headerButtons}>
          <button className={styles.backButton} onClick={onBack}>
            ← Back to Booking
          </button>
          <button className={styles.homeButton} onClick={onHome || onBack}>
            🏠 Dashboard
          </button>
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>🎁 Gift Gallery</h1>
          <p className={styles.pageSubtitle}>Explore our curated collection of special gifts for your event</p>
        </div>
      </div>

      <div className={styles.giftGalleryContent}>
        <div className={styles.categoryFilter}>
          {giftCategories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className={styles.giftGrid}>
          {filteredGifts.map(gift => (
            <div
              key={gift.id}
              className={styles.giftCard}
              onClick={() => openGiftModal(gift)}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.giftImage}>{gift.image}</div>
              <div className={styles.giftInfo}>
                <h3 className={styles.giftName}>{gift.name}</h3>
                <p className={styles.giftDescription}>{gift.description}</p>
                <div className={styles.giftFeatures}>
                  <h4>Features:</h4>
                  <ul className={styles.featuresList}>
                    {gift.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.giftFooter}>
                  <span className={styles.giftPrice}>{gift.price}</span>
                  <button className={styles.selectGiftButton}>View Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gift Detail Modal */}
        {selectedGift && (
          <div className={styles.giftModal} onClick={closeGiftModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedGift.name}</h2>
                <button className={styles.closeButton} onClick={closeGiftModal}>×</button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.modalGiftImage}>{selectedGift.image}</div>
                <div className={styles.modalGiftPrice}>{selectedGift.price}</div>
                <div className={styles.modalGiftDescription}>
                  <p>{selectedGift.description}</p>
                  
                  <div className={styles.giftFeatures}>
                    <h4>What's Included:</h4>
                    <ul className={styles.featuresList}>
                      {selectedGift.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button className={styles.cancelButton} onClick={closeGiftModal}>
                  Cancel
                </button>
                <button className={styles.addToCartButton} onClick={closeGiftModal}>
                  Add to Selection
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
    </div>
  )
}

export default GiftGallery
