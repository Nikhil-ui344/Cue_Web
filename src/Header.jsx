import './Header.css'

const Header = ({ onShowAdmin, currentView }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">EventSpace</h1>
          <p className="header-subtitle">Book Your Perfect Event Space</p>
        </div>
        {currentView !== 'admin' && (
          <div className="header-right">
            <button 
              className="admin-btn"
              onClick={onShowAdmin}
              title="Admin Panel"
            >
              👨‍💼 Admin
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
