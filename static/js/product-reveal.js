(function () {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.remove("is-pending");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll("[data-product-reveal]").forEach(function (panel) {
        panel.classList.add("is-pending");
        observer.observe(panel);
        panel.addEventListener("focusin", function () {
            panel.classList.remove("is-pending");
        });
    });
}());
