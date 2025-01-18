import { Link } from "@tanstack/react-router";
import { components } from "../lib/api/v1";

type User = components["schemas"]["User"];

const User = ({ id, name }: User) => {
  return (
    <div>
      <Link to="/user/$id"
            params={{
              id: `${id}`}}>
        {name}
      </Link>
    </div>
  );
};

export default User;
