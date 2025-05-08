const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { codeSearchSchema } = require('../validations/codeValidation');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

router.post('/search', validate(codeSearchSchema), auth, codeController.searchCode);
// router.post('/search', validate(codeSearchSchema), codeController.searchCode);
router.get('/history', auth, codeController.getErrorCodeHistory);
module.exports = router;