const Code = require('../models/Code');
const User = require('../models/User');
const Part = require('../models/Part');

exports.searchCode = async (req, res) => {
  try {
    const { code } = req.body;

    // ابحث عن كود العطل
    const codeDoc = await Code.findOne({ code: code.toUpperCase() }).populate('suggestedParts');
    if (!codeDoc) {
      return res.status(404).json({ message: 'الكود غير موجود في قاعدة البيانات' });
    }

    // إذا المستخدم مسجّل، أضف الكود إلى سجل البحث
    if (req.user && req.user.id) {
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { searchHistory: code.toUpperCase() }
      });
    }

    // إرجاع التفاصيل
    res.json({
      code: codeDoc.code,
      problem: codeDoc.problem,
      solution: codeDoc.solution,
      suggestedParts: codeDoc.suggestedParts.map(part => ({
        id: part._id,
        name: part.name,
        price: part.price,
        condition: part.condition,
        available: part.available,
      }))
    });

  } catch (err) {
    res.status(500).json({ message: 'خطأ في البحث', error: err.message });
  }
};




// exports.getErrorCodeHistory = async (req, res) => {
//   try {
//     const errorCodes = await Code.find({ user: req.user.id });
//     res.status(200).json({ errorCodes });
//   } catch (error) {
//     console.error('Get Error Code History Error:', error.message);
//     res.status(500).json({ message: 'حدث خطأ أثناء جلب السجل' });
//   }
// };

exports.getErrorCodeHistory = async (req, res) => {
  try {
    // جيب المستخدم مع searchHistory
    const user = await User.findById(req.user.id).select('searchHistory');
    if (!user || !user.searchHistory || user.searchHistory.length === 0) {
      return res.status(200).json({ errorCodes: [] });
    }

    // جيب تفاصيل الأكواد من Code collection
    const errorCodes = await Code.find({ code: { $in: user.searchHistory } }).populate('suggestedParts');

    // صيغ الأكواد للإرجاع
    const formattedErrorCodes = errorCodes.map(code => ({
      _id: code._id,
      code: code.code,
      description: code.problem,
      createdAt: code.createdAt,
      solution: code.solution,
      suggestedParts: code.suggestedParts.map(part => ({
        id: part._id,
        name: part.name,
        price: part.price,
        condition: part.condition,
        available: part.available
      }))
    }));

    res.status(200).json({ errorCodes: formattedErrorCodes });
  } catch (error) {
    console.error('Get Error Code History Error:', error.message);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب السجل' });
  }
};