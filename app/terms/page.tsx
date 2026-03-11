
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#0c2d5a] to-[#164e8a] text-white font-bold text-xs">
              AI
            </div>
            <span className="font-bold text-lg text-[#0c2d5a]">雨漏りドクター</span>
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-[#0c2d5a] transition-colors">
            &larr; トップに戻る
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">特定商取引法に基づく表記</h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-slate-700 leading-relaxed">
          <table className="w-full">
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top w-1/3 whitespace-nowrap">事業者名</td>
                <td className="py-4">株式会社ドローン工務店</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">代表者</td>
                <td className="py-4">代表取締役 坂井 友哉</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">所在地</td>
                <td className="py-4">大阪府大阪市旭区高殿2-12-6</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">電話番号</td>
                <td className="py-4">06-6927-1065（受付時間: 9:00〜18:00）</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">メールアドレス</td>
                <td className="py-4">drone@loki-group.com</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">サービス内容</td>
                <td className="py-4">
                  AIによる建物外装の損傷診断サービス（無料）<br />
                  雨漏り修繕工事の施工・監理
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">サービスの対価</td>
                <td className="py-4">
                  <p><strong>AI診断:</strong> 無料</p>
                  <p className="mt-1"><strong>修繕工事:</strong> 現地調査後に個別にお見積りいたします</p>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">対価以外の費用</td>
                <td className="py-4">
                  AI診断のご利用にあたり、インターネット接続に必要な通信料はお客様のご負担となります。
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">お支払い方法</td>
                <td className="py-4">
                  修繕工事の場合: 銀行振込、現金払い<br />
                  （詳細はお見積り時にご案内いたします）
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">お支払い時期</td>
                <td className="py-4">
                  修繕工事の場合: 工事完了後、請求書発行から30日以内
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">サービス提供時期</td>
                <td className="py-4">
                  <p><strong>AI診断:</strong> 写真アップロード後、最短3分で結果をお届け</p>
                  <p className="mt-1"><strong>修繕工事:</strong> ご契約後、日程調整のうえ施工開始</p>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">キャンセル・返金</td>
                <td className="py-4">
                  <p><strong>AI診断:</strong> 無料サービスのため該当なし</p>
                  <p className="mt-1"><strong>修繕工事:</strong> 工事着手前であればキャンセル可能です。着手後のキャンセルについては、実費をご請求させていただく場合があります。</p>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">対応エリア</td>
                <td className="py-4">大阪府・京都府・兵庫県・奈良県・滋賀県・和歌山県</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">動作環境</td>
                <td className="py-4">
                  AI診断サービスのご利用には、インターネット接続環境およびカメラ機能付きのスマートフォンまたはPCが必要です。
                  推奨ブラウザ: Chrome、Safari、Edge の最新版。
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm text-slate-500 pt-6 mt-6 border-t border-slate-200">
            制定日: 2024年12月1日<br />
            最終更新日: 2026年3月1日
          </p>
        </div>
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        &copy; 2024 雨漏りドクター. All rights reserved.
      </footer>
    </div>
  );
}
