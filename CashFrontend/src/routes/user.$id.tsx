import { createFileRoute } from "@tanstack/react-router";
import { userDebtFetch } from "../utils/fetchUsers";
import { postItem } from "../utils/fetchItems";
import { useState } from "react";

export const Route = createFileRoute("/user/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await userDebtFetch(Number.parseInt(params.id));
  },
});

function RouteComponent() {
  const { data } = Route.useLoaderData();
  const params = Route.useParams(); // Access route parameters
  const [detailedBalances, setDetailedBalances] = useState<string[]>(data || []);
  const [newExpense, setNewExpense] = useState({ name: "", price: 0 });

  const onAddExpense = async () => {
    try {
      // Use the postItem utility to submit the expense
      const response = await postItem({
        name: newExpense.name,
        price: newExpense.price,
        userId: Number(params.id), // Use params.id as userId
      });

      // Handle the response (assuming success updates balances)
      if (response.data) {
        setDetailedBalances((prev) => [
          ...prev,
          `${newExpense.name} (${newExpense.price}) added for user.`,
        ]);
        setNewExpense({ name: "", price: 0 }); // Reset inputs
      } else {
        console.error("Failed to add expense: ", response.error);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div>
      <h2>Detailed Balances</h2>
      <div className="flex flex-col gap-4">
        {detailedBalances.length > 0 ? (
          detailedBalances.map((balance, index) => (
            <div key={index} className="card bg-base-200 w-96 shadow-xl">
              <div className="card-body">
                <p>{balance}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No balances available for this user.</p>
        )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Expense Name"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
          className="input input-bordered mr-2"
        />
        <input
          type="number"
          placeholder="Expense Price"
          value={newExpense.price}
          onChange={(e) => setNewExpense({ ...newExpense, price: Number(e.target.value) })}
          className="input input-bordered mr-2"
        />
        <button className="btn bg-prim" onClick={onAddExpense}>
          Add Expense
        </button>
      </div>
    </div>
  );
}
