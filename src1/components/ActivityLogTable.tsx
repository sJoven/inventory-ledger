import { getActivityLogs } from "@/src/lib/logs";
import UndoButton from "@/src/app/logs/undo-button";

interface Props {
  storeId: string;
  page: number;
}

export default async function ActivityLogTable({ storeId, page }: Props) {
  const { logs, productMap } = await getActivityLogs(storeId, page);

  if (logs.length < 1) {
    return (
      <div className="p-12 text-center text-gray-400 italic">
        There are no logs related to this store.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="md:hidden space-y-4 p-2">
        {logs.map((log) => {
          const currentProduct = productMap.get(log.doc_id);
          const changes = getDiff(log.prev_state as any, currentProduct);
          const isComplete = !!(log.user && currentProduct);
          const hasDiff = !!(changes && changes.length > 0);
          const canUndo = isComplete && log.action !== "CREATE" && hasDiff;

          return (
            <div
              key={log.id}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 
                     shadow-sm transition-all duration-300 ease-out
                     hover:shadow-xl hover:-translate-y-1 hover:border-[#fc6022]/30"
            >
              <div
                className="absolute top-0 left-6 w-8 h-1 bg-[#fc6022] rounded-b-full 
                       opacity-40 transition-all duration-300 
                       group-hover:w-16 group-hover:opacity-100"
              />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {log.createdAt.toLocaleString()}
                  </p>
                  <h3 className="text-lg font-extrabold text-[#3a3a3a] tracking-tight group-hover:text-[#fc6022] transition-colors">
                    {currentProduct?.name ?? (
                      <span className="text-red-400 italic">
                        Missing Product
                      </span>
                    )}
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 text-[#3a3a3a] text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {log.action}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    {log.user?.name ?? (
                      <span className="text-red-400 italic">Missing User</span>
                    )}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 group-hover:bg-white group-hover:border-[#fc6022]/10 transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                    Changes Detected
                  </p>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {renderChanges(changes)}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  {canUndo ? (
                    <UndoButton logId={log.id} />
                  ) : (
                    <span className="text-[10px] font-bold text-gray-300 uppercase italic">
                      {log.action === "CREATE"
                        ? "Initial Entry"
                        : "No Revert Available"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto scrollbar-hide rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-[rgb(23,33,44)]">
              <tr>
                <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                  Date/Time
                </th>
                <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-[0.875rem] font-bold text-white uppercase tracking-wider">
                  Changes
                </th>
                <th className="px-6 py-4 text-right text-[0.875rem] font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const currentProduct = productMap.get(log.doc_id);
                const changes = getDiff(log.prev_state as any, currentProduct);
                const isComplete = !!(log.user && currentProduct);
                const hasDiff = !!(changes && changes.length > 0);
                const canUndo =
                  isComplete && log.action !== "CREATE" && hasDiff;

                return (
                  <tr
                    key={log.id}
                    className="transition-colors duration-150 odd:bg-white even:bg-[rgb(23,33,44)]/[0.03]"
                  >
                    <td className="px-6 py-4 text-[0.875rem] text-gray-500 font-mono border-b border-gray-100">
                      {log.createdAt.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[0.875rem] text-[#3a3a3a] font-semibold border-b border-gray-100">
                      {log.user?.name ?? (
                        <span className="text-red-400 italic">
                          Missing User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[0.875rem] text-[#3a3a3a] font-semibold border-b border-gray-100">
                      {currentProduct?.name ?? (
                        <span className="text-red-400 italic">
                          Missing Product
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className="px-2 py-0.5 bg-[rgb(23,33,44)] text-white text-[10px] font-bold uppercase tracking-wider rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 border-b border-gray-100 max-w-xs truncate">
                      {renderChanges(changes)}
                    </td>
                    <td className="px-6 py-4 text-right border-b border-gray-100">
                      {canUndo ? (
                        <UndoButton logId={log.id} />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase italic">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
