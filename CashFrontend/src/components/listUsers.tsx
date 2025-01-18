import { userListFetch } from "../utils/fetchUsers"
import User from "./user"

const UserList = () => {
    console.log(userListFetch);
  return (
    <>
    <div className="flex flex-col gap-4">
      {userListFetch.data?.map(userObject => <User key={userObject.id} id={userObject.id} name={userObject.name} />)}
    </div>
    </>
  )
}

export default UserList