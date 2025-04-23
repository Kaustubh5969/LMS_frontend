import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchStudents();
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
      console.error("Error fetching Student:", err);
    }
  };

  const totalBCount = books.reduce((sum, book) => sum + book.copies, 0);
  const totalSCount = students.length;

  return (
    <>
      <div className="container-fluid mt-5">
        <div className="row row-cols-1 row-cols-md-2 pt-4 g-3">
          <div className="col col-md-8 p-3">
            <div className="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Sr.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Roll No</th>
                    <th scope="col">Standard</th>
                    <th scope="col">Books</th>
                    <th scope="col">Read Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@fat</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>Jacob</td>
                    <td>Jacob</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@fat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col col-md-4 p-3">
            <div className="d-flex">
              <div className="m-1 d-flex flex-sm-row">
                <p className="p-3 bg-dark text-light text-center fs-5 fw-bold">
                  {totalBCount}
                </p>
                <p className="fs-5 p-3 text-center border border-dark fw-bold">
                  Total Books
                </p>
              </div>
              <div className="m-1 d-flex">
                <p className="p-3 bg-dark text-light text-center fs-5 fw-bold">
                  {totalSCount}
                </p>
                <p className="fs-5 p-3 text-center border border-dark fw-bold">
                  Total Students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
