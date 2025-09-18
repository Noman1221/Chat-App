/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import { authContext } from "../context/authContext";
function SideBar({ selectUser, setSelectUser }) {
    const { getUsersForSidebar, user } = useContext(authContext);
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
    }, [getUsersForSidebar, user]);

    return (
        <div className="p-2 h-full overflow-y-auto bg-gray-100 border-r border-gray-300">
            <h2 className="font-bold mb-3 text-gray-700">Chats</h2>
            <div>
                <Link to={"/register"} className="font-bold mb-3 text-gray-700">Sigin</Link>
            </div>


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
                        {u.profilePicture ? <img src={u.profilePicture} alt="image is found" style={{ width: "20px", height: "20px" }} /> : <img src={img1} style={{ width: "20px", height: "20px" }} />}

                    </li>

                ))}
            </ul>
        </div>
    );
}

export default SideBar;
