import { group } from "k6";
import ProductCreate from "./product-create-stress-test";
import ProductSearch from "./product-search-load-test";

export default function () {
  group("Product Create Stress Test", () => {
    ProductCreate();
  });

  group("Product Search Load Test", () => {
    ProductSearch();
  });
}
