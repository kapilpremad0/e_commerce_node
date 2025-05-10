
exports.home = async (req, res) => {
    try {
        res.render('admin/categories/list');
        // res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};