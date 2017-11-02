import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import Book from "./Book";

class SearchBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books_in_shelf: [],
      books: [],
      query: ""
    };

    this.handleOnUpdateBookShelf = this.handleOnUpdateBookShelf.bind(this);
    this.compareAndReplace = this.compareAndReplace.bind(this);
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({
        books_in_shelf: books
      });
    });
  }

  /**
   * @description Compare and replace the book shelf from the search result with the books already updated with a shelf.
   * @param {*} books
   */
  compareAndReplace(books) {
    books.map(book => {
      this.state.books_in_shelf.map(book_in_shelf => {
        if (book.id === book_in_shelf.id) {
          book["shelf"] = book_in_shelf.shelf;
        }
      });
    });

    this.setState({
      books
    });

    /* console.log(books); */
  }

  /**
   * @description Handles the query response to the state
   * @param {string} query
   */
  handleQuery(query) {
    this.setState({
      query
    });

    const resetQuery = () => {
      this.setState({
        books: []
      });
    };

    if (query !== "") {
      BooksAPI.search(query)
        .then(this.compareAndReplace)
        .catch(err => resetQuery());
    } else {
      resetQuery();
    }
  }

  handleOnUpdateBookShelf(book, shelf) {
    BooksAPI.get(book.id).then(book => {
      BooksAPI.update(book, shelf);
    });
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={event => this.handleQuery(event.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.books.map(book => (
              <li key={book.id}>
                <Book
                  book={book}
                  updateBookShelf={this.handleOnUpdateBookShelf}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default SearchBooks;
