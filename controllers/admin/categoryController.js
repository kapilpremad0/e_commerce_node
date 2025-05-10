const Category = require('../../models/Category');


exports.createCategory = async (req, res) => {
    const { name, status, description } = req.body;

    const errors = {}; // Initialize an empty errors object

    const image = req.file;

    // Validation
    if (!name) errors.name = 'Name is required';
    if (!status) errors.status = 'Status is required';
    if (!description) errors.description = 'Description is required';
    if (!image) errors.image = 'Image is required';

    // If there are errors, return them with a 400 status code
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    // Simulate saving to DB
    try {
        const category = new Category({
            name,
            status,
            description,
            image: req.file.filename
        });

        // Save to MongoDB, and wait for the operation to complete
        await category.save();
        req.session.success = 'Category created successfully!';
        // Respond with success message
        return res.status(201).json({
            message: 'created successfully',
            data: category
        });
    } catch (err) {
        // Handle any database errors
        console.error(err);
        return res.status(500).json({ error: 'Failed to save category. Please try again later.' });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        res.render('admin/categories/list');
        // res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoriesData = async (req, res) => {
    try {

        const draw = parseInt(req.body.draw) || 0;
        const start = parseInt(req.body.start) || 0;
        const length = parseInt(req.body.length) || 10;
        const search = req.body.search?.value || "";
        const status = req.body.status; // Get the status filter

       const query = {};

        if (search) {
            query.name = new RegExp(search, 'i');
        }

        if (status) {
            query.status = status; // Add the status filter to the query
        }

        const totalRecords = await Category.countDocuments();
        const filteredRecords = await Category.countDocuments(query);

        

        const data_fetch = await Category.find(query)
            .sort({ createdAt: -1 }) 
            .skip(start)
            .limit(length)
            .exec();

        const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;

        const data = data_fetch.map(item => ({
            name__: item.name,
            name:`<div class="d-flex align-items-center">
                            <div class="avatar rounded">
                                <div class="avatar-content">
                                    <img src="${baseUrl}/${item.image}" width="50"
                                        height="50" alt="Toolbar svg" />
                                </div>
                            </div>
                            <div>
                                <div class="fw-bolder">${item.name}</div>
                                
                                
                            </div>
                        </div>`,

            status: item.status === 1
                ? `<span class="badge rounded-pill badge-light-primary me-1">Active</span>`
                : `<span class="badge rounded-pill badge-light-danger me-1">Inactive</span>`,
            description:item.description,
            datetime: new Date(item.createdAt).toLocaleString(), // Format datetime
            action: `<div class="dropdown">
                          <button type="button" class="btn btn-sm dropdown-toggle hide-arrow py-0" data-bs-toggle="dropdown">
                            <i data-feather="more-vertical"></i>
                          </button>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#">
                              <i data-feather="edit-2" class="me-50"></i>
                              <span>Edit</span>
                            </a>
                            <a class="dropdown-item" href="#">
                              <i data-feather="trash" class="me-50"></i>
                              <span>Delete</span>
                            </a>
                          </div>
                </div>`
        }));

        res.json({
            draw,
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};