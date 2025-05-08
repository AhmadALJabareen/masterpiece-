import { useState, useEffect } from "react";
import {
  Search,
  Wrench,
  User,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Car,
  Star,
  Award,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsImageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const testimonials = [
    {
      id: 1,
      name: "أحمد خالد",
      role: "مالك سيارة تويوتا كامري",
      image: "/api/placeholder/60/60",
      content:
        "ساعدني موقع أوتو دياج على اكتشاف مشكلة في نظام الوقود كنت أعاني منها لشهور. وجدت الحل بسرعة ووفرت الكثير من المال!",
      rating: 5,
    },
    {
      id: 2,
      name: "فاطمة العلي",
      role: "مالكة سيارة نيسان التيما",
      image: "/api/placeholder/60/60",
      content:
        "الموقع سهل الاستخدام ووفر لي الكثير من الوقت. حجزت ميكانيكي ممتاز عبر التطبيق وأصلح المشكلة في نفس اليوم.",
      rating: 5,
    },
    {
      id: 3,
      name: "محمد العمري",
      role: "ميكانيكي معتمد",
      image: "/api/placeholder/60/60",
      content:
        "كميكانيكي، أوتو دياج ساعدني في زيادة عملائي وتنظيم مواعيدي بشكل أفضل. أنصح به جميع الميكانيكيين!",
      rating: 4,
    },
  ];

  const topSpareParts = [
    {
      id: 1,
      name: "حساس الأكسجين",
      code: "O2-SENSOR",
      price: "250",
      image: "/api/placeholder/100/100",
    },
    {
      id: 2,
      name: "منظم ضغط الوقود",
      code: "FUEL-REG",
      price: "320",
      image: "/api/placeholder/100/100",
    },
    {
      id: 3,
      name: "مضخة وقود",
      code: "FUEL-PUMP",
      price: "480",
      image: "/api/placeholder/100/100",
    },
    {
      id: 4,
      name: "ثرموستات",
      code: "THERM-02",
      price: "180",
      image: "/api/placeholder/100/100",
    },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#081840]/5 to-[#081840]/10"
    >
      <Navbar />

      {/* Hero Section with Animation */}
      <section className="container mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#081840] mb-6">
            حلول فورية لتشخيص أعطال سيارتك
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            أدخل رمز عطل سيارتك للحصول على تفاصيل المشكلة، الحلول المقترحة، وقطع
            الغيار المتوفرة بدون تسجيل. سجّل الدخول لحجز مواعيد مع ميكانيكيين،
            بيع أو شراء قطع غيار مستعملة، وتتبع صيانة سيارتك.
          </p>
          {/* <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="أدخل رمز الخطأ (مثال: P0300)"
                className="w-full p-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5D1D5F]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5D1D5F] hover:bg-[#5D1D5F]/80 p-2 rounded text-white"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div> */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Wrench className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>تشخيص فوري</span>
            </div>
            <div className="flex items-center text-gray-700">
              <User className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>ميكانيكيون معتمدون</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>حجز سهل</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CreditCard className="h-5 w-5 ml-2 text-[#5D1D5F]" />
              <span>دفع آمن</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="/code"
              className="bg-[#5D1D5F] hover:bg-[#5D1D5F]/80 text-white font-medium py-3 px-6 rounded-lg transition duration-300 animate-pulse-slow"
            >
              ابحث عن الأكواد الآن
            </a>
            <a
              href="/booking"
              className="bg-transparent hover:bg-[#FCDE59]/20 text-[#4A4215] font-medium py-3 px-6 border border-[#FCDE59] rounded-lg transition duration-300"
            >
              احجز ميكانيكي
            </a>
          </div>
        </div>
        <div
          className={`order-1 md:order-2 transition-all duration-1000 transform ${
            isImageLoaded
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-[#FCDE59] rounded-full opacity-20 blur-lg animate-pulse"></div>
            <div className="relative bg-white p-2 rounded-xl shadow-2xl overflow-hidden">
              <img
                src="https://img.freepik.com/free-vector/blue-sports-car-isolated-white-vector_53876-67354.jpg?semt=ais_hybrid&w=740"
                alt="واجهة تشخيص السيارة"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg">
                <div className="flex items-center text-sm font-medium text-gray-800">
                  <FileText className="h-4 w-4 ml-2 text-[#5D1D5F]" />
                  <span>نتائج فورية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Code Result (Conditionally Shown) */}
      {showResults && (
        <section className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-lg mb-12 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#081840]">
              نتائج البحث: {searchQuery}
            </h2>
            <button
              onClick={() => setShowResults(false)}
              className="text-gray-500 hover:text-[#5D1D5F]"
              aria-label="إغلاق نتائج البحث"
            >
              إغلاق
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border-r-4 border-red-500">
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                المشكلة
              </h3>
              <p className="text-gray-700">
                {searchQuery.toLowerCase() === "p0300"
                  ? "خطأ احتراق متعدد غير منتظم (Misfire). يشير إلى وجود مشكلة في نظام الاشتعال تسبب عدم انتظام دوران المحرك."
                  : "خطأ في نظام السيارة يحتاج إلى فحص."}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                الحلول المقترحة
              </h3>
              <ul className="text-gray-700 space-y-2">
                {searchQuery.toLowerCase() === "p0300" ? (
                  <>
                    <li>• فحص شمعات الإشعال واستبدالها إذا لزم الأمر</li>
                    <li>• فحص ملفات الإشعال (Ignition Coils)</li>
                    <li>• فحص حقن الوقود والفلاتر</li>
                    <li>• فحص ضغط الاسطوانات</li>
                  </>
                ) : (
                  <li>• فحص النظام المرتبط بالخطأ لدى ميكانيكي معتمد</li>
                )}
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-r-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                قطع الغيار المقترحة
              </h3>
              <div className="flex flex-col space-y-2">
                {searchQuery.toLowerCase() === "p0300" ? (
                  <>
                    <a
                      href="#"
                      className="flex items-center justify-between hover:bg-green-100 p-2 rounded"
                    >
                      <span>شمعات إشعال NGK</span>
                      <span className="text-[#5D1D5F] font-bold">120 ر.س</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between hover:bg-green-100 p-2 rounded"
                    >
                      <span>ملف إشعال بوش</span>
                      <span className="text-[#5D1D5F] font-bold">350 ر.س</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between hover:bg-green-100 p-2 rounded"
                    >
                      <span>فلتر وقود</span>
                      <span className="text-[#5D1D5F] font-bold">85 ر.س</span>
                    </a>
                  </>
                ) : (
                  <span className="text-gray-700">
                    حدد رمز خطأ صحيح للحصول على قطع الغيار المناسبة
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="/mechanics"
              className="inline-block bg-[#5D1D5F] hover:bg-[#5D1D5F]/80 text-white font-medium py-2 px-6 rounded transition duration-300"
            >
              احجز موعد مع ميكانيكي
            </a>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 bg-white rounded-t-3xl shadow-inner">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#081840]">
          خدماتنا المميزة
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              تشخيص الأعطال
            </h3>
            <p className="text-gray-600">
              أدخل رمز العطل للحصول على تفاصيل المشكلة، الحلول، وقطع الغيار
              المناسبة فوراً.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              حجز ميكانيكي
            </h3>
            <p className="text-gray-600">
              اختر خدمة منزلية أو ورشة، حدد الموقع والوقت، وادفع إلكترونياً
              بسهولة.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Wrench className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              سوق قطع الغيار
            </h3>
            <p className="text-gray-600">
              بيع أو اشترِ قطع غيار مستعملة بأمان مع ضمان الجودة والتوافق.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              ملفات الميكانيكيين
            </h3>
            <p className="text-gray-600">
              استعرض تقييمات الميكانيكيين، مواعيدهم، وقم بحجز موعد بسهولة.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              تتبع الصيانة
            </h3>
            <p className="text-gray-600">
              تابع حالة الحجوزات وسجل الصيانة مع تنبيهات دورية للعناية بسيارتك.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#FCDE59]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-[#5D1D5F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#081840]">
              دفع إلكتروني
            </h3>
            <p className="text-gray-600">
              ادفع بأمان عبر الإنترنت مع إيصال رقمي لكل عملية.
            </p>
          </div>
        </div>
      </section>

      {/* Top Spare Parts Section */}
      <section className="container mx-auto px-4 py-12 bg-[#081840]/5">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840] mb-3">
            قطع الغيار الأكثر طلباً
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            تصفح قطع الغيار الأكثر شيوعاً وابحث عن ما تحتاجه بأفضل الأسعار
            والجودة.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {topSpareParts.map((part) => (
            <div
              key={part.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="p-2 bg-[#FCDE59]/10 flex justify-center">
                <img
                  src={part.image}
                  alt={part.name}
                  className="h-32 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#081840]">{part.name}</h3>
                <div className="text-sm text-gray-500 mb-2">
                  رمز: {part.code}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#5D1D5F]">
                    {part.price} ر.س
                  </span>
                  <button className="bg-[#5D1D5F] text-white px-3 py-1 rounded text-sm hover:bg-[#5D1D5F]/80 transition duration-300">
                    أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/spare-parts"
            className="inline-block bg-[#081840] hover:bg-[#081840]/80 text-white font-medium py-2 px-6 rounded transition duration-300"
          >
            عرض جميع قطع الغيار
          </a>
        </div>
      </section>

      <section className="bg-[#081840] text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <Shield className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">+500</span>
            <span className="text-gray-300">ميكانيكي معتمد</span>
          </div>
          <div className="p-4">
            <Car className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">+10K</span>
            <span className="text-gray-300">عطل تم تشخيصه</span>
          </div>
          <div className="p-4">
            <User className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">+50K</span>
            <span className="text-gray-300">عميل راضٍ</span>
          </div>
          <div className="p-4">
            <Wrench className="h-10 w-10 mx-auto mb-2 text-[#FCDE59]" />
            <span className="block text-3xl font-bold mb-1">+5K</span>
            <span className="text-gray-300">قطعة غيار متوفرة</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840] mb-3">
            آراء العملاء
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            تعرف على تجارب عملائنا مع أوتو دياج
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto overflow-hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-[#081840]/5 rounded-xl p-6 md:p-8 shadow-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-[#FCDE59]/30"
                        loading="lazy"
                      />
                      <div className="md:mr-4 text-center md:text-right mt-4 md:mt-0">
                        <h3 className="font-bold text-lg text-[#081840]">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {testimonial.role}
                        </p>
                        <div className="flex justify-center md:justify-start space-x-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-[#FCDE59]"
                                  : "text-gray-300"
                              }`}
                              fill={i < testimonial.rating ? "#FCDE59" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  activeTestimonial === index ? "bg-[#5D1D5F]" : "bg-gray-300"
                }`}
                aria-label={`انتقل إلى التقييم ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-[#081840]/5">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840]">
            نصائح وصيانة
          </h2>
          <p className="text-gray-600">
            مقالات مختارة لمساعدتك في العناية بسيارتك
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "10 علامات تدل على حاجة سيارتك لصيانة فورية",
              excerpt:
                "تعرف على العلامات التحذيرية التي لا يجب تجاهلها في سيارتك.",
              image: "/api/placeholder/400/250?blog=1",
            },
            {
              title: "دليل اختيار زيت المحرك المناسب",
              excerpt:
                "كيف تختار زيت المحرك الأمثل لسيارتك حسب نوعها وسنوات الاستخدام.",
              image: "/api/placeholder/400/250?blog=2",
            },
          ].map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <a
                  href="#"
                  className="text-[#5D1D5F] font-medium hover:underline"
                >
                  قراءة المزيد
                </a>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center">
            <a href="/blog" className="text-center p-6 w-full">
              <div className="text-2xl font-bold text-[#5D1D5F] mb-2">+</div>
              <span className="font-medium">عرض جميع المقالات</span>
            </a>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#081840]">
            أسئلة شائعة
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: "كيف أعرف رمز العطل في سيارتي؟",
              answer:
                "يمكنك قراءة رمز العطل عبر جهاز OBD-II أو زيارة أقرب مركز صيانة لمسح الأكواد.",
            },
            {
              question: "هل الخدمة متوفرة في جميع المدن؟",
              answer: "نعم، لدينا ميكانيكيون معتمدون في معظم المدن الرئيسية.",
            },
            {
              question: "ما هي ضمانات قطع الغيار؟",
              answer:
                "جميع القطع الجديدة لها ضمان لمدة عام، والمستعملة 3 أشهر.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button className="w-full p-4 text-right font-medium bg-gray-50 hover:bg-gray-100 transition duration-300">
                {item.question}
              </button>
              <div className="p-4 bg-white text-gray-600">{item.answer}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
