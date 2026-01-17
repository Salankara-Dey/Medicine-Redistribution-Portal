window.onload = function () {
  const params = new URLSearchParams(window.location.search);

  const medicine = params.get("medicine");
  const from = params.get("from");

  if (medicine) {
    document.getElementById("medicineName").value = medicine;
  }

  if (from) {
    document.getElementById("requester").value = from;
  }
};

function submitRequest() {
  const medicine = document.getElementById("medicineName").value;
  const quantity = document.getElementById("quantity").value;
  const requester = document.getElementById("requester").value;
  const location = document.getElementById("location").value.toLowerCase();
  const urgency = document.getElementById("urgency").value;

  if (!medicine || !quantity || !requester || !location) {
    alert("Please fill all fields");
    return;
  }

  const newRequest = {
    id: Date.now(),
    medicine,
    quantity: Number(quantity),
    requester,
    location,
    urgency,
    status: "Pending"
  };

  // SAVE REQUEST (shared with admin)
  let requests =
    JSON.parse(localStorage.getItem("medicineRequests")) || [];

  requests.push(newRequest);
  localStorage.setItem("medicineRequests", JSON.stringify(requests));

  alert("Request submitted successfully and sent for admin approval");

  // Reset form
  document.getElementById("medicineName").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("requester").value = "";
  document.getElementById("location").value = "";
}
