document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("postsContainer");

  // Fetch the token from local storage
  const token = localStorage.getItem("token");

  if (!token) {
    postsContainer.innerHTML = "You need to log in first.";
    return;
  }

  // Fetch all posts from the backend
  fetch("http://192.168.1.215:3000/allPosts", {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        postsContainer.innerHTML = data.error;
      } else {
        displayPosts(data.posts);
      }
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      postsContainer.innerHTML = "Error fetching posts.";
    });

  // Function to handle like and dislike actions
  function handleLikeDislike(postId, userId, action) {
    const endpoint = action === "like" ? "/likePost" : "/dislikePost";

    fetch(`http://192.168.1.215:3000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ postId, userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // Re-fetch posts to update like/dislike counts
          fetchPosts();
        } else {
          console.error("Error updating like/dislike:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error updating like/dislike:", error);
      });
  }

  // Function to re-fetch posts
  function fetchPosts() {
    fetch("http://192.168.1.215:3000/allPosts", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          postsContainer.innerHTML = data.error;
        } else {
          displayPosts(data.posts);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        postsContainer.innerHTML = "Error fetching posts.";
      });
  }

  // Function to display posts
  function displayPosts(posts) {
    postsContainer.innerHTML = "";

    posts.forEach((entry) => {
      const post = entry.post;
      const user = entry.user;

      if (!user || !user.name) {
        console.error("Missing user data for post:", post);
        return; // Skip posts with missing user data
      }

      const postElement = document.createElement("div");
      postElement.className = "post";

      const mediaElement = createMediaElement(post.imageUrl);

      const captionElement = document.createElement("p");
      captionElement.textContent = `Caption: ${post.caption}`;
      captionElement.className = "caption";

      const dateElement = document.createElement("p");
      dateElement.textContent = `Uploaded on: ${new Date(
        post.createdAt
      ).toLocaleString()}`;
      dateElement.className = "date";

      const userElement = document.createElement("p");
      userElement.textContent = `Uploaded by: ${user.name}`;
      userElement.className = "user";

      // Like and Dislike icons using FontAwesome
      const likeIcon = document.createElement("i");
      likeIcon.className = "fas fa-thumbs-up like-icon";
      likeIcon.title = "Like";
      likeIcon.addEventListener("click", () =>
        handleLikeDislike(post._id, user._id, "like")
      );

      const dislikeIcon = document.createElement("i");
      dislikeIcon.className = "fas fa-thumbs-down dislike-icon";
      dislikeIcon.title = "Dislike";
      dislikeIcon.addEventListener("click", () =>
        handleLikeDislike(post._id, user._id, "dislike")
      );

      // Display like and dislike counts
      const likeCountElement = document.createElement("span");
      likeCountElement.textContent = `Likes: ${post.likes}`;
      likeCountElement.className = "like-count";

      const dislikeCountElement = document.createElement("span");
      dislikeCountElement.textContent = `Dislikes: ${post.dislikes}`;
      dislikeCountElement.className = "dislike-count";

      const likeDislikeContainer = document.createElement("div");
      likeDislikeContainer.className = "like-dislike-container";
      likeDislikeContainer.appendChild(likeIcon);
      likeDislikeContainer.appendChild(likeCountElement);
      likeDislikeContainer.appendChild(dislikeIcon);
      likeDislikeContainer.appendChild(dislikeCountElement);

      postElement.appendChild(userElement);
      postElement.appendChild(mediaElement);
      postElement.appendChild(captionElement);
      postElement.appendChild(dateElement);
      postElement.appendChild(likeDislikeContainer);

      postsContainer.appendChild(postElement);
    });
  }

  // Helper function to create media element
  function createMediaElement(mediaUrl) {
    const formattedUrl = formatMediaUrl(mediaUrl);
    let mediaElement;

    if (formattedUrl.match(/\.(jpeg|jpg|gif|png|heic|HEIC)$/i)) {
      mediaElement = document.createElement("img");
      mediaElement.src = formattedUrl;
      mediaElement.alt = "Post media";
    } else if (formattedUrl.match(/\.(mp4|webm|ogg)$/i)) {
      mediaElement = document.createElement("video");
      mediaElement.src = formattedUrl;
      mediaElement.controls = true;
    } else {
      mediaElement = document.createElement("p");
      mediaElement.textContent = "Unsupported media type";
      console.error("Unsupported media type:", formattedUrl);
    }

    mediaElement.className = "media";
    return mediaElement;
  }

  // Helper function to format the media URL
  function formatMediaUrl(mediaUrl) {
    return `http://192.168.1.215:3000/${mediaUrl.replace("uploads/", "")}`;
  }
});
