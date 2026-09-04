const SUPABASE_URL = "https://trdcdmyyhyanspandlhk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Ohcw_Kc0lyienmiK9wxFoQ_XtYaZjI2";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const signoutBtn = document.getElementById("signoutBtn");
const refreshBtn = document.getElementById("refreshBtn");
const loginStatus = document.getElementById("loginStatus");

async function login() {
  loginStatus.textContent = "Signing in...";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    loginStatus.textContent = "Please enter your email and password.";
    return;
  }

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    console.error("LOGIN ERROR:", error);
    loginStatus.textContent = error.message;
    return;
  }

  console.log("LOGIN SUCCESS:", data);

  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");

  await loadConfessions();
}

async function loadConfessions() {
  const list = document.getElementById("list");

  list.innerHTML = "<div class='item'>Loading confessions...</div>";

  const { data, error } = await supabaseClient
    .from("confessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("LOAD CONFESSIONS ERROR:", error);

    list.innerHTML = `
      <div class="item">
        <p><strong>Database error:</strong></p>
        <p>${escapeHtml(error.message)}</p>
        <small>Code: ${escapeHtml(error.code || "unknown")}</small>
      </div>
    `;

    return;
  }

  updateStats(data || []);

  if (!data || data.length === 0) {
    list.innerHTML =
      "<div class='item'><p>No confessions yet.</p></div>";
    return;
  }

  list.innerHTML = data.map(confession => `
    <div class="item">
      <p>${escapeHtml(confession.message)}</p>

      <small>
        ${new Date(confession.created_at).toLocaleString()}
        ·
        ${confession.approved ? "APPROVED" : "PENDING"}
      </small>

      <div class="item-actions">

        ${
          confession.approved
            ? ""
            : `<button class="approve"
                onclick="approveConfession('${confession.id}')">
                APPROVE
              </button>`
        }

        <button class="danger"
          onclick="deleteConfession('${confession.id}')">
          DELETE
        </button>

      </div>
    </div>
  `).join("");
}

function updateStats(data) {
  const total = data.length;
  const pending = data.filter(x => !x.approved).length;
  const approved = data.filter(x => x.approved).length;

  document.getElementById("total").textContent = total;
  document.getElementById("pending").textContent = pending;
  document.getElementById("approved").textContent = approved;
}

async function approveConfession(id) {
  const { error } = await supabaseClient
    .from("confessions")
    .update({ approved: true })
    .eq("id", id);

  if (error) {
    alert("Could not approve confession:\n" + error.message);
    console.error(error);
    return;
  }

  await loadConfessions();
}

async function deleteConfession(id) {
  if (!confirm("Delete this confession?")) {
    return;
  }

  const { error } = await supabaseClient
    .from("confessions")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Could not delete confession:\n" + error.message);
    console.error(error);
    return;
  }

  await loadConfessions();
}

async function signOut() {
  await supabaseClient.auth.signOut();

  dashboard.classList.add("hidden");
  loginBox.classList.remove("hidden");

  loginStatus.textContent = "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loginBtn.addEventListener("click", login);
signoutBtn.addEventListener("click", signOut);
refreshBtn.addEventListener("click", loadConfessions);

document.getElementById("password").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    login();
  }
});
