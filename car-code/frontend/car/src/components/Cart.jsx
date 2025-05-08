import { X } from 'lucide-react';

export default function Cart({ cart, onClose, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className="fixed top-16 right-4 bg-white rounded-lg shadow-xl w-72 p-4 z-50 border border-gray-200"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">السلة</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 py-4">السلة فارغة</p>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <img
                    src={item.image ? `http://localhost:4000${item.image}` : '/api/placeholder/60/60'}
                    alt={item.name}
                    className="w-10 h-10 rounded object-cover mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {item.price} ر.س
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-gray-200">
            <div className="flex justify-between font-bold">
              <span>المجموع:</span>
              <span>{total} ر.س</span>
            </div>
            <button
              className="w-full mt-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#5D1D5F', color: 'white' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4a1749')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5D1D5F')}
            >
              إتمام الشراء
            </button>
          </div>
        </>
      )}
    </div>
  );
}