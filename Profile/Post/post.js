document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");

  var postForm = document.querySelector("#postForm");
  var greet = document.querySelector("#greeting");

  const name = localStorage.getItem("User_name");
  console.log("Retrieved name from localStorage:", name);

  if (name) {
    const message = document.createElement("p");
    message.textContent = `Hi, ${name}! Welcome`;
    console.log("Created greeting message:", message.textContent);
    greet.appendChild(message);
  } else {
    console.error("User_name is not defined in localStorage");
  }

  // if (postForm) {
  //   postForm.addEventListener("submit", async function (event) {
  //     event.preventDefault();

  //     var formData = new FormData(postForm);
  //     const token = localStorage.getItem("token");
  //     console.log("Token retrieved:", token);

  //     if (!token) {
  //       alert("No token found. Please login first.");
  //       return;
  //     }

  //     try {
  //       const response = await fetch("http://192.168.1.215:3000/login", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ mobile, password }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("Login response data:", data); // Debugging login response
  //         localStorage.setItem("token", `Bearer ${data.token}`); // Store token in Bearer format
  //         localStorage.setItem("userName", data.name);
  //         alert("Login successful");
  //         displayUserName();
  //       } else {
  //         const errorMessage = await response.text();
  //         console.error("Server responded with error:", errorMessage);
  //         alert("Error logging in");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       alert("Error logging in");
  //     }
  //   });
  // }

  if (postForm) {
    postForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      var formData = new FormData(postForm);
      const token = localStorage.getItem("token");
      console.log("Token retrieved:", token); // Debugging token

      if (!token) {
        alert("No token found. Please login first.");
        return;
      }

      const url = "http://192.168.1.215:3000/post";
      console.log("Sending POST request to:", url);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        });

        if (response.ok) {
          alert("Post submitted successfully");
        } else {
          const errorMessage = await response.text();
          console.error("Server responded with error:", errorMessage);
          alert("Error submitting post");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error submitting post");
      }
    });
  }
});
