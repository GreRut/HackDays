import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { userDebtFetch, payDebt } from "../utils/fetchUsers";
import { postItem } from "../utils/fetchItems";
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
    const fetchResponse = await userDebtFetch(Number.parseInt(params.id));
    return fetchResponse.data;
  },
});

function RouteComponent() {
  const debts = Route.useLoaderData() as Debt[];
  const params = Route.useParams<{ id: string }>();
  const currentUserId = Number(params.id);
  const router = useRouter();

  const onAddExpense = async (name: string, price: number): Promise<void> => {
    try {
      const response = await postItem({
        name,
        price,
        userId: currentUserId,
      });
      if (response.data) {
        router.invalidate();
      } else {
        console.error("Failed to add expense:", response.error);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
    finally{
      router.invalidate();
    }
  };

  const onPayNow = async (debt: Debt): Promise<void> => {
    try {
      const response = await payDebt({
        fromUserId: currentUserId,
        toUserId: debt.toUserId,
        amount: debt.amount,
      });
      if (response.success) {
        router.invalidate();
      } else {
        console.error("Failed to process payment:", response.error);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
    finally{
      router.invalidate();
    }
  };

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url(../../Abstract3DBackground.jpg)",
      }}
    >
      <div className="p-5 flex justify-center items-center h-30">
        <Link
          to="/"
          className="btn
                          hover:bg-terc
                          hover:border-terc rounded-lg
                          border-sec no-underline
                          w-[22rem] h-[10rem]
                          bg-sec
                          text-prim text-center text-4xl font-bold flex justify-center items-center"
        >
          Group
        </Link>
      </div>
      <div className="flex justify-center pt-20">
        <div className="card bg-neutral text-neutral-content w-96 space-y-5 p-10">
          <h2 className="text-primary text-3xl font-bold text-center">
            User Debts
          </h2>
          <div className="flex flex-col gap-4">
            {debts.length > 0 ? (
              debts
                .filter((debt) => debt.amount > 0)
                .map((debt, index) => (
                  <div
                    key={index}
                    className="card bg-base-200 shadow-xl w-full"
                  >
                    <div className="card-body text-center">
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
              <p className="text-2xl text-center">
                No debts available for this user.
              </p>
            )}
          </div>
          <div className="flex flex-col items-center mt-4 space-y-4">
            <input
              id="expense-name"
              type="text"
              placeholder="Expense Name"
              className="input input-bordered w-full"
            />
            <input
              id="expense-price"
              type="number"
              placeholder="Expense Price"
              className="input input-bordered w-full"
            />
            <button
              className="btn bg-prim w-full text-xl font-bold"
              onClick={() => {
                const nameInput = document.getElementById(
                  "expense-name"
                ) as HTMLInputElement;
                const priceInput = document.getElementById(
                  "expense-price"
                ) as HTMLInputElement;

                const name = nameInput.value.trim();
                const price = parseFloat(priceInput.value);

                if (name && !isNaN(price)) {
                  onAddExpense(name, price);
                  nameInput.value = "";
                  priceInput.value = "";
                } else {
                  console.error("Invalid expense input.");
                }
              }}
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
