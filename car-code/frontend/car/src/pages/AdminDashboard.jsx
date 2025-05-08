import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Wrench, FileText, Car, Home, Settings, Bell, Search, LogOut, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [parts, setParts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ bookings: [], revenue: [], userTypes: [] });
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check admin authentication
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/me');
      setAdmin(response.data.admin);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Admin Auth Error:', error.response?.data?.message || error.message);
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersResponse = await axios.get('http://localhost:4000/api/admin/users');
      setUsers(usersResponse.data.users);

      // Fetch mechanics
      const mechanicsResponse = await axios.get('http://localhost:4000/api/admin/mechanics');
      setMechanics(mechanicsResponse.data.mechanics);

      // Fetch parts
      const partsResponse = await axios.get('http://localhost:4000/api/admin/parts');
      setParts(partsResponse.data.parts);

      // Fetch articles
      const articlesResponse = await axios.get('http://localhost:4000/api/admin/articles');
      setArticles(articlesResponse.data.articles);

      // Fetch bookings
      const bookingsResponse = await axios.get('http://localhost:4000/api/admin/bookings');
      setBookings(bookingsResponse.data.bookings);

      // Fetch stats
      const statsResponse = await axios.get('http://localhost:4000/api/admin/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error.response?.data?.message || error.message);
      toast.error('فشل جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth and fetch data on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle part state update
  const handlePartState = async (partId, state) => {
    try {
      await axios.put(`http://localhost:4000/api/admin/parts/${partId}`, { state });
      setParts(parts.map(p => p._id === partId ? { ...p, state } : p));
      toast.success(`تم ${state === 'approved' ? 'الموافقة على' : 'رفض'} القطعة`);
    } catch (error) {
      console.error('Error updating part state:', error);
      toast.error('فشل تحديث حالة القطعة');
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profilePic', file);
    
    try {
      const response = await axios.post('http://localhost:4000/api/admin/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data)
      setAdmin(response.data.admin);
      toast.success('تم رفع الصورة الشخصية');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('فشل رفع الصورة');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = e.target.elements;
    
    if (newPassword.value !== confirmPassword.value) {
      toast.error('كلمة المرور الجديدة لا تتطابق');
      return;
    }
    
    try {
      await axios.post('http://localhost:4000/api/admin/change-password', {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      toast.success('تم تغيير كلمة المرور بنجاح');
      e.target.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'فشل تغيير كلمة المرور');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout');
      navigate('/');
      toast.success('تم تسجيل الخروج');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('فشل تسجيل الخروج');
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex min-h-screen justify-center items-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 text-right" dir="rtl">
      {/* القائمة الجانبية */}
      <div className="bg-gray-900 text-white w-64 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold">لوحة تحكم الإدارة</h2>
          <p className="text-gray-400 text-sm">أكواد أعطال السيارات</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul>
            <li className={`mb-2 rounded hover:bg-gray-800 ${activeTab === 'dashboard' ? 'bg-gray-800' : ''}`}>
              <button onClick={() => setActiveTab('dashboard')} className="flex items-center p-3 w-full">
                <Home size={18} className="ml-2" />
                <span>الرئيسية</span>
              </button>
            </li>
            <li className={`mb-2 rounded hover:bg-gray-800 ${activeTab === 'users' ? 'bg-gray-800' : ''}`}>
              <button onClick={() => setActiveTab('users')} className="flex items-center p-3 w-full">
                <Users size={18} className="ml-2" />
                <span>المستخدمين</span>
              </button>
            </li>
            <li className={`mb-2 rounded hover:bg-gray-800 ${activeTab === 'mechanics' ? 'bg-gray-800' : ''}`}>
              <button onClick={() => setActiveTab('mechanics')} className="flex items-center p-3 w-full">
                <Wrench size={18} className="ml-2" />
                <span>الميكانيكيين والورش</span>
              </button>
            </li>
            <li className={`mb-2 rounded hover:bg-gray-800 ${activeTab === 'articles' ? 'bg-gray-800' : ''}`}>
              <button onClick={() => setActiveTab('articles')} className="flex items-center p-3 w-full">
                <FileText size={18} className="ml-2" />
                <span>المقالات</span>
              </button>
            </li>
            <li className={`mb-2 rounded hover:bg-gray-800 ${activeTab === 'parts' ? 'bg-gray-800' : ''}`}>
              <button onClick={() => setActiveTab('parts')} className="flex items-center p-3 w-full">
                <Car size={18} className="ml-2" />
                <span>قطع الغيار</span>
              </button>
            </li>
            <li className={`mb-2 rounded hover:bg-gray-800 ${activeTab === 'bookings' ? 'bg-gray-800' : ''}`}>
              <button onClick={() => setActiveTab('bookings')} className="flex items-center p-3 w-full">
                <Calendar size={18} className="ml-2" />
                <span>الحجوزات</span>
              </button>
            </li>
            <li className={`mb-2 rounded hover:bg-gray-800 ${activeTab === 'settings' ? 'bg-gray-800' : ''}`}>
              <button onClick={() => setActiveTab('settings')} className="flex items-center p-3 w-full">
                <Settings size={18} className="ml-2" />
                <span>الإعدادات</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-500 w-full">
            <LogOut size={18} className="ml-2" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
      
      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* الشريط العلوي */}
        <header className="bg-white border-b flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
              </button>
              
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border">
                  <div className="p-2 border-b">
                    <h3 className="font-bold">الإشعارات</h3>
                  </div>
                  <ul>
                    <li className="p-2 hover:bg-gray-100 border-b">
                      <p className="text-sm">تم إضافة قطعة غيار جديدة</p>
                      <span className="text-xs text-gray-500">منذ 10 دقائق</span>
                    </li>
                    <li className="p-2 hover:bg-gray-100 border-b">
                      <p className="text-sm">تم إضافة ميكانيكي جديد</p>
                      <span className="text-xs text-gray-500">منذ ساعة</span>
                    </li>
                    <li className="p-2 hover:bg-gray-100">
                      <p className="text-sm">تقرير الإيرادات الأسبوعي جاهز</p>
                      <span className="text-xs text-gray-500">منذ 3 ساعات</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex items-center mr-4 border rounded-lg overflow-hidden">
              <input type="text" placeholder="بحث..." className="px-3 py-2 outline-none" />
              <button className="bg-blue-500 text-white p-2">
                <Search size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-left">
              <p className="font-bold">{admin?.name || 'أحمد المشرف'}</p>
              <p className="text-sm text-gray-600">مشرف نظام</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
              {admin?.image ? (
                <img src={`http://localhost:4000${admin.image}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{admin?.name?.[0] || 'أ'}</span>
              )}
            </div>
          </div>
        </header>
        
        {/* محتوى الصفحة */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">لوحة المعلومات</h1>
              
              {/* البطاقات الإحصائية */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">إجمالي المستخدمين</p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users size={24} className="text-blue-500" />
                    </div>
                  </div>
                  <p className="text-green-500 text-sm mt-2">+12% منذ الشهر الماضي</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">الميكانيكيين النشطين</p>
                      <p className="text-2xl font-bold">{mechanics.filter(m => m.available).length}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Wrench size={24} className="text-green-500" />
                    </div>
                  </div>
                  <p className="text-green-500 text-sm mt-2">+5% منذ الأسبوع الماضي</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">إجمالي قطع الغيار</p>
                      <p className="text-2xl font-bold">{parts.length}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Car size={24} className="text-purple-500" />
                    </div>
                  </div>
                  <p className="text-green-500 text-sm mt-2">+15% منذ الشهر الماضي</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">عدد المقالات</p>
                      <p className="text-2xl font-bold">{articles.length}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FileText size={24} className="text-yellow-500" />
                    </div>
                  </div>
                  <p className="text-green-500 text-sm mt-2">+8% منذ الأسبوع الماضي</p>
                </div>
              </div>
              
              {/* الرسوم البيانية */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-bold mb-4">الحجوزات الشهرية</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.bookings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="عدد" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-bold mb-4">الإيرادات الشهرية</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="إيراد" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* توزيع المستخدمين */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-bold mb-4">توزيع المستخدمين</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats.userTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="قيمة"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.userTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* آخر المستخدمين */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-bold mb-4">آخر المستخدمين المسجلين</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-right">الاسم</th>
                          <th className="py-2 text-right">النوع</th>
                          <th className="py-2 text-right">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 4).map(user => (
                          <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{user.name}</td>
                            <td className="py-2">{user.role === 'admin' ? 'مشرف' : user.role === 'mechanic' ? 'ميكانيكي' : 'عميل'}</td>
                            <td className="py-2">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* آخر قطع الغيار المضافة */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-bold mb-4">آخر قطع الغيار المضافة</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-right">اسم القطعة</th>
                          <th className="py-2 text-right">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.slice(0, 4).map(part => (
                          <tr key={part._id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{part.name}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${part.state === 'approved' ? 'bg-green-100 text-green-800' : part.state === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {part.state === 'approved' ? 'مقبول' : part.state === 'pending' ? 'معلق' : 'مرفوض'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">إضافة مستخدم جديد</button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b">
                  <div className="flex items-center">
                    <select className="border rounded p-2 ml-2">
                      <option>كل الأنواع</option>
                      <option>عملاء</option>
                      <option>ميكانيكيين</option>
                      <option>مشرفين</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center border rounded overflow-hidden">
                    <input type="text" placeholder="بحث عن مستخدم..." className="px-3 py-2 outline-none" />
                    <button className="bg-gray-100 px-3 py-2">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
                
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-right">الاسم</th>
                      <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
                      <th className="py-3 px-4 text-right">النوع</th>
                      <th className="py-3 px-4 text-right">تاريخ التسجيل</th>
                      <th className="py-3 px-4 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.role === 'admin' ? 'مشرف' : user.role === 'mechanic' ? 'ميكانيكي' : 'عميل'}</td>
                        <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">تعديل</button>
                            <button className="text-red-500 hover:text-red-700 mr-2">حظر</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="p-4 flex items-center justify-between border-t">
                  <div>
                    <p className="text-sm text-gray-500">عرض 1-10 من {users.length} مستخدم</p>
                  </div>
                  <div className="flex">
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">السابق</button>
                    <button className="border rounded bg-blue-500 text-white mr-1 px-3 py-1">1</button>
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">2</button>
                    <button className="border rounded px-3 py-1 hover:bg-gray-100">التالي</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'articles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة المقالات</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">إضافة مقال جديد</button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b">
                  <div className="flex items-center">
                    <select className="border rounded p-2 ml-2">
                      <option>كل التصنيفات</option>
                      <option>صيانة</option>
                      <option>أعطال شائعة</option>
                      <option>نصائح</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center border rounded overflow-hidden">
                    <input type="text" placeholder="بحث عن مقال..." className="px-3 py-2 outline-none" />
                    <button className="bg-gray-100 px-3 py-2">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {articles.map(article => (
                    <div key={article._id} className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{article.title}</h3>
                        <p className="text-gray-600 text-sm mt-2">{article.content.substring(0, 100)}...</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-gray-500">{article.author?.name || 'غير معروف'}</span>
                          <span className="text-xs text-gray-500">{new Date(article.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div className="flex mt-4 space-x-2">
                          <button className="text-blue-500 hover:text-blue-700 text-sm">تعديل</button>
                          <button className="text-red-500 hover:text-red-700 text-sm">حذف</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 flex items-center justify-between border-t">
                  <div>
                    <p className="text-sm text-gray-500">عرض 1-9 من {articles.length} مقال</p>
                  </div>
                  <div className="flex">
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">السابق</button>
                    <button className="border rounded bg-blue-500 text-white mr-1 px-3 py-1">1</button>
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">2</button>
                    <button className="border rounded px-3 py-1 hover:bg-gray-100">التالي</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'mechanics' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الميكانيكيين والورش</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">إضافة ميكانيكي جديد</button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b">
                  <div className="flex items-center">
                    <select className="border rounded p-2 ml-2">
                      <option>كل الحالات</option>
                      <option>نشط</option>
                      <option>غير نشط</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center border rounded overflow-hidden">
                    <input type="text" placeholder="بحث عن ميكانيكي..." className="px-3 py-2 outline-none" />
                    <button className="bg-gray-100 px-3 py-2">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
                
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-right">الاسم</th>
                      <th className="py-3 px-4 text-right">التخصص</th>
                      <th className="py-3 px-4 text-right">الموقع</th>
                      <th className="py-3 px-4 text-right">تاريخ التسجيل</th>
                      <th className="py-3 px-4 text-right">الحالة</th>
                      <th className="py-3 px-4 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mechanics.map(mechanic => (
                      <tr key={mechanic._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{mechanic.user?.name}</td>
                        <td className="py-3 px-4">{mechanic.specializations.join(', ')}</td>
                        <td className="py-3 px-4">{mechanic.user?.location || 'غير محدد'}</td>
                        <td className="py-3 px-4">{new Date(mechanic.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${mechanic.available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {mechanic.available ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">تعديل</button>
                            <button className="text-red-500 hover:text-red-700 mr-2">حظر</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="p-4 flex items-center justify-between border-t">
                  <div>
                    <p className="text-sm text-gray-500">عرض 1-10 من {mechanics.length} ميكانيكي</p>
                  </div>
                  <div className="flex">
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">السابق</button>
                    <button className="border rounded bg-blue-500 text-white mr-1 px-3 py-1">1</button>
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">2</button>
                    <button className="border rounded px-3 py-1 hover:bg-gray-100">التالي</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'parts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة قطع الغيار</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">إضافة قطعة جديدة</button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b">
                  <div className="flex items-center">
                    <select className="border rounded p-2 ml-2">
                      <option>كل الحالات</option>
                      <option>معلق</option>
                      <option>مقبول</option>
                      <option>مرفوض</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center border rounded overflow-hidden">
                    <input type="text" placeholder="بحث عن قطعة..." className="px-3 py-2 outline-none" />
                    <button className="bg-gray-100 px-3 py-2">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
                
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-right">اسم القطعة</th>
                      <th className="py-3 px-4 text-right">السعر</th>
                      <th className="py-3 px-4 text-right">الحالة</th>
                      <th className="py-3 px-4 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map(part => (
                      <tr key={part._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{part.name}</td>
                        <td className="py-3 px-4">{part.price} ر.س</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${part.state === 'approved' ? 'bg-green-100 text-green-800' : part.state === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {part.state === 'approved' ? 'مقبول' : part.state === 'pending' ? 'معلق' : 'مرفوض'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            {part.state === 'pending' && (
                              <>
                                <button
                                  onClick={() => handlePartState(part._id, 'approved')}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  موافقة
                                </button>
                                <button
                                  onClick={() => handlePartState(part._id, 'rejected')}
                                  className="text-red-500 hover:text-red-700 mr-2"
                                >
                                  رفض
                                </button>
                              </>
                            )}
                            <button className="text-blue-500 hover:text-blue-700">تعديل</button>
                            <button className="text-red-500 hover:text-red-700 mr-2">حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="p-4 flex items-center justify-between border-t">
                  <div>
                    <p className="text-sm text-gray-500">عرض 1-10 من {parts.length} قطعة</p>
                  </div>
                  <div className="flex">
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">السابق</button>
                    <button className="border rounded bg-blue-500 text-white mr-1 px-3 py-1">1</button>
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">2</button>
                    <button className="border rounded px-3 py-1 hover:bg-gray-100">التالي</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الحجوزات</h1>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b">
                  <div className="flex items-center">
                    <select className="border rounded p-2 ml-2">
                      <option>كل الحالات</option>
                      <option>معلق</option>
                      <option>مقبول</option>
                      <option>مرفوض</option>
                      <option>مكتمل</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center border rounded overflow-hidden">
                    <input type="text" placeholder="بحث عن حجز..." className="px-3 py-2 outline-none" />
                    <button className="bg-gray-100 px-3 py-2">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
                
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-right">العميل</th>
                      <th className="py-3 px-4 text-right">الميكانيكي</th>
                      <th className="py-3 px-4 text-right">نوع الخدمة</th>
                      <th className="py-3 px-4 text-right">التاريخ</th>
                      <th className="py-3 px-4 text-right">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{booking.user?.name || 'غير معروف'}</td>
                        <td className="py-3 px-4">{booking.mechanic?.user?.name || 'غير معروف'}</td>
                        <td className="py-3 px-4">{booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة'}</td>
                        <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString('ar-SA')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'completed' ? 'مكتمل' :
                             booking.status === 'accepted' ? 'مقبول' :
                             booking.status === 'pending' ? 'معلق' : 'مرفوض'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="p-4 flex items-center justify-between border-t">
                  <div>
                    <p className="text-sm text-gray-500">عرض 1-10 من {bookings.length} حجز</p>
                  </div>
                  <div className="flex">
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">السابق</button>
                    <button className="border rounded bg-blue-500 text-white mr-1 px-3 py-1">1</button>
                    <button className="border rounded mr-1 px-3 py-1 hover:bg-gray-100">2</button>
                    <button className="border rounded px-3 py-1 hover:bg-gray-100">التالي</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">إعدادات النظام</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">الصورة الشخصية</h3>
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
                        {admin?.image ? (
                          <img src={`http://localhost:4000${admin.image}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{admin?.name?.[0] || 'أ'}</span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="border rounded p-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">تغيير كلمة المرور</h3>
                    <form onSubmit={handlePasswordChange}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">كلمة المرور الحالية</label>
                          <input
                            type="password"
                            name="currentPassword"
                            className="mt-1 block w-full border rounded p-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            name="newPassword"
                            className="mt-1 block w-full border rounded p-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            className="mt-1 block w-full border rounded p-2"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                      >
                        تغيير كلمة المرور
                      </button>
                    </form>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">إعدادات الإشعارات</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" defaultChecked />
                        <span>إرسال إشعارات إضافة قطع الغيار</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" defaultChecked />
                        <span>إرسال إشعارات تسجيل المستخدمين</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        <span>إرسال تقارير الإيرادات الأسبوعية</span>
                      </label>
                    </div>
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