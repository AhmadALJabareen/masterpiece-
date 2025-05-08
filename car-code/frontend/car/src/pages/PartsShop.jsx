import { useState, useEffect } from 'react';
import { ShoppingCart, Search, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PartModal from '../components/PartModal';
import Cart from '../components/Cart';

export default function PartsShop() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch approved parts
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/parts/approved');
        setParts(response.data.parts);
      } catch (error) {
        console.error('Error fetching parts:', error);
        toast.error('فشل جلب قطع الغيار');
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  // Handle adding to cart
  const addToCart = (part) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === part._id);
      if (existingItem) {
        toast.success(`تم زيادة كمية ${part.name} في السلة`);
        return prevCart.map((item) =>
          item._id === part._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`تم إضافة ${part.name} إلى السلة`);
      return [...prevCart, { ...part, quantity: 1 }];
    });
  };

  // Handle removing from cart
  const removeFromCart = (partId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item._id === partId);
      toast.success(`تم إزالة ${itemToRemove?.name || 'المنتج'} من السلة`);
      return prevCart.filter((item) => item._id !== partId);
    });
  };

  // Handle opening modal
  const openModal = (part) => {
    setSelectedPart(part);
  };

  // Handle closing modal
  const closeModal = () => {
    setSelectedPart(null);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Filter parts by search query
  const filteredParts = parts.filter(
    (part) =>
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.carModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate cart item count
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#f9f9f9' }}>
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: '#5D1D5F' }}
        ></div>
        <span className="mr-3 text-gray-700">جارٍ التحميل...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }} dir="rtl">
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-40" style={{ backgroundColor: '#081840' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: '#FCDE59' }}>
              متجر قطع الغيار
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={toggleCart}
                  className="p-2 rounded-full relative transition-colors"
                  style={{ backgroundColor: '#FCDE59' }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e6c94f')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FCDE59')}
                >
                  <ShoppingCart size={20} style={{ color: '#4A4215' }} />
                  {cartItemCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      style={{ backgroundColor: '#5D1D5F' }}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </button>
                {showCart && (
                  <Cart cart={cart} onClose={() => setShowCart(false)} removeFromCart={removeFromCart} />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن قطع الغيار..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#5D1D5F' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Parts Grid */}
        {filteredParts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">لا توجد قطع غيار مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredParts.map((part) => (
              <div
                key={part._id}
                onClick={() => openModal(part)}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={part.image ? `http://localhost:4000${part.image}` : 'https://via.placeholder.com/400/300'}
                    alt={part.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: '#FCDE59', color: '#4A4215' }}
                    >
                      متوفر
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{part.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{part.carModel}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold" style={{ color: '#5D1D5F' }}>
                      {part.price} ر.س
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(part);
                      }}
                      className="p-2 rounded-full transition-colors"
                      style={{ backgroundColor: '#FCDE59' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e6c94f')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FCDE59')}
                    >
                      <ShoppingCart size={16} style={{ color: '#4A4215' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPart && (
        <PartModal part={selectedPart} onClose={closeModal} onAddToCart={addToCart} />
      )}
    </div>
  );
}