const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// إعدادات سرية JWT
const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_EXPIRES_IN = '7d'; // مدة صلاحية التوكن

// التسجيل
exports.register = async (req, res) => {
  try {
    const { name, email, password, location, phone } = req.body;

    // تحقق هل يوجد المستخدم مسبقًا
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });

    // هاش الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await User.create({ name, email, password: hashedPassword, location, phone });

    // إنشاء JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // تخزين التوكن في الكوكيز
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    res.status(201).json({
      message: 'تم التسجيل بنجاح',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ في السيرفر', error: err.message });
  }
};

// تسجيل دخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });

    // تحقق كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });

    // إنشاء JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // تخزين التوكن في الكوكيز
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ في السيرفر', error: err.message });
  }
};

// تسجيل الخروج (اختياري)
exports.logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'تم تسجيل الخروج بنجاح' });
};


// Get current user
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware (contains { id, role })
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ في السيرفر', error: err.message });
  }
};