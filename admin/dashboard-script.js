// الانتظار حتى تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession(); // التأكد من تسجيل الدخول
    loadAdminData();    // جلب بيانات المدير الحالي
    fetchStats();       // جلب الإحصائيات العامة
    fetchUsersList();   // جلب قائمة الموظفين
});

// --- 1. جلب بيانات المدير الحالي لتعرض في الهيدر ---
async function loadAdminData() {
    const { data: { user } } = await window.supabaseDB.auth.getUser();
    if (user) {
        // جلب الاسم والصلاحية من جدول profiles
        const { data: profile, error } = await window.supabaseDB
            .from('profiles')
            .select('full_name, role')
            .eq('id', user.id)
            .single();

        if (profile) {
            document.getElementById('adminName').innerText = profile.full_name;
            document.getElementById('adminAvatar').src = `https://ui-avatars.com/api/?name=${profile.full_name}&background=6c5ce7&color=fff`;

            // إذا كان المستخدم ليس مديراً (admin)، يمكنك إخفاء زر "المستخدمين" منه
            if (profile.role !== 'admin') {
                const usersNavItem = document.querySelector('li[onclick*="users-section"]');
                if (usersNavItem) usersNavItem.style.display = 'none';
            }
        }
    }
}

// --- 2. إدارة التبويبات الفرعية لقسم المستخدمين ---
function showUserSubTab(tabId) {
    // إخفاء كل التبويبات الفرعية
    document.querySelectorAll('.user-sub-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // إزالة التحديد عن كل الأزرار في قائمة المستخدمين
    document.querySelectorAll('.user-menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // إظهار التبويب المختار
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    // تحديد الزر النشط (بناءً على الحدث)
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // إذا تم اختيار قائمة الفريق، قم بتحديثها
    if (tabId === 'user-list') fetchUsersList();
}

// --- 3. جلب قائمة الموظفين من قاعدة البيانات ---
async function fetchUsersList() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const { data: users, error } = await window.supabaseDB
        .from('profiles')
        .select('*');

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    tbody.innerHTML = '';
    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.full_name}</td>
                <td>
                    <select class="role-select" onchange="updateUserRole('${user.id}', this.value)" style="background:#1a1a24; color:white; border:none; padding:5px; border-radius:5px;">
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>مدير</option>
                        <option value="editor" ${user.role === 'editor' ? 'selected' : ''}>محرر</option>
                    </select>
                </td>
                <td><span style="color: #00ff88;">نشط</span></td>
                <td>
                    <button class="btn btn-danger" onclick="deleteStaffUser('${user.id}')" style="padding: 5px 10px; font-size: 0.8rem;">حذف</button>
                </td>
            </tr>
        `;
    });
}

// --- 4. إضافة موظف جديد ---
async function handleCreateStaff() {
    // ملاحظة: في النسخة المجانية من Supabase، إضافة مستخدم تتطلب تسجيل خروج أو استخدام Edge Functions
    // هنا سنقوم بإضافته لجدول الـ profiles مباشرة (كمحاكاة) أو توجيهك للطريقة الصحيحة
    const name = document.querySelector('#user-add input[type="text"]').value;
    const email = document.querySelector('#user-add input[type="email"]').value;
    const password = document.querySelector('#user-add input[type="password"]').value;

    if (!name || !email || !password) {
        alert("يرجى ملء كافة الحقول");
        return;
    }

    showToast("جاري إنشاء الحساب...");

    // عملية الـ SignUp في Supabase
    const { data, error } = await window.supabaseDB.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { full_name: name, role: 'editor' }
        }
    });

    if (error) {
        alert("خطأ: " + error.message);
    } else {
        showToast("تم إضافة الموظف بنجاح! (يجب تفعيل البريد)");
        showUserSubTab('user-list');
    }
}

// --- 5. تحديث صلاحية المستخدم ---
async function updateUserRole(userId, newRole) {
    const { error } = await window.supabaseDB
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) {
        alert("فشل تحديث الصلاحية");
    } else {
        showToast("تم تحديث الصلاحية بنجاح");
    }
}

// --- 6. حذف مستخدم ---
async function deleteStaffUser(userId) {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    const { error } = await window.supabaseDB
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (error) {
        alert("خطأ في الحذف");
    } else {
        showToast("تم حذف المستخدم");
        fetchUsersList();
    }
}

// --- وظائف عامة (تبديل التبويبات الرئيسية) ---
function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    const titles = {
        'dashboard': 'نظرة عامة',
        'products': 'إدارة المنتجات',
        'offers': 'شريط العروض',
        'users-section': 'إدارة المستخدمين',
        'settings': 'الإعدادات'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}