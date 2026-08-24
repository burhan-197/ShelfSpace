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
        let page=1
        let limit=10;
        if(queryParams.page!==undefined ){
             page=+queryParams.page;

        }
         if(queryParams.limit!==undefined){
             limit=+queryParams.limit

        }
     

        if((page <=0 ||!Number.isInteger(page)) || (limit <=0  || !Number.isInteger(limit))){
            return res.status(400).json({error:`Invalid page or limit value`});
        }
       const skip = (page - 1) * limit
        
            const invalidSortBy=sortBy && !allowedSortByValues.includes(sortBy);
            if(invalidSortBy){
                return res.status(400).json({error:`Invalid sortBy value: ${sortBy}`});
            }
   
        
            const books = await getAllBooksService(filters, sortBy,skip, limit);
            res.status(200).json(books);
        
    }catch (err) {
        next(err);
    }
}

module.exports={
    getAllBooks,
    
}