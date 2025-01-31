// Timer
let time = 300;
let userId = "U54fa786b43cdbc6f8d7112ea33077598";
let Image64Data = "";
const timerElement = document.getElementById("timer");

function startTimer() {
  const interval = setInterval(() => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerElement.textContent = `${minutes}:${seconds}`;
    time--;

    if (time < 0) {
      clearInterval(interval);
      alert("หมดเวลา!");
    }
  }, 1000);
}

startTimer();

function showPopup() { 
  document.getElementById("popup").classList.add('show');
  document.getElementById("popup").style.display = "flex";
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("popup").classList.remove('show');
  document.getElementById("uploadButton").style.visibility = "visible";
  document.getElementById("uploadButton").style.display = "inline";
  setTimeout(() => document.getElementById("popup").style.display = 'none', 500);
  
}

function submitForm() {
  closePopup();
  document.getElementById("popupButton").style.display = "none";
  document.getElementById("uploadButton").style.display = "inline";
}

document.getElementById("uploadButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  document.getElementById("uploadButton").style.visibility = "hidden";
  const file = fileInput.files[0];
  
  document.getElementById("loadingPopup").style.display = "block";
  

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64String = reader.result.split(",")[1]; // Extract Base64 part from data URL
      const formData = new FormData();
      formData.append("file", base64String);
      formData.append("fileName", file.name);
      formData.append("contentType", file.type);
      document.getElementById("labelslip").style.display = "none";
      const namecustomer = document.getElementById("namecustomer").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();

      // Validate form fields
      if (!namecustomer || !phone || !address) {
        document.getElementById("loadingPopup").style.display = "none";
        showValidationPopup("กรุณากรอกข้อมูลให้ครบทุกช่อง");

      } else {
        formData.append("namecustomer", namecustomer);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("file", file);

        fetch(
          "https://script.google.com/macros/s/AKfycbzNs6RXhqlbnOuN_DcBBtgEskYt0enA5ip2kquVwj0KaHkGedZplGGorpuVtiGunuxP/exec",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            document.getElementById("loadingPopup").style.display = "none";
            if (data.url) {
              showStatusPopup("Upload successful!", true);
            } else if (data.error) {
              showStatusPopup("Upload failed: " + data.error, false);
            }
          })
          .catch((error) => {
            document.getElementById("loadingPopup").style.display = "none";
            showStatusPopup("Upload failed: " + error.message, false);
          });
      }
    };

    reader.readAsDataURL(file); // Read file as data URL
  } else {
    document.getElementById("loadingPopup").style.display = "none";
    showValidationPopup("กรุณาอัพโหลดไฟล์ก่อน");
    closePopup();
    document.getElementById("labelslip").style.display = "inline";
    document.getElementById("uploadButton").style.visibility = "visible";
  }
});

function showStatusPopup(message, isSuccess) {
  const statusPopup = document.getElementById("statusPopup");
  const statusIcon = document.getElementById("statusIcon");
  const statusMessage = document.getElementById("statusMessage");

  statusMessage.innerText = message;
  if (isSuccess) {
    statusIcon.innerHTML = "✔"; // Green checkmark
    statusIcon.className = "success-icon";
  } else {
    statusIcon.innerHTML = "✘"; // Red cross
    statusIcon.className = "error-icon";
  }
  statusPopup.style.display = "block";
}

function handleStatusOk() {
  const statusPopup = document.getElementById("statusPopup");
  statusPopup.style.display = "none";
  

  if (
    document.getElementById("statusIcon").className.includes("success-icon")
  ) {
    window.location.href = "Thx.html"; // Redirect to Thank You page
  } else {
    location.reload(); // Refresh the page for another upload attempt
  }
}

function showValidationPopup(message) {
  const validationPopup = document.createElement("div");
  validationPopup.className = "validation-popup";
  validationPopup.innerHTML = `
      <div class="validation-popup-content">
          <div id="statusIcon" class="error-icon">!</div>
          <p>${message}</p>
          <button onclick="closeValidationPopup(this)" class="btn-upload">ตกลง</button>
      </div>
  `;

  document.body.appendChild(validationPopup);
}

function closeValidationPopup(button) {
  const popup = button.closest(".validation-popup");
  if (popup) {
      showPopup();
    document.body.removeChild(popup);
  }
}
