import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 100 },
    { duration: "2m", target: 250 },
    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_duration: ["p(95)<300"],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = "http://localhost:3000";
const STORE_ID = "store123";

const queries = ["", "apple", "keyboard", "mouse", "phone", "sku"];

export default function ProductSearch() {
  const page = Math.floor(Math.random() * 50) + 1;
  const query = queries[Math.floor(Math.random() * queries.length)];

  const url =
    `${BASE_URL}/api/products/search` +
    `?storeId=${STORE_ID}` +
    `&page=${page}` +
    `&query=${encodeURIComponent(query)}`;

  const res = http.get(url);

  check(res, {
    "status 200": (r) => r.status === 200,
  });
}
