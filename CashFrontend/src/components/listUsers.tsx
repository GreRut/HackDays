import User from "./user";
import { Link } from "@tanstack/react-router";

type UserListProps = {
  users: {
    id: number;
    name: string;
    payees: unknown[];
  }[];
};

const UserList = ({ users }: UserListProps) => {
  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(../../Abstract3DBackground.jpg)" }}
    >
      <div className="p-5 flex justify-center items-center h-30">
        <Link
          to="/"
          className="btn hover:bg-terc hover:border-terc rounded-lg border-sec
          no-underline w-[22rem] h-[10rem] bg-sec text-prim text-center text-4xl
          font-bold flex justify-center items-center"
        >
          Group
        </Link>
      </div>

      <div className="flex justify-center pt-20">
        <div className="card bg-neutral text-neutral-content w-96 space-y-5 py-10">
          {users.map((user) => (
            <User
              key={user.id}
              id={user.id}
              name={user.name}
              payees={user.payees}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
