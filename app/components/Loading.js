export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="loading-spinner"></div>
      <p className="mt-4 text-slate-400">数据加载中...</p>
    </div>
  );
}
