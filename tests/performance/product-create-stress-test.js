import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    create_product_stress: {
      executor: "ramping-vus",
      stages: [
        { duration: "20s", target: 10 },
        { duration: "20s", target: 25 },
        { duration: "20s", target: 50 },
        { duration: "30s", target: 50 },
        { duration: "20s", target: 0 },
      ],
    },
  },

  thresholds: {
    http_req_failed: ["rate<0.05"],
  },
};

const URL =
  "https://inventory-ledger-omega-staging.vercel.app/api/stress/product";

const CLEANUP_URL =
  "https://inventory-ledger-omega-staging.vercel.app/api/stress/product/delete";

const STORE_ID = "some-store";
const USER_ID = "some-id";

export default function () {
  const id = `${__VU}-${__ITER}-${Date.now()}`;

  const payload = JSON.stringify({
    storeId: STORE_ID,
    userId: USER_ID,

    sku: `SKU-${id}`,
    name: `Stress Product ${id}`,
    image: "",
    description: "Created by k6 stress test",
    quantity: Math.floor(Math.random() * 100) + 1,
    price: Math.floor(Math.random() * 5000) + 100,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(URL, payload, params);

  const body = JSON.parse(res.body);
  console.log(body);
  console.log(body.success);
  console.log(typeof body.success);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "success is true": () => body.success === true,
  });

  sleep(Math.random() * 0.2);
}

export function teardown() {
  const res = http.post(
    CLEANUP_URL,
    JSON.stringify({
      storeId: STORE_ID,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  check(res, {
    "cleanup succeeded": (r) => r.status === 200,
  });
}
