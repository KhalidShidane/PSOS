/**
 * Temporary placeholder rendered by feature pages that have not been
 * implemented yet. Replace with real page content as each module is built.
 */
const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        {description || "This section is coming soon."}
      </p>
    </div>
  );
};

export default PlaceholderPage;
