// Interactive elements and stats counter animation
document.addEventListener("DOMContentLoaded", () => {
    // Stats counter animation
    const counters = document.querySelectorAll(".stat-number");
    
    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const updateCount = () => {
                const count = +counter.innerText;
                // Speed calculation based on target size
                const speed = target / 50; 
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + speed);
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer to trigger counters when visible
    const observerOptions = {
        threshold: 0.5
    };

    const statsSection = document.getElementById("stats");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        observer.observe(statsSection);
    }

    // Modal Interaction Logic
    const viewBtn = document.getElementById("view-childhood-btn");
    const photoModal = document.getElementById("photo-modal");
    const closeModal = document.querySelector(".close-modal");

    if (viewBtn && photoModal && closeModal) {
        viewBtn.addEventListener("click", () => {
            photoModal.style.display = "block";
        });

        closeModal.addEventListener("click", () => {
            photoModal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === photoModal) {
                photoModal.style.display = "none";
            }
        });
    }
});
