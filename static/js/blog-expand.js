(function () {
    var disclosure = document.querySelector(".blog-disclosure");
    if (!disclosure) return;

    disclosure.addEventListener("toggle", function () {
        if (!disclosure.open) return;

        var posts = disclosure.querySelector(".blog-disclosure__posts");
        var firstLink = posts.querySelector("a");
        if (firstLink) firstLink.focus({ preventScroll: true });

        if (!posts.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        posts.animate([
            { height: "0px", opacity: 0, overflow: "hidden" },
            { height: posts.scrollHeight + "px", opacity: 1, overflow: "hidden" }
        ], { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    });
}());
