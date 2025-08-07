import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import LSContext from "../context/LSContext";
import StudentContext from "../context/StudentContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const { fetchStudents, indexOfFirstStudent, students, topstudents } =
    useContext(StudentContext);

  const [books, setBooks] = useState([]);

  const { ToastContainer, notify, ls, setLs } = useContext(LSContext);

  useEffect(() => {
    fetchBooks();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (ls == true) {
      notify();
      setLs(false);
    }
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book/allBooks"); // GET route
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching Book:", err);
    }
  };

  const totalBCount = books.reduce((sum, book) => sum + book.copies, 0);
  const totalSCount = students.length;

  const data = {
    labels: ["History", "Biography", "Mystery", "Drama", "Poetry"],
    datasets: [
      {
        label: "Reading Count",
        data: [30, 40, 20, 10, 50],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Category wise books Data",
      },
    },
  };

  return (
    <>
      <div className="container-fluid mt-5">
        <div className="row row-cols-1 row-cols-md-2 pt-4 g-1">
          <div className="col col-md-6 p-1">
            <div className="p-1 rounded shadow border bg-light">
              <div className="text-center">
                <h3>TOP READER</h3>
              </div>
              <hr />
              <div className="d-flex align-items-end justify-content-center">
                <div className="w-100">
                  <div
                    class="card m-1 border-secondary"
                    style={{ backgroundColor: "rgba(229, 232, 232)" }}
                  >
                    {topstudents[1] && (
                      <div
                        class="card-body d-flex p-2 justify-content-between gap-2"
                        key={topstudents[1]._id}
                      >
                        <div className="bg-light rounded">
                          <h2 className="text-start fw-bold px-3 py-2 ">
                            {topstudents[1].status}
                          </h2>
                        </div>
                        <div className="w-100 bg-light rounded d-flex">
                          <h5 class="card-title p-2 align-self-center">
                            {topstudents[1].name}
                          </h5>
                        </div>
                      </div>
                    )}
                    <div
                      className="card-footer"
                      style={{ backgroundColor: "rgba(229, 232, 232)" }}
                    >
                      <img
                        src="/IMG/22.png"
                        className="img-fluid card-img-bottom mx-auto d-block rounded-circle"
                        alt="..."
                        style={{ width: "110px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <div
                    class="card m-1 border-warning"
                    style={{ backgroundColor: "rgba(252, 243, 207)" }}
                  >
                    {topstudents[1] && (
                      <div class="card-body d-flex p-2 justify-content-between gap-2">
                        <div className="bg-light rounded">
                          <h2 className="text-start fw-bold px-3 py-2">
                            {topstudents[0].status}
                          </h2>
                        </div>
                        <div className="w-100 bg-light rounded d-flex">
                          <h5 class="card-title text-center p-2  align-self-center">
                            {topstudents[0].name}
                          </h5>
                        </div>
                      </div>
                    )}
                    <div
                      className="card-footer"
                      style={{ backgroundColor: "rgba(252, 243, 207)" }}
                    >
                      <img
                        src="/IMG/11.png"
                        className="img-fluid card-img-bottom mx-auto d-block rounded-circle"
                        alt="..."
                        style={{ width: "130px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <div
                    class="card m-1 border-danger"
                    style={{ backgroundColor: "rgba(250, 219, 216)" }}
                  >
                    {topstudents[2] && (
                      <div class="card-body d-flex p-2 justify-content-between gap-2">
                        <div className="bg-light rounded">
                          <h2 className="text-start fw-bold px-3 py-2">
                            {topstudents[2].status}
                          </h2>
                        </div>
                        <div className="w-100 bg-light rounded d-flex">
                          <h5 class="card-title text-center p-2  align-self-center">
                            {topstudents[2].name}
                          </h5>
                        </div>
                      </div>
                    )}
                    <div
                      className="card-footer"
                      style={{ backgroundColor: "rgba(250, 219, 216)" }}
                    >
                      <img
                        src="/IMG/33.png"
                        className="img-fluid card-img-bottom mx-auto d-block rounded-circle"
                        alt="..."
                        style={{ width: "90px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-6 p-1">
            <div className="p-1 rounded shadow border bg-light w-100 h-100">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 pt-2 g-1">
          <div className="col col-md-7 p-1">
            <div className="p-1 rounded shadow border bg-light">
              <div className="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Sr.No</th>
                      <th scope="col">Name</th>
                      <th scope="col">Roll No</th>
                      <th scope="col">Standard</th>
                      <th scope="col">Read Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topstudents.map((student, index) => (
                      <tr key={student._id}>
                        <th scope="row">{indexOfFirstStudent + index + 1}</th>
                        <td>{student.name}</td>
                        <td>{student.roll_no}</td>
                        <td>{student.standard}</td>
                        <td>{student.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col col-md-2 p-1">
            <div className="p-1 rounded shadow border my-1 bg-light">
              <div className="text-center">
                <h3>QUICK INFO</h3>
              </div>
              <hr />
              <div className="d-flex flex-column">
                <div
                  className="m-1 d-flex rounded p-2 gap-2 justify-content-between border border-primary"
                  style={{ backgroundColor: "rgb(174, 214, 241)" }}
                >
                  <div className="bg-light rounded">
                    <h5 className="p-2 fw-bold">{totalBCount}</h5>
                  </div>
                  <div className="bg-light w-100 rounded d-flex">
                    <h5 className="p-2 align-self-center">Total Books</h5>
                  </div>
                </div>

                <div
                  className="m-1 d-flex rounded p-2 gap-2 justify-content-between border border-primary"
                  style={{ backgroundColor: "rgb(174, 214, 241)" }}
                >
                  <div className="bg-light rounded">
                    <h5 className="p-2 fw-bold">{totalSCount}</h5>
                  </div>
                  <div className="bg-light w-100 rounded d-flex">
                    <h5 className="p-2 align-self-center">Total Books</h5>
                  </div>
                </div>

                <div
                  className="m-1 d-flex rounded p-2 gap-2 justify-content-between border border-primary"
                  style={{ backgroundColor: "rgb(174, 214, 241)" }}
                >
                  <div className="bg-light rounded">
                    <h5 className="p-2 fw-bold">{totalSCount}</h5>
                  </div>
                  <div className="bg-light w-100 rounded d-flex">
                    <h5 className="p-2 align-self-center">Total Reading</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-3 p-1">
            <div className="p-1 rounded shadow border my-1 bg-light">
              <div className="text-center">
                <h3>QUICK LINKS</h3>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <div className="m-1 d-flex w-100">
                  <p className="p-1 bg-success text-light text-center fs-5 fw-bold rounded-start"></p>
                  <p className="fs-5 py-3 px-2 text-start text-success border border-success fw-bold rounded-end w-100">
                    Add Book
                  </p>
                </div>
                <div className="m-1 d-flex w-100">
                  <p className="p-1 bg-danger text-light text-center fs-5 fw-bold rounded-start"></p>
                  <p className="fs-5 py-3 px-2 text-start text-danger border border-danger fw-bold rounded-end w-100">
                    Delete Book
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="m-1 d-flex w-100">
                  <p className="p-1 bg-success text-light text-center fs-5 fw-bold rounded-start"></p>
                  <p className="fs-5 py-3 px-2 text-start text-success border border-success fw-bold rounded-end w-100">
                    Add Student
                  </p>
                </div>
                <div className="m-1 d-flex w-100">
                  <p className="p-1 bg-danger text-light text-center fs-5 fw-bold rounded-start"></p>
                  <p className="fs-5 py-3 px-2 text-start text-danger border border-danger fw-bold rounded-end w-100">
                    Delete Student
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="m-1 d-flex w-100">
                  <p className="p-1 bg-success text-light text-center fs-5 fw-bold rounded-start"></p>
                  <p className="fs-5 py-3 px-2 text-start text-success border border-success fw-bold rounded-end w-100">
                    Borrow Book
                  </p>
                </div>
                <div className="m-1 d-flex w-100">
                  <p className="p-1 bg-danger text-light text-center fs-5 fw-bold rounded-start"></p>
                  <p className="fs-5 py-3 px-2 text-start text-danger border border-danger fw-bold rounded-end w-100">
                    Return Book
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Home;
