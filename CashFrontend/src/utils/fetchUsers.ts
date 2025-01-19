import createClient from "openapi-fetch";
import type { paths } from "../lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5274/" });

export const userListFetch = await client.GET("/api/Users", {});

export const userFetch = (id: number) =>
  client.GET("/api/Users/{id}", {
    params: {
      path: { id: id },
      query: undefined,
    },
  });

export const userDebtFetch = (id: number) =>
  client.GET("/api/Users/{id}/detailed-balance", {
    params: {
      path: { id: id },
      query: undefined,
    },
  });

  export const payDebt = (PaymentRequest: { fromUserId: number, toUserId: number, amount: number }) =>
      client.POST("/api/Payment/transfer", {
        body: PaymentRequest,
        params: {
          query: undefined,
        },
  });
