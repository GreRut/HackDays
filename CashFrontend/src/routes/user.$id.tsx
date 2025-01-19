import { createFileRoute } from "@tanstack/react-router";
import { userDebtFetch } from "../utils/fetchUsers";
import { postItem } from "../utils/fetchItems";
import { useState } from "react";

interface Debt {
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  amount: number;
}

interface Expense {
  name: string;
  price: number;
}

export const Route = createFileRoute("/user/$id")({
  component: RouteComponent,
  loader: async ({ params }: { params: { id: string } }) => {
    return await userDebtFetch(Number.parseInt(params.id));
  },
});

function RouteComponent() {
  const { data } = Route.useLoaderData<Debt[]>();
  const params = Route.useParams<{ id: string }>();
  const currentUserId = Number(params.id);
  const [debts, setDebts] = useState<Debt[]>(data || []);
  const [newExpense, setNewExpense] = useState<Expense>({ name: "", price: 0 });

  const onAddExpense = async (): Promise<void> => {
    try {
      const response = await postItem({
        name: newExpense.name,
        price: newExpense.price,
        userId: currentUserId,
      });

      if (response.data) {
        const updatedData = await userDebtFetch(currentUserId);
        setDebts(updatedData || []);
        setNewExpense({ name: "", price: 0 });
      } else {
        console.error("Failed to add expense: ", response.error);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const onPayNow = async (debt: Debt): Promise<void> => {
    console.log(
      `Paying debt from ${debt.fromUserName} to ${debt.toUserName} for $${debt.amount}`
    );
  };

  return (
    <div>
      <h2>User Debts</h2>
      <div className="flex flex-col gap-4">
        {debts.length > 0 ? (
          debts.map((debt, index) => (
            <div key={index} className="card bg-base-200 w-96 shadow-xl">
              <div className="card-body">
                <p>
                  {debt.fromUserName} owes {debt.toUserName}: $
                  {debt.amount.toFixed(2)}
                </p>
                {debt.fromUserId === currentUserId && (
                  <button
                    className="btn bg-prim mt-2"
                    onClick={() => onPayNow(debt)}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No debts available for this user.</p>
        )}
      </div>
      <div className="mt-4">
        <h3>Add Expense</h3>
        <input
          type="text"
          placeholder="Expense Name"
          value={newExpense.name}
          onChange={(e) =>
            setNewExpense({ ...newExpense, name: e.target.value })
          }
          className="input input-bordered mr-2"
        />
        <input
          type="number"
          placeholder="Expense Price"
          value={newExpense.price}
          onChange={(e) =>
            setNewExpense({ ...newExpense, price: Number(e.target.value) })
          }
          className="input input-bordered mr-2"
        />
        <button className="btn bg-prim" onClick={onAddExpense}>
          Add Expense
        </button>
      </div>
    </div>
  );
}
