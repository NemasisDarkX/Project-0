var fetch_date = new Date();

function time() {
    var formate_time = fetch_date.toLocaleTimeString();
    document.getElementById("change").innerHTML = formate_time;
    closeDropdown(); // Close dropdown after selection
};

function date() {
    var formate_date = fetch_date.toLocaleDateString();
    document.getElementById('change').innerHTML = formate_date
    closeDropdown(); // Close dropdown after selection
};

// Dropdown functionality
function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Helper to explicitly close the dropdown (called after time/date is set)
function closeDropdown() {
    document.getElementById("myDropdown").classList.remove("show");
}

let rickrollTimeout; // to store the timeout reference
let videoElementReady = false; // Flag to indicate if video is ready to play
let videoPlayAttempted = false; // Flag to track if we've tried to play the video in the current view

window.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("rickVideo");
    if (video) {
        // Event listeners for video readiness
        video.addEventListener('canplay', () => {
            console.log("Video canplay event fired. Ready to play.");
            videoElementReady = true;
            // If the rickroll section is currently in view and we haven't attempted playing this cycle, try now.
            // This handles cases where scroll event fires before video is ready.
            const videoSection = document.getElementById("rickroll");
            const videoRect = videoSection.getBoundingClientRect();
            const isVideoSectionInView =
                videoRect.top <= window.innerHeight / 2 &&
                videoRect.bottom >= window.innerHeight / 2;

            if (isVideoSectionInView && !video.paused) {
                // If it's already playing (e.g., from muted autoplay), just ensure correct state
                video.muted = false; // Attempt to unmute
            } else if (isVideoSectionInView && video.paused) {
                 // If paused and in view, try to play (this covers scenarios where autoplay was blocked)
                 attemptVideoPlay(video);
            }
        });

        // 'canplaythrough' means it can play to the end without buffering. More robust.
        video.addEventListener('canplaythrough', () => {
            console.log("Video canplaythrough event fired.");
            videoElementReady = true;
        });

        video.addEventListener('error', (e) => {
            console.error("Video error:", e);
            console.error("Error code:", video.error.code); // MediaError.code (e.g., 4 for NETWORK_EMPTY)
            console.error("Error message:", video.error.message); // More descriptive message
            // You might want to display a fallback message or image here
            // e.g., document.getElementById("rickroll").innerHTML = "<p>Video failed to load.</p>";
        });

        // Attempt to load the video immediately to start buffering
        // This is often implicitly handled by `preload="auto"` but doesn't hurt.
        video.load();
    }
});


function attemptVideoPlay(video) {
    if (!videoElementReady || !video || videoPlayAttempted) {
        // If not ready, or already attempted in this scroll cycle, don't try again immediately.
        return;
    }

    videoPlayAttempted = true; // Mark that we've attempted playing for this cycle

    // Ensure it's not paused before trying to play.
    // If it's paused, it means it's not being auto-played or was stopped.
    // The `video.paused` check below is for the final unmuted play attempt.
    if (video.paused) {
        video.muted = false; // Try to unmute and play first
        video.play().then(() => {
            console.log("Video played successfully (unmuted attempt).");
            // Optionally, reset videoPlayAttempted to false if you want it to trigger again
            // immediately on next scroll, though the event listeners handle this better.
        }).catch(error => {
            console.warn("Unmuted video playback failed:", error);
            // Fallback: If unmuted autoplay fails, try muted playback
            video.muted = true;
            video.play().then(() => {
                console.log("Video played successfully (muted fallback).");
            }).catch(err => {
                console.error("Muted video playback also failed:", err);
                // Last resort: If even muted playback fails, assume a major issue
                // (e.g., file not found, corrupted, or browser policy too strict)
                // You might display a static image or message.
            });
        });
    } else if (video.muted) {
        // If it's already playing (muted autoplay) but we are in view, unmute it.
        video.muted = false;
        console.log("Video was playing muted, now unmuted.");
    }
}


window.addEventListener("scroll", () => {
    const bigText = document.getElementById("change");
    const aboutSection = document.getElementById("about-rick");
    const videoSection = document.getElementById("rickroll");
    const video = document.getElementById("rickVideo");

    // Ensure video element exists
    if (!video) return;

    const aboutRect = aboutSection.getBoundingClientRect();
    const videoRect = videoSection.getBoundingClientRect();

    const isVideoSectionInView =
        videoRect.top <= window.innerHeight / 2 &&
        videoRect.bottom >= window.innerHeight / 2;

    // Reset play attempt flag for each scroll cycle, assuming we want to re-evaluate playback
    videoPlayAttempted = false;

    // About section (second)
    if (
        aboutRect.top <= window.innerHeight / 2 &&
        aboutRect.bottom >= window.innerHeight / 2
    ) {
        bigText.style.opacity = "0";
        bigText.innerHTML = "RICK ASTLEY";
        clearTimeout(rickrollTimeout);
    }
    // Rickroll section (third)
    else if (isVideoSectionInView) {
        bigText.innerHTML = "GET RICK ROLLED";
        bigText.style.opacity = "1";

        clearTimeout(rickrollTimeout);
        rickrollTimeout = setTimeout(() => {
            bigText.style.opacity = "0";
        }, 1000); // 1 second

        // Try to play the video when the section is in view
        attemptVideoPlay(video);

    }
    // Default state (first page or any other section not "about" or "rickroll")
    else {
        bigText.style.opacity = "1";
        bigText.innerHTML = "RICK ASTLEY";
        clearTimeout(rickrollTimeout);

        // Mute the video when not in the rickroll section
        if (!video.paused) {
            video.muted = true;
        }
    }
});

const images = [
    "./resources/1.png",
    "./resources/3.png",
    "./resources/4.png",
];

let currentIndex = 0;

function change2() {
    currentIndex = (currentIndex + 1) % images.length;
    document.getElementById("rick-front").src = images[currentIndex];
}