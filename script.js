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

    // --- 2. إدارة نافذة تسجيل الدخول ---
    const loginBtn = document.getElementById('loginBtnHeader');
    const modal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(loginBtn.innerText === "تسجيل الخروج") {
            loginBtn.innerText = "تسجيل الدخول";
            showToast("تم تسجيل الخروج بنجاح");
        } else {
            modal.classList.add('active');
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