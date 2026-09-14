const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

/** Shows the user's photo if set, otherwise their initials on an emerald
 * chip - used in the Navbar and on Settings. */
const Avatar = ({ name, src, size = 32 }) => {
  const dimension = `${size}px`;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Profile"}
        className="shrink-0 rounded-full object-cover"
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700"
      style={{ width: dimension, height: dimension, fontSize: size * 0.4 }}
    >
      {getInitials(name)}
    </span>
  );
};

export default Avatar;
