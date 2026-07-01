"use client";

interface AdminTopbarProps {
  onMenuToggle: () => void;
}

export function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-sm p-2 text-stone-700 lg:hidden"
          aria-label="Toggle admin menu"
          onClick={onMenuToggle}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-sm font-medium text-stone-900 lg:text-base">
          Admin Panel
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* TODO: Wire up NextAuth logout in Step 2 */}
        <button
          type="button"
          className="rounded-sm px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
          disabled
          title="Authentication coming in Step 2"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
