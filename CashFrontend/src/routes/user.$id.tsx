import { createFileRoute } from "@tanstack/react-router";
import { userDebtFetch, payDebt } from "../utils/fetchUsers";
import { postItem } from "../utils/fetchItems";
import { useState } from "react";
import "../App.css";

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
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 min-h-screen">
      <div className="flex justify-center pt-20">
        <div className="card bg-neutral text-neutral-content w-96 space-y-5 p-10">
          <h2 className="text-primary text-3xl font-bold text-center">
            User Debts
          </h2>
          <div className="flex flex-col gap-4">
            {debts.length > 0 ? (
              debts.map((debt, index) => (
                <div key={index} className="card bg-base-200 shadow-xl w-full">
                  <div className="card-body text-center">
                    <p>
                      {debt.fromUserName} owes {debt.toUserName}: $
                      {debt.amount.toFixed(2)}
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
              <p className="text-2xl text-center">
                No debts available for this user.
              </p>
            )}
          </div>
          <div className="flex flex-col items-center mt-4 space-y-4">
            <input
              type="text"
              placeholder="Expense Name"
              value={newExpense.name}
              onChange={(e) =>
                setNewExpense({ ...newExpense, name: e.target.value })
              }
              className="input input-bordered w-full"
            />
            <input
              type="number"
              placeholder="Expense Price"
              value={newExpense.price}
              onChange={(e) =>
                setNewExpense({ ...newExpense, price: Number(e.target.value) })
              }
              className="input input-bordered w-full"
            />
            <button
              className="btn bg-prim w-full text-xl font-bold"
              onClick={onAddExpense}
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
