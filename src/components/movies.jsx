
import React, { Component } from 'react';
import { getMovies} from "../services/fakeMovieService";
import {getGenres} from "../services/fakeGenreService";
import Pagination from './common/pagination';
import {paginate} from '../utils/paginate';
import ListGroup from './common/listGroup';
import MoviesTable from './moviesTable';
import _ from 'lodash';
import NavBar from './navbar';


class Movies extends Component{
    state = {
        movies: [],
        genres:[],
        pageSize:4,
        currentPage:1,
        sortColumn:{path:'title', order: 'asc'}
       
    };

    componentDidMount(){
        const genres=[{_id:'', name: 'All Genres'}, ...getGenres()];
        this.setState({ movies: getMovies(), genres});
    }

    handleDelete = movie => {
        const movies = this.state.movies.filter( m=> m._id !== movie._id);
        this.setState({movies});
      }
     
     handleLike = ( movie ) => {
         const movies=[...this.state.movies];
         const index= movies.indexOf(movie);
         movies[index] = {...movies[index]};
         movies[index].liked = !movies[index].liked;
         this.setState({movies});
     };
      
     handlePageChange = page =>{ 
        const currentPage = page;
        this.setState({currentPage}); 
     };
    
     handleGenreSelect = genre =>{
        this.setState({selectedGenre : genre, currentPage :1});
    };

    handleSort = sortColumn => {
        this.setState({ sortColumn });
    };

    getPagedData = () => {
        const {currentPage,
            pageSize,
            selectedGenre, 
            movies: allMovies,
            sortColumn
        } = this.state;

        const filtered = selectedGenre && selectedGenre._id ? allMovies.filter( m=> 
            m.genre._id === selectedGenre._id): allMovies;

        const sorted = _.orderBy( filtered, [sortColumn.path], [sortColumn.order] );
        const movies = paginate(sorted, currentPage, pageSize );
        return {totalCount: filtered.length, data: movies};
    };

    render(){
        const { length : count } = this.state.movies;
        const { currentPage, pageSize, sortColumn } = this.state;
        if( count === 0 ) 
            return <h2> There are no movies in the database.</h2>;
        
        const { totalCount, data : movies} = this.getPagedData();

        return(
            <div className="row">
               
                <div className="col-2">
                    <ListGroup 
                    items={this.state.genres} 
                    selectedItem ={this.state.selectedGenre}
                    onItemSelect = {this.handleGenreSelect}
                    />
                </div>
                <div className="col">
                   <h2>
                       Showing {totalCount} movies in the database
                    </h2>

                    <MoviesTable 
                     onLike ={this.handleLike}
                     onDelete={this.handleDelete}
                     movies={movies}
                     onSort={this.handleSort}
                     sortColumn={sortColumn}
                     />

                    <Pagination 
                    itemsCount={totalCount} 
                    currentPage ={currentPage}
                    pageSize={pageSize}
                    onPageChange={this.handlePageChange}
                    />

                </div>
            </div>
        )
    }
}
export default Movies;