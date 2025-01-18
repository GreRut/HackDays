// import { NavLink } from "react-router-dom";
import { Link } from "@tanstack/react-router";
import { components } from "../lib/api/v1";

type User = components["schemas"]["User"];

const User = ({ id, name, balance }: User) => {
  return (
    <div>
      <Link
        to="/user/$id"
        params={{
          id: `${id}`,
        }}
        className="text-white"
      >
        {name} {balance}
      </Link>
    </div>
  );
};

export default User;
