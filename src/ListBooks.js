import React, { Component } from "react";
import { Link } from "react-router-dom";
import BookShelf from "./BookShelf";
import * as BooksAPI from "./BooksAPI";

class ListBooks extends Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  };

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({
        currentlyReading: books.filter(
          book => book.shelf === "currentlyReading"
        ),
        wantToRead: books.filter(book => book.shelf === "wantToRead"),
        read: books.filter(book => book.shelf === "read")
      });
    });

    // https://stackoverflow.com/questions/41121667/reactjs-how-to-pass-values-from-child-component-to-grand-parent-component#
    // Needed when passing a callback to grandchild component.
    // Binds the parent context
    this.onUpdateBookSHelf = this.onUpdateBookSHelf.bind(this);
  }

  /**
   * @description Handles the book's shelf update
   * @param {obj} book
   * @param {string} shelf
   */
  onUpdateBookSHelf(book, shelf) {
    /* console.log("Book", book);
    console.log("new shelf", shelf); */

    let currentlyReading = "currentlyReading";
    let wantToRead = "wantToRead";
    let read = "read";

    // Remove book from its current shelf
    this.setState(state => ({
      currentlyReading:
        book.shelf === currentlyReading
          ? state.currentlyReading.filter(currentlyReadingBook => {
              return currentlyReadingBook.title !== book.title;
            })
          : state.currentlyReading,
      wantToRead:
        book.shelf === wantToRead
          ? state.wantToRead.filter(wantToReadBook => {
              return wantToReadBook.title !== book.title;
            })
          : state.wantToRead,
      read:
        book.shelf === read
          ? state.read.filter(readBook => {
              return readBook.title !== book.title;
            })
          : state.read
    }));

    // Move book to a different shelf
    this.setState(state => ({
      currentlyReading:
        shelf === currentlyReading
          ? ((book.shelf = currentlyReading),
            state.currentlyReading.concat(book))
          : state.currentlyReading,
      wantToRead:
        shelf === wantToRead
          ? ((book.shelf = wantToRead), state.wantToRead.concat(book))
          : state.wantToRead,
      read:
        shelf === read
          ? ((book.shelf = read), state.read.concat(book))
          : state.read
    }));

    // Update the book shelf in the API
    BooksAPI.update(book, shelf);
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf
              title="Currently Reading"
              books={this.state.currentlyReading}
              handleOnUpdateBookShelf={this.onUpdateBookSHelf}
            />
            <BookShelf
              title="Want to Read"
              books={this.state.wantToRead}
              handleOnUpdateBookShelf={this.onUpdateBookSHelf}
            />
            <BookShelf
              title="Read"
              books={this.state.read}
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
