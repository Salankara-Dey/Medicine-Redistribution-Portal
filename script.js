/***********************
 * FAKE DATA (ESP32 + AI OUTPUT)
 ***********************/
/***********************
 * TEMPERATURE-SENSITIVE MEDICINE DATABASE
 ***********************/
let medicines = [
  {
    name: "Insulin (Human)",
    expiry: 4,
    tempStatus: "Unsafe",
    riskScore: 9,
    pharmacy: "Pharmacy A",
    status: "Available"
  },
  {
    name: "Insulin Glargine",
    expiry: 6,
    tempStatus: "Safe",
    riskScore: 6,
    pharmacy: "Pharmacy B",
    status: "Available"
  },
  {
    name: "COVID‑19 Vaccine",
    expiry: 2,
    tempStatus: "Unsafe",
    riskScore: 10,
    pharmacy: "Hospital Cold Storage",
    status: "Available"
  },
  {
    name: "Hepatitis B Vaccine",
    expiry: 5,
    tempStatus: "Safe",
    riskScore: 6,
    pharmacy: "Pharmacy C",
    status: "Available"
  },
  {
    name: "MMR Vaccine",
    expiry: 3,
    tempStatus: "Unsafe",
    riskScore: 9,
    pharmacy: "City Hospital",
    status: "Available"
  },
  {
    name: "Oxytocin Injection",
    expiry: 7,
    tempStatus: "Safe",
    riskScore: 5,
    pharmacy: "Maternity Center",
    status: "Available"
  },
  {
    name: "Erythropoietin Injection",
    expiry: 4,
    tempStatus: "Unsafe",
    riskScore: 8,
    pharmacy: "Dialysis Clinic",
    status: "Available"
  },
  {
    name: "Interferon Alpha",
    expiry: 6,
    tempStatus: "Safe",
    riskScore: 6,
    pharmacy: "Specialty Pharmacy",
    status: "Available"
  },
  {
    name: "Monoclonal Antibody – Trastuzumab",
    expiry: 3,
    tempStatus: "Unsafe",
    riskScore: 9,
    pharmacy: "Oncology Center",
    status: "Available"
  },
  {
    name: "Growth Hormone Injection",
    expiry: 8,
    tempStatus: "Safe",
    riskScore: 5,
    pharmacy: "Pharmacy D",
    status: "Available"
  },
  {
    name: "Insulin Aspart",
    expiry: 5,
    tempStatus: "Unsafe",
    riskScore: 7,
    pharmacy: "Pharmacy E",
    status: "Available"
  },
  {
    name: "BCG Vaccine",
    expiry: 2,
    tempStatus: "Unsafe",
    riskScore: 10,
    pharmacy: "Government Clinic",
    status: "Available"
  },
  {
    name: "Tetanus Toxoid",
    expiry: 9,
    tempStatus: "Safe",
    riskScore: 4,
    pharmacy: "Community Health Center",
    status: "Available"
  },
  {
    name: "Rituximab Injection",
    expiry: 4,
    tempStatus: "Unsafe",
    riskScore: 8,
    pharmacy: "Cancer Care Unit",
    status: "Available"
  },
  {
    name: "Adrenaline Injection",
    expiry: 6,
    tempStatus: "Safe",
    riskScore: 6,
    pharmacy: "Emergency Pharmacy",
    status: "Available"
  }
];

/***********************
 * LOAD TABLE
 ***********************/
function loadTable() {
  const table = document.getElementById("medicineTable");

  medicines.forEach((med, index) => {
    let row = table.insertRow();

    row.insertCell(0).innerText = med.name;
    row.insertCell(1).innerText = med.expiry + " days";
    row.insertCell(2).innerText = med.tempStatus;
    row.insertCell(3).innerText = med.riskScore;

    row.insertCell(4).innerHTML =
      med.status === "Available"
        ? "<span style='color:green'>Available</span>"
        : "<span style='color:red'>Reserved</span>";

    // Highlight high risk
    if (med.riskScore >= 7) {
      row.style.backgroundColor = "#f8d7da";
    }

    let actionCell = row.insertCell(5);
    let btn = document.createElement("button");

    if (med.status === "Available") {
      btn.innerText = "Request";

      // 🔹 PART 3 + 4 INTEGRATION HERE
      btn.onclick = () => {
        window.location.href =
          `request.html?medicine=${encodeURIComponent(med.name)}&from=${encodeURIComponent(med.pharmacy)}`;
      };

    } else {
      btn.innerText = "Reserved";
      btn.disabled = true;
    }

    actionCell.appendChild(btn);
  });

  updateStats();
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
}

/***********************
 * SEARCH FEATURE
 ***********************/
function searchMedicines() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.getElementById("medicineTable").getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    let text = rows[i].innerText.toLowerCase();
    rows[i].style.display = text.includes(input) ? "" : "none";
  }
}

/***********************
 * ANALYTICS
 ***********************/
function updateStats() {
  let saved = medicines.filter(m => m.status !== "Available").length;
  document.getElementById("stats").innerText = saved;
}

/***********************
 * INITIAL LOAD
 ***********************/
loadTable();
function simulateTempFluctuation() {
  medicines.forEach(med => {
    if (Math.random() > 0.7) {
      med.tempStatus = "Unsafe";
      med.riskScore = Math.min(10, med.riskScore + 2);
    }
  });
  refreshTable();
}

// Run every 15 seconds (demo only)
setInterval(simulateTempFluctuation, 15000);

/***********************
 * BLYNK REAL-TIME FETCH
 ***********************/
const BLYNK_TOKEN = "O_99-ewWBAop_gdx5ADa4PekLYtCYnHq";
const TEMP_PIN = "V0";

function fetchTemperatureFromBlynk() {
  fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&pin=${TEMP_PIN}`)
    .then(res => {
      if (!res.ok) throw new Error("Blynk API error");
      return res.text();
    })
    .then(temp => {
      document.getElementById("liveTemp").innerText = `${temp} °C`;

      if (temp < 2 || temp > 8) {
        document.getElementById("tempStatus").innerText = "❌ Risk";
      } else {
        document.getElementById("tempStatus").innerText = "✅ Safe";
      }
    })
    .catch(err => console.error("Fetch failed:", err));
}

setInterval(fetchTemperatureFromBlynk, 5000);
