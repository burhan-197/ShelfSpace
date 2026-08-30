const { getBookByIdService } = require('../services/getbookbyid.service');
const path = require('path');
async function renderBook(req, res, next) {
    const { id } = req.params;

    try {
        const book = await getBookByIdService(id);

        res.status(200).render('render', {
                layout: 'render-layout',
                title: 'Reader — ShelfSpace',
                stylesheet: '/css/reader.css',
                script: '/js/render.js',
                book
            });

    } catch (err) {
        next(err);
    }
}
async function serveBookFile(req, res, next) {
    const { id } = req.params;

    try {
        const book = await getBookByIdService(id);
const absolutePath = path.join(__dirname, '..', book.filePath);
res.sendFile(absolutePath);

    } catch (err) {
        next(err);
    }
}

module.exports = {renderBook,
serveBookFile
};