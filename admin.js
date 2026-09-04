const SUPABASE_URL = "https://trddcmyyhyanspandlhk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Ohcw_Kc0lyienmiK9wxFoQ_XtYaZjI2";

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const loginStatus = document.getElementById("loginStatus");
let client;

function setup() {
  if (SUPABASE_URL.startsWith("YOUR_")) {
    loginStatus.textContent = "Configure Supabase in admin.js first.";
    return false;
  }
  client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}

document.getElementById("loginBtn").onclick = async () => {
  if (!setup()) return;
  loginStatus.textContent = "Signing in…";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const { error } = await client.auth.signInWithPassword({email,password});
  if (error) loginStatus.textContent = error.message;
  else showDashboard();
};

document.getElementById("signoutBtn").onclick = async () => {
  await client.auth.signOut();
  dashboard.classList.add("hidden");
  loginBox.classList.remove("hidden");
};

document.getElementById("refreshBtn").onclick = loadConfessions;

async function showDashboard(){
  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  await loadConfessions();
}

async function loadConfessions(){
  const {data,error} = await client.from("confessions").select("*").order("created_at",{ascending:false});
  if(error){ document.getElementById("list").innerHTML = `<div class="item">${escapeHtml(error.message)}</div>`; return; }

  document.getElementById("total").textContent = data.length;
  document.getElementById("pending").textContent = data.filter(x=>!x.approved).length;
  document.getElementById("approved").textContent = data.filter(x=>x.approved).length;

  const list = document.getElementById("list");
  if(!data.length){list.innerHTML='<div class="item">No confessions yet.</div>';return;}

  list.innerHTML = data.map(x => `
    <article class="item">
      <p>${escapeHtml(x.message)}</p>
      <small>${new Date(x.created_at).toLocaleString()}</small>
      <div class="item-actions">
        <button class="approve" onclick="toggleApproval('${x.id}', ${!x.approved})">${x.approved ? "✓ Approved" : "Approve"}</button>
        <button class="danger" onclick="deleteConfession('${x.id}')">Delete</button>
      </div>
    </article>`).join("");
}

window.toggleApproval = async (id, approved) => {
  const {error} = await client.from("confessions").update({approved}).eq("id",id);
  if(error) alert(error.message); else loadConfessions();
};

window.deleteConfession = async (id) => {
  if(!confirm("Delete this confession?")) return;
  const {error} = await client.from("confessions").delete().eq("id",id);
  if(error) alert(error.message); else loadConfessions();
};

function escapeHtml(s){
  return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

(async()=>{
  if(!setup()) return;
  const {data:{session}} = await client.auth.getSession();
  if(session) showDashboard();
})();
