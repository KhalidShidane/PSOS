const VARIANTS = {
  neutral: "bg-gray-100 text-gray-600",
  brand: "bg-emerald-100 text-emerald-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
};

/** Small pill label - the one place badge colors are defined, so every
 * status/priority tag in the app looks the same. */
const Badge = ({ children, variant = "neutral" }) => (
  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${VARIANTS[variant] || VARIANTS.neutral}`}>
    {children}
  </span>
);

export default Badge;
