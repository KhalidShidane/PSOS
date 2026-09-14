/** Base skeleton block - a pulsing gray rectangle. Compose specific
 * shapes (cards, rows, stats) from this primitive so every loading
 * state in the app uses the same pulse timing and gray tone. */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

export default Skeleton;
