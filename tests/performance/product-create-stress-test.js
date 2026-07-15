import http from "k6/http";
import { check } from "k6";
import { Counter, Trend } from "k6/metrics";

export const options = {
  scenarios: {
    db_stress: {
      executor: "ramping-vus",
      stages: [
        { duration: "20s", target: 50 },
        { duration: "1m", target: 200 },
        { duration: "2m", target: 500 },
        { duration: "30s", target: 0 },
      ],
    },
  },

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
  },
};

const BASE_URL = "http://localhost:3000";

const failures = new Counter("failures");
const latency = new Trend("create_latency");

export default function ProductCreate() {
  const payload = JSON.stringify({
    storeId: "store123",
    userId: "user123",

    sku: `SKU-${__VU}-${__ITER}`,
    name: `Stress Product ${__VU}-${__ITER}`,
    image: "",
    description: "Stress test",
    quantity: Math.floor(Math.random() * 1000),
    price: Math.random() * 100,
  });

  const res = http.post(`${BASE_URL}/api/stress/products`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  latency.add(res.timings.duration);

  const ok = check(res, {
    200: (r) => r.status === 200,
    success: (r) => JSON.parse(r.body).success === true,
  });

  if (!ok) failures.add(1);
}
