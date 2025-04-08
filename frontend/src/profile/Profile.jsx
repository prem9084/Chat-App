import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./Profile.css";
const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [updateUser, setUpdateUser] = useState(false);

  const { authUser } = useAuth();

  const getUser = async (e) => {
    try {
      const { data } = await axios.get(`/api/auth/get-user/${authUser._id}`);
      setFullname(data.fullname);
      setEmail(data.email);
      setUsername(data.username);
      setGender(data.gender);
    } catch (error) {
      console.error(error);
    }
  };
  useState(() => {
    getUser();
  }, []);

  const handleClick = (e) => {
    setUpdateUser(true);
  };

  const handelUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/auth/update/${authUser._id}`, {
        fullname,
        email,
        username,
        gender,
      });
      if (data.success) {
        toast.success(data?.message);
        setUpdateUser(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="profile-form bg-gray">
          {!updateUser ? (
            <>
              <form
                action=""
                className="forms text-white border-1 rounded-1 h-100 w-50 m-auto fs-5 fw-bolder bg-gray-500 p-5"
              >
                <h3 className=" text-center mb-2">Profile</h3>
                <hr />
                <div className="d-flex justify-content-between">
                  <div>
                    <button className="bg-white rounded px-2 py-1 self-center">
                      <Link to="/">
                        <IoArrowBackSharp size={25} />
                      </Link>
                    </button>
                  </div>
                  <div className="d-flex ">
                    <button className="btn btn-primary " onClick={handleClick}>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-column gap-3 items-center w-100 ">
                  <div>
                    <label for="fullname">Full Name:</label>
                    <br />
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      className="bg-gray-400 text-black"
                      value={fullname}
                      disabled
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label for="email">Email:</label>
                    <br />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-400 text-black "
                    />
                  </div>
                  <div>
                    <label for="username">username:</label>
                    <br />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      disabled
                      className=" bg-gray-400 text-black"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Select Gender:</label>
                    <select
                      id="gender"
                      value={gender}
                      disabled
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full  border  shadow-sm  text-black"
                    >
                      <option value="">Choose...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              {" "}
              <form
                action=""
                className="text-white border-1 rounded-1 h-100 w-50 m-auto fs-5 fw-bolder bg-gray-500 p-5"
                onSubmit={handelUpdate}
              >
                <h3 className=" text-center mb-2">Profile</h3>
                <hr />

                <div className="d-flex flex-column gap-3 items-center w-100 ">
                  <div>
                    <label for="fullname">Full Name:</label>
                    <br />
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      className="bg-white text-black"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label for="email">Email:</label>
                    <br />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white text-black "
                    />
                  </div>
                  <div>
                    <label for="username">username:</label>
                    <br />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      className=" bg-white text-black"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Select Gender:</label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full  border  shadow-sm  text-black bg-white"
                    >
                      <option value="">Choose...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success text-bold">
                    Update Profile
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
