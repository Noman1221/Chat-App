
function rightSidebar({ selectUser }) {
    console.log("dekh bhai", selectUser);

    return (
        <div>
            <p>{selectUser?.fullname}</p>
            <p>{selectUser?.email}</p>
            <p>{selectUser?.bio}</p>

        </div>
    )
}

export default rightSidebar