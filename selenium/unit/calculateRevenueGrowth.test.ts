//Revenue Growth Calculation

import { describe, test, expect } from "vitest";
import { calculatePercentageChange } from "@/src/lib/calculations";

describe("calculatePercentageChange", () => {
  test("should calculate positive percentage increase correctly", () => {
    const result = calculatePercentageChange(150, 100);
    expect(result).toEqual({
      percentageChange: 50.0,
      isPositive: true,
    });
  });

  test("should calculate negative percentage decrease correctly", () => {
    const result = calculatePercentageChange(75, 100);
    expect(result).toEqual({
      percentageChange: -25.0,
      isPositive: false,
    });
  });

  test("should handle no change (0%) correctly", () => {
    const result = calculatePercentageChange(100, 100);
    expect(result).toEqual({
      percentageChange: 0.0,
      isPositive: true,
    });
  });

  test("should round to exactly two decimal places", () => {
    const result = calculatePercentageChange(103.456, 100);
    expect(result.percentageChange).toBe(3.46);
  });

  test("should handle previousValue being 0 to avoid division by zero", () => {
    const result = calculatePercentageChange(100, 0);
    expect(result).toEqual({
      percentageChange: 0,
      isPositive: true,
    });
  });
});
