const { getBookByIdService } = require('../services/getbookbyid.service');

async function getBookById(req, res, next) {
    const { id } = req.params;

    try {
        const book = await getBookByIdService(id);

        res.status(200).render('book-detail', {
            title: 'Book Details — ShelfSpace',
            stylesheet: '/css/book_details.css',
            script: '/js/book_details.js',
            activePage: '',
            book
        });

    } catch (err) {
        next(err);
    }
}

module.exports = getBookById;