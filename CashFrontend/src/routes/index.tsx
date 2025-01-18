import { createFileRoute } from "@tanstack/react-router";
import UserList from "../components/listUsers";

export const Route = createFileRoute("/")({
    component: RouteComponent,
  });
  
  function RouteComponent() { 
  
    return (
      <div>
          <UserList  />
      </div>
    );
  }
