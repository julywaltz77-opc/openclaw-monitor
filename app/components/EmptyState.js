export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">📭</div>
      <p className="text-slate-400">{message}</p>
      <p className="text-sm text-slate-500 mt-2">请先配置并运行本地采集脚本</p>
    </div>
  );
}
