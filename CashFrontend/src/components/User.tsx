import { Link } from "@tanstack/react-router";

type UserProps = {
  id: number;
  name: string;
  payees: unknown[];
};

const User = ({ id, name, payees }: UserProps) => {
  const hasNoPayees = payees.length == 0;

  return (
    <div className="flex justify-center items-center gap-4">
      <Link
        to="/user/$id"
        params={{ id: `${id}` }}
        className="text-3xl font-bold"
      >
        {name}
      </Link>
      <input
        type="checkbox"
        className="w-6 h-6"
        checked={hasNoPayees}
        disabled
        aria-label={`Checkbox indicating ${name} ${
          hasNoPayees ? "has no payees" : "has payees"
        }`}
      />
    </div>
  );
};

export default User;
