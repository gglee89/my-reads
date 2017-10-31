import React, { Component } from "react";

class Book extends Component {
  render() {
    const { book, updateBookShelf, isSearch } = this.props;

    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 188,
              backgroundImage: `url(${book.imageLinks.smallThumbnail})`
            }}
          />
          <div className="book-shelf-changer">
            <select
              onChange={event => updateBookShelf(book, event.target.value)}
              value={!isSearch ? book.shelf : "none"}
            >
              <option value="none" disabled>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{book.authors}</div>
      </div>
    );
  }
}

export default Book;
