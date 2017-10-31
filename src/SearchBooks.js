import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import Book from "./Book";

class SearchBooks extends Component {
  state = {
    query: "",
    books: []
  };

  componenetDidMount() {
    // https://stackoverflow.com/questions/41121667/reactjs-how-to-pass-values-from-child-component-to-grand-parent-component#
    // Passing callback to grandchild component
    this.handleOnUpdateBookShelf = this.handleOnUpdateBookShelf.bind(this);
  }

  handleQuery(query) {
    this.setState({
      query
    });

    if (query !== "") {
      BooksAPI.search(query)
        .then(books => {
          this.setState({
            books
          });
        })
        .catch(err => {
          this.setState({
            books: []
          });
        });
    } else {
      this.setState({
        books: []
      });
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
            {!this.state.books.hasOwnProperty("error") ? (
              this.state.books.map(book => (
                <li key={book.id}>
                  <Book
                    book={book}
                    updateBookShelf={this.handleOnUpdateBookShelf}
                  />
                </li>
              ))
            ) : (
              <li />
            )}
          </ol>
        </div>
      </div>
    );
  }
}

export default SearchBooks;
