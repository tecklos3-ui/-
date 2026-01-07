// admin/login-script.js

async function handleLogin() {
    // 1. جلب العناصر من الواجهة
    const emailInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('error');
    const loginBtn = document.querySelector('.btn-login');

    // 2. التحقق الأولي من المدخلات
    if (!emailInput || !passwordInput) {
        showError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    // 3. تحضير الواجهة لحالة التحميل
    loginBtn.innerText = "جاري التحقق...";
    loginBtn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        // 4. محاولة تسجيل الدخول باستخدام العميل الذي عرفناه في supabase-config.js
        const { data, error } = await window.supabaseDB.auth.signInWithPassword({
            email: emailInput,
            password: passwordInput,
        });

        // 5. التحقق من وجود خطأ في بيانات الدخول
        if (error) throw error;

        // 6. إذا نجح الدخول، نجلب بيانات المستخدم الإضافية (مثل الدور) من جدول profiles
        const { data: profile, error: profileError } = await window.supabaseDB
            .from('profiles')
            .select('role, full_name')
            .eq('id', data.user.id)
            .single();

        // ملاحظة: إذا لم تجد ملف تعريف، نعتبره موظف بشكل افتراضي
        const userRole = profile ? profile.role : 'staff';
        const fullName = profile ? profile.full_name : 'مستخدم جديد';

        // 7. حفظ بيانات الجلسة في المتصفح
        localStorage.setItem('al_furqan_session', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: fullName,
            role: userRole,
            expires: new Date().getTime() + (24 * 60 * 60 * 1000) // تنتهي الصلاحية بعد 24 ساعة
        }));

        // 8. التوجيه للوحة التحكم
        window.location.href = 'dashboard.html';

    } catch (err) {
        console.error("Login Error:", err.message);

        // ترجمة الأخطاء الشائعة للمستخدم
        let message = "فشل تسجيل الدخول. تأكد من البيانات.";
        if (err.message === 'Invalid login credentials') {
            message = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (err.message.includes('Email not confirmed')) {
            message = "يرجى تأكيد البريد الإلكتروني أولاً";
        }

        showError(message);
    } finally {
        // إعادة الزر لحالته الطبيعية
        loginBtn.innerText = "دخول";
        loginBtn.disabled = false;
    }
}

// وظيفة مساعدة لعرض الأخطاء
function showError(text) {
    const errorMsg = document.getElementById('error');
    errorMsg.innerText = text;
    errorMsg.style.display = 'block';
}