document
  .querySelector("#signup_button")
  .addEventListener("click", signupFunction);

async function signupFunction() {
  console.log("inside function");

  var name = document.querySelector("#name").value;
  var mob = document.querySelector("#mob").value;
  var mail = document.querySelector("#mail").value;
  var password = document.querySelector("#pass").value;

  if (name === "" || mob === "" || mail === "" || password === "") {
    alert("fill in the empty fields");
  } else {
    const userObj = {
      name: name,
      mobile: mob,
      email: mail,
      password: password,
    };

    try {
      const response = await fetch("http://192.168.1.215:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      });

      if (response.ok) {
        alert("Signed up successfully");
        document.querySelector("#mob").value = "";
        document.querySelector("#mail").value = "";
        document.querySelector("#pass").value = "";
        document.querySelector("#name").value = "";
        window.location.href = "profile.html";
      } else {
        alert("Error signing up");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error signing up");
    }
  }
}

// HYPERLINK FOR PROFILE
document.getElementById("profile").addEventListener("click", function () {
  window.location.href = "profile.html";
});

document.getElementById("landingPage").addEventListener("click", function () {
  window.location.href = "../Landingpage/index.html";
});

document.getElementById("logIn").addEventListener("click", function () {
  window.location.href = "../Profile/profile.html";
});
