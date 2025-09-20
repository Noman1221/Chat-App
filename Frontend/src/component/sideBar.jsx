/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import { authContext } from "../context/authContext";

function SideBar({ selectUser, setSelectUser }) {
    const { getUsersForSidebar, user } = useContext(authContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const getAllUser = async () => {
            try {
                let data = await getUsersForSidebar();
                if (data) setUsers(data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllUser();
    }, [getUsersForSidebar, user]);

    // Filter users by search
    const filteredUsers = users.filter(u =>
        u.fullname.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full bg-gray-100 border-r border-gray-300 flex flex-col">
            {/* Sticky nav/search */}
            <div className="sticky top-0 z-30 bg-gray-100 px-4 py-3 flex items-center justify-between">
                <h2 className="font-bold text-green-600 text-xl">QuickChat</h2>
                <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <FiMoreVertical size={22} />
                </button>
                {/* Dropdown menu */}
                {showMenu && (
                    <div className="absolute right-4 top-14 bg-white shadow-lg rounded-lg py-2 w-40 z-30">
                        {!user && (
                            <Link
                                to="/register"
                                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                onClick={() => setShowMenu(false)}
                            >
                                Login
                            </Link>
                        )}
                        {user && (
                            <>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    onClick={() => setShowMenu(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/logout"
                                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                    onClick={() => setShowMenu(false)}
                                >
                                    Logout
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="fixed w-1/4 flex items-center justify-center top-[56px] z-10 bg-gray-100 px-4 py-2 ">
                <input
                    type="text"
                    placeholder="Search user"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-full border focus:outline-none focus:ring"
                />
            </div>
            {/* User list */}
            <div className="flex-1 overflow-y-auto px-2 mt-14">
                <ul>
                    {filteredUsers.map((u) => (
                        <li
                            key={u._id}
                            onClick={() => setSelectUser(u)}
                            className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition
                                ${selectUser?._id === u._id
                                    ? "bg-green-500 text-white"
                                    : "text-gray-800 hover:bg-green-100"
                                }`}
                        >
                            <img
                                src={u.profilePicture || img1}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="font-semibold">{u.fullname}</div>
                                {/* Optionally show last message/time here */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
