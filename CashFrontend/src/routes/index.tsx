import { createFileRoute } from "@tanstack/react-router";
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
      className="h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(./Abstract3DBackground.jpg)" }}
    >
      <UserList users={users} />
    </div>
  );
}
