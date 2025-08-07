import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BookContext from "../context/BookContext";
import StudentContext from "../context/StudentContext";

function Transactions() {
  const {
    currentBooksB,
    searchQueryB,
    handlePageChangeB,
    getPageNumbersB,
    handleNextB,
    handlePreviousB,
    fetchBooks,
    indexOfFirstBookB,
    setSearchQueryB,
    totalPagesB,
    currentPageB,
  } = useContext(BookContext);

  const {
    currentStudentsS,
    handlePageChangeS,
    getPageNumbersS,
    handleNextS,
    setSearchQueryS,
    searchQueryS,
    handlePreviousS,
    indexOfFirstStudentS,
    currentPageS,
    fetchStudents,
    totalPagesS,
  } = useContext(StudentContext);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetchBooks();
    fetchStudents();
    fetchTransactions();
  }, []);

  const [step, setStep] = useState(1);

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
    const student = currentStudentsS.find((s) => s._id === studentId);
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
    studentId: "",
  });

  const handleSave = async () => {
    const borrowDate = new Date().toLocaleDateString(); // today's date

    // Create one borrowData entry per book
    const postData = selectedBooks.map((book) => ({
      name: selectedStudent.name,
      title: book.title,
      borrow_date: borrowDate,
      due_date: dueDate.toLocaleDateString(), // assuming dueDate is a Date object
      return_date: "", // default
      teacher: user.username, // if you have it
      studentId: selectedStudent._id,
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
        studentId: "",
      });

      setSelectedBooks([]);
      setSelectedStudent(null);
      setDueDate(null);
      setStep(1); // Reset to step 1

      alert("Book(s) borrowed successfully!");
      fetchTransactions();
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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  // Calculate indexes
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransaction = transaction.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Calculate total pages
  const totalPages = Math.ceil(transaction.length / rowsPerPage);

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

  // const returnBDate = new Date().toLocaleDateString();

  const [returnBook, setReturnBook] = useState({
    _id: "",
    name: "",
    title: "",
    borrow_date: "",
    due_date: "",
    return_date: "",
    teacher: "",
    studentId: "",
  });

  const handleEditClickT = (transaction) => {
    setReturnBook(transaction);
  };

  const handleUpdateTransaction = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { _id, ...restData } = returnBook;

      const updateData = {
        ...restData,
        return_date: today,
      };

      const response = await axios.put(
        `http://localhost:5000/transaction/${_id}`,
        updateData
      );

      if (response.status === 200) {
        console.log("Book Return successfully");
        fetchTransactions();
        if (returnBook.studentId) {
          await axios.put(
            `http://localhost:5000/student/increment-reading/${returnBook.studentId}`
          );
          console.log("Student status incremented successfully");
          fetchStudents();
        } else {
          console.error("No studentId found for this transaction");
        }
      }
    } catch (error) {
      console.error("Error in return Book", error);
    }
  };

  const returnTransactions = transaction.filter(
    (transaction) =>
      transaction.return_date === null && transaction.teacher === user?.username
  );

  const [currentPageT, setCurrentPageT] = useState(1);
  const rowsPerPageT = 10;
  // Calculate indexes
  const indexOfLastTransactionT = currentPageT * rowsPerPageT;
  const indexOfFirstTransactionT = indexOfLastTransactionT - rowsPerPageT;
  const currentTransactionT = returnTransactions.slice(
    indexOfFirstTransactionT,
    indexOfLastTransactionT
  );

  // Calculate total pages
  const totalPagesT = Math.ceil(returnTransactions.length / rowsPerPageT);

  const pageLimitT = 5;
  const getPageNumbersT = () => {
    const totalPageNumbersT = Math.min(pageLimitT, totalPagesT);
    let startPageT = Math.max(currentPageT - Math.floor(pageLimitT / 2), 1);
    let endPageT = startPageT + totalPageNumbersT - 1;

    if (endPageT > totalPagesT) {
      endPageT = totalPagesT;
      startPageT = Math.max(endPageT - totalPageNumbersT + 1, 1);
    }

    const pageNumbersT = [];
    for (let i = startPageT; i <= endPageT; i++) {
      pageNumbersT.push(i);
    }

    return pageNumbersT;
  };

  const handlePageChangeT = (pageNumber) => {
    setCurrentPageT(pageNumber);
  };

  const handlePreviousT = () => {
    if (currentPageT > 1) setCurrentPageT(currentPageT - 1);
  };

  const handleNextT = () => {
    if (currentPageT < totalPagesT) setCurrentPageT(currentPageT + 1);
  };

  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]); 

  const handleSearch = () => {
    if (filterType === "All" || !startDate || !endDate) {
      setFilteredData(currentTransaction); // Show all
      return;
    }

    const filtered = currentTransaction.filter((item) => {
      const rawDate = item[filterType.toLowerCase() + "_date"]; // e.g. item.borrow_date
      const parsedDate = new Date(rawDate);

      // Convert selected filter inputs to Date
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Compare by date only (ignore time)
      const parsedDateOnly = parsedDate.toISOString().split("T")[0];
      const startOnly = start.toISOString().split("T")[0];
      const endOnly = end.toISOString().split("T")[0];

      return parsedDateOnly >= startOnly && parsedDateOnly <= endOnly;
    });

    setFilteredData(filtered);
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
                                value={searchQueryB}
                                onChange={(e) =>
                                  setSearchQueryB(e.target.value)
                                }
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
                              {currentBooksB.map((book, index) => (
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
                                    {indexOfFirstBookB + index + 1}
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
                                currentPageB === 1 ? "disabled" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={handlePreviousB}
                              >
                                Previous
                              </button>
                            </li>

                            {getPageNumbersB().map((pageNumber) => (
                              <li
                                key={pageNumber}
                                className={`page-item ${
                                  pageNumber === currentPageB ? "active" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChangeB(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            ))}

                            <li
                              className={`page-item ${
                                currentPageB === totalPagesB ? "disabled" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={handleNextB}
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
                                value={searchQueryS}
                                onChange={(e) =>
                                  setSearchQueryS(e.target.value)
                                }
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
                              {currentStudentsS.map((student, index) => (
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
                                    {indexOfFirstStudentS + index + 1}
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
                                currentPageS === 1 ? "disabled" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={handlePreviousS}
                              >
                                Previous
                              </button>
                            </li>

                            {getPageNumbersS().map((pageNumber) => (
                              <li
                                key={pageNumber}
                                className={`page-item ${
                                  pageNumber === currentPageS ? "active" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChangeS(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            ))}

                            <li
                              className={`page-item ${
                                currentPageS === totalPagesS ? "disabled" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={handleNextS}
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
                        <div className="row row-cols-1 row-cols-md-3">
                          <div className="col col-md-4 my-1 align-content-center bg-warning text-dark rounded bg-opacity-25">
                            <div className="text-center">
                              <h3>Borrow Date</h3>
                              <h2>{new Date().toLocaleDateString()}</h2>
                            </div>
                          </div>
                          <div className="col col-md-4 my-1 d-flex justify-content-center">
                            <Calendar onChange={setDueDate} value={dueDate} />
                          </div>
                          <div className="col col-md-4 my-1 align-content-center bg-primary text-dark rounded bg-opacity-25">
                            <div className="text-center">
                              <h3>Due Date</h3>
                              <h2>
                                {dueDate
                                  ? dueDate.toLocaleDateString()
                                  : "No date selected"}
                              </h2>
                            </div>
                          </div>
                        </div>
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
                                <td>{user.username}</td>
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
              className="btn btn-danger m-1"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
            >
              Return
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
                      Return Book
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
                            <th>Name</th>
                            <th>Title</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Teacher</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTransactionT.map((transaction, index) => (
                            <tr key={transaction._id}>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => {
                                    handleEditClickT(transaction);
                                  }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editStudentModal"
                                >
                                  Edit
                                </button>
                              </td>
                              <th scope="row">{index + 1}</th>
                              <td>{transaction.name}</td>
                              <td>{transaction.title}</td>
                              <td>{transaction.borrow_date}</td>
                              <td>{transaction.due_date}</td>
                              <td>{transaction.teacher}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <nav>
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPageT === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={handlePreviousT}
                          >
                            Previous
                          </button>
                        </li>

                        {getPageNumbersT().map((pageNumber) => (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              pageNumber === currentPageT ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChangeT(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        ))}

                        <li
                          className={`page-item ${
                            currentPageT === totalPagesT ? "disabled" : ""
                          }`}
                        >
                          <button className="page-link" onClick={handleNextT}>
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
                      Return Book
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
                            <th>Name</th>
                            <th>Title</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Teacher</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{returnBook.name}</td>
                            <td>{returnBook.title}</td>
                            <td>{returnBook.borrow_date}</td>
                            <td>{returnBook.due_date}</td>
                            <td>{new Date().toLocaleDateString()}</td>
                            <td>{returnBook.teacher}</td>
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
                      onClick={handleUpdateTransaction}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-9 text-center">
            <div className="btn border-0">
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">Select Date for filter</option>
                <option value="borrow">Borrow Date</option> {/* borrow_date */}
                <option value="due">Due Date</option> {/* due_date */}
                <option value="return">Return Date</option> {/* return_date */}
              </select>
            </div>
            <input
              type="date"
              className="btn btn-secondary m-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="btn btn-secondary m-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-dark m-1"
              onClick={handleSearch}
            >
              Search
            </button>
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
                <th scope="col">Name</th>
                <th scope="col">Title</th>
                <th scope="col">Borrow Date</th>
                <th scope="col">Due Date</th>
                <th scope="col">Return Date</th>
                <th scope="col">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((transaction, index) => (
                <tr key={transaction._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{transaction.name}</td>
                  <td>{transaction.title}</td>
                  <td>
                    {transaction.borrow_date
                      ? new Date(transaction.borrow_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                  </td>
                  <td>
                    {transaction.due_date
                      ? new Date(transaction.due_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                  </td>
                  <td>
                    {transaction.return_date
                      ? new Date(transaction.return_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                    {/* {transaction.return_date} */}
                  </td>
                  <td>{transaction.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="">
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
      </div>
    </>
  );
}

export default Transactions;
