import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { userDebtFetch, payDebt } from "../utils/fetchUsers";
import { postItem } from "../utils/fetchItems";
import "../App.css";

export const Route = createFileRoute("/user/$id")({
  component: RouteComponent,
  loader: async ({ params }) => (await userDebtFetch(Number(params.id))).data,
});

function RouteComponent() {
  const debts = Route.useLoaderData();
  const { id } = Route.useParams();
  const userId = Number(id);
  const router = useRouter();

  const handleAction = async (action: () => Promise<unknown>) => {
    try {
      await action();
      router.invalidate();
    } catch (error) {
      console.error(error);
      router.invalidate();
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(../../Abstract3DBackground.jpg)" }}
    >
      <div className="p-5 flex justify-center">
        <Link
          to="/"
          className="btn hover:bg-terc hover:border-terc rounded-lg border-sec
                     no-underline w-[22rem] h-[10rem] bg-sec text-prim
                     text-4xl font-bold flex items-center justify-center">
          Group
        </Link>
      </div>
      <div className="flex justify-center pt-20">
        <div className="card bg-neutral text-neutral-content w-96 p-10 space-y-5">
          <h2 className="text-primary text-3xl font-bold text-center">
            User Debts
          </h2>
          {debts.length ? (
            debts.map(
              (debt, i) =>
                debt.amount > 0 && (
                  <div
                    key={i}
                    className="card bg-base-200 shadow-xl w-full mb-4"
                  >
                    <div className="card-body text-center">
                      <p>
                        {debt.fromUserName} owes {debt.toUserName}: $
                        {debt.amount.toFixed(2)}
                      </p>
                      {debt.fromUserId === userId && (
                        <button
                          className="btn bg-prim mt-2"
                          onClick={() =>
                            handleAction(() =>
                              payDebt({
                                fromUserId: userId,
                                toUserId: debt.toUserId,
                                amount: debt.amount,
                              })
                            )
                          }
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                )
            )
          ) : (
            <p className="text-2xl text-center">
              No debts available for this user.
            </p>
          )}
          <div className="space-y-4">
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
              onClick={() =>
                handleAction(() => {
                  const name = (
                    document.getElementById("expense-name") as HTMLInputElement
                  ).value.trim();
                  const price = parseFloat(
                    (
                      document.getElementById(
                        "expense-price"
                      ) as HTMLInputElement
                    ).value
                  );
                  if (!name || isNaN(price)) {
                    throw new Error("Invalid expense input");
                  }
                  return postItem({ name, price, userId });
                })
              }
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
