document.addEventListener("DOMContentLoaded", () => {
    loadCurrentUser();
});

async function loadCurrentUser() {
    const session = JSON.parse(localStorage.getItem("al_furqan_session"));

    if (!session) {
        window.location.href = "../auth/login.html";
        return;
    }

    const { data, error } = await window.supabaseDB
        .from("profiles")
        .select("*")
        .eq("id", session.user_id)
        .single();

    if (error || !data) return;

    document.getElementById("adminName").innerText = data.full_name;
    document.getElementById("adminCreated").innerText =
        "منذ: " + new Date(data.created_at).toLocaleDateString("ar");
}

function logout() {
    localStorage.removeItem("al_furqan_session");
    window.location.href = "../auth/login.html";
}

