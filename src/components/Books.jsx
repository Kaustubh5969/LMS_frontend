import React, { useEffect, useState } from "react";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    auther: "",
    category: "",
    price: "",
    copies: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book/allBooks"); // GET route
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching Book:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/book/addNewBook", formData); // your POST route
      fetchBooks();
      setFormData({
        title: "",
        auther: "",
        category: "",
        price: "",
        copies: "",
      }); // Reset form
      alert("Book Added successfully");
    } catch (err) {
      console.error("Error adding Book:", err);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === "All" || `${book.category}` === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.auther.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || book.status === selectedStatus;

    return matchesCategory && matchesSearch && matchesStatus;
  });

  const totalCount = filteredBooks.reduce((sum, book) => sum + book.copies, 0);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // Calculate indexes
  const indexOfLastBook = currentPage * rowsPerPage;
  const indexOfFirstBook = indexOfLastBook - rowsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Calculate total pages
  const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);

  const pageLimit = 5;
  const getPageNumbers = () => {
    const totalPageNumbers = Math.min(pageLimit, totalPages);
    let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
    let endPage = startPage + totalPageNumbers - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - totalPageNumbers + 1, 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleCheckboxChange = (e) => {
    const id = e.target.value;
    if (e.target.checked) {
      setSelectedBooks([...selectedBooks, id]);
    } else {
      setSelectedBooks(selectedBooks.filter((bid) => bid !== id));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete("http://localhost:5000/book/delete", {
        data: { ids: selectedBooks },
      });

      if (response.status === 200) {
        alert("Book deleted successfully");

        fetchBooks();

        setSelectedBooks([]); // Clear selected
      }
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };

  const [editBook, setEditBook] = useState({
    _id: "",
    title: "",
    auther: "",
    category: "",
    status: "",
    price: "",
    copies: "",
  });

  const handleEditClick = (book) => {
    setEditBook(book);
  };

  const handleUpdateBook = async () => {
    try {
      const { _id, ...updateData } = editBook;
      const response = await axios.put(
        `http://localhost:5000/book/${_id}`,
        updateData
      );

      if (response.status === 200) {
        console.log("Book updated successfully");
        fetchBooks(); // re-fetch students list
      }
    } catch (error) {
      console.error("Error updating book", error);
    }
  };

  const categoryOptions = [
    "History",
    "Biography",
    "fairy Tale",
    "Mystery",
    "Science",
    "Poerty",
    "Drama",
    "Other",
  ];

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
                      onClick={handleSave}
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
                      onClick={handleDelete}
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
                              <td>{book.status}</td>
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
                      onClick={handleUpdateBook} // your custom function
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

        <div className="row row-cols-2">
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
              {/* Count: {filteredBooks.length} */}
              Count: {totalCount}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Books;
