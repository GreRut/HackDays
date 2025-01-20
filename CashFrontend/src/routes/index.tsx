import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import UserList from "../components/listUsers";
import { userListFetch, postUser } from "../utils/fetchUsers";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    const response = await userListFetch();
    return response.data;
  },
});

function RouteComponent() {
  const users = Route.useLoaderData();
  const router = useRouter();

  const handleAddUser = async () => {
    const inputElement = document.getElementById("user-name") as HTMLInputElement;
    const userName = inputElement?.value.trim();

    if (!userName) {
      alert("User name cannot be empty.");
      return;
    }
    try {
      await postUser({ name: userName });
      inputElement.value = "";
      router.invalidate();
    } catch (error) {
      console.error("Failed to add user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center flex flex-col items-center pt-10"
      style={{ backgroundImage: "url(./Abstract3DBackground.jpg)" }}
    >
      <UserList users={users} />
      <div className="flex flex-col items-center gap-4 w-96">
        <input
          id="user-name"
          type="text"
          placeholder="Enter user name"
          className="input input-bordered w-full text-xl"
        />
        <button
          className="btn bg-prim w-full text-xl font-bold"
          onClick={handleAddUser}
        >
          Add User
        </button>
        <div className="flex justify-center h-30">
          <Link
            to="/statistics"
            className="btn hover:bg-terc hover:border-terc rounded-lg border-sec
            no-underline w-96 h-12 bg-sec text-prim text-center text-xl
            font-bold flex "
          >
            Stastics
          </Link>
        </div>
      </div>
    </div>
  );
}
