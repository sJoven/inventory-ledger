import { handleLogout } from "@/src/lib/actions";

export default function UserOptions() {
  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
      <ul className="flex flex-col">
        <li>
          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2.5 text-[0.875rem] text-[#3a3a3a] hover:bg-[#fc6022] hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
}
