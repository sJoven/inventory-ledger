import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    read_heavy: {
      executor: "constant-vus",
      vus: 100,
      duration: "2m",
    },
  },

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const BASE_URL =
  "https://inventory-ledger-abuffodys-sjovens-projects.vercel.app/api/products/search";

const STORE_ID = "some-store";

const QUERIES = [
  "",
  "a",
  "e",
  "shirt",
  "shoe",
  "bag",
  "watch",
  "phone",
  "abc",
  "123",
];

export default function ProductSearch() {
  const page = Math.floor(Math.random() * 20) + 1;
  const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];

  const url =
    `${BASE_URL}?storeId=${STORE_ID}` +
    `&page=${page}` +
    `&query=${encodeURIComponent(query)}`;

  const res = http.get(url);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response is array": (r) => Array.isArray(r.json()),
  });

  sleep(Math.random() * 0.5);
}
