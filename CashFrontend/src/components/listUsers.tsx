import { userListFetch } from "../utils/fetchUsers"
import User from "./user"

const UserList = () => {
    console.log(userListFetch);
  return (
    <>
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 min-h-screen bg-cover bg-no-repeat bg-center">
      <div className="card bg-neutral text-neutral-content w-96">
      {userListFetch.data?.map(userObject => <User key={userObject.id} id={userObject.id} name={userObject.name} balance={userObject.balance}/>)}
      </div>
    </div>
    </>
  )
}

export default UserList