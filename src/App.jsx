import { useState, useEffect } from 'react';
import './App.css'; // Make sure this perfectly matches your CSS file's name!

function App() {
  const [foodMenu, setFoodMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch data from your working Express server
  useEffect(() => {
    fetch('https://crave-delivery-backend.onrender.com/api/food')
      .then(res => res.json())
      .then(data => setFoodMenu(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

  // Live Search Filter Logic
  const filteredMenu = foodMenu.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="header">
        <div className="logo">
          <h1>🍔 CraveDelivery</h1>
          <p>Lightning fast food, straight to your door.</p>
        </div>
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Search for food..." 
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="cart-summary-btn" onClick={() => setIsCartOpen(true)}>
            🛒 {cart.length} Items | ${cartTotal}
          </button>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="hero-banner">
        <h2>Craving something delicious?</h2>
        <p>Get 20% off your first order with code: CRAVE20</p>
      </div>

      {/* Animated Menu Grid */}
      <main className="menu-grid">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((food) => (
            <div key={food._id} className="food-card">
              <div className="food-image">{food.image}</div>
              <div className="food-info">
                <h3>{food.name}</h3>
                <p className="description">{food.description}</p>
                <p className="price">${Number(food.price).toFixed(2)}</p>
              </div>
              <button className="add-btn" onClick={() => addToCart(food)}>
                + Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h2>No food found for "{searchQuery}" 😢</h2>
            <p>Try searching for something else like "Pizza" or "Burger".</p>
          </div>
        )}
      </main>

      {/* Slide-out Cart Drawer */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>✖</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty. Add some food!</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <span className="cart-item-image">{item.image}</span>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(index)}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Total:</span>
              <span>${cartTotal}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout 🚀</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;