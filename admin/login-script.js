// admin/login-script.js

async function handleLogin() {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error');
    const loginBtn = document.querySelector('.btn-login');

    if (!email || !password) {
        errorMsg.innerText = "يرجى إدخال البيانات كاملة";
        errorMsg.style.display = 'block';
        return;
    }

    loginBtn.innerText = "جاري التحقق...";
    loginBtn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        // استخدام كائن supabase المعرف في supabase-config.js
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // جلب الدور من جدول profiles
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        // حفظ الجلسة
        localStorage.setItem('al_furqan_session', JSON.stringify({
            id: data.user.id,
            name: profile.full_name,
            role: profile.role,
            expires: new Date().getTime() + (24 * 60 * 60 * 1000)
        }));

        window.location.href = 'dashboard.html';

    } catch (error) {
        errorMsg.innerText = "بيانات الدخول غير صحيحة";
        errorMsg.style.display = 'block';
        console.error(error.message);
    } finally {
        loginBtn.innerText = "دخول";
        loginBtn.disabled = false;
    }
}