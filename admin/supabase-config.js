// admin/supabase-config.js

// إعدادات مشروع Supabase الخاص بك
const SUPABASE_URL = 'https://ifyprnnmswppurgitgtc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J_pBXSB20JpGpM10vn7W1Q_wZD4mTox';

// إنشاء العميل (Client) مرة واحدة وتصديره ليستخدم في كل مكان
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// وظيفة مساعدة للتحقق من الجلسة (اختياري)
function checkSession() {
    const session = JSON.parse(localStorage.getItem('al_furqan_session'));
    if (!session || new Date().getTime() > session.expires) {
        localStorage.removeItem('al_furqan_session');
        return null;
    }
    return session;
}