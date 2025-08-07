import React, { useEffect, useContext } from "react";

import BookContext from "../context/BookContext";
import LSContext from "../context/LSContext";

function Books() {
  const {
    formData,
    fetchBooks,
    handleInputChange,
    categoryOptions,
    handleUpdateBook,
    handleEditClick,
    handleDelete,
    handleCheckboxChange,
    handleNext,
    handlePrevious,
    handlePageChange,
    getPageNumbers,
    indexOfFirstBook,
    currentPage,
    totalPages,
    currentBooks,
    totalCount,
    handleSave,
    setSelectedStatus,
    setSelectedCategory,
    setSearchQuery,
    searchQuery,
    selectedCategory,
    selectedStatus,
    editBook,
    setEditBook,
  } = useContext(BookContext);

  const { bookAdd, ToastContainer, bookUpdate, bookDelete } =
    useContext(LSContext);

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="row row-cols-md-3 row-cols-1 pt-4">
          <div className="col col-md-3 text-center">
            <button
              type="button"
              class="btn btn-success m-1"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Add
            </button>
            <div
              class="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabindex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">
                      Add New Book
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div className="row">
                      <div className="col col-md-8">
                        <p>Adding Another New Copy of Book</p>
                      </div>
                      <div className="col col-md-4">
                        <form
                          className="d-flex m-1"
                          role="search"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <input
                            className="form-control me-2 border border-dark"
                            type="search"
                            placeholder="Search Book"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </form>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Sr.No</th>
                            <th scope="col">Title</th>
                            <th scope="col">Auther</th>
                            <th scope="col">Category</th>
                            <th scope="col">Price</th>
                            <th scope="col">Copies</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBooks.map((book, index) => (
                            <tr key={book._id}>
                              <th scope="row">
                                {indexOfFirstBook + index + 1}
                              </th>
                              <td>{book.title}</td>
                              <td>{book.auther}</td>
                              <td>{book.category}</td>
                              <td>{book.price}</td>
                              <td>{book.copies}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Auther</th>
                            <th scope="col">Category</th>
                            <th scope="col">Price</th>
                            <th scope="col">Copies</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="auther"
                                value={formData.auther}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <select
                                className="form-select"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="" disabled>
                                  Select a category
                                </option>
                                {categoryOptions.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="copies"
                                value={formData.copies}
                                onChange={handleInputChange}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      class="btn btn-success"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        handleSave();
                        bookAdd();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-danger m-1"
              data-bs-toggle="modal"
              data-bs-target="#deleteModalId"
            >
              Delete
            </button>
            <div
              className="modal fade"
              id="deleteModalId"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="deleteModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="deleteModalLabel">
                      Delete Book
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Select</th>
                            <th scope="col">Sr.No</th>
                            <th scope="col">Title</th>
                            <th scope="col">Auther</th>
                            <th scope="col">Category</th>
                            <th scope="col">Price</th>
                            <th scope="col">Copies</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBooks.map((book, index) => (
                            <tr key={book._id}>
                              <th>
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  value={book._id}
                                  onChange={handleCheckboxChange}
                                />
                              </th>
                              <th scope="row">
                                {indexOfFirstBook + index + 1}
                              </th>
                              <td>{book.title}</td>
                              <td>{book.auther}</td>
                              <td>{book.category}</td>
                              <td>{book.price}</td>
                              <td>{book.copies}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <nav>
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={handlePrevious}
                          >
                            Previous
                          </button>
                        </li>

                        {getPageNumbers().map((pageNumber) => (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              pageNumber === currentPage ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        ))}

                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button className="page-link" onClick={handleNext}>
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        handleDelete();
                        bookDelete();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary m-1"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
            >
              Edit
            </button>
            <div
              className="modal fade"
              id="editModal"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="editModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="editModalLabel">
                      Edit Book
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Select</th>
                            <th>Sr.No</th>
                            <th>Title</th>
                            <th>Auther</th>
                            <th>Cateogry</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Copies</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBooks.map((book, index) => (
                            <tr key={book._id}>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleEditClick(book)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editStudentModal"
                                >
                                  Edit
                                </button>
                              </td>
                              <td>{indexOfFirstBook + index + 1}</td>
                              <td>{book.title}</td>
                              <td>{book.auther}</td>
                              <td>{book.category}</td>
                              <td>
                                {book.copies > 0
                                  ? `Available - ${book.copies}`
                                  : "Borrowed"}
                              </td>
                              <td>{book.price}</td>
                              <td>{book.copies}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <nav>
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={handlePrevious}
                          >
                            Previous
                          </button>
                        </li>

                        {getPageNumbers().map((pageNumber) => (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              pageNumber === currentPage ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        ))}

                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button className="page-link" onClick={handleNext}>
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="editStudentModal"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="editStudentModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="editStudentModalLabel">
                      Edit Student
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Auther</th>
                            <th scope="col">Category</th>
                            <th scope="col">Price</th>
                            <th scope="col">Copies</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editBook?.title || ""}
                                onChange={(e) =>
                                  setEditBook({
                                    ...editBook,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editBook?.auther || ""}
                                onChange={(e) =>
                                  setEditBook({
                                    ...editBook,
                                    auther: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <select
                                className="form-select"
                                id="category"
                                value={editBook?.category || ""}
                                onChange={(e) =>
                                  setEditBook({
                                    ...editBook,
                                    category: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="" disabled>
                                  Select a category
                                </option>
                                {categoryOptions.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editBook?.price || ""}
                                onChange={(e) =>
                                  setEditBook({
                                    ...editBook,
                                    price: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editBook?.copies || ""}
                                onChange={(e) =>
                                  setEditBook({
                                    ...editBook,
                                    copies: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        handleUpdateBook();
                        bookUpdate();
                      }} // your custom function
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-7 text-center">
            <div className="btn border-0">
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
              </select>
            </div>
            {[
              "All",
              "History",
              "Biography",
              "Mystery",
              "Drama",
              "Poetry",
              "Other",
            ].map((cat) => (
              <button
                key={cat}
                className={`btn m-1 ${
                  selectedCategory === cat ? "btn-dark" : "btn-secondary"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="col col-md-2 text-center">
            <form
              className="d-flex m-1"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="form-control me-2 border border-dark"
                type="search"
                placeholder="Search Book"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
        <hr />
      </div>

      <div className="container my-2">
        <div className="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Sr.No</th>
                <th scope="col">Title</th>
                <th scope="col">Auther</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col">Price</th>
                <th scope="col">Copies</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book, index) => (
                <tr key={book._id}>
                  <th scope="row">{indexOfFirstBook + index + 1}</th>
                  <td>{book.title}</td>
                  <td>{book.auther}</td>
                  <td>{book.category}</td>
                  <td>{book.status}</td>
                  <td>{book.price}</td>
                  <td>{book.copies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row row-cols-1 mt-2">
          <div className="col col-md-10">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button className="page-link" onClick={handlePrevious}>
                    Previous
                  </button>
                </li>

                {getPageNumbers().map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      pageNumber === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={handleNext}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col col-md-2 text-end">
            <button className="btn btn-outline-dark">
              Count: {totalCount}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Books;
