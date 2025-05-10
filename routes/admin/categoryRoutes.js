const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-category-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });


router.post('/', upload.single('image'), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.post('/data', categoryController.getCategoriesData);


module.exports = router;