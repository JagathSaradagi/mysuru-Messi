// Interactive elements, modal, sliders, radar chart, and documentary animation
document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       Stats Counter Animation
       ========================================================================== */
    const counters = document.querySelectorAll(".stat-number");
    
    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const updateCount = () => {
                const count = +counter.innerText;
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

    const observerOptions = { threshold: 0.5 };
    const statsSection = document.getElementById("stats");
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       Childhood Photo Modal
       ========================================================================== */
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

    /* ==========================================================================
       Interactive Football Pitch
       ========================================================================== */
    const markers = document.querySelectorAll(".marker");
    const tacticsTitle = document.getElementById("tactics-title");
    const tacticsDesc = document.getElementById("tactics-desc");

    const tacticsData = {
        deep: {
            title: "Deep Playmaking & Tempo Control",
            desc: "Operating from deep spaces in his own half, K V Aryan Urs functions as the tactical engine of PES University. Under pressure, he drops between the center-backs, collects the ball, and distributes short or long-range passes with calm precision to break the opposition's first line of press."
        },
        half: {
            title: "Agility in Half-Spaces",
            desc: "Often sliding into the pockets of space between the wings and the center midfield, Aryan thrives in tight environments. Using his signature body feints, he turns away from aggressive defenders instantly, retaining possession and carrying the attack forward."
        },
        assist: {
            title: "The Assist Zone (Final Third)",
            desc: "Hailing from Mysore, his playmaking shines brightest in the final third. With remarkable vision and spatial awareness, Aryan slides pinpoint through-balls behind backlines or cuts back passes to matching forwards, creating high-value goal attempts."
        }
    };

    markers.forEach(marker => {
        marker.addEventListener("click", () => {
            const zone = marker.getAttribute("data-zone");
            if (tacticsData[zone]) {
                tacticsTitle.innerText = tacticsData[zone].title;
                tacticsDesc.innerText = tacticsData[zone].desc;
                
                // Active highlighting
                markers.forEach(m => m.style.transform = "translate(-50%, -50%) scale(1)");
                marker.style.transform = "translate(-50%, -50%) scale(1.3)";
            }
        });
    });

    /* ==========================================================================
       Superstar Quotes Carousel
       ========================================================================== */
    const slides = document.querySelectorAll(".carousel-slide");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let currentSlide = 0;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove("active"));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add("active");
    };

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
        nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
        
        // Auto slide change every 8 seconds
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 8000);
    }

    /* ==========================================================================
       Custom SVG Radar Chart (HTML5 Canvas)
       ========================================================================== */
    const canvas = document.getElementById("attributesChart");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const center = 200;
        const radius = 130;
        
        const labels = ["Dribbling", "Vision", "Passing", "Composure", "Agility"];
        const stats = [92, 95, 90, 96, 89]; // Player attributes out of 100
        const colors = ["#ffd700", "#00ff88", "#3b82f6", "#ec4899", "#8b5cf6"];
        
        const drawRadar = (animateRatio = 1) => {
            ctx.clearRect(0, 0, 400, 400);
            
            // Draw background pentagons
            for (let j = 5; j > 0; j--) {
                const ratio = j / 5;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                    const x = center + Math.cos(angle) * radius * ratio;
                    const y = center + Math.sin(angle) * radius * ratio;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            
            // Draw axes lines
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.lineTo(center + Math.cos(angle) * radius, center + Math.sin(angle) * radius);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
                ctx.stroke();
                
                // Add labels on axes endpoints
                const labelX = center + Math.cos(angle) * (radius + 25);
                const labelY = center + Math.sin(angle) * (radius + 15);
                ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
                ctx.fillStyle = "#9ca3af";
                ctx.textAlign = "center";
                ctx.fillText(labels[i], labelX, labelY);
            }
            
            // Draw player data polygon
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const valueRatio = (stats[i] / 100) * animateRatio;
                const x = center + Math.cos(angle) * radius * valueRatio;
                const y = center + Math.sin(angle) * radius * valueRatio;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            
            // Fill polygon with semi-transparent gradient
            const grad = ctx.createRadialGradient(center, center, 10, center, center, radius);
            grad.addColorStop(0, "rgba(0, 255, 136, 0.1)");
            grad.addColorStop(1, "rgba(255, 215, 0, 0.25)");
            ctx.fillStyle = grad;
            ctx.fill();
            
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw data node circles
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const valueRatio = (stats[i] / 100) * animateRatio;
                const x = center + Math.cos(angle) * radius * valueRatio;
                const y = center + Math.sin(angle) * radius * valueRatio;
                
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = colors[i];
                ctx.fill();
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        };

        // Trigger Radar Animation on scroll
        const radarObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let progress = 0;
                    const anim = () => {
                        progress += 0.04;
                        if (progress <= 1) {
                            drawRadar(progress);
                            requestAnimationFrame(anim);
                        } else {
                            drawRadar(1);
                        }
                    };
                    anim();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        radarObserver.observe(canvas);
    }

    /* ==========================================================================
       Cinematic Documentary Audio and Subtitle Synchronizer
       ========================================================================== */
    const playDocBtn = document.getElementById("play-doc-btn");
    const statusText = document.querySelector(".status-indicator");
    const videoArea = document.querySelector(".doc-video-container");
    const bgVideo = document.getElementById("doc-bg-video");
    const subtitleOverlay = document.getElementById("doc-subtitles");

    // Audio Object using local narrator track
    const audioTrack = new Audio("narrator.mp3");

    // Explicit subtitle timestamps mapping to narrator.mp3 timing
    const subtitleTracks = [
        { start: 0.0, end: 4.8, text: "In the heart of Mysore, a young boy named K V Aryan Urs first touched a football." },
        { start: 4.8, end: 11.2, text: "Nobody predicted that years later, on the fields of PES University..." },
        { start: 11.2, end: 16.5, text: "...he would command the pitch under the eyes of coach Jagath Saradigi." },
        { start: 16.5, end: 25.0, text: "Every turn, every diagonal run, and every clinical assist whispers one name across the campus: The Mysuru Messi." }
    ];

    let isPlaying = false;

    if (playDocBtn && statusText && videoArea && bgVideo && subtitleOverlay) {
        
        const updateSubtitles = () => {
            const currentTime = audioTrack.currentTime;
            let activeSubtitle = subtitleTracks.find(sub => currentTime >= sub.start && currentTime < sub.end);
            
            if (activeSubtitle) {
                subtitleOverlay.innerText = activeSubtitle.text;
                subtitleOverlay.classList.add("active");
            } else {
                subtitleOverlay.classList.remove("active");
            }
        };

        playDocBtn.addEventListener("click", () => {
            if (isPlaying) {
                // Pause narration, video and animations
                audioTrack.pause();
                bgVideo.pause();
                statusText.innerText = "STANDBY";
                statusText.style.color = "var(--text-muted)";
                playDocBtn.innerHTML = "<span class='play-triangle'>▶</span>";
                videoArea.classList.remove("playing");
                subtitleOverlay.classList.remove("active");
                isPlaying = false;
            } else {
                // Start / resume playback
                isPlaying = true;
                statusText.innerText = "PLAYING DOCUMENTARY";
                statusText.style.color = "var(--secondary-color)";
                playDocBtn.innerHTML = "<span style='font-size:1.8rem; font-weight:bold;'>||</span>";
                videoArea.classList.add("playing");
                
                // Play audio and sync background video
                audioTrack.play();
                bgVideo.play();
            }
        });

        // Sync subtitles dynamically as audio plays
        audioTrack.addEventListener("timeupdate", updateSubtitles);

        // Reset player UI state when audio track finishes playing
        audioTrack.addEventListener("ended", () => {
            statusText.innerText = "FINISHED";
            statusText.style.color = "var(--primary-color)";
            playDocBtn.innerHTML = "<span class='play-triangle'>▶</span>";
            videoArea.classList.remove("playing");
            subtitleOverlay.classList.remove("active");
            bgVideo.pause();
            bgVideo.currentTime = 0;
            isPlaying = false;
        });
    }
});
