/**
 * app/admin/loading.tsx
 * 管理画面共通のスケルトンUI（ページ遷移時の白画面防止）
 */
export default function AdminLoading() {
  return (
    <div className="p-6 animate-pulse">
      {/* ヘッダースケルトン */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 統計カードスケルトン */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="h-4 w-20 bg-slate-200 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* テーブルスケルトン */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
