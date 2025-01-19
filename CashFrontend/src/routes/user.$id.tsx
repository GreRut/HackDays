import { createFileRoute } from "@tanstack/react-router";
import { userDebtFetch, payDebt } from "../utils/fetchUsers";
import { postItem } from "../utils/fetchItems";
import { useState } from "react";
import '../App.css';


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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const response = await payDebt({
        fromUserId: debt.fromUserId,
        toUserId: debt.toUserId,
        amount: debt.amount,
      });

      if (response.success) {
        const updatedData = await userDebtFetch(currentUserId);
        setDebts(updatedData || []);
        alert("Payment processed successfully.");
      } else {
        console.error("Failed to process payment: ", response.error);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[url('https://unsplash.com/photos/an-aerial-view-of-a-lush-green-forest-BOJ_pat2MPg')] bg-cover bg-center">
      <h2 className="text-red-600">User Debts</h2>
      <div className="flex flex-col gap-4">
        {debts.length > 0 ? (
          debts.map((debt, index) => (
            <div key={index} className="card bg-base-200 w-96 shadow-xl">
              <div className="card-body">
                <p>
                  {debt.fromUserName} owes {debt.toUserName}: ${debt.amount.toFixed(2)}
                </p>
                {debt.fromUserId === currentUserId && (
                  <button
                    className="btn bg-prim mt-2"
                    disabled={loading}
                    onClick={() => onPayNow(debt)}
                  >
                    {loading ? "Processing..." : "Pay Now"}
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
