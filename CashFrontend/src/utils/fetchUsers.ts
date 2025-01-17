import createClient from "openapi-fetch";
import type { paths } from "../lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5274/" });

export const userListFetch = await client.GET("/api/Users", {
});