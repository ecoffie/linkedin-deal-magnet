// jump to top of page
document.addEventListener("DOMContentLoaded", function() {
    var winH = window.innerHeight;
    var jumpBtn = document.getElementById("toplink");

    window.addEventListener("scroll", function () {
    if (window.scrollY > winH) {
        jumpBtn.classList.add("active");
    } else {
        jumpBtn.classList.remove("active");
    }
    });
});