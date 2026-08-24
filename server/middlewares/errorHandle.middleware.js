function errorHandler(err, req, res, next) {
    if(err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }else if(err.name === 'CastError'){
        console.error(err);
        return res.status(400).json({ error: 'Invalid ID' });
    }else if(err.statusCode){
        return res.status(err.statusCode).json({ error: err.message });
    }
return res.status(500).json({ error: err.message });


}
module.exports = {errorHandler};