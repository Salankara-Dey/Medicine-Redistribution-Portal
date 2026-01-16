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
  let medicine = document.getElementById("medicineName").value;
  let qty = document.getElementById("quantity").value;
  let requester = document.getElementById("requester").value;

  if (!medicine || !qty || !requester) {
    alert("Please fill all fields");
    return;
  }

  alert(
    `Request submitted!\n\nMedicine: ${medicine}\nQuantity: ${qty}\nRequester: ${requester}`
  );

  // Demo-only: no backend
  document.getElementById("medicineName").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("requester").value = "";
}
