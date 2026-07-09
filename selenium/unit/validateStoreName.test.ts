//Edge Case: New Store - Empty Store Name
import { describe, test, expect } from "vitest";
import { validateStoreName } from "@/src/lib/validations";

describe("validateStoreName", () => {
  test("should return success for a valid store name", () => {
    const result = validateStoreName("My Awesome Store");
    expect(result).toEqual({ success: true });
  });

  test("should fail if the store name is empty", () => {
    const result = validateStoreName("");
    expect(result).toEqual({
      success: false,
      error: "Store name is required.",
    });
  });

  test("should fail if the store name is missing/undefined", () => {
    const result = validateStoreName(undefined);
    expect(result).toEqual({
      success: false,
      error: "Store name is required.",
    });
  });

  test("should fail if the store name is only whitespace", () => {
    const result = validateStoreName("   ");
    expect(result).toEqual({
      success: false,
      error: "Store name is required.",
    });
  });
});
