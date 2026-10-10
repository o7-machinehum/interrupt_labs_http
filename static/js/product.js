(function () {
    var carousels = document.querySelectorAll("[data-pd-carousel]");

    carousels.forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".pd-carousel__slide"));
        var previous = carousel.querySelector("[data-carousel-prev]");
        var next = carousel.querySelector("[data-carousel-next]");
        var dots = carousel.querySelector(".pd-carousel__dots");
        var activeIndex = 0;
        var touchStartX = 0;
        var touchStartY = 0;
        var dotButtons = [];

        function setSlide(index) {
            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                var isActive = slideIndex === activeIndex;

                slide.classList.toggle("is-active", isActive);
                slide.setAttribute("aria-hidden", isActive ? "false" : "true");
            });

            dotButtons.forEach(function (dot, dotIndex) {
                var isActive = dotIndex === activeIndex;

                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

        if (!slides.length) {
            return;
        }

        if (dots) {
            dotButtons = slides.map(function (slide, slideIndex) {
                var dot = document.createElement("button");

                dot.type = "button";
                dot.setAttribute("aria-label", "Show image " + (slideIndex + 1));
                dot.addEventListener("click", function () {
                    setSlide(slideIndex);
                });
                dots.appendChild(dot);

                return dot;
            });
        }

        if (previous) {
            previous.addEventListener("click", function () {
                setSlide(activeIndex - 1);
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                setSlide(activeIndex + 1);
            });
        }

        carousel.addEventListener("touchstart", function (event) {
            if (!event.changedTouches.length) {
                return;
            }

            touchStartX = event.changedTouches[0].clientX;
            touchStartY = event.changedTouches[0].clientY;
        }, { passive: true });

        carousel.addEventListener("touchend", function (event) {
            var touch;
            var deltaX;
            var deltaY;

            if (!event.changedTouches.length) {
                return;
            }

            touch = event.changedTouches[0];
            deltaX = touch.clientX - touchStartX;
            deltaY = touch.clientY - touchStartY;

            if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) {
                return;
            }

            setSlide(activeIndex + (deltaX < 0 ? 1 : -1));
        }, { passive: true });

        setSlide(0);
    });
}());
