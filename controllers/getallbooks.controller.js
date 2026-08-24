const { getAllBooksService } = require('../services/getallbooks.service');

async function getAllBooks(req,res,next){
    const allowedQueryParams = ['author', 'title', 'genre','sortBy','page','limit'];
    const allowedFilters = ['author', 'title', 'genre'];
    const allowedSortByValues = ['title', 'author', 'genre','publishDate'];

    try {
        const queryParams=req.query;
        const invalidQueryParams=Object.keys(queryParams).filter((key)=>{return !allowedQueryParams.includes(key)});
        if(invalidQueryParams.length>0){
            return res.status(400).json({error:`Invalid query parameters: ${invalidQueryParams.join(', ')}`});
        }
        const filters=Object.fromEntries(Object.entries(queryParams).filter(([key])=>{return allowedFilters.includes(key)}));
        const sortBy=queryParams.sortBy;
        const page=queryParams.page;
        const limit=queryParams.limit;
        if((page <=0 ||!Number.isInteger(Number(page))) || (limit <=0  || !Number.isInteger(Number(limit)))){
            return res.status(400).json({error:`Invalid page or limit value`});
        }
        
            const invalidSortBy=sortBy && !allowedSortByValues.includes(sortBy);
            if(invalidSortBy){
                return res.status(400).json({error:`Invalid sortBy value: ${sortBy}`});
            }
   
        if(Object.keys(filters).length>0 || sortBy){
            const books = await getAllBooksService(filters, sortBy);
            res.status(200).json(books);
        }else{
            const books = await getAllBooksService();
            res.status(200).json(books);
        }
    }catch (err) {
        next(err);
    }
}

module.exports={
    getAllBooks,
    
}