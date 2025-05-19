import React, { useState, useContext } from "react";
import axios from "axios";
import LSContext from "../context/LSContext";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLs, ToastContainer, invalid, registerS, registerE } =
    useContext(LSContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(token);
      setLs(true);
    } catch (err) {
      invalid();
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitR = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/user/signup",
        formData
      );
      registerS();
      setFormData({ name: "", mobile: "", email: "", password: "" });
    } catch (err) {
      registerE();
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div
        className="container pt-5"
        style={{
          backgroundImage: "url('/IMG/HomeBG.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          minWidth: "100%",
        }}
      >
        <div className="row row-cols-1 row-cols-md-3 mt-5">
          <div className="col col-md-3"></div>
          <div className="col col-md-6">
            <div className="p-5 rounded shadow bg-light">
              <h1 className="text-center">LOGIN</h1>
              <hr />
              <form onSubmit={handleSubmit}>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="exampleInputEmail1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    class="form-control"
                    id="exampleInputPassword1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="row mb-3 row-cols-1 row-cols-md-3">
                  <div className="col col-md-4"></div>
                  <div className="col col-md-4"></div>
                  <div className="col col-md-4 text-end">
                    <input
                      class="form-check-input mt-0"
                      type="checkbox"
                      value="Show Password"
                      onChange={togglePassword}
                      aria-label="Checkbox for following text input"
                    />{" "}
                    Show Password
                  </div>
                </div>
                <div className="row mb-3 row-cols-1 row-cols-md-3">
                  <div className="col col-md-1"></div>
                  <div className="col col-md-10">
                    <button type="submit" class="btn btn-success w-100">
                      LOGIN
                    </button>
                  </div>
                  <div className="col col-md-1"></div>
                </div>
              </form>
              <div className="row row-cols-1 row-cols-md-3">
                <div className="col col-md-2"></div>
                <div className="col col-md-8 text-center">
                  <p
                    className="text-decoration-none"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    role="button"
                  >
                    New User? Register here
                  </p>
                  <div
                    class="modal fade"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="staticBackdropLabel">
                            New User Registration
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body">
                          <div className="mb-3 text-start">
                            <label for="exampleInputEmail1" class="form-label">
                              Name
                            </label>
                            <input
                              className="form-control mb-3"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="mb-3 text-start">
                            <label for="exampleInputEmail1" class="form-label">
                              Mobile No
                            </label>
                            <input
                              className="form-control mb-3"
                              type="tel"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div class="mb-3 text-start">
                            <label for="exampleInputEmail1" class="form-label">
                              Email address
                            </label>
                            <input
                              className="form-control mb-3"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="mb-3 text-start">
                            <label for="exampleInputEmail1" class="form-label">
                              Password
                            </label>
                            <input
                              className="form-control mb-4"
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
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
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmitR}
                            data-bs-dismiss="modal"
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-md-2"></div>
              </div>
              <div className="row row-cols-1 row-cols-md-3">
                <div className="col col-md-4"></div>
                <div className="col col-md-4">
                  <p
                    className="text-decoration-none text-center"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop5"
                    role="button"
                  >
                    Forget Password?
                  </p>

                  <div
                    class="modal fade"
                    id="staticBackdrop5"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="staticBackdropLabel5"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1
                            class="modal-title fs-5"
                            id="staticBackdropLabel5"
                          >
                            Reset Password
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body">
                          <input type="email" placeholder="Email" />
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
                            class="btn btn-primary"
                            data-bs-dismiss="modal"
                          >
                            Send Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-md-4"></div>
              </div>
            </div>
          </div>
          <div className="col col-md-3"></div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Login;
