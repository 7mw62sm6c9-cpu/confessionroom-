// ====== CONFIGURE THESE TWO VALUES ======
// Create a free Supabase project, then paste its URL and anon key here.
const SUPABASE_URL = "https://trdcdmyyhyanspandlhk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Ohcw_Kc0lyienmiK9wxFoQ_XtYaZjI2";
// ========================================

const form = document.getElementById("confessionForm");
const textarea = document.getElementById("confession");
const counter = document.getElementById("counter");
const statusEl = document.getElementById("status");
const sendBtn = document.getElementById("sendBtn");
const success = document.getElementById("success");

textarea.addEventListener("input", () => {
  counter.textContent = `${textarea.value.length} / 500`;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = textarea.value.trim();
  if (!text) return;

  sendBtn.disabled = true;
  statusEl.textContent = "Sending…";

  try {
    if (SUPABASE_URL.startsWith("YOUR_")) {
      throw new Error("Supabase is not configured yet. Add the URL and anon key in app.js.");
    }

    const { createClient } = supabase;
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { error } = await client.from("confessions").insert({
      message: text
    });

    if (error) throw error;

    form.reset();
    counter.textContent = "0 / 500";
    statusEl.textContent = "";
    success.classList.add("show");
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Couldn't send right now. Please try again.";
    sendBtn.disabled = false;
  }
});
