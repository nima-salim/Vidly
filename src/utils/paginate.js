import _ from 'lodash';

export function paginate( items, pageNumber, pageSize, paginationMovies ){
    const startIndex = ( pageNumber -1 ) * pageSize;
   
    return _(items).slice(startIndex).take(pageSize).value();
}