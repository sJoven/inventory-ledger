import { handleLogout } from "@/src/lib/actions";

export default function UserOptions() {
  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
      <ul className="flex flex-col text-sm text-gray-700">
        <li>
          <hr className="my-1 border-gray-200" />
          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
}
