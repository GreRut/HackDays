import { createFileRoute, useRouter } from "@tanstack/react-router";
import UserList from "../components/listUsers";
import { userListFetch } from "../utils/fetchUsers";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    const response = await userListFetch();
    return response.data;
  },
});

function RouteComponent() {
  const users = Route.useLoaderData();

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center flex flex-col items-center pt-10"
      style={{ backgroundImage: "url(./Abstract3DBackground.jpg)" }}
    >
      <UserList users={users} />
      <button className="btn bg-prim w-96 text-xl font-bold">
        Add User
      </button>
    </div>
  );
}
