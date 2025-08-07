import React, { useState } from "react";
import StudentContext from "./StudentContext";
import axios from "axios";
import Students from "../components/Students";

const StudentContextProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [topstudents, setTopStudents] = useState([]);

  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    standard: "",
    mobile: "",
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/student/allStudents"); // GET route
      setStudents(res.data);

      const sortedStudents = await res.data.sort((a, b) => b.status - a.status);
      const topFiveStudents = sortedStudents.slice(0, 3);
      setTopStudents(topFiveStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/student/addNewStudent", formData); // your POST route
      fetchStudents();
      setFormData({
        roll_no: "",
        name: "",
        standard: "",
        mobile: "",
      }); // Reset form
      // alert("Student Added successfully");
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("All");

  const filteredStudents = students.filter((student) => {
    const matchesStandard =
      selectedStandard === "All" ||
      `${student.standard}` === selectedStandard ||
      `${student.standard}` === selectedStandard;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.mobile.toString().includes(searchQuery);

    return matchesStandard && matchesSearch;
  });

  const [searchQueryS, setSearchQueryS] = useState("");

  const filteredStudentsS = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQueryS.toLowerCase()) ||
      student.mobile.toString().includes(searchQueryS);

    return matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  // Calculate indexes
  const indexOfLastStudent = currentPage * rowsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

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

  const [currentPageS, setCurrentPageS] = useState(1);
  const rowsPerPageS = 10;
  // Calculate indexes
  const indexOfLastStudentS = currentPageS * rowsPerPageS;
  const indexOfFirstStudentS = indexOfLastStudentS - rowsPerPageS;
  const currentStudentsS = filteredStudentsS.slice(
    indexOfFirstStudentS,
    indexOfLastStudentS
  );

  // Calculate total pages
  const totalPagesS = Math.ceil(filteredStudentsS.length / rowsPerPageS);

  const getPageNumbersS = () => {
    const totalPageNumbersS = Math.min(pageLimit, totalPagesS);
    let startPageS = Math.max(currentPageS - Math.floor(pageLimit / 2), 1);
    let endPageS = startPageS + totalPageNumbersS - 1;

    if (endPageS > totalPagesS) {
      endPageS = totalPagesS;
      startPageS = Math.max(endPageS - totalPageNumbersS + 1, 1);
    }

    const pageNumbersS = [];
    for (let i = startPageS; i <= endPageS; i++) {
      pageNumbersS.push(i);
    }

    return pageNumbersS;
  };

  const handlePageChangeS = (pageNumberS) => {
    setCurrentPageS(pageNumberS);
  };

  const handlePreviousS = () => {
    if (currentPageS > 1) setCurrentPageS(currentPageS - 1);
  };

  const handleNextS = () => {
    if (currentPageS < totalPagesS) setCurrentPageS(currentPageS + 1);
  };

  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleCheckboxChange = (e) => {
    const id = e.target.value;
    if (e.target.checked) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/student/delete",
        {
          data: { ids: selectedStudents },
        }
      );

      if (response.status === 200) {
        // alert("Students deleted successfully");

        fetchStudents();

        setSelectedStudents([]); // Clear selected
      }
    } catch (error) {
      console.error("Error deleting students", error);
    }
  };

  const [editStudent, setEditStudent] = useState({
    _id: "",
    roll_no: "",
    name: "",
    standard: "",
    mobile: "",
    status: "",
  });

  const handleEditClick = (student) => {
    setEditStudent(student);
  };

  const handleUpdateStudent = async () => {
    try {
      const { _id, ...updateData } = editStudent;
      const response = await axios.put(
        `http://localhost:5000/student/${_id}`,
        updateData
      );

      if (response.status === 200) {
        console.log("Student updated successfully");
        fetchStudents();
      }
    } catch (error) {
      console.error("Error updating student", error);
    }
  };
  return (
    <StudentContext.Provider
      value={{
        currentStudentsS,
        handlePageChangeS,
        getPageNumbersS,
        handleNextS,
        setSearchQueryS,
        searchQueryS,
        handlePreviousS,
        totalPagesS,
        handleNext,
        indexOfFirstStudentS,
        currentPageS,
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
        students,
        topstudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContextProvider;
