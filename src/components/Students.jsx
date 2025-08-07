import React, { useEffect, useContext } from "react";

import StudentContext from "../context/StudentContext";
import LSContext from "../context/LSContext";

function Students() {
  const {
    handleNext,
    getPageNumbers,
    currentStudents,
    handleSave,
    handlePageChange,
    handlePrevious,
    handleUpdateStudent,
    handleEditClick,
    handleInputChange,
    editStudent,
    setEditStudent,
    fetchStudents,
    handleDelete,
    handleCheckboxChange,
    setSelectedStandard,
    setSearchQuery,
    formData,
    indexOfFirstStudent,
    currentPage,
    totalPages,
    selectedStandard,
    searchQuery,
    filteredStudents,
  } = useContext(StudentContext);

  const { studAdd, ToastContainer, studUpdate, studDelete } =
    useContext(LSContext);

  useEffect(() => {
    fetchStudents();
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
                      Add New Student
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
                            <th scope="col">Roll No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Standard</th>
                            <th scope="col">Mobile</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="roll_no"
                                value={formData.roll_no}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="standard"
                                value={formData.standard}
                                onChange={handleInputChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="mobile"
                                value={formData.mobile}
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
                        studAdd();
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
                      Delete Student
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
                            <th scope="col">Roll No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Stadard</th>
                            <th scope="col">Mobile No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudents.map((student, index) => (
                            <tr key={student._id}>
                              <th>
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  value={student._id}
                                  onChange={handleCheckboxChange}
                                />
                              </th>
                              <th scope="row">
                                {indexOfFirstStudent + index + 1}
                              </th>
                              <td>{student.roll_no}</td>
                              <td>{student.name}</td>
                              <td>{student.standard}</td>
                              <td>{student.mobile}</td>
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
                        studDelete();
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
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Select</th>
                            <th>Sr.No</th>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Standard</th>
                            <th>Mobile No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudents.map((student, index) => (
                            <tr key={student._id}>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleEditClick(student)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editStudentModal"
                                >
                                  Edit
                                </button>
                              </td>
                              <td>{indexOfFirstStudent + index + 1}</td>
                              <td>{student.roll_no}</td>
                              <td>{student.name}</td>
                              <td>{student.standard}</td>
                              <td>{student.mobile}</td>
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
                            <th scope="col">Roll No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Standard</th>
                            <th scope="col">Mobile</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editStudent?.roll_no || ""}
                                onChange={(e) =>
                                  setEditStudent({
                                    ...editStudent,
                                    roll_no: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editStudent?.name || ""}
                                onChange={(e) =>
                                  setEditStudent({
                                    ...editStudent,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editStudent?.standard || ""}
                                onChange={(e) =>
                                  setEditStudent({
                                    ...editStudent,
                                    standard: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={editStudent?.mobile || ""}
                                onChange={(e) =>
                                  setEditStudent({
                                    ...editStudent,
                                    mobile: e.target.value,
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
                        handleUpdateStudent();
                        studUpdate();
                      }} // your custom function
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-6 text-center">
            {["All", "1", "2", "3", "4"].map((std) => (
              <button
                key={std}
                className={`btn m-1 ${
                  selectedStandard === std ? "btn-dark" : "btn-secondary"
                }`}
                onClick={() => setSelectedStandard(std)}
              >
                {std}
              </button>
            ))}
          </div>
          <div className="col col-md-3 text-center">
            <form
              className="d-flex m-1"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="form-control me-2 border-dark"
                type="search"
                placeholder="Search Student"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-dark" type="submit">
                Search
              </button>
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
                  <th scope="row">{indexOfFirstStudent + index + 1}</th>
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
              Count: {filteredStudents.length}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Students;
