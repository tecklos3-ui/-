document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. القائمة الجانبية للموبايل ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // إغلاق القائمة عند الضغط على أي رابط
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

   // التوجه لصفحة تسجيل الدخول عند الضغط على الزر
const loginBtn = document.getElementById('loginBtnHeader');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        // تأكد من أن المسار يؤدي إلى مجلد admin حيث وضعت صفحة login.html
        window.location.href = 'admin/login.html';
    });
}

// ميزة إضافية: إذا كان المستخدم مسجلاً دخوله بالفعل، غير نص الزر إلى "لوحة التحكم"
window.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('al_furqan_session'));
    if (session && new Date().getTime() < session.expires) {
        const loginBtn = document.getElementById('loginBtnHeader');
        if (loginBtn) {
            loginBtn.innerText = 'لوحة التحكم';
            loginBtn.style.background = 'var(--accent-color)';
            loginBtn.onclick = () => window.location.href = 'admin/dashboard.html';
        }
    }
});

    closeModal.addEventListener('click', () => modal.classList.remove('active'));

    // إغلاق النافذة عند الضغط خارجها
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // معالجة نموذج الدخول
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        loginBtn.innerText = "تسجيل الخروج";
        modal.classList.remove('active');
        showToast(`مرحباً بك مجدداً! ${email.split('@')[0]}`);
        loginForm.reset();
    });

    // --- 3. نظام التنبيهات (Toast) ---
    function showToast(msg) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- 4. أنيميشن ظهور المنتجات عند التمرير ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
});
