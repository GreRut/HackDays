import { createFileRoute } from "@tanstack/react-router";
import { userDebtFetch } from "../utils/fetchUsers";
import { useState } from "react";

export const Route = createFileRoute("/user/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await userDebtFetch(Number.parseInt(params.id));
  },
});

function RouteComponent() {
  const { data } = Route.useLoaderData();
  const [detailedBalances] = useState<string[]>(data || []);

  return (
    <div>
      <h2>Detailed Balances</h2>
      <div>
        {detailedBalances.length > 0 ? (
          detailedBalances.map((balance, index) => (
            <div key={index}>
              <div>
                <p>{balance}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No balances available for this user.</p>
        )}
      </div>
    </div>
  );
}
