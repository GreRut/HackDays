import { createFileRoute } from "@tanstack/react-router";
import UserList from "../components/listUsers";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(./Abstract3DBackground.jpg)" }}
    >
      <UserList />
    </div>
  );
}
