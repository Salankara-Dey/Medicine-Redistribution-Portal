/***********************
 * SIMPLE ADMIN LOGIN (DEMO)
 ***********************/

// Hardcoded demo credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function adminLogin() {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;
  const error = document.getElementById("loginError");

  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    // Save login state (demo)
    sessionStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin-dashboard.html";
  } else {
    error.innerText = "Invalid credentials";
  }
}

/***********************
 * PROTECT ADMIN DASHBOARD
 ***********************/
if (window.location.pathname.includes("admin-dashboard")) {
  if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
  }
}

/***********************
 * ADMIN DASHBOARD LOGIC
 ***********************/
let organizations =
  JSON.parse(localStorage.getItem("organizations")) || [];
// STEP 4B: Load buyer/hospital requests
let medicineRequests =
  JSON.parse(localStorage.getItem("medicineRequests")) || [];

function registerOrg() {
  const name = document.getElementById("orgName").value;
  const location = document.getElementById("orgLocation").value;
  const type = document.getElementById("orgType").value;

  if (!name || !location) {
    alert("Please fill all fields");
    return;
  }

  organizations.push({
  name,
  location: location.toLowerCase(),
  type
});

localStorage.setItem("organizations", JSON.stringify(organizations));

  updateOrgList();

  document.getElementById("orgName").value = "";
  document.getElementById("orgLocation").value = "";
}

function updateOrgList() {
  const list = document.getElementById("orgList");
  list.innerHTML = "";

  organizations.forEach(org => {
    const li = document.createElement("li");
    li.innerText = `${org.name} (${org.type}) – ${org.location}`;
    list.appendChild(li);
  });
}
// STEP 4B: Location-based matching logic
function getMatchingRequests() {
  let matches = [];

  medicineRequests.forEach(req => {
    organizations.forEach(org => {
      if (
        org.type === "Pharmacy" &&
        org.location === req.location
      ) {
        matches.push({
          medicine: req.medicine,
          quantity: req.quantity,
          requester: req.requester,
          fromLocation: org.location
        });
      }
    });
  });

  return matches;
}
function showLocationMatches() {
  const matches = getLocationSafeMatches();

  if (matches.length === 0) {
    alert("No location-safe redistribution possible");
    return;
  }

  console.log("✅ Location-Restricted Matches:");
  matches.forEach(m => {
    console.log(
      `Medicine: ${m.medicine} | Qty: ${m.quantity} | From: ${m.matchedStore} | To: ${m.requester} | Location: ${m.location}`
    );
  });

  alert("Location-safe matches generated. Check console.");
}
