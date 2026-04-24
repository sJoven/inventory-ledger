import { getActivityLogs } from "@/lib/logs";
import UndoButton from "@/app/logs/undo-button";

interface Props {
  storeId: string;
  page: number;
}

export default async function ActivityLogTable({ storeId, page }: Props) {
  const { logs, productMap } = await getActivityLogs(storeId, page);

  if (logs.length < 1) {
    return (
      <div className="p-12 border-2 border-dashed rounded-lg bg-gray-50 text-center">
        <p className="text-gray-500 italic">
          There are no logs related to this store.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b text-sm uppercase tracking-wider">
            <th className="p-4 font-semibold">Date/Time</th>
            <th className="p-4 font-semibold">User</th>
            <th className="p-4 font-semibold">Product</th>
            <th className="p-4 font-semibold">Action</th>
            <th className="p-4 font-semibold">Changes Detected</th>
            <th className="p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const currentProduct = productMap.get(log.doc_id);
            const changes = getDiff(log.prev_state as any, currentProduct);
            const isComplete = !!(log.user && currentProduct);
            const hasDiff = !!(changes && changes.length > 0);
            const canUndo = isComplete && log.action !== "CREATE" && hasDiff;

            return (
              <tr
                key={log.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 whitespace-nowrap text-sm">
                  {log.createdAt.toLocaleString()}
                </td>
                <td className="p-4 text-sm">
                  {log.user?.name ?? (
                    <span className="text-red-400 italic">Missing User</span>
                  )}
                </td>
                <td className="p-4 font-medium text-sm">
                  {currentProduct?.name ?? (
                    <span className="text-red-400 italic">Missing Product</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-600">
                  {renderChanges(changes)}
                </td>
                <td className="p-4 text-center">
                  {canUndo ? (
                    <UndoButton logId={log.id} />
                  ) : (
                    <span className="text-gray-400 text-xs italic">
                      {log.action === "CREATE"
                        ? "Initial Entry"
                        : "No changes to revert"}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getDiff(prev: any, current: any) {
  if (!prev || !current) return null;
  const diffs: string[] = [];
  const ignoreFields = ["id", "_id", "updatedAt", "createdAt", "store_id"];
  for (const key in prev) {
    if (ignoreFields.includes(key)) continue;
    if (key in current && prev[key] !== current[key]) {
      diffs.push(`${key}: ${prev[key]} → ${current[key]}`);
    }
  }
  return diffs;
}

function renderChanges(changes: string[] | null) {
  if (!changes || changes.length === 0)
    return <span className="text-gray-400">No changes detected</span>;
  return (
    <ul className="list-disc list-inside space-y-1">
      {changes.map((change, i) => (
        <li key={i}>{change}</li>
      ))}
    </ul>
  );
}
