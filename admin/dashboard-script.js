// admin/dashboard-script.js

// 1. فحص هل المستخدم مسجل دخول أم لا
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('al_furqan_session');
    if (!session) {
        window.location.href = 'login.html'; // طرده إذا لم يسجل دخول
    }
    fetchProducts(); // جلب البيانات عند التشغيل
});

// 2. التنقل بين الأقسام
function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    // تحديد الزر النشط بناءً على النص أو الأيقونة (تحسين بسيط)
    event.currentTarget.classList.add('active');
    
    const titles = { 'dashboard': 'نظرة عامة', 'products': 'إدارة المنتجات', 'offers': 'شريط العروض', 'settings': 'الإعدادات' };
    document.getElementById('pageTitle').innerText = titles[tabId];
}

// 3. جلب المنتجات من Supabase
async function fetchProducts() {
    try {
        const { data, error } = await window.supabaseDB
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderProducts(data);
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

// 4. عرض المنتجات في الجداول
function renderProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    const recentBody = document.getElementById('recentProductsTable');
    
    tbody.innerHTML = '';
    recentBody.innerHTML = '';

    products.forEach(p => {
        const row = `
            <tr>
                <td><img src="${p.img_url || 'https://via.placeholder.com/50'}" class="product-thumb"></td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td><button class="btn btn-danger" onclick="deleteProduct('${p.id}')">حذف</button></td>
            </tr>`;
        tbody.innerHTML += row;
    });

    // آخر 3 منتجات للرئيسية
    products.slice(0, 3).forEach(p => {
        recentBody.innerHTML += `
            <tr>
                <td><img src="${p.img_url}" class="product-thumb"></td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td><span style="color:#00ff88;">نشط</span></td>
            </tr>`;
    });

    document.getElementById('totalProductsCount').innerText = products.length;
}

// 5. إضافة منتج جديد لـ Supabase
async function saveProductToSupabase() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const img = document.getElementById('pImage').value;
    const saveBtn = document.getElementById('saveBtn');

    if (!name || !price) return alert("أكمل البيانات");

    saveBtn.disabled = true;
    saveBtn.innerText = "جاري الحفظ...";

    const { error } = await window.supabaseDB
        .from('products')
        .insert([{ name, price, img_url: img }]);

    if (!error) {
        showToast("تمت إضافة الجهاز بنجاح");
        closeProductModal();
        fetchProducts(); // تحديث القائمة
    } else {
        alert("خطأ: " + error.message);
    }
    
    saveBtn.disabled = false;
    saveBtn.innerText = "حفظ";
}

// 6. حذف منتج
async function deleteProduct(id) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await window.supabaseDB
        .from('products')
        .delete()
        .eq('id', id);

    if (!error) {
        showToast("تم الحذف بنجاح");
        fetchProducts();
    }
}

// أدوات المساعدة (Modals & Toasts)
function openProductModal() { document.getElementById('productModal').classList.add('active'); }
function closeProductModal() { document.getElementById('productModal').classList.remove('active'); }
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
}
function handleLogout() {
    localStorage.removeItem('al_furqan_session');
    window.location.href = 'login.html';
}