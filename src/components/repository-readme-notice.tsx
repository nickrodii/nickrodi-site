export default function RepositoryReadmeNotice() {
  return (
    <div className="flex items-start gap-4 rounded-[1.75rem] border border-amber-200/25 bg-amber-100/[0.06] p-5 text-amber-50 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mt-0.5 h-11 w-11 shrink-0 text-amber-200 md:h-12 md:w-12"
        fill="none"
      >
        <path
          d="M12 3.35L2.77 19.25A1 1 0 0 0 3.64 20.75H20.36A1 1 0 0 0 21.23 19.25L12 3.35Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 8.25V13.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="16.9" r="1" fill="currentColor" />
      </svg>
      <p className="max-w-3xl pt-0.5 text-sm leading-7 text-amber-50/95 md:text-base">
        This project is closed source. The section below is the repository README, included here to
        provide additional context.
      </p>
    </div>
  );
}
