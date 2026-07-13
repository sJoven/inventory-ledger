//Readable Action Logs Formatting
import { describe, test, expect } from "vitest";
import { getReadableAction, formatEnrichedLogs } from "@/src/lib/log-utils";

describe("getReadableAction", () => {
  test("should map actions accurately", () => {
    expect(getReadableAction("create_item")).toBe("Created");
    expect(getReadableAction("UPDATE")).toBe("Updated");
    expect(getReadableAction("delete")).toBe("Deleted");
    expect(getReadableAction("unknown")).toBe("Modified");
  });
});

describe("formatEnrichedLogs", () => {
  test("should return empty array when given empty logs", () => {
    expect(formatEnrichedLogs([], [])).toEqual([]);
  });

  test("should format logs correctly with matching products", () => {
    const mockDate = new Date("2026-07-09T10:00:00Z");

    const logs = [
      { id: "1", action: "create", doc_id: "prod_1", createdAt: mockDate },
      { id: "2", action: "delete", doc_id: "prod_2", createdAt: mockDate },
    ];

    const products = [{ id: "prod_1", name: "Laptop" }];

    const result = formatEnrichedLogs(logs, products);

    expect(result).toHaveLength(2);

    const firstSentence = result[0].sentence as any;
    expect(firstSentence.props.children[0].props.children).toBe("Created");
    expect(firstSentence.props.children[2].props.children).toBe("Laptop");

    const secondSentence = result[1].sentence as any;
    expect(secondSentence.props.children[0].props.children).toBe("Deleted");
    expect(secondSentence.props.children[2].props.children).toBe(
      "Unknown/Deleted Product",
    );
  });
});
