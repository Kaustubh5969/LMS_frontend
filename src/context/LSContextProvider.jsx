import React, { useState } from "react";
import LSContext from "./LSContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LSContextProvider = ({ children }) => {
  const notify = () => toast.success("Login successful!");
  const invalid = () => toast.error("Invalid credentials!");
  const registerS = () =>
    toast.success("Registration Successfully Completed. Kindly Login Here.");
  const registerE = () => toast.error("Registration failed!");
  const [ls, setLs] = useState(false);

  const studAdd = () => toast.success("Student Add successfully!");
  const studDelete = () => toast.error("Student Delete successfully!");
  const studUpdate = () => toast.success("Student Update successfully!");

  const bookAdd = () => toast.success("Book Add successfully!");
  const bookDelete = () => toast.error("Book Delete successfully!");
  const bookUpdate = () => toast.success("Book Update successfully!");

  return (
    <LSContext.Provider
      value={{
        notify,
        bookAdd,
        bookDelete,
        bookUpdate,
        ToastContainer,
        ls,
        setLs,
        invalid,
        registerS,
        registerE,
        studAdd,
        studDelete,
        studUpdate,
      }}
    >
      {children}
    </LSContext.Provider>
  );
};

export default LSContextProvider;
