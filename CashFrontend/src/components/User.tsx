import { Link } from "@tanstack/react-router";
import { components } from "../lib/api/v1";

type User = components["schemas"]["User"];

const User = ({ id, name}: User) => {
  return (
    <div className="flex justify-center items-center">
      <Link
        to="/user/$id"
        params={{
          id: `${id}`,
        }}
        className="p-2 flex gap-2 h-14 text-center text-3xl font-bold"
      >
        {name}
      </Link>
    </div>
  );
};

export default User;
