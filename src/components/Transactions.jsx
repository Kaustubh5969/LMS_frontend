import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Transactions() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchStudents();
    fetchTransactions();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book/allBooks"); // GET route
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching Book:", err);
    }
  };
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/student/allStudents"); // GET route
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.auther.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.mobile.toString().includes(searchQuery);

    return matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate indexes
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const [step, setStep] = useState(1);

  // Calculate total pages
  let totalPages = Math.ceil(filteredBooks.length / rowsPerPage);
  if (step === 2) {
    totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  }

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

  const handleCheckboxChange = (e, book) => {
    if (e.target.checked) {
      setSelectedBooks([...selectedBooks, book]); // store full book object
    } else {
      setSelectedBooks(selectedBooks.filter((b) => b._id !== book._id));
    }
  };

  const [selectedStudent, setSelectedStudent] = useState();

  const handleRadioChecked = (e) => {
    const studentId = e.target.value;
    const student = currentStudents.find((s) => s._id === studentId);
    setSelectedStudent(student); // This stores full student object
  };

  const [dueDate, setDueDate] = useState();

  const [borrowData, setBorrowData] = useState({
    name: "",
    title: "",
    borrow_date: "",
    due_date: "",
    return_date: "",
    teacher: "",
  });

  const handleSave = async () => {
    // const borrowDate = new Date().toLocaleDateString(); // today's date
    const borrowDate = new Date().toISOString().split('T')[0]; // '2025-04-21'


    // Create one borrowData entry per book
    const postData = selectedBooks.map((book) => ({
      name: selectedStudent.name,
      title: book.title,
      borrow_date: borrowDate,
      due_date: dueDate.toLocaleDateString(), // assuming dueDate is a Date object
      return_date: "", // default
      teacher: "Admin", // if you have it
    }));
    try {
      await Promise.all(
        postData.map((entry) =>
          axios.post("http://localhost:5000/transaction/borrow", entry)
        )
      );

      // Reset everything
      setBorrowData({
        name: "",
        title: "",
        borrow_date: "",
        due_date: "",
        return_date: "",
        teacher: "",
      });

      setSelectedBooks([]);
      setSelectedStudent(null);
      setDueDate(null);
      setStep(1); // Reset to step 1

      alert("Book(s) borrowed successfully!");
    } catch (err) {
      console.error("Error while borrowing book(s):", err);
      alert("Something went wrong while borrowing.");
    }
  };

  const [transaction, setTransaction] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/transaction/allTransctions"
      ); // GET route
      setTransaction(res.data);
    } catch (err) {
      console.error("Error fetching transaction:", err);
    }
  };

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
              Borrow
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
                      Borrow Book
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {step === 1 && (
                      <>
                        {/* Your book table code here (reuse existing logic) */}
                        <div className="row">
                          <div className="col col-md-8"></div>
                          <div className="col col-md-4">
                            <form
                              className="d-flex m-1"
                              role="search"
                              onSubmit={(e) => e.preventDefault()}
                            >
                              <input
                                className="form-control me-2 border border-dark"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </form>
                          </div>
                        </div>
                        <div className="table-responsive mt-1">
                          <table class="table table-bordered">
                            <thead>
                              <tr>
                                <th scope="col">Select</th>
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
                                  <th>
                                    <input
                                      className="form-check-input mt-0"
                                      type="checkbox"
                                      value={book._id}
                                      onChange={(e) =>
                                        handleCheckboxChange(e, book)
                                      }
                                    />
                                  </th>
                                  <th scope="row">
                                    {indexOfFirst + index + 1}
                                  </th>
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
                              <button
                                className="page-link"
                                onClick={handleNext}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        {/* student list here */}
                        <div className="row">
                          <div className="col col-md-8"></div>
                          <div className="col col-md-4">
                            <form
                              className="d-flex m-1"
                              role="search"
                              onSubmit={(e) => e.preventDefault()}
                            >
                              <input
                                className="form-control me-2 border border-dark"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </form>
                          </div>
                        </div>
                        <div className="table-responsive mt-1">
                          <table class="table table-bordered">
                            <thead>
                              <tr>
                                <th scope="col">Select</th>
                                <th scope="col">Sr.No</th>
                                <th scope="col">Roll No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Stadard</th>
                                <th scope="col">Mobile No</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentStudents.map((student, index) => (
                                <tr key={student._id}>
                                  <th>
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="studentRadio"
                                      value={student._id}
                                      onChange={handleRadioChecked}
                                      checked={
                                        selectedStudent?._id === student._id
                                      }
                                    />
                                  </th>
                                  <th scope="row">
                                    {indexOfFirst + index + 1}
                                  </th>
                                  <td>{student.roll_no}</td>
                                  <td>{student.name}</td>
                                  <td>{student.standard}</td>
                                  <td>{student.mobile}</td>
                                  <td>{student.status}</td>
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
                              <button
                                className="page-link"
                                onClick={handleNext}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        {/* <input
                          type="date"
                          className="form-control"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        /> */}
                        <Calendar onChange={setDueDate} value={dueDate} />
                      </>
                    )}
                    {step === 4 && (
                      <>
                        <div className="table-responsive mt-1">
                          <table class="table table-bordered">
                            <thead>
                              <tr>
                                <th scope="col">Roll No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Title</th>
                                <th scope="col">Borrow Date</th>
                                <th scope="col">Due Date</th>
                                <th scope="col">Teacher</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{selectedStudent?.roll_no}</td>
                                <td>{selectedStudent?.name}</td>
                                <td>
                                  {selectedBooks.map((book, index) => (
                                    <p key={book._id} className="text-start">
                                      <strong>Book {index + 1}:</strong>{" "}
                                      {book.title}
                                    </p>
                                  ))}
                                </td>
                                <td>{new Date().toLocaleDateString()}</td>
                                <td>{dueDate.toLocaleDateString()}</td>
                                <td>Admin</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setStep(1);
                        setSelectedBooks([]);
                        setSelectedStudent(null);
                        setDueDate("");
                      }}
                    >
                      Clear
                    </button>

                    {step < 4 && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setStep((prev) => prev + 1)}
                        disabled={
                          (step === 1 && selectedBooks.length === 0) ||
                          (step === 2 && !selectedStudent) ||
                          (step === 3 && !dueDate)
                        }
                      >
                        Next
                      </button>
                    )}

                    {step === 4 && (
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          // Final borrow logic here (e.g. axios POST)
                          handleSave();
                          console.log("Borrow confirmed!");
                          setStep(1);
                          setSelectedBooks([]);
                          setSelectedStudent(null);
                          setDueDate("");
                        }}
                        data-bs-dismiss="modal"
                      >
                        Borrow
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary m-1"
              // data-bs-toggle="modal"
              // data-bs-target="#editModal"
            >
              Return
            </button>
          </div>
          <div className="col col-md-6 text-center">
            <input type="date" className="btn btn-secondary m-1" />
            <input type="date" className="btn btn-secondary m-1" />
          </div>
          <div className="col col-md-3 text-center"></div>
        </div>
        <hr />
      </div>

      <div className="container my-2">
        <div className="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Sr.No</th>
                <th scope="col">Name</th>
                <th scope="col">Title</th>
                <th scope="col">Borrow Date</th>
                <th scope="col">Due Date</th>
                <th scope="col">Return Date</th>
                <th scope="col">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {transaction.map((transaction, index) => (
                <tr key={transaction._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{transaction.name}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.borrow_date}</td>
                  <td>{transaction.due_date}</td>
                  <td>{transaction.return_date}</td>
                  <td>{transaction.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Transactions;
