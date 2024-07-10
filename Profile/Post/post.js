document.addEventListener("DOMContentLoaded", function () {
  // Select the form and greeting elements
  console.log("DOMContentLoaded event fired"); // Check if event fires

  // Select the form and greeting elements
  var postForm = document.querySelector("#postForm");
  var greet = document.querySelector("#greeting");

  // Retrieve the user's name from localStorage
  const name = localStorage.getItem("User_name");
  console.log("Retrieved name from localStorage:", name); // Check retrieved name

  // Check if the name exists in localStorage
  if (name) {
    // Create a new h3 element to display the greeting message
    const message = document.createElement("p");
    message.textContent = `Hi, ${name}! Welcome`;
    console.log("Created greeting message:", message.textContent); // Check message content

    // Append the message to the greeting element
    greet.appendChild(message); // Append the created message to the greeting div
  } else {
    // Handle the case where the name is not found in localStorage
    console.error("User_name is not defined in localStorage");
  }

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

      try {
        // Fetch user data
        const userResponse = await fetch("http://192.168.1.215:3000/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Correct Bearer format
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("User data retrieved:", userData); // Debugging user data
          document.getElementById("userName").textContent = userData.name;
        } else {
          const errorText = await userResponse.text();
          console.error("Failed to retrieve user data:", errorText);
          alert("Failed to retrieve user data");
        }

        const url = "http://192.168.1.215:3000/post";
        console.log("Sending POST request to:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Correct Bearer format
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
