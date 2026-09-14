import { Loader2 } from "lucide-react";

/** Consistent primary submit button with a spinner while submitting -
 * used across every form in the app so "saving" always looks the same. */
const SubmitButton = ({ isSubmitting, children, submittingLabel = "Saving...", className = "" }) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className={`flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${className}`}
  >
    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />}
    {isSubmitting ? submittingLabel : children}
  </button>
);

export default SubmitButton;
