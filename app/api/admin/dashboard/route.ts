/**
 * app/api/admin/dashboard/route.ts
 * 管理画面ダッシュボード用API（パフォーマンス最適化版）
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 統計データ + 一覧データを全て並列で取得
    const [
      { count: totalContacts },
      { count: contactsThisMonth },
      { count: totalDiagnoses },
      { count: diagnosesThisMonth },
      { count: totalAppointments },
      { count: appointmentsThisMonth },
      { data: contacts },
      { data: diagnoses },
      { data: appointments },
    ] = await Promise.all([
      // 統計カウント（head: true で行データを返さない）
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
      supabase.from('diagnosis_sessions').select('*', { count: 'exact', head: true }),
      supabase.from('diagnosis_sessions').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
      // 一覧データ（必要カラムのみ取得、最新20件）
      supabase
        .from('inquiries')
        .select('id, customer_name, name, customer_email, email, customer_phone, phone, message, inquiry_content, status, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('diagnosis_sessions')
        .select('id, customer_name, customer_phone, customer_email, damage_locations, estimated_cost_min, estimated_cost_max, insurance_likelihood, recommended_plan, damage_description, severity_score, first_aid_cost, secret_code, admin_status, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('appointments')
        .select('id, customer_name, customer_email, customer_phone, address, preferred_date, preferred_time, status, notes, diagnosis_session_id, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    const stats = {
      totalContacts: totalContacts || 0,
      contactsThisMonth: contactsThisMonth || 0,
      totalDiagnoses: totalDiagnoses || 0,
      diagnosesThisMonth: diagnosesThisMonth || 0,
      totalAppointments: totalAppointments || 0,
      appointmentsThisMonth: appointmentsThisMonth || 0,
      conversionRate: totalContacts && totalAppointments
        ? Math.round((totalAppointments / totalContacts) * 100)
        : 0,
      conversionRateChange: 0,
    };

    const contactList = (contacts || []).map((c: any) => ({
      id: c.id,
      name: c.customer_name || c.name || '',
      email: c.customer_email || c.email || '',
      phone: c.customer_phone || c.phone || '',
      message: c.message || c.inquiry_content || '',
      status: c.status || '未対応',
      createdAt: c.created_at,
    }));

    const diagnosisList = (diagnoses || []).map((d: any) => ({
      id: d.id,
      name: d.customer_name || '',
      phone: d.customer_phone || '',
      email: d.customer_email || '',
      repairLocation: d.damage_locations || '',
      estimatedCostMin: d.estimated_cost_min || 0,
      estimatedCostMax: d.estimated_cost_max || 0,
      insuranceLikelihood: d.insurance_likelihood || 'none',
      recommendedPlan: d.recommended_plan || '',
      diagnosisDetails: d.damage_description || '',
      severityScore: d.severity_score || 0,
      firstAidCost: d.first_aid_cost || 0,
      claimCode: d.secret_code || '',
      adminStatus: d.admin_status || '未対応',
      createdAt: d.created_at,
    }));

    const appointmentList = (appointments || []).map((a: any) => ({
      id: a.id,
      name: a.customer_name || '',
      email: a.customer_email || '',
      phone: a.customer_phone || '',
      address: a.address || '',
      preferredDate: a.preferred_date || '',
      preferredTime: a.preferred_time || '',
      status: a.status || 'pending',
      notes: a.notes || '',
      diagnosisSessionId: a.diagnosis_session_id || null,
      createdAt: a.created_at,
    }));

    return NextResponse.json({
      stats,
      contacts: contactList,
      diagnoses: diagnosisList,
      appointments: appointmentList,
    });
  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}
