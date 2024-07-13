document.addEventListener("DOMContentLoaded", function () {
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

  if (mob === "" || password === "") {
    alert("Please fill in all fields");
    return;
  }

  const userObj = {
    mobile: mob,
    password: password,
  };
  console.log("User object being sent:", userObj); // Add this before the fetch call
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
        localStorage.setItem("token", data.token); // Store the token
        localStorage.setItem("User_name", data.name); // Store the token

        alert("Logged in successfully");
        window.location.href = "http://127.0.0.1:5500/Profile/Feed/feed.html";
      } else {
        alert("Invalid credentials");
      }
    } else {
      const errorMessage = await response.text();
      console.error("Server responded with error:", errorMessage);
      alert("Error logging in");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error logging in");
  }
}
