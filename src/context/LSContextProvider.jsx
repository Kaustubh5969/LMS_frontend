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
  return (
    <LSContext.Provider
      value={{
        notify,
        ToastContainer,
        ls,
        setLs,
        invalid,
        registerS,
        registerE,
      }}
    >
      {children}
    </LSContext.Provider>
  );
};

export default LSContextProvider;
