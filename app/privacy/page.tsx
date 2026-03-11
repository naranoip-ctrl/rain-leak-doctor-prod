
import Link from 'next/link';

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold text-slate-800 mb-8">プライバシーポリシー</h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8 text-slate-700 leading-relaxed">
          <p>
            株式会社CJW TRUST（以下「当社」）は、AI雨漏りドクター（以下「本サービス」）における
            お客様の個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. 収集する情報</h2>
            <p>当社は、本サービスの提供にあたり、以下の情報を収集する場合があります。</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>お名前、ご連絡先（電話番号、メールアドレス）</li>
              <li>ご住所（診断対象物件の所在地）</li>
              <li>建物の写真・画像データ</li>
              <li>LINEアカウント情報（LINE連携をご利用の場合）</li>
              <li>アクセスログ、Cookie情報、端末情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. 利用目的</h2>
            <p>収集した個人情報は、以下の目的で利用いたします。</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>AI診断サービスの提供および診断結果のご報告</li>
              <li>お見積り・ご相談への対応</li>
              <li>修繕工事に関するご連絡・ご案内</li>
              <li>サービスの改善・新サービスの開発</li>
              <li>統計データの作成（個人を特定できない形式）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. 第三者への提供</h2>
            <p>当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません。</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>お客様の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>修繕工事の実施にあたり、提携施工業者と共有が必要な場合（事前にご説明いたします）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. AIによる画像解析について</h2>
            <p>
              本サービスでは、お客様がアップロードされた建物の写真をAI（人工知能）により解析し、
              雨漏りの可能性や損傷状態の診断を行います。アップロードされた画像は診断目的にのみ使用し、
              診断完了後は当社のサーバーに安全に保管されます。
              AIの学習データとして無断で使用することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. 情報の管理</h2>
            <p>
              当社は、お客様の個人情報の正確性を保ち、不正アクセス・紛失・破損・改ざん・漏洩などを
              防止するため、適切なセキュリティ対策を講じます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Cookieの使用について</h2>
            <p>
              本サービスでは、サービスの利便性向上およびアクセス解析のためにCookieを使用しています。
              ブラウザの設定によりCookieを無効にすることも可能ですが、一部機能がご利用いただけなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. 個人情報の開示・訂正・削除</h2>
            <p>
              お客様ご本人から個人情報の開示・訂正・削除のご請求があった場合、
              ご本人確認のうえ、合理的な期間内に対応いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. お問い合わせ窓口</h2>
            <p>個人情報の取扱いに関するお問い合わせは、以下までご連絡ください。</p>
            <div className="mt-3 p-4 bg-slate-50 rounded-lg">
              <p className="font-bold">株式会社CJW TRUST</p>
              <p>AI雨漏りドクター 個人情報相談窓口</p>
              <p>電話: 0120-410-654</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. ポリシーの変更</h2>
            <p>
              当社は、必要に応じて本プライバシーポリシーを変更することがあります。
              変更後のポリシーは、本ページに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          <p className="text-sm text-slate-500 pt-4 border-t border-slate-200">
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
