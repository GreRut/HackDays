import { userListFetch } from "../utils/fetchUsers"
import User from "./User"

const UserList = () => {
    console.log(userListFetch);
  return (
    <>
    <div className="flex flex-col gap-4">
      {userListFetch.data?.map(userObject => <User key={userObject.id} id={userObject.id} name={userObject.name} balance={userObject.balance}/>)}
    </div>
    </>
  )
}

export default UserList