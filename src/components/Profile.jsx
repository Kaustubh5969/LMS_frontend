import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [users, setUsers] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    const userData = localStorage.getItem("user");
    setUser(JSON.parse(userData));
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/user/allUsers", {
        headers: {
          Authorization: token,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching Users:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`http://localhost:5000/user/${user.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Account deleted successfully");
        localStorage.removeItem("user");
        // Optionally redirect to home or login
        window.location.href = "/login";
      } else {
        const errorData = await res.json();
        alert("Error deleting account: " + errorData?.error || res.statusText);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    age: "",
    gender: "",
    proimg: "",
  });

  const handleUpdateProfile = async () => {
    try {
      const _id = user?.id;

      const formData = new FormData();
      for (const key in editProfile) {
        formData.append(key, editProfile[key]);
      }

      const response = await axios.put(
        `http://localhost:5000/user/${_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      alert("Please enter a new password");
      return;
    }

    try {
      const _id = user?.id;
      const response = await axios.put(`http://localhost:5000/user/${_id}`, {
        password: newPassword,
      });

      if (response.status === 200) {
        console.log("Password updated successfully");
        fetchUsers();
        setNewPassword(""); // Clear password field after update
      }
    } catch (error) {
      console.error("Error updating password", error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const activeUser = users.find((u) => `${u._id}` === `${user?.id}`);
  useEffect(() => {
    if (activeUser) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
      };

      setEditProfile({
        name: activeUser.name || "",
        email: activeUser.email || "",
        mobile: activeUser.mobile || "",
        dob: formatDate(activeUser.dob),
        age: activeUser.age || "",
        gender: activeUser.gender || "",
        proimg: activeUser.proimg || "",
      });
    }
  }, [activeUser]);

  const inactiveUsers = users.filter((u) => {
    const inactive = `${u?.email}` !== activeUser.email;
    return inactive;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProfile((prev) => ({
        ...prev,
        proimg: file,
      }));
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row pt-5 row-cols-1 row-cols-md-3">
          <div className="col col-md-6">
            {activeUser?.proimg && (
              <div className="text-center">
                <img
                  src={`http://localhost:5000/IMG/${activeUser.proimg}`}
                  className="img-thumbnail"
                  alt="Profile"
                  style={{
                    // width: "100%",
                    height: "350px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
          <div className="col col-md-6">
            <div className="">
              {activeUser ? (
                <div className="">
                  <p className="lh-lg">
                    <span className="fw-bold">Name : </span>
                    {activeUser.name}
                  </p>
                  <p className="lh-lg">
                    <span className="fw-bold">Email : </span>
                    {activeUser.email}
                  </p>
                  <p className="lh-lg">
                    <span className="fw-bold">Mobile No : </span>
                    {activeUser.mobile}
                  </p>
                  <p className="lh-lg">
                    <span className="fw-bold">DOB : </span>
                    {activeUser.dob
                      ? new Date(activeUser.dob).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </p>

                  <p className="lh-lg">
                    <span className="fw-bold">Age : </span>
                    {activeUser.age}
                  </p>
                  <p className="lh-lg">
                    <span className="fw-bold">Gender : </span>
                    {activeUser.gender}
                  </p>
                </div>
              ) : (
                <p>Loading user data...</p>
              )}

              <div className="">
                <button
                  type="button"
                  class="btn btn-primary m-1"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  Edit Profile
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
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">
                          Edit Profile
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        {["name", "email", "mobile", "dob", "age"].map(
                          (field) => (
                            <div className="mb-3" key={field}>
                              <label className="form-label text-capitalize">
                                {field}
                              </label>
                              <input
                                type={field === "dob" ? "date" : "text"}
                                className="form-control"
                                value={editProfile[field]}
                                onChange={(e) =>
                                  setEditProfile({
                                    ...editProfile,
                                    [field]: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )
                        )}
                        <div className="mb-3">
                          <label className="form-label">Gender</label>
                          <select
                            className="form-select"
                            value={editProfile.gender}
                            onChange={(e) =>
                              setEditProfile({
                                ...editProfile,
                                gender: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="proimg" className="form-label">
                            Profile Image
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="proimg"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e)}
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
                          type="button"
                          class="btn btn-success"
                          onClick={handleUpdateProfile}
                          data-bs-dismiss="modal"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop1"
                >
                  Delete Profile
                </button>

                <div
                  class="modal fade"
                  id="staticBackdrop1"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabindex="-1"
                  aria-labelledby="staticBackdropLabel1"
                  aria-hidden="true"
                >
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel1">
                          Delete Account
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <h5>
                          Are you sure you want to{" "}
                          <span className="text-danger">delete</span> your
                          account?
                        </h5>
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
                          class="btn btn-danger"
                          onClick={handleDeleteAccount}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary m-1"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop2"
                >
                  Change Password
                </button>
                <div
                  class="modal fade"
                  id="staticBackdrop2"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  tabindex="-1"
                  aria-labelledby="staticBackdropLabel2"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel2">
                          Update Password
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
                            New Password :
                          </label>
                          <input
                            className="form-control mb-3"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="mb-3 text-end">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value="Show Password"
                            onChange={togglePassword}
                            aria-label="Checkbox for following text input"
                          />{" "}
                          <label for="exampleInputEmail1" class="form-label">
                            Show password
                          </label>
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
                          className="btn btn-success"
                          onClick={handleUpdatePassword}
                          data-bs-dismiss="modal"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <hr />
        <h2>All Teacher's</h2>
        <div className="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Sr No</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {inactiveUsers.map((user, index) => (
                <tr key={user._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Profile;
