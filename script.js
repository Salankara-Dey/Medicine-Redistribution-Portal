/***********************
 * DATA
 ***********************/
let medicines = [
  { name: "Insulin (Human)", expiry: 4, tempStatus: "Unsafe", riskScore: 9, status: "Available" },
  { name: "Insulin Glargine", expiry: 6, tempStatus: "Safe", riskScore: 6, status: "Available" },
  { name: "COVID‑19 Vaccine", expiry: 2, tempStatus: "Unsafe", riskScore: 10, status: "Available" },
  { name: "MMR Vaccine", expiry: 3, tempStatus: "Unsafe", riskScore: 9, status: "Available" },
  { name: "Oxytocin Injection", expiry: 7, tempStatus: "Safe", riskScore: 5, status: "Available" }
];

/***********************
 * LOAD TABLE
 ***********************/
function loadTable() {
  const table = document.getElementById("medicineTable");

  medicines.forEach(med => {
    const row = table.insertRow();

    if (med.riskScore >= 8) row.classList.add("danger-row");

    row.insertCell(0).innerText = med.name;
    row.insertCell(1).innerHTML = `<span class="pill">${med.expiry} days</span>`;
    row.insertCell(2).innerHTML =
      med.tempStatus === "Unsafe"
        ? `<span class="pill critical">Critical</span>`
        : `<span class="pill safe">Safe</span>`;
    row.insertCell(3).innerText = med.riskScore;
    row.insertCell(4).innerHTML =
      med.status === "Available"
        ? `<span class="pill safe">Available</span>`
        : `<span class="pill critical">Reserved</span>`;

    // 🔥 HARD REDIRECT (NO JS CONFLICT POSSIBLE)
    row.insertCell(5).innerHTML =
      med.status === "Available"
        ? `<a class="primary-btn" href="request.html?medicine=${encodeURIComponent(med.name)}">Request</a>`
        : `<button disabled>Reserved</button>`;
  });

  updateStats();
}

/***********************
 * SEARCH
 ***********************/
function searchMedicines() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.getElementById("medicineTable").rows;

  for (let i = 1; i < rows.length; i++) {
    rows[i].style.display = rows[i].innerText.toLowerCase().includes(input)
      ? ""
      : "none";
  }
}

/***********************
 * ANALYTICS
 ***********************/
function updateStats() {
  document.getElementById("stats").innerText =
    medicines.filter(m => m.status !== "Available").length;
}

/***********************
 * BLYNK TEMP (OPTIONAL)
 ***********************/
const BLYNK_TOKEN = "O_99-ewWBAop_gdx5ADa4PekLYtCYnHq";
const TEMP_PIN = "V0";

function fetchTemperatureFromBlynk() {
  fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&pin=${TEMP_PIN}`)
    .then(res => res.text())
    .then(temp => {
      document.getElementById("liveTemp").innerText = `${temp} °C`;
      document.getElementById("tempStatus").innerText =
        temp < 2 || temp > 8 ? "❌ Risk" : "✅ Safe";
    });
}

setInterval(fetchTemperatureFromBlynk, 5000);

/***********************
 * INIT
 ***********************/
loadTable();
