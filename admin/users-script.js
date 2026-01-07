document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});

async function fetchUsers() {
    const { data, error } = await window.supabaseDB
        .from("profiles")
        .select("full_name, email, role, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = "";

    data.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.full_name ?? "-"}</td>
                <td>${user.email ?? "-"}</td>
                <td>${user.role ?? "-"}</td>
                <td>${user.created_at ? new Date(user.created_at).toLocaleDateString("ar") : "-"}</td>
            </tr>
        `;
    });
}
