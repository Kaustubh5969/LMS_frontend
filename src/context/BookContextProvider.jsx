import React, { useState } from "react";
import BookContext from "./BookContext";
import axios from "axios";

const BookContextProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    auther: "",
    category: "",
    price: "",
    copies: "",
  });

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book/allBooks");
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
      await axios.post("http://localhost:5000/book/addNewBook", formData);
      fetchBooks();
      setFormData({
        title: "",
        auther: "",
        category: "",
        price: "",
        copies: "",
      });
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

  const [searchQueryB, setSearchQueryB] = useState("");

  const filteredBooksB = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQueryB.toLowerCase()) ||
      book.auther.toLowerCase().includes(searchQueryB.toLowerCase());

    return matchesSearch;
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

  const [currentPageB, setCurrentPageB] = useState(1);
  const rowsPerPageB = 10;

  // Calculate indexes
  const indexOfLastBookB = currentPageB * rowsPerPageB;
  const indexOfFirstBookB = indexOfLastBookB - rowsPerPageB;
  const currentBooksB = filteredBooksB.slice(
    indexOfFirstBookB,
    indexOfLastBookB
  );

  // Calculate total pages
  const totalPagesB = Math.ceil(filteredBooksB.length / rowsPerPageB);

  const getPageNumbersB = () => {
    const totalPageNumbersB = Math.min(pageLimit, totalPagesB);
    let startPageB = Math.max(currentPageB - Math.floor(pageLimit / 2), 1);
    let endPageB = startPageB + totalPageNumbersB - 1;

    if (endPageB > totalPagesB) {
      endPageB = totalPagesB;
      startPageB = Math.max(endPageB - totalPageNumbersB + 1, 1);
    }

    const pageNumbersB = [];
    for (let i = startPageB; i <= endPageB; i++) {
      pageNumbersB.push(i);
    }

    return pageNumbersB;
  };

  const handlePageChangeB = (pageNumberB) => {
    setCurrentPageB(pageNumberB);
  };

  const handlePreviousB = () => {
    if (currentPageB > 1) setCurrentPageB(currentPageB - 1);
  };

  const handleNextB = () => {
    if (currentPageB < totalPagesB) setCurrentPageB(currentPageB + 1);
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
    <BookContext.Provider
      value={{
        currentBooksB,
        currentPageB,
        totalPagesB,
        searchQueryB,
        setSearchQueryB,
        indexOfFirstBookB,
        handlePageChangeB,
        getPageNumbersB,
        handleNextB,
        handlePreviousB,
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
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export default BookContextProvider;
