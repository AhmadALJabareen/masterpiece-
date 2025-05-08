const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingCreateSchema } = require('../validations/bookingValidation');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const isMechanic = require('../middlewares/isMechanic');


router.post('/book', auth, validate(bookingCreateSchema), bookingController.createBooking);


// عرض الحجوزات للميكانيكي الحالي
router.get('/my', auth, isMechanic, bookingController.getMyBookings);

// قبول الحجز
router.post('/accept/:bookingId', auth, isMechanic, bookingController.acceptBooking);

// رفض الحجز
router.post('/reject/:bookingId', auth, isMechanic, bookingController.rejectBooking);

// عرض حجوزات المستخدم
router.get('/my-user', auth, bookingController.getMyUserBookings);



// إلغاء الحجز من طرف المستخدم
router.post('/cancel/:bookingId', auth, bookingController.cancelBooking);

// إنهاء الحجز (من طرف الميكانيكي أو المستخدم)
router.post('/complete/:bookingId', auth, bookingController.completeBooking);




module.exports = router;