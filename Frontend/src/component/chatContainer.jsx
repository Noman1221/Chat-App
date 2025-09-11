/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect } from "react";
import { authContext } from "../context/authContext";
function chatContainer({ selectUser, messages, setMessages }) {
    const { getMessages } = useContext(authContext);


    useEffect(() => {
        const getAllMesaages = async () => {
            if (!selectUser?._id) return;
            try {

                let message = await getMessages(selectUser._id);
                console.log("we are not getting:", message);

                setMessages((prev) => ([...prev, messages]))
            } catch (error) {
                console.log(error);
            }
        }
        getAllMesaages();
    }, [getMessages]);
    return (
        <div>chatContainer</div>
    )
}

export default chatContainer