const { getBookByIdService } = require('../services/getbookbyid.service');
const { getBookFileService } = require('../services/bookfile.service');
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
        const { absolutePath } = await getBookFileService(id);
        res.sendFile(absolutePath);
    } catch (err) {
        next(err);
    }
}

module.exports = {renderBook,
serveBookFile
};