import createClient from "openapi-fetch";
import type { paths } from "../lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5274/" });

export const postItem = (item: { name: string; price: number; userId: number }) =>
    client.POST("/api/Item", {
      body: item,
      params: {
        query: undefined,
      },
});
