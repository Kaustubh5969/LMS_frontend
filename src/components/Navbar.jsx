import React from "react";
import { Link } from 'react-router-dom';

function Navbar({ onLogout, username }) {
  return (
    <>
      <div className="">
        <nav class="navbar navbar-expand-lg bg-light navbar-light shadow fixed-top">
          <div class="container-fluid px-3">
            <Link class="navbar-brand" to="/">
              LMS
            </Link>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <h class="navbar-nav me-auto mb-2 mb-lg-0"></h>

              <ul class="navbar-nav">
                <li class="nav-item">
                  <Link class="nav-link active" aria-current="page" to="/">
                    HOME
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/books">
                    BOOKS
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/students">
                    STUDENTS
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/transactions">
                    TRANSACTIONS
                  </Link>
                </li>
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {username}
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <Link class="dropdown-item" to="/profile">
                        <i class="fa-solid fa-user"></i> PROFILE
                      </Link>
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <button className="btn" onClick={onLogout}>
                        <i class="fa-solid fa-right-from-bracket"></i> LOGOUT
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
