// admin/supabase-config.js

// 1. إعدادات مشروع Supabase
// ملاحظة: تأكد من نسخ الـ anon key من (Settings -> API) في لوحة Supabase
const SB_URL = 'https://ifyprnnmswppurgitgtc.supabase.co';
const SB_KEY = 'sb_publishable_J_pBXSB20JpGpM10vn7W1Q_wZD4mTox';

// 2. التحقق من وجود مكتبة supabase قبل البدء
if (typeof supabase === 'undefined') {
    console.error("خطأ: مكتبة Supabase لم يتم تحميلها! تأكد من وضع رابط الـ CDN في ملف HTML قبل هذا الملف.");
}

// 3. إنشاء العميل وحفظه في نافذة المتصفح (window) ليكون متاحاً في كل الملفات
const { createClient } = supabase;
window.supabaseDB = createClient(SB_URL, SB_KEY);

// 4. وظيفة مساعدة للتحقق من الجلسة
window.checkSession = function () {
    const sessionData = localStorage.getItem('al_furqan_session');
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    if (new Date().getTime() > session.expires) {
        localStorage.removeItem('al_furqan_session');
        return null;
    }
    return session;
};