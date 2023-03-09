import { useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { BsPencil } from "react-icons/bs";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { FiMail, FiLock, FiUnlock } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";

import { ChatState } from "../context/ChatProvider";
import {
    renameUserRoute,
    emailUpdateRoute,
    profilePicUpdateRoute,
    passwordUpdateRoute
} from "../utils/APIRoutes";

function UpdateProfile({ fetchAgain, setFetchAgain, setModalActive }) {
    const { user, setUser } = ChatState();

    //show inputs
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showUsernameInput, setShowUsernameInput] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    //new values 
    const [newUsername, setNewUsername] = useState();
    const [newEmail, setNewEmail] = useState();
    const [newProfilePic, setNewProfilePic] = useState("");
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPasswordConfirm, setNewPasswordConfirm] = useState();

    //show password
    const [showOld, setShowOld] = useState(false);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const [isActive, setIsActive] = useState('not-active');

    //styles for error notification
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleRename = async () => {
        setShowUsernameInput(false);
        if (!newUsername) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${renameUserRoute}`,
                {
                    userId: user._id,
                    newUsername: newUsername,
                },
                config
            );

            setUser(data.updatedUser)
            //setting the user into localstorage
            if (data.status === true) {
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(data.updatedUser)
                );
            }
            toast.success('your username was changed successfully', toastOptions);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
        setNewUsername("");
    };

    const handleEmail = async () => {
        setShowEmailInput(false);
        if (!newEmail) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${emailUpdateRoute}`,
                {
                    userId: user._id,
                    newEmail: newEmail,
                },
                config
            );

            setUser(data.updatedUser)
            //setting the user into localstorage
            if (data.status === true) {
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(data.updatedUser)
                );
            }
            toast.success('your email was changed successfully', toastOptions);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
        setNewEmail("");
        setShowEmailInput(false);
    };

    const imageUpload = async (event) => {
        event.preventDefault();

        const profilePic = event.target.files[0];
        const formData = new FormData();
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        try {
            formData.append("userId", user._id);
            if (profilePic) {
                formData.append("profilePic", profilePic, profilePic.name);
            };
            const { data } = await axios.put(
                `${profilePicUpdateRoute}`, formData,
                config
            );

            setUser(data.updatedUser);

            //setting the user into localstorage
            if (data.status === true) {
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(data.updatedUser)
                );
            }
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error('something went wrong', toastOptions);
        }
        setNewProfilePic("");
    };

    const handlePassword = async () => {
        setShowPasswordInput(false);
        if (!newPassword || !oldPassword) return;
        if (newPassword !== newPasswordConfirm) {
            //throwing an error
            toast.error(
                "Password and confirm password should be same.",
                toastOptions
            );
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${passwordUpdateRoute}`,
                {
                    userId: user._id,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                },
                config
            );
            if (data.status === true) {
                toast.success('your password was changed successfully', toastOptions);
            } else {
                toast.error('response.data.message', toastOptions);
            }
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
    };

    return (
        <>
            <div className="modal-wrapper user-update">
                <div className="modal-container">
                    <div className='close-button-wrapper'>
                        <button className='close-button' onClick={() => { setModalActive('not') }}>
                            <GrFormClose />
                        </button>
                    </div>
                    <div className='modal-header'>
                        <div className="avatar">
                            <label>
                                <input
                                    type="file"
                                    name="profilePic"
                                    accept="image/*"
                                    className={`${isActive === 'active' ? 'active' : ''}`}
                                    onChange={(event) => imageUpload(event)}
                                />
                                <img src={process.env.REACT_APP_PROFILE_PICS_PATHS + user.profilePic}
                                    alt={user.username}
                                />
                                <div className="hover-text">Update profile picture</div>
                            </label>
                        </div>
                    </div>
                    <div className="modal-content">
                        <div className="inputs">
                            <div className='modal-input'>
                                {showUsernameInput
                                    ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder={user.username}
                                                value={newUsername}
                                                onChange={(e) => setNewUsername(e.target.value)}
                                            />
                                            <BsPencil />
                                            <button className="button-submit" onClick={handleRename}>Save</button>
                                        </>
                                    )
                                    : (
                                        <>
                                            <span>{user.username}</span>
                                            <button className="button-submit" onClick={() => setShowUsernameInput(true)}>Update</button>
                                        </>
                                    )}

                            </div>
                            <div className="modal-input">

                                {showEmailInput
                                    ? (
                                        <>
                                            <input
                                                type="email"
                                                placeholder={user.email}
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                            />
                                            <FiMail />
                                            <button className="button-submit" onClick={handleEmail}>Save</button>
                                        </>
                                    )
                                    : (
                                        <>
                                            <span>{user.email}</span>
                                            <button className="button-submit" onClick={() => setShowEmailInput(true)}>Update</button>
                                        </>
                                    )
                                }
                            </div>
                            {showPasswordInput
                                ? (
                                    <>
                                        <div className="modal-input">
                                            <input
                                                type={`${showOld ? "text" : "password"}`}
                                                placeholder="Old password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                            />
                                            <FiUnlock />
                                            <RxEyeOpen
                                                className={`${showOld ? "password-icon" : "none"}`}
                                                onClick={() => { setShowOld(false) }}
                                            />
                                            <RxEyeClosed
                                                className={`${!showOld ? "password-icon" : "none"}`}
                                                onClick={() => { setShowOld(true) }}
                                            />
                                        </div>
                                        <div className="modal-input">
                                            <input
                                                type={`${show ? "text" : "password"}`}
                                                placeholder="New password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <FiUnlock />
                                            <RxEyeOpen
                                                className={`${show ? "password-icon" : "none"}`}
                                                onClick={() => { setShow(false) }}
                                            />
                                            <RxEyeClosed
                                                className={`${!show ? "password-icon" : "none"}`}
                                                onClick={() => { setShow(true) }}
                                            />
                                        </div>
                                        <div className="modal-input">
                                            <input
                                                type={`${showConfirm ? "text" : "password"}`}
                                                placeholder="Confirm new password"
                                                name="confirmPassword"
                                                value={newPasswordConfirm}
                                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                            />
                                            <FiLock />
                                            <RxEyeOpen
                                                className={`${showConfirm ? "password-icon" : "none"}`}
                                                onClick={() => { setShowConfirm(false) }}
                                            />
                                            <RxEyeClosed
                                                className={`${showConfirm ? "none" : "password-icon"}`}
                                                onClick={() => { setShowConfirm(true) }}
                                            />
                                            <button className="button-submit" onClick={handlePassword}>Save</button>
                                        </div>
                                    </>
                                )
                                : (
                                    <div className="modal-input">
                                        <span>********</span>
                                        <button className="button-submit" onClick={() => setShowPasswordInput(true)}>Update</button>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default UpdateProfile;