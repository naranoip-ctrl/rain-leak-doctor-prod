/**
 * app/admin/customers/loading.tsx
 * 顧客管理ページのスケルトンUI
 */
export default function CustomersLoading() {
  return (
    <div className="p-6 animate-pulse">
      {/* ヘッダースケルトン */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-40 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-36 bg-slate-200 rounded-lg" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 検索バースケルトン */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="h-10 w-full bg-slate-100 rounded-lg" />
      </div>

      {/* 顧客カードスケルトン */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 w-32 bg-slate-200 rounded" />
                  <div className="h-5 w-20 bg-green-100 rounded" />
                </div>
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  <div className="h-4 w-40 bg-slate-100 rounded" />
                  <div className="h-4 w-36 bg-slate-100 rounded" />
                </div>
                <div className="flex gap-4">
                  <div className="h-4 w-28 bg-slate-100 rounded" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                  <div className="h-4 w-20 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-9 w-16 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
