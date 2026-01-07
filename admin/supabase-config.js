// admin/supabase-config.js

// 1. إعدادات مشروع Supabase الخاص بك
const SB_URL = 'https://ifyprnnmswppurgitgtc.supabase.co';
const SB_KEY = 'sb_publishable_J_pBXSB20JpGpM10vn7W1Q_wZD4mTox';

// 2. إنشاء العميل باسم مختلف (مثلاً supabaseClient) لتجنب التضارب مع المكتبة الأصلية
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// 3. جعل العميل متاحاً عالمياً تحت اسم 'db' أو استخدامه مباشرة
window.supabaseDB = supabaseClient;

// وظيفة مساعدة للتحقق من الجلسة
function checkSession() {
    const session = JSON.parse(localStorage.getItem('al_furqan_session'));
    if (!session || new Date().getTime() > session.expires) {
        localStorage.removeItem('al_furqan_session');
        return null;
    }
    return session;
}