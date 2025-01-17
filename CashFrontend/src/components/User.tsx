import { components } from "../lib/api/v1";

type User = components["schemas"]["User"];

const User = ({id, name }: User) => {
    return (
      <div>
        <h2>{id} {name}</h2>
      </div>
    );
  };
  
  export default User;
