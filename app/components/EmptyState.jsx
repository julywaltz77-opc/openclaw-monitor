export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg shadow p-8">
      <div className="text-gray-400 text-4xl mb-4">📭</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
