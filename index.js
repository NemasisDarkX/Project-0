var fetch_date = new Date();

function time() {
    var formate_time = fetch_date.toLocaleTimeString();
    document.getElementById("change").innerHTML = formate_time;
};

function date() {
    var formate_date = fetch_date.toLocaleDateString();
    document.getElementById('change').innerHTML = formate_date
};

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
let hasVideoPlayedOnce = false; // New flag to control video playback

window.addEventListener("scroll", () => {
    const bigText = document.getElementById("change");
    const aboutSection = document.getElementById("about-rick");
    const videoSection = document.getElementById("rickroll");
    const video = document.getElementById("rickVideo");

    const aboutRect = aboutSection.getBoundingClientRect();
    const videoRect = videoSection.getBoundingClientRect();

    // Check if the "rickroll" section is currently in view
    const isVideoSectionInView =
        videoRect.top <= window.innerHeight / 2 &&
        videoRect.bottom >= window.innerHeight / 2;

    // About section (second)
    if (
        aboutRect.top <= window.innerHeight / 2 &&
        aboutRect.bottom >= window.innerHeight / 2
    ) {
        bigText.style.opacity = "0";
        bigText.innerHTML = "RICK ASTLEY";
        clearTimeout(rickrollTimeout);
        // Do not stop or reset the video here. We only care about the rickroll section.
    }
    // Rickroll section (third) - This is the only place the video should interact
    else if (isVideoSectionInView) {
        bigText.innerHTML = "GET RICK ROLLED";
        bigText.style.opacity = "1";

        // Clear previous timeout for the big text
        clearTimeout(rickrollTimeout);

        // Set timeout to hide big text after 1 second
        rickrollTimeout = setTimeout(() => {
            bigText.style.opacity = "0";
        }, 1000); // 1000ms = 1 second

        // Play video with sound ONLY IF it's not playing and hasn't played once
        // or if it's explicitly stopped/paused and we want it to resume
        if (video.paused && !hasVideoPlayedOnce) { // Or if video.paused for subsequent scrolls
             video.muted = false; // Unmute the video
             video.play();
             hasVideoPlayedOnce = true; // Set flag so it doesn't try to play again on subsequent scrolls
        } else if (!video.paused && video.muted) {
            // If the video is playing but was muted, unmute it when in view
            video.muted = false;
        }

    }
    // Default state (first page or any other section not "about" or "rickroll")
    else {
        bigText.style.opacity = "1";
        bigText.innerHTML = "RICK ASTLEY";
        clearTimeout(rickrollTimeout);
        // If not in the rickroll section, mute the video but let it keep playing in the background
        // or pause if you truly want it to stop when not in view
        if (!video.paused) {
            video.muted = true; // Mute it when not in the rickroll section
            // If you want it to pause and reset when scrolling *away* from the rickroll, uncomment next two lines:
            // video.pause();
            // video.currentTime = 0;
        }
        // Reset the 'hasVideoPlayedOnce' flag if you want the video to play again every time you scroll to it
        // hasVideoPlayedOnce = false; // Uncomment if you want it to trigger every time
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

// Removed the problematic reload logic.