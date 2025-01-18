// import { NavLink } from "react-router-dom";
import { Link } from "@tanstack/react-router";
import { components } from "../lib/api/v1";

type User = components["schemas"]["User"];

const User = ({ id, name }: User) => {
  return (
    <div>
      {/* <NavLink to={`/user/${id}`}><p>{name}</p></NavLink> */}

      <div className="card bg-primary text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <div className="card-actions justify-end">
            <Link
              to="/user/$id"
              params={{
                id: `${id}`,
              }}
              className={`btn
                hover:bg-terc
                hover:border-terc rounded-lg
                border-sec no-underline w-20 h-10`}
            >
                Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
