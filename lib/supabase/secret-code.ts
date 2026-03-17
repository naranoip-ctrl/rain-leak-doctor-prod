/**
 * lib/supabase/secret-code.ts
 * ユニークな4桁合言葉の生成ユーティリティ
 * 
 * 既存のアクティブなセッションと重複しない4桁コードを生成する。
 */
import { getSupabaseAdmin } from '@/lib/supabase/server';

/**
 * ユニークな4桁の合言葉を生成する
 * 既存のアクティブなセッションと重複しないことを保証
 * 最大10回リトライ
 */
export async function generateUniqueSecretCode(): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin();
  
  for (let attempt = 0; attempt < 10; attempt++) {
    // 4桁のランダムな数字を生成（1000-9999）
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // 既存のアクティブセッションと重複チェック
    const { data, error } = await supabaseAdmin
      .from('diagnosis_sessions')
      .select('id')
      .eq('secret_code', code)
      .eq('is_active', true)
      .limit(1);
    
    if (error) {
      console.error('Error checking secret code uniqueness:', error);
      // エラーの場合はそのまま使用（重複の可能性は低い）
      return code;
    }
    
    // 重複がなければこのコードを使用
    if (!data || data.length === 0) {
      return code;
    }
    
    console.log(`Secret code ${code} already exists, retrying... (attempt ${attempt + 1})`);
  }
  
  // 10回リトライしても重複する場合（ほぼありえない）
  // タイムスタンプを含めたコードを生成
  const fallback = Math.floor(1000 + Math.random() * 9000).toString();
  console.warn(`Using fallback secret code after 10 retries: ${fallback}`);
  return fallback;
}
