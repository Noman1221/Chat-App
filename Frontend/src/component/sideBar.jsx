/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import { authContext } from "../context/authContext";

function SideBar({ selectUser, setSelectUser }) {
    const { getUsersForSidebar } = useContext(authContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getAllUser = async () => {
            try {
                let data = await getUsersForSidebar();


                if (data) {
                    setUsers(data); // ✅ save users
                }
            } catch (error) {
                console.log(error);
            }
        };
        getAllUser();
    }, [getUsersForSidebar]);

    return (
        <div className="p-2 h-full overflow-y-auto bg-gray-100 border-r border-gray-300">
            <h2 className="font-bold mb-3 text-gray-700">Chats</h2>

            <ul>
                {users.map((u) => (
                    <li
                        key={u._id}
                        onClick={() => {
                            setSelectUser(u);
                        }}
                        className={`p-3 cursor-pointer rounded-lg transition ${selectUser?._id === u._id
                            ? "bg-green-500 text-white"
                            : "text-gray-800 hover:bg-green-100"
                            }`}
                    >
                        {u.fullname}
                    </li>

                ))}
            </ul>
        </div>
    );
}

export default SideBar;
