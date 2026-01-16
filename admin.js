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
let organizations = [];

function registerOrg() {
  const name = document.getElementById("orgName").value;
  const location = document.getElementById("orgLocation").value;
  const type = document.getElementById("orgType").value;

  if (!name || !location) {
    alert("Please fill all fields");
    return;
  }

  organizations.push({ name, location, type });
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
