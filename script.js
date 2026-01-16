/***********************
 * DATA (ESP32 + AI OUTPUT)
 ***********************/
let medicines = [
  { name: "Insulin (Human)", expiry: 4, tempStatus: "Unsafe", riskScore: 9, pharmacy: "Pharmacy A", status: "Available" },
  { name: "Insulin Glargine", expiry: 6, tempStatus: "Safe", riskScore: 6, pharmacy: "Pharmacy B", status: "Available" },
  { name: "COVID-19 Vaccine", expiry: 2, tempStatus: "Unsafe", riskScore: 10, pharmacy: "Hospital Cold Storage", status: "Available" },
  { name: "Hepatitis B Vaccine", expiry: 5, tempStatus: "Safe", riskScore: 6, pharmacy: "Pharmacy C", status: "Available" },
  { name: "MMR Vaccine", expiry: 3, tempStatus: "Unsafe", riskScore: 9, pharmacy: "City Hospital", status: "Available" },
  { name: "Oxytocin Injection", expiry: 7, tempStatus: "Safe", riskScore: 5, pharmacy: "Maternity Center", status: "Available" },
  { name: "Erythropoietin Injection", expiry: 4, tempStatus: "Unsafe", riskScore: 8, pharmacy: "Dialysis Clinic", status: "Available" },
  { name: "Interferon Alpha", expiry: 6, tempStatus: "Safe", riskScore: 6, pharmacy: "Specialty Pharmacy", status: "Available" },
  { name: "Monoclonal Antibody – Trastuzumab", expiry: 3, tempStatus: "Unsafe", riskScore: 9, pharmacy: "Oncology Center", status: "Available" },
  { name: "Growth Hormone Injection", expiry: 8, tempStatus: "Safe", riskScore: 5, pharmacy: "Pharmacy D", status: "Available" }
];

/***********************
 * TABLE LOAD (ENHANCED UI)
 ***********************/
function loadTable() {
  const table = document.getElementById("medicineTable");

  medicines.forEach((med, index) => {
    let row = table.insertRow();

    // Lovable-style risk row highlight
    if (med.riskScore >= 8) row.classList.add("danger-row");

    row.insertCell(0).innerText = med.name;
    const expiryLevel = getExpiryLevel(med.expiry);
    row.insertCell(1).innerHTML =
  `<span class="pill ${expiryLevel}">${med.expiry} days</span>`;


    // Status pill
    let statusPill = med.tempStatus === "Unsafe"
      ? `<span class="pill critical">Critical</span>`
      : `<span class="pill safe">Safe</span>`;

    row.insertCell(2).innerHTML = statusPill;
    row.insertCell(3).innerText = med.riskScore;

    row.insertCell(4).innerHTML =
      med.status === "Available"
        ? `<span class="pill safe">Available</span>`
        : `<span class="pill critical">Reserved</span>`;

    // ACTION
    let actionCell = row.insertCell(5);
    let btn = document.createElement("button");

    if (med.status === "Available") {
      btn.innerText = "Request";
      btn.onclick = () => openModal(med);
    } else {
      btn.innerText = "Reserved";
      btn.disabled = true;
    }

    actionCell.appendChild(btn);
  });

  updateStats();
  updateExpiryAlerts();

}

/***********************
 * REFRESH TABLE
 ***********************/
function refreshTable() {
  const table = document.getElementById("medicineTable");
  table.innerHTML = `
    <tr>
      <th>Medicine</th>
      <th>Expiry</th>
      <th>Temp Status</th>
      <th>Risk Score</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  `;
  loadTable();
  updateExpiryAlerts();

}

/***********************
 * SEARCH
 ***********************/
function searchMedicines() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.getElementById("medicineTable").getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    rows[i].style.display = rows[i].innerText.toLowerCase().includes(input) ? "" : "none";
  }
}

/***********************
 * ANALYTICS
 ***********************/
function updateStats() {
  let reserved = medicines.filter(m => m.status !== "Available").length;
  document.getElementById("stats").innerText = reserved;
}

/***********************
 * SIMULATED TEMPERATURE FLUCTUATION
 ***********************/
function simulateTempFluctuation() {
  medicines.forEach(med => {
    if (Math.random() > 0.7) {
      med.tempStatus = "Unsafe";
      med.riskScore = Math.min(10, med.riskScore + 1);
    }
  });
  refreshTable();
}

setInterval(simulateTempFluctuation, 15000);

/***********************
 * BLYNK REAL-TIME TEMPERATURE
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
    })
    .catch(err => console.error("Blynk error:", err));
}

setInterval(fetchTemperatureFromBlynk, 5000);

/***********************
 * MODAL (LOVABLE UX)
 ***********************/
let selectedMedicine = null;

function openModal(med) {
  selectedMedicine = med;

  document.getElementById("modalMedicineName").innerText = med.name;
  document.getElementById("modalExpiry").innerText = med.expiry;
  document.getElementById("modalRiskScore").innerText = med.riskScore;

  document.getElementById("modalRiskLabel").innerText =
    med.riskScore >= 8 ? "Critical" : "Warning";

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function confirmRequest() {
  if (!selectedMedicine) return;

  selectedMedicine.status = "Reserved";
  closeModal();
  refreshTable();
}

function hideAllDropdowns() {
  ["notificationBox", "settingsBox", "profileBox"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
}

function openNotifications() {
  hideAllDropdowns();
  document.getElementById("notificationBox").style.display = "block";
}

function openSettings() {
  hideAllDropdowns();
  document.getElementById("settingsBox").style.display = "block";
}

function openProfile() {
  hideAllDropdowns();
  document.getElementById("profileBox").style.display = "block";
}

document.addEventListener("click", e => {
  if (!e.target.closest(".nav-right")) hideAllDropdowns();
});
function getExpiryLevel(days) {
  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  if (days <= 60) return "notice";
  return "safe";
}
function updateExpiryAlerts() {
  const alerts = medicines.filter(m => m.expiry <= 30);

  const box = document.getElementById("notificationBox");
  box.innerHTML = "<strong>Expiry Alerts</strong>";

  if (alerts.length === 0) {
    box.innerHTML += "<p>No urgent alerts</p>";
    return;
  }

  alerts.forEach(m => {
    box.innerHTML += `
      <p>⚠ ${m.name} expires in ${m.expiry} days</p>
    `;
  });
}

/***********************
 * INITIAL LOAD
 ***********************/
loadTable();
