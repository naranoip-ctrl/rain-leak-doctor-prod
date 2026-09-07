'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare, Brain, Calendar, TrendingUp, CheckCircle, Clock, XCircle, Eye
} from 'lucide-react';
import { Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/AdminUI';
import { Spinner } from '@/components/Spinner';
import {
  type Stats, type Contact, type Diagnosis, type Appointment,
  getDashboardData
} from '@/lib/admin/data';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardData();
        setStats(data.stats);
        setContacts(data.contacts);
        setDiagnoses(data.diagnoses);
        setAppointments(data.appointments);
      } catch (e: any) {
        console.error('Dashboard load error:', e);
        setError(e.message || 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          再読み込み
        </button>
      </div>
    );
  }

  const statCards = [
    { label: 'お問い合わせ', value: stats?.totalContacts || 0, sub: `今月: ${stats?.contactsThisMonth || 0}件`, icon: MessageSquare, color: 'text-blue-500' },
    { label: 'AI診断', value: stats?.totalDiagnoses || 0, sub: `今月: ${stats?.diagnosesThisMonth || 0}件`, icon: Brain, color: 'text-purple-500' },
    { label: '予約', value: stats?.totalAppointments || 0, sub: `今月: ${stats?.appointmentsThisMonth || 0}件`, icon: Calendar, color: 'text-green-500' },
    { label: '成約率', value: `${stats?.conversionRate || 0}%`, sub: `先月比: +${stats?.conversionRateChange || 0}%`, icon: TrendingUp, color: 'text-amber-500' },
  ];

  const statusConfig: Record<string, { label: string; icon: React.ElementType; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    pending: { label: '保留中', icon: Clock, variant: 'secondary' },
    confirmed: { label: '確認済み', icon: CheckCircle, variant: 'default' },
    completed: { label: '完了', icon: CheckCircle, variant: 'outline' },
    cancelled: { label: 'キャンセル', icon: XCircle, variant: 'destructive' },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">管理者ダッシュボード</h1>
        <p className="text-slate-500 mt-1">お問い合わせ・AI診断・予約を一元管理</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{card.label}</span>
              <card.icon className={`h-5 w-5 shrink-0 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{card.value}</div>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">お問い合わせ</TabsTrigger>
          <TabsTrigger value="diagnoses">AI診断</TabsTrigger>
          <TabsTrigger value="appointments">予約</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">お問い合わせ一覧</h2>
              <p className="text-sm text-slate-500">最新のお問い合わせから表示</p>
            </div>
            <div className="divide-y divide-slate-100">
              {contacts.length > 0 ? contacts.map((contact) => (
                <div key={contact.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{contact.name}</h4>
                      <p className="text-sm text-slate-500">{contact.email} / {contact.phone}</p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(contact.createdAt).toLocaleDateString('ja-JP')}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{contact.message}</p>
                </div>
              )) : (
                <p className="text-center text-slate-400 py-8">お問い合わせはまだありません</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">AI診断一覧</h2>
              <p className="text-sm text-slate-500">最新のAI診断結果から表示</p>
            </div>
            <div className="divide-y divide-slate-100">
              {diagnoses.length > 0 ? diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {diagnosis.insuranceLikelihood === 'high' && '🔴 '}
                        {diagnosis.insuranceLikelihood === 'medium' && '🟡 '}
                        {diagnosis.insuranceLikelihood === 'low' && '🟢 '}
                        {diagnosis.repairLocation}
                      </h4>
                      <p className="text-sm text-slate-500">{diagnosis.name} / {diagnosis.phone}</p>
                      <p className="text-sm text-slate-500">
                        推定費用: ¥{diagnosis.estimatedCostMin.toLocaleString()}〜¥{diagnosis.estimatedCostMax.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(diagnosis.createdAt).toLocaleDateString('ja-JP')}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{diagnosis.diagnosisDetails}</p>
                  <div className="flex gap-2 flex-wrap">
                    {diagnosis.insuranceLikelihood === 'high' && (
                      <Badge variant="default">保険適用可能性高</Badge>
                    )}
                    <Badge variant="outline">{diagnosis.recommendedPlan}</Badge>
                    <Badge variant="secondary">合言葉: {diagnosis.claimCode}</Badge>
                    <Link href={`/admin/diagnosis/${diagnosis.id}/edit`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">
                        <Eye className="h-3 w-3 mr-1" />
                        編集
                      </Badge>
                    </Link>
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-400 py-8">AI診断結果はまだありません</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">予約一覧</h2>
              <p className="text-sm text-slate-500">最新の予約から表示</p>
            </div>
            <div className="divide-y divide-slate-100">
              {appointments.length > 0 ? appointments.map((appt) => {
                const sc = statusConfig[appt.status] || statusConfig.pending;
                return (
                  <div key={appt.id} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{appt.name}</h4>
                        <p className="text-sm text-slate-500">{appt.email} / {appt.phone}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={sc.variant}>
                          <sc.icon className="h-3 w-3 mr-1" />
                          {sc.label}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(appt.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                      <div><span className="font-semibold">希望日:</span> {appt.preferredDate}</div>
                      <div><span className="font-semibold">希望時間:</span> {appt.preferredTime}</div>
                      {appt.address && (
                        <div className="sm:col-span-2">
                          <span className="font-semibold">住所:</span> {appt.address}
                        </div>
                      )}
                      {appt.diagnosisSessionId && (
                        <div className="sm:col-span-2">
                          <span className="font-semibold">AI診断ID:</span> {appt.diagnosisSessionId}
                        </div>
                      )}
                    </div>
                    {appt.notes && (
                      <p className="text-sm mt-2 text-slate-400">{appt.notes}</p>
                    )}
                  </div>
                );
              }) : (
                <p className="text-center text-slate-400 py-8">予約はまだありません</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
