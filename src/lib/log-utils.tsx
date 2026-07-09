export function getReadableAction(action: string) {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes("create")) return "Created";
  if (lowerAction.includes("update")) return "Updated";
  if (lowerAction.includes("delete")) return "Deleted";
  return "Modified";
}

type RawLog = {
  id: string;
  action: string;
  doc_id: string;
  createdAt: Date;
};

type Product = {
  id: string;
  name: string;
};

export function formatEnrichedLogs(logs: RawLog[], products: Product[]) {
  if (logs.length === 0) return [];

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  return logs.map((log) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(log.createdAt);

    return {
      id: log.id,
      sentence: (
        <>
          <span className="font-semibold text-gray-900">
            {getReadableAction(log.action)}
          </span>{" "}
          <span className="font-medium text-gray-800">
            {productMap.get(log.doc_id) || "Unknown/Deleted Product"}
          </span>{" "}
          <span className="text-gray-500">at {formattedDate}</span>
        </>
      ),
    };
  });
}
