import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Home, Wrench, DollarSign, Star, Users, CheckCircle, XCircle, Settings, LogOut, Bell, Menu, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000; // 5 seconds timeout

export default function MechanicDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [mechanic, setMechanic] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for auth
  const navigate = useNavigate();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    console.log('Checking authentication...');
    try {
      await axios.get('http://localhost:4000/api/mechanic/me');
      console.log('Mechanic is authenticated');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      setIsAuthenticated(false);
      navigate('/login'); // Redirect to login if not authenticated
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch data
  const fetchData = useCallback(async () => {
    console.log('Starting fetchData...');
    setLoading(true);
    try {
      // Fetch mechanic profile
      const mechanicResponse = await axios.get('http://localhost:4000/api/mechanic/me');
      setMechanic(mechanicResponse.data.mechanic);

      // Fetch bookings
      const bookingsResponse = await axios.get('http://localhost:4000/api/bookings/my');
      setBookings(bookingsResponse.data.bookings);
      setNotifications(bookingsResponse.data.bookings.filter(b => b.status === 'pending').length);

      // Fetch available slots
      const slotsResponse = await axios.get('http://localhost:4000/api/slots/mechanic/me');
      setSlots(slotsResponse.data.slots);

      // Fetch earnings
      const earningsResponse = await axios.get('http://localhost:4000/api/mechanic/earnings');
      setEarnings(earningsResponse.data.earnings);
    } catch (error) {
      console.error('Error fetching data:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      toast.error('فشل جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    console.log('Initial auth check on mount');
    checkAuth();
  }, [checkAuth]);

  // Fetch data only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle booking status
  const handleBookingStatus = async (bookingId, newStatus) => {
    try {
      const endpoint = newStatus === 'accepted' ? `/api/bookings/accept/${bookingId}` : `/api/bookings/reject/${bookingId}`;
      const response = await axios.post(`http://localhost:4000${endpoint}`, {}, { withCredentials: true });
      setBookings(bookings.map(b => (b._id === bookingId ? response.data.booking : b)));
      setNotifications(notifications - (newStatus === 'accepted' || newStatus === 'rejected' ? 1 : 0));
      toast.success(`تم ${newStatus === 'accepted' ? 'قبول' : 'رفض'} الحجز بنجاح`);
    } catch (error) {
      console.error(`Error updating booking status to ${newStatus}:`, error);
      toast.error('فشل تحديث حالة الحجز');
    }
  };

  // Add new slot
  const addSlot = async (date, time) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/slots/add',
        { date, time },
        { withCredentials: true }
      );
      setSlots([...slots, response.data.slot]);
      toast.success('تم إضافة الموعد بنجاح');
    } catch (error) {
      console.error('Error adding slot:', error);
      toast.error('فشل إضافة الموعد');
    }
  };

  // Remove slot
  const removeSlot = async (slotId) => {
    try {
      await axios.delete(`http://localhost:4000/api/slots/remove/${slotId}`, { withCredentials: true });
      setSlots(slots.filter(s => s._id !== slotId));
      toast.success('تم حذف الموعد بنجاح');
    } catch (error) {
      console.error('Error removing slot:', error);
      toast.error('فشل حذف الموعد');
    }
  };

  // Update profile
  const updateProfile = async (updatedData) => {
    try {
      const response = await axios.put('http://localhost:4000/api/mechanic/me', updatedData, {
        withCredentials: true,
      });
      setMechanic(response.data.mechanic);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('فشل تحديث الملف الشخصي');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('فشل تسجيل الخروج');
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If loading or not authenticated
  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-100">
        <div className="text-xl font-bold text-blue-900">جارٍ التحميل...</div>
      </div>
    );
  }

  // باقي الكود (الـ UI) يظل زي ما هو
  return (
    <div className="flex min-h-screen bg-gray-100 text-right" dir="rtl">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-blue-900 text-white p-4 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } md:translate-x-0 md:static md:flex md:w-64 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-right mb-8">
            <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
              <Wrench size={20} />
            </div>
            <h1 className="text-xl font-bold mr-2">بوابة الميكانيكي</h1>
          </div>
          <nav className="space-y-2">
            {[
              { tab: 'overview', label: 'الرئيسية', icon: Home },
              { tab: 'bookings', label: 'الحجوزات', icon: Calendar },
              { tab: 'slots', label: 'المواعيد المتاحة', icon: Clock },
              { tab: 'profile', label: 'الملف الشخصي', icon: Users },
              { tab: 'earnings', label: 'الإيرادات', icon: DollarSign },
              { tab: 'settings', label: 'الإعدادات', icon: Settings },
            ].map(({ tab, label, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg text-right ${
                  activeTab === tab ? 'bg-blue-800' : 'hover:bg-blue-800'
                }`}
              >
                <Icon size={18} className="ml-2" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-right hover:bg-blue-800"
            >
              <LogOut size={18} className="ml-2" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-600">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-xl font-semibold">{mechanic?.user?.name || 'مرحباً، الميكانيكي'}</h2>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">متاح</span>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center mr-4">
              <span className="font-bold text-blue-800">{mechanic?.user?.name?.[0] || 'م'}</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar size={24} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-500">حجوزات اليوم</p>
                      <h3 className="text-2xl font-bold">
                        {bookings.filter(b => new Date(b.date).toDateString() === new Date().toDateString()).length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign size={24} className="text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-500">إيرادات هذا الشهر</p>
                      <h3 className="text-2xl font-bold">{mechanic?.revenue || 0} ريال</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star size={24} className="text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-500">متوسط التقييم</p>
                      <h3 className="text-2xl font-bold">
                        {mechanic?.ratings?.length
                          ? (mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length).toFixed(1)
                          : 'غير متاح'}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              {/* Upcoming Bookings */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="border-b p-4">
                  <h3 className="text-lg font-bold">الحجوزات القادمة</h3>
                </div>
                <div className="p-4">
                  <div className="md:hidden space-y-4">
                    {bookings.slice(0, 3).map(booking => (
                      <div key={booking._id} className="bg-white rounded-lg shadow p-4">
                        <p><strong>العميل:</strong> {booking.user.name}</p>
                        <p><strong>الخدمة:</strong> {booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</p>
                        <p><strong>الموقع:</strong> {booking.location}</p>
                        <p><strong>التاريخ:</strong> {new Date(booking.date).toLocaleDateString('ar-EG')}</p>
                        <p><strong>الوقت:</strong> {booking.time}</p>
                        <p>
                          <strong>الحالة:</strong>{' '}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {booking.status === 'accepted' ? 'مؤكد' :
                             booking.status === 'pending' ? 'قيد الانتظار' :
                             booking.status === 'rejected' ? 'مرفوض' : 'مكتمل'}
                          </span>
                        </p>
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleBookingStatus(booking._id, 'accepted')}
                              className="p-1 bg-green-100 text-green-600 rounded"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleBookingStatus(booking._id, 'rejected')}
                              className="p-1 bg-red-100 text-red-600 rounded"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <table className="w-full hidden md:table">
                    <thead>
                      <tr className="text-right">
                        <th className="pb-2">العميل</th>
                        <th className="pb-2">الخدمة</th>
                        <th className="pb-2">الموقع</th>
                        <th className="pb-2">التاريخ</th>
                        <th className="pb-2">الوقت</th>
                        <th className="pb-2">الحالة</th>
                        <th className="pb-2">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 3).map(booking => (
                        <tr key={booking._id} className="border-t">
                          <td className="py-3">{booking.user.name}</td>
                          <td className="py-3">{booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</td>
                          <td className="py-3">{booking.location}</td>
                          <td className="py-3">{new Date(booking.date).toLocaleDateString('ar-EG')}</td>
                          <td className="py-3">{booking.time}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {booking.status === 'accepted' ? 'مؤكد' :
                               booking.status === 'pending' ? 'قيد الانتظار' :
                               booking.status === 'rejected' ? 'مرفوض' : 'مكتمل'}
                            </span>
                          </td>
                          <td className="py-3">
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleBookingStatus(booking._id, 'accepted')}
                                  className="p-1 bg-green-100 text-green-600 rounded"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                  className="p-1 bg-red-100 text-red-600 rounded mr-2"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Recent Reviews */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b p-4">
                  <h3 className="text-lg font-bold">آخر التقييمات</h3>
                </div>
                <div className="p-4">
                  {mechanic?.ratings?.slice(0, 3).map(review => (
                    <div key={review._id} className="border-b py-3 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">{review.user.name}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-1">{review.comment || 'لا يوجد تعليق'}</p>
                      <p className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                  ))}
                  {(!mechanic?.ratings || mechanic.ratings.length === 0) && (
                    <p className="text-gray-500">لا توجد تقييمات بعد</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">إدارة الحجوزات</h2>
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-bold">قائمة الحجوزات</h3>
                  <div>
                    <select
                      onChange={(e) => {
                        const status = e.target.value;
                        if (status === 'all') {
                          fetchData(); // Refresh bookings
                        } else {
                          setBookings(bookings.filter(b => b.status === status));
                        }
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                    >
                      <option value="all">جميع الحجوزات</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="accepted">مؤكدة</option>
                      <option value="completed">مكتملة</option>
                      <option value="rejected">مرفوضة</option>
                    </select>
                  </div>
                </div>
                <div className="p-4">
                  <div className="md:hidden space-y-4">
                    {bookings.map(booking => (
                      <div key={booking._id} className="bg-white rounded-lg shadow p-4">
                        <p><strong>العميل:</strong> {booking.user.name}</p>
                        <p><strong>الخدمة:</strong> {booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</p>
                        <p><strong>الموقع:</strong> {booking.location}</p>
                        <p><strong>التاريخ:</strong> {new Date(booking.date).toLocaleDateString('ar-EG')}</p>
                        <p><strong>الوقت:</strong> {booking.time}</p>
                        <p>
                          <strong>الحالة:</strong>{' '}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {booking.status === 'accepted' ? 'مؤكد' :
                             booking.status === 'pending' ? 'قيد الانتظار' :
                             booking.status === 'rejected' ? 'مرفوض' : 'مكتمل'}
                          </span>
                        </p>
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleBookingStatus(booking._id, 'accepted')}
                              className="p-1 bg-green-100 text-green-600 rounded"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleBookingStatus(booking._id, 'rejected')}
                              className="p-1 bg-red-100 text-red-600 rounded"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <table className="w-full hidden md:table">
                    <thead>
                      <tr className="text-right">
                        <th className="pb-2">العميل</th>
                        <th className="pb-2">الخدمة</th>
                        <th className="pb-2">الموقع</th>
                        <th className="pb-2">التاريخ</th>
                        <th className="pb-2">الوقت</th>
                        <th className="pb-2">الحالة</th>
                        <th className="pb-2">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking._id} className="border-t">
                          <td className="py-3">{booking.user.name}</td>
                          <td className="py-3">{booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</td>
                          <td className="py-3">{booking.location}</td>
                          <td className="py-3">{new Date(booking.date).toLocaleDateString('ar-EG')}</td>
                          <td className="py-3">{booking.time}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {booking.status === 'accepted' ? 'مؤكد' :
                               booking.status === 'pending' ? 'قيد الانتظار' :
                               booking.status === 'rejected' ? 'مرفوض' : 'مكتمل'}
                            </span>
                          </td>
                          <td className="py-3">
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleBookingStatus(booking._id, 'accepted')}
                                  className="p-1 bg-green-100 text-green-600 rounded"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                  className="p-1 bg-red-100 text-red-600 rounded mr-2"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slots' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">إدارة المواعيد المتاحة</h2>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">إضافة موعد جديد</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const date = e.target.date.value;
                    const time = e.target.time.value;
                    addSlot(date, time);
                    e.target.reset();
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 mb-1">التاريخ</label>
                      <input
                        type="date"
                        name="date"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">الوقت</label>
                      <input
                        type="time"
                        name="time"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    إضافة الموعد
                  </button>
                </form>
              </div>
              <div className="bg-white rounded-lg shadow">
                <div className="border-b p-4">
                  <h3 className="text-lg font-bold">المواعيد المتاحة</h3>
                </div>
                <div className="p-4">
                  <div className="md:hidden space-y-4">
                    {slots.map(slot => (
                      <div key={slot._id} className="bg-white rounded-lg shadow p-4">
                        <p><strong>التاريخ:</strong> {new Date(slot.date).toLocaleDateString('ar-EG')}</p>
                        <p><strong>الوقت:</strong> {slot.time}</p>
                        <button
                          onClick={() => removeSlot(slot._id)}
                          className="p-1 bg-red-100 text-red-600 rounded mt-2"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <table className="w-full hidden md:table">
                    <thead>
                      <tr className="text-right">
                        <th className="pb-2">التاريخ</th>
                        <th className="pb-2">الوقت</th>
                        <th className="pb-2">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map(slot => (
                        <tr key={slot._id} className="border-t">
                          <td className="py-3">{new Date(slot.date).toLocaleDateString('ar-EG')}</td>
                          <td className="py-3">{slot.time}</td>
                          <td className="py-3">
                            <button
                              onClick={() => removeSlot(slot._id)}
                              className="p-1 bg-red-100 text-red-600 rounded"
                            >
                              <XCircle size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">الملف الشخصي</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <div className="h-24 w-24 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-blue-800">{mechanic?.user?.name?.[0] || 'م'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{mechanic?.user?.name}</h3>
                    <p className="text-gray-500 mb-4">فني ميكانيكا سيارات</p>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(
                              mechanic?.ratings?.length
                                ? mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length
                                : 0
                            )
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="mr-1 text-sm text-gray-600">
                        {mechanic?.ratings?.length
                          ? (mechanic.ratings.reduce((sum, r) => sum + r.rating, 0) / mechanic.ratings.length).toFixed(1)
                          : 'غير متاح'} ({mechanic?.ratings?.length || 0} تقييم)
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 mt-4">
                    <h3 className="text-lg font-bold mb-4">ساعات العمل</h3>
                    <div className="space-y-2">
                      {mechanic?.workSchedule?.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{schedule.day}</span>
                          <span>{schedule.from} - {schedule.to}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg w-full mt-4"
                      onClick={() => {
                        toast.info('ميزة تحرير ساعات العمل قيد التطوير');
                      }}
                    >
                      تعديل ساعات العمل
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold mb-4">المعلومات الشخصية</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const updatedData = {
                          user: {
                            name: e.target.name.value,
                            email: e.target.email.value,
                            phone: e.target.phone.value,
                            location: e.target.location.value,
                          },
                          workshopName: e.target.workshopName.value,
                        };
                        updateProfile(updatedData);
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-500 mb-1">الاسم الكامل</label>
                          <input
                            type="text"
                            name="name"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                            defaultValue={mechanic?.user?.name}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">البريد الإلكتروني</label>
                          <input
                            type="email"
                            name="email"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                            defaultValue={mechanic?.user?.email}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">رقم الهاتف</label>
                          <input
                            type="tel"
                            name="phone"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                            defaultValue={mechanic?.user?.phone}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">اسم الورشة</label>
                          <input
                            type="text"
                            name="workshopName"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                            defaultValue={mechanic?.workshopName}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-gray-500 mb-1">العنوان</label>
                          <input
                            type="text"
                            name="location"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                            defaultValue={mechanic?.user?.location}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700"
                      >
                        حفظ التغييرات
                      </button>
                    </form>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 mt-4">
                    <h3 className="text-lg font-bold mb-4">التقييمات ({mechanic?.ratings?.length || 0})</h3>
                    <div className="space-y-4">
                      {mechanic?.ratings?.map(review => (
                        <div key={review._id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold">{review.user.name}</div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-1">{review.comment || 'لا يوجد تعليق'}</p>
                          <p className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString('ar-SA')}</p>
                        </div>
                      ))}
                      {(!mechanic?.ratings || mechanic.ratings.length === 0) && (
                        <p className="text-gray-500">لا توجد تقييمات بعد</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">الإيرادات وأداء الخدمات</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-bold mb-4">ملخص الإيرادات</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-500">إيرادات هذا الشهر</p>
                      <h4 className="text-2xl font-bold">{mechanic?.revenue || 0} ريال</h4>
                    </div>
                    <div>
                      <p className="text-gray-500">إيرادات هذا العام</p>
                      <h4 className="text-2xl font-bold">{(mechanic?.revenue || 0) * 12} ريال</h4>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <div className="h-full w-full bg-gray-50 rounded flex">
                      {['يناير', 'فبراير', 'مارس', 'أبريل'].map((month, index) => (
                        <div key={index} className="flex-1 flex flex-col justify-end p-2 text-center">
                          <div
                            className="bg-blue-500 rounded-t"
                            style={{ height: `${((mechanic?.revenue || 0) / 16000) * 100}%` }}
                          ></div>
                          <p className="text-xs mt-1">{month}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-bold mb-4">أداء الخدمات</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p>خدمة منزلية</p>
                        <p className="text-sm">
                          {bookings.length
                            ? (
                                (bookings.filter(b => b.serviceType === 'home').length / bookings.length) * 100
                              ).toFixed(0)
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              bookings.length
                                ? (bookings.filter(b => b.serviceType === 'home').length / bookings.length) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p>خدمة ورشة</p>
                        <p className="text-sm">
                          {bookings.length
                            ? (
                                (bookings.filter(b => b.serviceType === 'workshop').length / bookings.length) * 100
                              ).toFixed(0)
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              bookings.length
                                ? (bookings.filter(b => b.serviceType === 'workshop').length / bookings.length) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow">
                <div className="border-b p-4">
                  <h3 className="text-lg font-bold">سجل الإيرادات</h3>
                </div>
                <div className="p-4">
                  <div className="md:hidden space-y-4">
                    {earnings.map((transaction, index) => (
                      <div key={index} className="bg-white rounded-lg shadow p-4">
                        <p><strong>التاريخ:</strong> {new Date(transaction.date).toLocaleDateString('ar-EG')}</p>
                        <p><strong>العميل:</strong> {transaction.customer}</p>
                        <p><strong>الخدمة:</strong> {transaction.service}</p>
                        <p><strong>المبلغ:</strong> {transaction.amount} ريال</p>
                        <p><strong>طريقة الدفع:</strong> {transaction.paymentMethod}</p>
                      </div>
                    ))}
                  </div>
                  <table className="w-full hidden md:table">
                    <thead>
                      <tr className="text-right">
                        <th className="pb-2">التاريخ</th>
                        <th className="pb-2">العميل</th>
                        <th className="pb-2">الخدمة</th>
                        <th className="pb-2">المبلغ</th>
                        <th className="pb-2">طريقة الدفع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.map((transaction, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-3">{new Date(transaction.date).toLocaleDateString('ar-EG')}</td>
                          <td className="py-3">{transaction.customer}</td>
                          <td className="py-3">{transaction.service}</td>
                          <td className="py-3">{transaction.amount} ريال</td>
                          <td className="py-3">{transaction.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">الإعدادات</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4">إعدادات الإشعارات</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" defaultChecked />
                        <span>إشعارات الحجوزات الجديدة</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" defaultChecked />
                        <span>إشعارات تغييرات حالة الحجوزات</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        <span>إشعارات التقييمات الجديدة</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">إعدادات التوفر</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" defaultChecked />
                        <span>إظهار حالة "متاح" للعملاء</span>
                      </label>
                      <div>
                        <label className="block text-gray-500 mb-1">الحد الأقصى للحجوزات اليومية</label>
                        <input
                          type="number"
                          className="w-24 bg-gray-50 border border-gray-300 rounded-lg p-2"
                          defaultValue="5"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">إعدادات الحساب</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-500 mb-1">لغة التطبيق</label>
                        <select className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2">
                          <option>العربية</option>
                          <option>English</option>
                        </select>
                      </div>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        <span>تفعيل المصادقة الثنائية</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">تغيير كلمة المرور</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        toast.info('ميزة تغيير كلمة المرور قيد التطوير');
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-500 mb-1">كلمة المرور الحالية</label>
                          <input
                            type="password"
                            placeholder="أدخل كلمة المرور الحالية"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            placeholder="أدخل كلمة المرور الجديدة"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1">تأكيد كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            placeholder="تأكيد كلمة المرور الجديدة"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg mt-4 hover:bg-blue-700"
                      >
                        حفظ التغييرات
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}