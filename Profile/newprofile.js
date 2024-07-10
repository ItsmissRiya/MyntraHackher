document.addEventListener("DOMContentLoaded", function () {
  // Ensure DOM is fully loaded before accessing elements
  var loginButton = document.querySelector("#login");
  if (loginButton) {
    loginButton.addEventListener("click", loginFunction);
  } else {
    console.error("Login button not found in the DOM");
  }
});

async function loginFunction(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  var mob = document.querySelector("#mob").value;
  var password = document.querySelector("#pass").value;

  // Perform basic validation
  if (mob === "" || password === "") {
    alert("Please fill in all fields");
    return;
  }

  const userObj = {
    mobile: mob,
    password: password,
  };

  try {
    const response = await fetch("http://192.168.1.215:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.exists) {
        alert("Logged in successfully");
        // Redirect or perform further actions on successful login
        window.location.href = "../Profile/newprofile.html";
      } else {
        alert("Invalid credentials");
      }
    } else {
      alert("Error logging in");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error logging in");
  }
}
