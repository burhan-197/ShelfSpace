 function getPaginationRange(currentPage,totalPages) {

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    
    let pages=[]
    let hasPreviousPage=true
    let hasNextPage=true
    let nextPage=currentPage+1
    let previousPage=currentPage-1
    if(currentPage<=1){
        hasPreviousPage=false
    }
    if(currentPage>=totalPages){
        hasNextPage=false
    }

    
       for(let i=startPage;i<=endPage;i++){
           pages.push(i)
       }     

       return{
        startPage,
        endPage,
        pages,
        hasPreviousPage,
        hasNextPage,
        nextPage,
        previousPage
       }

}
module.exports = getPaginationRange;