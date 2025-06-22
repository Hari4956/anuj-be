const express = require('express');
const router = express.Router();
const upload = require('../../middleware/voice');
const { createSupportRequest, getAllSupportRequests, deleteSupportRequest, updateSupportRequest } = require('../../controller/formController/serviceAndSupport');


router.post('/createServiceAndSupport', (req, res, next) => {
    upload.single('voiceRecord')(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                error: err
            });
        }
        next();
    });
}, createSupportRequest);
router.get('/getallServiceAndSupport', getAllSupportRequests);

router.delete('/:id', deleteSupportRequest);

router.put('/:id', upload.single('voiceRecord'), updateSupportRequest);

module.exports = router;
