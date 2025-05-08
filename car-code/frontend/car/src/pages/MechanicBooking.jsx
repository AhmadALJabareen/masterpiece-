import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Star, Package, X, Home, Wrench, Briefcase } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

export default function MechanicBooking() {
  const [mechanics, setMechanics] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [bookingData, setBookingData] = useState({
    slotId: '',
    serviceType: 'home',
    location: '',
    notes: '',
  });
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:4000/api/users/me');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error)
      }
    };
    checkAuth();
  }, []);

  // Fetch mechanics
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/mechanic');
        console.log('Mechanics Response:', response.data);
        setMechanics(response.data.filter((m) => m.available));

        // Fetch available slots for each mechanic
        const slotsPromises = response.data.map(async (mechanic) => {
          try {
            const slotsResponse = await axios.get(`http://localhost:4000/api/slots/mechanic/${mechanic._id}`);
            return { mechanicId: mechanic._id, slots: slotsResponse.data.slots };
          } catch (error) {
            console.error(`Fetch Slots Error for Mechanic ${mechanic._id}:`, error.message);
            return { mechanicId: mechanic._id, slots: [] };
          }
        });
        const slotsData = await Promise.all(slotsPromises);
        const slotsMap = slotsData.reduce((acc, { mechanicId, slots }) => {
          acc[mechanicId] = slots;
          return acc;
        }, {});
        setAvailableSlots(slotsMap);
      } catch (error) {
        console.error('Fetch Mechanics Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
        toast.error('فشل جلب الميكانيكيين');
        setMechanics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMechanics();
  }, []);

  // Handle booking form changes
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle booking submission
  const handleBookingSubmit = async () => {
    console.log('handleBookingSubmit called with bookingData:', bookingData);
  console.log('selectedMechanic:', selectedMechanic);
    if (!isAuthenticated) {
      toast.error('الرجاء تسجيل الدخول لحجز موعد');
      navigate('/login');
      return;
    }

    if (!bookingData.slotId || !bookingData.serviceType || !bookingData.location) {
      toast.error('الرجاء إدخال كل الحقول المطلوبة');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/bookings/book', {
        mechanicId: selectedMechanic._id,
        serviceType: bookingData.serviceType,
        location: bookingData.location,
        slotId: bookingData.slotId,
        notes: bookingData.notes,
        date: availableSlots[selectedMechanic._id]?.find(slot => slot._id === bookingData.slotId)?.date,
      time: availableSlots[selectedMechanic._id]?.find(slot => slot._id === bookingData.slotId)?.time
      });
      console.log('Booking Response:', response.data);
      toast.success('تم حجز الموعد بنجاح! في انتظار موافقة الميكانيكي');
      setShowBookingModal(false);
      setBookingData({ slotId: '', serviceType: 'home', location: '', notes: '' });
      navigate('/');
    } catch (error) {
      console.error('Booking Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error(`فشل الحجز: ${error.response?.data?.message || 'خطأ غير معروف'}`);
    }
  };

  // Open booking modal
  const openBookingModal = (mechanic) => {
    if (!isAuthenticated) {
      toast.error('الرجاء تسجيل الدخول لحجز موعد');
      navigate('/login');
      return;
    }
    setSelectedMechanic(mechanic);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">الميكانيكيون المتاحون</h1>

        {/* Mechanics List */}
        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">جارٍ تحميل الميكانيكيين...</p>
          </div>
        ) : mechanics.length === 0 ? (
          <div className="text-center text-gray-600 flex items-center justify-center">
            <Package size={24} className="ml-2" />
            <p>لا يوجد ميكانيكيون متاحون حاليًا</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map((mechanic) => (
              <div
                key={mechanic._id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
              >
                <img
                  src={
                    mechanic.user?.image
                      ? `http://localhost:4000${mechanic.user.image}`
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw6z_d9lGWm6fHIBphcR95mlF8YWN-_38oug&s'
                  }
                  alt={mechanic.user?.name}
                  className="h-24 w-24 rounded-full object-cover mb-4"
                  onError={(e) => (e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw6z_d9lGWm6fHIBphcR95mlF8YWN-_38oug&s')}
                />
                <h2 className="text-xl font-semibold text-blue-600">{mechanic.user?.name}</h2>
                <p className="text-gray-600 flex items-center">
                  <Wrench size={18} className="ml-2" />
                  الورشة: {mechanic.workshopName || 'غير محدد'}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Briefcase size={18} className="ml-2" />
                  التخصصات: {mechanic.specializations?.join(', ') || 'غير محدد'}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Star size={18} className="ml-2 text-yellow-500" />
                  التقييم: {mechanic.ratings?.length ? (mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length).toFixed(1) : 'غير متوفر'}
                </p>
                <p className="text-gray-600 flex items-center">
                  <MapPin size={18} className="ml-2" />
                  الموقع: {mechanic.user?.location || 'غير محدد'}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Package size={18} className="ml-2" />
                  السعر: {mechanic.pricing ? `${mechanic.pricing[bookingData.serviceType || 'home']} دينار/ساعة` : 'غير محدد'}
                </p>
                <button
                  onClick={() => openBookingModal(mechanic)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={!(availableSlots[mechanic._id]?.length > 0)}
                >
                  {availableSlots[mechanic._id]?.length > 0 ? 'حجز موعد' : 'لا توجد مواعيد متاحة'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedMechanic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">حجز موعد مع {selectedMechanic.user?.name}</h2>
                <button onClick={() => setShowBookingModal(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-gray-700 font-semibold">
                    <Calendar size={18} className="ml-2" />
                    الموعد المتاح
                  </label>
                  <select
                    name="slotId"
                    value={bookingData.slotId}
                    onChange={handleBookingChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر موعدًا</option>
                    {(availableSlots[selectedMechanic._id] || []).map((slot) => (
                      <option key={slot._id} value={slot._id}>
                        {new Date(slot.date).toLocaleDateString('ar-EG')} - {slot.time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-gray-700 font-semibold">
                    <Home size={18} className="ml-2" />
                    نوع الخدمة
                  </label>
                  <select
                    name="serviceType"
                    value={bookingData.serviceType}
                    onChange={handleBookingChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="home">خدمة منزلية</option>
                    <option value="workshop">ورشة</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-gray-700 font-semibold">
                    <MapPin size={18} className="ml-2" />
                    الموقع
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={bookingData.location}
                    onChange={handleBookingChange}
                    placeholder="أدخل عنوان الخدمة"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-700 font-semibold">
                    <Package size={18} className="ml-2" />
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    placeholder="أضف أي ملاحظات إضافية"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleBookingSubmit}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  تأكيد الحجز
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}