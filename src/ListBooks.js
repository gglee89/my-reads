import React, { Component } from "react";
import { Link } from "react-router-dom";
import BookShelf from "./BookShelf";
import * as BooksAPI from "./BooksAPI";

class ListBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: []
    };

    // https://stackoverflow.com/questions/41121667/reactjs-how-to-pass-values-from-child-component-to-grand-parent-component#
    // Needed when passing a callback to grandchild component.
    // Binds the parent context
    this.onUpdateBookSHelf = this.onUpdateBookSHelf.bind(this);
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({
        books
      });
    });
  }

  /**
   * @description Handles the book's shelf update
   * @param {obj} book
   * @param {string} shelf
   */
  onUpdateBookSHelf(book, shelf) {
    // Update the book shelf in the API
    if (book.shelf !== shelf) {
      BooksAPI.update(book, shelf).then(() => {
        book.shelf = shelf;

        // Filter out the book and append it to the end of the list
        // so it appears at the end of whatever shelf it was added to.
        this.setState(state => ({
          books: state.books.filter(b => b.id !== book.id).concat([book])
        }));
      });
    }
  }

  render() {
    const { books } = this.state;

    const wantToRead = books.filter(book => book.shelf === "wantToRead");
    const currentlyReading = books.filter(
      book => book.shelf === "currentlyReading"
    );
    const read = books.filter(book => book.shelf === "read");

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf
              title="Currently Reading"
              books={currentlyReading}
              handleOnUpdateBookShelf={this.onUpdateBookSHelf}
            />
            <BookShelf
              title="Want to Read"
              books={wantToRead}
              handleOnUpdateBookShelf={this.onUpdateBookSHelf}
            />
            <BookShelf
              title="Read"
              books={read}
              handleOnUpdateBookShelf={this.onUpdateBookSHelf}
            />
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}

export default ListBooks;
