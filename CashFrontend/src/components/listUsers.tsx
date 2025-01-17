import { userListFetch } from "../utils/fetchUsers.ts"
import User from "./User.tsx"

const UserList = () => {
    console.log(userListFetch);
  return (
    <>
      <div className="flex flex-col gap-4">
        {userListFetch.data?.map((userObject, index) =>
          userObject.id && userObject.name ? ( 
            <User key={userObject.id} id={userObject.id} name={userObject.name} />
          ) : (
            <div key={index}>Invalid User Data</div>
          )
        )}
      </div>
    </>
  )
}

export default UserList