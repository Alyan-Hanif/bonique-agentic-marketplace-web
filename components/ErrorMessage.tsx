export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 text-xs font-semibold uppercase tracking-wider underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
