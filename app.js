// Interactive elements, modal, sliders, radar chart, and documentary animation
document.addEventListener("DOMContentLoaded", () => {
    
    // Create the diagnostic console as early as possible
    // Diagnostic / Error Console Overlay
    const createDiagnosticConsole = () => {
        if (document.getElementById("sys-logs-trigger")) return;
        
        // Create trigger button
        const trigger = document.createElement("button");
        trigger.id = "sys-logs-trigger";
        trigger.innerHTML = "⚙️ Diagnostics";
        trigger.style.position = "fixed";
        trigger.style.bottom = "15px";
        trigger.style.right = "15px";
        trigger.style.zIndex = "10000";
        trigger.style.background = "rgba(18, 22, 33, 0.95)";
        trigger.style.border = "1px solid #ffd700";
        trigger.style.color = "#ffd700";
        trigger.style.padding = "8px 14px";
        trigger.style.borderRadius = "20px";
        trigger.style.fontSize = "0.75rem";
        trigger.style.fontWeight = "bold";
        trigger.style.cursor = "pointer";
        trigger.style.boxShadow = "0 4px 16px rgba(0,0,0,0.6)";
        trigger.style.transition = "transform 0.2s ease, background 0.2s ease";
        trigger.style.display = "flex";
        trigger.style.alignItems = "center";
        trigger.style.gap = "6px";
        trigger.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

        // Create console panel
        const panel = document.createElement("div");
        panel.id = "sys-logs-panel";
        panel.style.position = "fixed";
        panel.style.bottom = "60px";
        panel.style.right = "15px";
        panel.style.width = "350px";
        panel.style.maxHeight = "400px";
        panel.style.background = "#070a12";
        panel.style.border = "1px solid rgba(255, 255, 255, 0.12)";
        panel.style.borderRadius = "14px";
        panel.style.boxShadow = "0 12px 40px rgba(0,0,0,0.85)";
        panel.style.zIndex = "10001";
        panel.style.display = "none";
        panel.style.flexDirection = "column";
        panel.style.overflow = "hidden";
        panel.style.fontFamily = "monospace";

        // Header
        const header = document.createElement("div");
        header.style.padding = "12px 16px";
        header.style.background = "rgba(255, 255, 255, 0.04)";
        header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.08)";
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.innerHTML = `<span style="color: #ffd700; font-size: 0.8rem; font-weight: bold; letter-spacing: 0.05em;">SYSTEM DIAGNOSTICS</span>`;

        const closeBtn = document.createElement("span");
        closeBtn.innerHTML = "&times;";
        closeBtn.style.color = "#9ca3af";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.fontSize = "1.4rem";
        closeBtn.style.fontWeight = "bold";
        closeBtn.style.lineHeight = "1";
        closeBtn.onclick = () => { panel.style.display = "none"; };
        header.appendChild(closeBtn);

        // Content Area for Logs
        const logContent = document.createElement("div");
        logContent.id = "sys-log-content";
        logContent.style.padding = "14px";
        logContent.style.flex = "1";
        logContent.style.overflowY = "auto";
        logContent.style.fontSize = "0.75rem";
        logContent.style.color = "#e5e7eb";
        logContent.style.lineHeight = "1.5";
        logContent.style.maxHeight = "280px";

        // Initial welcome message
        logContent.innerHTML = `<div style="color: #8b5cf6; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px; margin-bottom: 8px; font-weight: bold;">[SYSTEM INIT] Diagnostic engine online. Monitoring audio playback and canvas synchronization.</div>`;

        // Footer Actions
        const footer = document.createElement("div");
        footer.style.padding = "10px 14px";
        footer.style.background = "rgba(0,0,0,0.5)";
        footer.style.borderTop = "1px solid rgba(255, 255, 255, 0.08)";
        footer.style.display = "flex";
        footer.style.justifyContent = "space-between";
        footer.style.alignItems = "center";
        
        const copyBtn = document.createElement("button");
        copyBtn.innerHTML = "📋 Copy Logs";
        copyBtn.style.background = "rgba(255, 215, 0, 0.08)";
        copyBtn.style.border = "1px solid #ffd700";
        copyBtn.style.color = "#ffd700";
        copyBtn.style.fontSize = "0.7rem";
        copyBtn.style.padding = "5px 10px";
        copyBtn.style.borderRadius = "6px";
        copyBtn.style.cursor = "pointer";
        copyBtn.style.fontWeight = "bold";
        copyBtn.style.transition = "background 0.2s ease";
        copyBtn.onmouseenter = () => { copyBtn.style.background = "rgba(255, 215, 0, 0.15)"; };
        copyBtn.onmouseleave = () => { copyBtn.style.background = "rgba(255, 215, 0, 0.08)"; };
        copyBtn.onclick = () => {
            const logsText = Array.from(logContent.children).map(child => child.innerText).join("\n");
            navigator.clipboard.writeText(logsText).then(() => {
                copyBtn.innerHTML = "✓ Copied!";
                setTimeout(() => { copyBtn.innerHTML = "📋 Copy Logs"; }, 2000);
            }).catch(err => {
                alert("Please manually copy: " + logsText);
            });
        };

        const clearBtn = document.createElement("button");
        clearBtn.innerHTML = "Clear";
        clearBtn.style.background = "transparent";
        clearBtn.style.border = "1px solid rgba(255,255,255,0.15)";
        clearBtn.style.color = "#9ca3af";
        clearBtn.style.fontSize = "0.7rem";
        clearBtn.style.padding = "5px 10px";
        clearBtn.style.borderRadius = "6px";
        clearBtn.style.cursor = "pointer";
        clearBtn.onclick = () => {
            logContent.innerHTML = `<div style="color: #6b7280; padding-bottom: 8px;">[SYSTEM] Logs cleared.</div>`;
        };

        footer.appendChild(copyBtn);
        footer.appendChild(clearBtn);

        panel.appendChild(header);
        panel.appendChild(logContent);
        panel.appendChild(footer);

        document.body.appendChild(trigger);
        document.body.appendChild(panel);

        trigger.onclick = () => {
            if (panel.style.display === "none" || panel.style.display === "") {
                panel.style.display = "flex";
            } else {
                panel.style.display = "none";
            }
        };

        // Window error hook
        window.addEventListener("error", (event) => {
            logErrorToPanel("UNCAUGHT ERROR", `${event.message} (${event.filename}:${event.lineno}:${event.colno})`);
            panel.style.display = "flex";
            trigger.style.background = "rgba(220, 38, 38, 0.95)";
            trigger.style.borderColor = "#f87171";
            trigger.style.color = "#ffffff";
            trigger.innerHTML = "⚠️ Diagnostic Alert!";
        });

        // Promise rejection hook
        window.addEventListener("unhandledrejection", (event) => {
            logErrorToPanel("UNHANDLED REJECTION", event.reason ? (event.reason.message || event.reason) : "Unhandled Promise rejection");
            panel.style.display = "flex";
            trigger.style.background = "rgba(220, 38, 38, 0.95)";
            trigger.style.borderColor = "#f87171";
            trigger.style.color = "#ffffff";
            trigger.innerHTML = "⚠️ Diagnostic Alert!";
        });
    };

    const logErrorToPanel = (type, message) => {
        const logContent = document.getElementById("sys-log-content");
        if (logContent) {
            const timeStr = new Date().toTimeString().split(' ')[0];
            const item = document.createElement("div");
            item.style.padding = "6px 0";
            item.style.borderBottom = "1px solid rgba(255,255,255,0.04)";
            item.style.color = "#f87171";
            item.innerHTML = `<span style="color: #ef4444; font-weight: bold;">[${timeStr} - ${type}]</span> ${message}`;
            logContent.appendChild(item);
            logContent.scrollTop = logContent.scrollHeight;
        }
    };

    const logInfoToPanel = (type, message) => {
        const logContent = document.getElementById("sys-log-content");
        if (logContent) {
            const timeStr = new Date().toTimeString().split(' ')[0];
            const item = document.createElement("div");
            item.style.padding = "6px 0";
            item.style.borderBottom = "1px solid rgba(255,255,255,0.04)";
            item.style.color = "#10b981";
            item.innerHTML = `<span style="color: #10b981; font-weight: bold;">[${timeStr} - ${type}]</span> ${message}`;
            logContent.appendChild(item);
            logContent.scrollTop = logContent.scrollHeight;
        }
    };

    createDiagnosticConsole();

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
       Cinematic Documentary Audio and Subtitle Synchronizer with Canvas Animation
       ========================================================================== */
    const playDocBtn = document.getElementById("play-doc-btn");
    const videoArea = document.querySelector(".doc-video-container");
    const bgVideo = document.getElementById("doc-bg-video");
    const docCanvas = document.getElementById("doc-canvas");
    const subtitleOverlay = document.getElementById("doc-subtitles");

    // Initialize Audio Track with robust safety and tracking
    let audioTrack = null;
    try {
        audioTrack = new Audio("narrator.mp3");
        audioTrack.preload = "auto";
        logInfoToPanel("AUDIO", "Loading 'narrator.mp3' track in background...");
        
        audioTrack.addEventListener("canplaythrough", () => {
            logInfoToPanel("AUDIO", "narrator.mp3 loaded and is fully ready for playback!");
        });
        
        audioTrack.addEventListener("error", (e) => {
            const err = audioTrack ? audioTrack.error : null;
            let errMsg = "Unknown file loading error";
            if (err) {
                switch (err.code) {
                    case err.MEDIA_ERR_ABORTED: errMsg = "Audio playback/loading aborted by the user."; break;
                    case err.MEDIA_ERR_NETWORK: errMsg = "Network failure or CORS restriction. Check if file is served correctly."; break;
                    case err.MEDIA_ERR_DECODE: errMsg = "Audio format decoding failed (file may be corrupted or codec unsupported)."; break;
                    case err.MEDIA_ERR_SRC_NOT_SUPPORTED: errMsg = "File not found (404) or media format not supported."; break;
                }
            }
            logErrorToPanel("AUDIO_LOAD_ERROR", `${errMsg} (CWD Check: verify narrator.mp3 exists at site root)`);
        });
    } catch (e) {
        logErrorToPanel("AUDIO_INIT", `Failed to instantiate Audio object: ${e.message}`);
    }

    // Explicit subtitle timestamps mapping to narrator.mp3 timing
    const subtitleTracks = [
        { start: 0.0, end: 5.4, text: "In the heart of Mysore..." },
        { start: 5.4, end: 10.4, text: "Nobody predicted..." },
        { start: 10.4, end: 14.5, text: "...under the eyes of coach Jagath Saradigi." },
        { start: 14.5, end: 25.0, text: "Every turn, every diagonal run..." }
    ];

    let isPlaying = false;
    let canvasTime = 0;
    let playerSpeed = 0.04; // Calm standby speed

    // Fallback/Independent timing engine to guarantee animation play even if audio fails
    let documentaryTime = 0;
    let lastFrameTime = performance.now();
    let lastAudioTime = -1;

    if (playDocBtn && videoArea && bgVideo && subtitleOverlay) {
        const docCtx = docCanvas ? docCanvas.getContext("2d") : null;

        // Responsive Canvas Resizer
        const resizeCanvas = () => {
            if (!docCanvas || !docCtx) return;
            const rect = docCanvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const w = Math.floor(rect.width * dpr);
            const h = Math.floor(rect.height * dpr);
            docCanvas.width = w;
            docCanvas.height = h;
            docCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            logInfoToPanel("CANVAS_RESIZE", `Canvas set to ${w}x${h} (DPR: ${dpr}, rect: ${Math.round(rect.width)}x${Math.round(rect.height)})`);
        };

        window.addEventListener("resize", resizeCanvas);
        // Initial sizing
        setTimeout(resizeCanvas, 100);

        // Particle System for turf, dust, and celebratory confetti
        class Particle {
            constructor(x, y, type = "dust") {
                this.x = x;
                this.y = y;
                this.type = type; // "dust", "grass", "confetti"
                
                if (type === "grass") {
                    this.vx = (Math.random() - 0.7) * 4.5 - 2;
                    this.vy = (Math.random() - 0.6) * 5 - 3.5;
                    this.size = Math.random() * 4 + 1.5;
                    this.color = `rgba(${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 90 + 130)}, ${Math.floor(Math.random() * 30)}, 1)`;
                    this.decay = Math.random() * 0.02 + 0.015;
                    this.gravity = 0.22;
                } else if (type === "confetti") {
                    this.vx = (Math.random() - 0.5) * 5;
                    this.vy = Math.random() * 2.5 + 1.5;
                    this.size = Math.random() * 5 + 3.5;
                    this.color = `hsla(${Math.random() * 360}, 95%, 65%, 1)`;
                    this.decay = Math.random() * 0.006 + 0.003;
                    this.gravity = 0.04;
                    this.rotation = Math.random() * Math.PI * 2;
                    this.rotSpeed = (Math.random() - 0.5) * 0.12;
                } else {
                    // Dust
                    this.vx = (Math.random() - 0.5) * 1.5 - 0.5;
                    this.vy = (Math.random() - 0.5) * 1.2 - 0.5;
                    this.size = Math.random() * 2 + 1;
                    this.color = "rgba(255, 255, 255, 0.35)";
                    this.decay = Math.random() * 0.025 + 0.012;
                    this.gravity = 0;
                }
                this.alpha = 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.alpha -= this.decay;
                if (this.type === "confetti") {
                    this.rotation += this.rotSpeed;
                }
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                if (this.type === "grass") {
                    ctx.fillStyle = this.color;
                    ctx.translate(this.x, this.y);
                    ctx.rotate(Math.random() * Math.PI);
                    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 2);
                } else if (this.type === "confetti") {
                    ctx.fillStyle = this.color;
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                } else {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        const particles = [];

        // Core Match Coordinates Timeline Solver
        const getWorldPositions = (t, width, height) => {
            let playerX = 150;
            let playerY = height * 0.72;
            let ballX = 190;
            let ballY = height * 0.73;
            let cameraX = 0;
            let isShooting = false;
            let isGoal = false;
            let isCelebrating = false;
            let netRipple = 0;

            if (t < 5.4) {
                // Phase 1: Midfield Run (0 to 5.4s)
                const p = t / 5.4;
                playerX = 150 + p * 500; // 150 -> 650
                playerY = height * 0.72 + Math.sin(t * 3.5) * 6;
                cameraX = playerX - width * 0.35;

                // Ball dribbling in front of player
                ballX = playerX + 24 + Math.sin(t * 7) * 4;
                ballY = playerY + 14;
            } else if (t < 10.4) {
                // Phase 2: First & Second Defenders (5.4s to 10.4s)
                const p = (t - 5.4) / 5.0;
                playerX = 650 + p * 500; // 650 -> 1150
                
                // Fast zig-zag feints around defender positions
                let slalom = 0;
                if (p < 0.5) {
                    slalom = Math.sin(p * Math.PI * 2) * 28;
                } else {
                    slalom = -Math.sin((p - 0.5) * Math.PI * 2) * 28;
                }
                playerY = height * 0.72 + slalom;
                cameraX = playerX - width * 0.35;

                // Dynamic ball taps
                const touchCycle = (t * 2.5) % 1;
                const touchOffset = Math.sin(touchCycle * Math.PI) * 12;
                ballX = playerX + 20 + touchOffset;
                ballY = playerY + 14 + (slalom * 0.4);
            } else if (t < 14.5) {
                // Phase 3: Final Defender (10.4s to 14.5s)
                const p = (t - 10.4) / 4.1;
                playerX = 1150 + p * 400; // 1150 -> 1550
                let slalom = Math.cos(p * Math.PI * 1.5) * 20;
                playerY = height * 0.72 + slalom;
                cameraX = playerX - width * 0.35;

                ballX = playerX + 20 + Math.sin(p * Math.PI * 3) * 10;
                ballY = playerY + 14 + slalom * 0.5;
            } else if (t < 18.0) {
                // Phase 4: Approach, Power Strike & Flying Ball (14.5s to 18.0s)
                const p = (t - 14.5) / 3.5;
                playerX = 1550 + p * 200; // 1550 -> 1750
                playerY = height * 0.72;
                cameraX = playerX - width * 0.35;

                const shotTriggerTime = 16.2;
                if (t < shotTriggerTime) {
                    ballX = playerX + 26;
                    ballY = playerY + 14;
                } else {
                    isShooting = true;
                    // Ball travels fast to top corner of net (Goal line at worldX=1950, height * 0.50)
                    const shotDuration = 1.3; // 1.3 seconds flight
                    const shotP = Math.min(1, (t - shotTriggerTime) / shotDuration);
                    
                    if (shotP < 1.0) {
                        ballX = (playerX + 26) + shotP * (1950 - (playerX + 26));
                        ballY = (playerY + 14) + shotP * (height * 0.48 - (playerY + 14)) - Math.sin(shotP * Math.PI) * 60;
                    } else {
                        isGoal = true;
                        ballX = 1954;
                        ballY = height * 0.48 + Math.sin(t * 14) * 2.5; // spinning in net
                        netRipple = Math.sin((t - (shotTriggerTime + shotDuration)) * 7) * 14 * Math.exp(-(t - (shotTriggerTime + shotDuration)) * 0.35);
                    }
                }
            } else {
                // Phase 5: Goal Scored & Iconic Knee Slide Celebration (18.0s to 25.0s)
                const p = (t - 18.0) / 7.0;
                isCelebrating = true;
                isGoal = true;

                playerX = 1750 + Math.min(p * 2.5, 1.0) * 45; // forward kneehslide
                playerY = height * 0.74; // Kneel height
                cameraX = playerX - width * 0.42;

                // Soccer ball drops from net and rolls down
                const dropP = Math.min(1.0, (t - 18.0) / 1.5);
                ballX = 1954;
                ballY = (height * 0.48) + dropP * ((height * 0.77) - (height * 0.48)) + Math.abs(Math.sin(dropP * Math.PI * 1.5)) * 14 * Math.exp(-dropP * 1.5);
                netRipple = Math.sin(t * 1.5) * 1.5;
            }

            cameraX = Math.max(0, cameraX);

            return {
                playerX,
                playerY,
                ballX,
                ballY,
                cameraX,
                isShooting,
                isGoal,
                isCelebrating,
                netRipple
            };
        };

        // Draw Player & Defenders Helper
        const drawAthlete = (ctx, x, y, options) => {
            const { isAryan, isTackling, legCycle, armCycle, isCelebrating, hairColor, skinColor, bodyBob, kitColor } = options;
            const bob = bodyBob || 0;

            ctx.save();
            
            // Ground shadow
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            ctx.beginPath();
            ctx.ellipse(x, y + 36, isTackling ? 35 : (isCelebrating ? 25 : 18), 5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.translate(0, bob);

            if (isTackling) {
                // Side slide tackle posture
                ctx.translate(x, y + 12);
                ctx.rotate(-0.4);

                // Torso (Opposition kit)
                ctx.fillStyle = kitColor || "#dc2626";
                ctx.fillRect(-8, -16, 16, 28);

                // Rear tucked leg
                ctx.strokeStyle = "#1e293b";
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(-6, 10);
                ctx.lineTo(-20, 14);
                ctx.stroke();

                // Forward tackling leg
                ctx.strokeStyle = "#f3f4f6";
                ctx.lineWidth = 7;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(6, 10);
                ctx.lineTo(26, 26);
                ctx.stroke();

                // Red/White cleats
                ctx.fillStyle = "#ef4444";
                ctx.beginPath();
                ctx.arc(26, 26, 3.5, 0, Math.PI * 2);
                ctx.fill();

                // Head
                ctx.fillStyle = skinColor || "#e5b083";
                ctx.beginPath();
                ctx.arc(0, -25, 7.5, 0, Math.PI * 2);
                ctx.fill();

                // Hair
                ctx.fillStyle = hairColor || "#1e293b";
                ctx.beginPath();
                ctx.arc(0, -28, 8, Math.PI, Math.PI * 2);
                ctx.fill();

            } else if (isCelebrating) {
                // Knee slide celebration! Lean back and raise hands
                ctx.translate(x, y + 8);
                ctx.rotate(0.22);

                // Blue/Gold PES jersey
                ctx.fillStyle = kitColor || "#1e3a8a";
                ctx.fillRect(-9, -22, 18, 30);

                // Folded legs
                ctx.strokeStyle = "#ffd700";
                ctx.lineWidth = 7.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(-6, 8);
                ctx.lineTo(-14, 20);
                ctx.lineTo(-28, 22);
                ctx.moveTo(6, 8);
                ctx.lineTo(2, 20);
                ctx.lineTo(-10, 22);
                ctx.stroke();

                // Raised arms
                ctx.strokeStyle = skinColor || "#e5b083";
                ctx.lineWidth = 4.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(-9, -16);
                ctx.lineTo(-22, -38);
                ctx.moveTo(9, -16);
                ctx.lineTo(22, -38);
                ctx.stroke();

                // Head
                ctx.fillStyle = skinColor || "#e5b083";
                ctx.beginPath();
                ctx.arc(0, -31, 7.5, 0, Math.PI * 2);
                ctx.fill();

                // Hair
                ctx.fillStyle = hairColor || "#0f172a";
                ctx.beginPath();
                ctx.arc(-1, -34, 8, Math.PI * 1.1, Math.PI * 1.9);
                ctx.fill();

                if (isAryan) {
                    ctx.save();
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 6px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("ARYAN", 0, -10);
                    ctx.font = "900 13px sans-serif";
                    ctx.fillText("10", 0, 4);
                    ctx.restore();
                }

            } else {
                // Running / dribbling athlete posture
                ctx.translate(x, y);

                // Draw background leg
                ctx.save();
                ctx.rotate(legCycle);
                ctx.strokeStyle = "#111b33";
                ctx.lineWidth = 6.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(-4, 10);
                ctx.lineTo(0, 24);
                ctx.stroke();
                ctx.restore();

                // Torso
                ctx.fillStyle = kitColor || "#1e3a8a";
                ctx.fillRect(-9, -20, 18, 32);

                if (isAryan) {
                    // Back jersey printing "ARYAN 10"
                    ctx.save();
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 6.5px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("ARYAN", 0, -9);
                    ctx.font = "900 14px sans-serif";
                    ctx.fillText("10", 0, 5);
                    ctx.restore();
                } else if (options.jerseyNumber) {
                    ctx.save();
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "900 12px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText(options.jerseyNumber, 0, 4);
                    ctx.restore();
                }

                // Draw foreground leg
                ctx.save();
                ctx.rotate(-legCycle);
                ctx.strokeStyle = isAryan ? "#1d4ed8" : "#dc2626";
                ctx.lineWidth = 7;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(4, 10);
                ctx.lineTo(0, 24);
                ctx.stroke();
                
                // Socks/Shoes
                ctx.translate(0, 24);
                ctx.fillStyle = isAryan ? "#ffd700" : "#ffffff"; // Golden shoes for Aryan!
                ctx.beginPath();
                ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // Arms swinging
                ctx.strokeStyle = skinColor || "#e5b083";
                ctx.lineWidth = 4.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(-8, -12);
                ctx.lineTo(-16 + Math.sin(armCycle) * 5, -2 + Math.cos(armCycle) * 3);
                ctx.moveTo(8, -12);
                ctx.lineTo(16 - Math.sin(armCycle) * 5, -2 - Math.cos(armCycle) * 3);
                ctx.stroke();

                // Head
                ctx.fillStyle = skinColor || "#e5b083";
                ctx.beginPath();
                ctx.arc(0, -29, 7.5, 0, Math.PI * 2);
                ctx.fill();

                // Hair
                ctx.fillStyle = hairColor || "#0f172a";
                ctx.beginPath();
                ctx.arc(-1, -32, 8, Math.PI * 1.1, Math.PI * 1.9);
                ctx.fill();
            }

            ctx.restore();
        };

        // Reactive goal net drawer
        const drawGoalNet = (ctx, gx, gy, gWidth, gHeight, rippleX, rippleY, rippleAmp) => {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
            ctx.lineWidth = 1;

            const rows = 12;
            const cols = 7;

            // Draw horizontal net coordinates
            for (let r = 0; r <= rows; r++) {
                ctx.beginPath();
                const py = gy + (r / rows) * gHeight;
                for (let c = 0; c <= cols; c++) {
                    const px = gx + (c / cols) * gWidth;
                    
                    // Ripple mathematics based on distance to ball impact
                    let dx = 0;
                    let dy = 0;
                    if (rippleAmp > 0) {
                        const dist = Math.hypot(px - rippleX, py - rippleY);
                        const influence = Math.max(0, 1 - dist / 75);
                        dx = Math.sin(dist * 0.16 - canvasTime * 0.25) * rippleAmp * influence;
                        dy = Math.cos(dist * 0.16 - canvasTime * 0.25) * rippleAmp * influence * 0.4;
                    }

                    if (c === 0) {
                        ctx.moveTo(px + dx, py + dy);
                    } else {
                        ctx.lineTo(px + dx, py + dy);
                    }
                }
                ctx.stroke();
            }

            // Draw vertical net coordinates
            for (let c = 0; c <= cols; c++) {
                ctx.beginPath();
                const px = gx + (c / cols) * gWidth;
                for (let r = 0; r <= rows; r++) {
                    const py = gy + (r / rows) * gHeight;

                    let dx = 0;
                    let dy = 0;
                    if (rippleAmp > 0) {
                        const dist = Math.hypot(px - rippleX, py - rippleY);
                        const influence = Math.max(0, 1 - dist / 75);
                        dx = Math.sin(dist * 0.16 - canvasTime * 0.25) * rippleAmp * influence;
                        dy = Math.cos(dist * 0.16 - canvasTime * 0.25) * rippleAmp * influence * 0.4;
                    }

                    if (r === 0) {
                        ctx.moveTo(px + dx, py + dy);
                    } else {
                        ctx.lineTo(px + dx, py + dy);
                    }
                }
                ctx.stroke();
            }
            ctx.restore();
        };

        // Main Animation Render Loop with Fallback Stopwatch Timing
        let hasLoggedZeroSize = false;
        let lastLoggedTime = 0;
        let frameCount = 0;

        const renderLoop = () => {
            if (!docCanvas || !docCtx) {
                requestAnimationFrame(renderLoop);
                return;
            }

            frameCount++;
            // Check canvas dimensions dynamically every 30 frames or if dimensions are 0
            if (docCanvas.width === 0 || docCanvas.height === 0 || frameCount % 30 === 0) {
                const rect = docCanvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                const targetWidth = Math.floor(rect.width * dpr);
                const targetHeight = Math.floor(rect.height * dpr);
                if (targetWidth > 0 && targetHeight > 0 && (docCanvas.width !== targetWidth || docCanvas.height !== targetHeight)) {
                    docCanvas.width = targetWidth;
                    docCanvas.height = targetHeight;
                    docCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                    logInfoToPanel("CANVAS_RESIZE", `Dynamic resize triggered: ${targetWidth}x${targetHeight}`);
                }
            }

            const width = docCanvas.width / (window.devicePixelRatio || 1);
            const height = docCanvas.height / (window.devicePixelRatio || 1);

            // Compute elapsed frame time for independent animation tracking
            const now = performance.now();
            const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.1); // cap to avoid giant skips
            lastFrameTime = now;

            if (width > 0 && height > 0) {
                hasLoggedZeroSize = false; // reset
                // Dynamic time calculation (synced with audio if active & advancing, otherwise independent stopwatch fallback)
                let t = 0;
                if (isPlaying) {
                    let audioIsAdvancing = false;
                    try {
                        if (audioTrack && !audioTrack.paused && audioTrack.currentTime !== lastAudioTime && !audioTrack.muted) {
                            audioIsAdvancing = true;
                            lastAudioTime = audioTrack.currentTime;
                        }
                    } catch (err) {
                        // ignore error
                    }

                    if (audioIsAdvancing) {
                        // Keep our timer strictly synced to the audio
                        documentaryTime = audioTrack.currentTime;
                    } else {
                        // Increment using high precision stopwatch fallback
                        documentaryTime += deltaTime;
                    }

                    // Loop limit check for the documentary length (25s)
                    if (documentaryTime >= 25.0) {
                        documentaryTime = 25.0; // clamp
                        triggerDocumentaryFinished();
                    }
                    
                    t = documentaryTime;
                    
                    // Force render subtitles on frame ticks to guarantee synchronization
                    updateSubtitles(t);
                } else {
                    // 25-second continuous looping preview on Standby
                    t = (Date.now() / 1000) % 25;
                    documentaryTime = 0; // reset active play time
                }

                const targetSpeed = isPlaying ? 0.11 : 0.035;
                playerSpeed += (targetSpeed - playerSpeed) * 0.08;
                canvasTime += playerSpeed;

                // Solve coordinates of elements
                const state = getWorldPositions(t, width, height);

                // 1. Draw Deep Atmosphere Stadium Sky Gradient
                const bgGrad = docCtx.createLinearGradient(0, 0, 0, height);
                bgGrad.addColorStop(0, "#020408");
                bgGrad.addColorStop(0.5, "#080d19");
                bgGrad.addColorStop(1, "#04180d"); // stadium turf glow
                docCtx.fillStyle = bgGrad;
                docCtx.fillRect(0, 0, width, height);

                // 2. Parallax Background Stadium Crowd Silhouette (offset scrolls slower than foreground)
                docCtx.save();
                const parallaxX = -(state.cameraX * 0.25) % width;
                docCtx.fillStyle = "rgba(10, 16, 30, 0.45)";
                docCtx.beginPath();
                // Draw uneven crowd/seats profile
                for (let xOffset = 0; xOffset <= width + 50; xOffset += 15) {
                    const cx = parallaxX + xOffset;
                    const cy = height * 0.58 + Math.sin(xOffset * 0.04) * 4;
                    if (xOffset === 0) {
                        docCtx.moveTo(cx, height * 0.70);
                        docCtx.lineTo(cx, cy);
                    } else {
                        docCtx.lineTo(cx, cy);
                    }
                }
                docCtx.lineTo(parallaxX + width + 50, height * 0.70);
                docCtx.closePath();
                docCtx.fill();
                docCtx.restore();

                // 3. Ambient Stadium Spotlight Beams
                const drawSpotlight = (sx, sy, angle, color) => {
                    docCtx.save();
                    docCtx.translate(sx, sy);
                    docCtx.rotate(angle);
                    
                    const beamGrad = docCtx.createLinearGradient(0, 0, 0, height * 0.9);
                    beamGrad.addColorStop(0, color);
                    beamGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                    
                    docCtx.fillStyle = beamGrad;
                    docCtx.beginPath();
                    docCtx.moveTo(0, 0);
                    docCtx.lineTo(-75, height * 0.9);
                    docCtx.lineTo(75, height * 0.9);
                    docCtx.closePath();
                    docCtx.fill();
                    docCtx.restore();
                };

                const osc = Math.sin(canvasTime * 0.12) * 0.06;
                drawSpotlight(width * 0.2, 0, 0.4 + osc, "rgba(255, 215, 0, 0.09)"); // Gold Left
                drawSpotlight(width * 0.8, 0, -0.4 - osc, "rgba(0, 255, 136, 0.08)"); // Neon Green Right

                // 4. Draw Turf Perspective Ground
                docCtx.save();
                docCtx.fillStyle = "rgba(255, 255, 255, 0.04)";
                docCtx.lineWidth = 1.5;
                docCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";

                // Pitch division line
                docCtx.beginPath();
                docCtx.moveTo(0, height * 0.64);
                docCtx.lineTo(width, height * 0.64);
                docCtx.stroke();

                // Horizontal lane lines scrolling past
                const lineX = -(state.cameraX) % 180;
                for (let lx = lineX; lx < width + 180; lx += 180) {
                    docCtx.beginPath();
                    docCtx.moveTo(lx, height * 0.64);
                    docCtx.lineTo(lx - 45, height);
                    docCtx.stroke();
                }

                // Goal area circle on pitch (only visible when camera reaches goal line)
                const centerCircleX = 1000 - state.cameraX;
                docCtx.beginPath();
                docCtx.ellipse(centerCircleX, height * 0.80, 160, 45, 0, 0, Math.PI * 2);
                docCtx.stroke();

                // Goal crease markings
                const goalCreaseX = 1950 - state.cameraX;
                docCtx.beginPath();
                docCtx.ellipse(goalCreaseX, height * 0.82, 120, 32, 0, Math.PI * 0.5, Math.PI * 1.5);
                docCtx.stroke();

                docCtx.restore();

                // 5. Instantiating Grass clippings/turf kick particles & Confetti
                if (isPlaying && state.playerY > height * 0.65 && Math.random() < 0.4) {
                    particles.push(new Particle(state.playerX - state.cameraX - 10, state.playerY + 30, "grass"));
                    particles.push(new Particle(state.playerX - state.cameraX - 10, state.playerY + 30, "dust"));
                }

                // Drop celebration confetti when goal is scored
                if (state.isCelebrating && Math.random() < 0.35) {
                    particles.push(new Particle(state.playerX - state.cameraX + (Math.random() - 0.5) * 80, 0, "confetti"));
                }

                // Render all particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    if (particles[i].alpha <= 0 || particles[i].y > height + 20) {
                        particles.splice(i, 1);
                    } else {
                        particles[i].draw(docCtx);
                    }
                }

                // 6. Draw Goalpost Structure & Reactive physical net (Placed at worldX = 1950)
                const goalX = 1950 - state.cameraX;
                const goalY = height * 0.44;
                const goalHeight = height * 0.38;
                const goalWidth = 65;

                // Draw Goal Net Mesh behind post
                drawGoalNet(docCtx, goalX, goalY, goalWidth, goalHeight, 1954 - state.cameraX, height * 0.48, state.netRipple);

                // Draw solid White goalpost pipes
                docCtx.save();
                docCtx.strokeStyle = "#ffffff";
                docCtx.lineWidth = 4.5;
                docCtx.lineCap = "round";
                docCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
                docCtx.shadowBlur = 5;

                ctx_drawGoalposts: {
                    docCtx.beginPath();
                    // Back support posts
                    docCtx.strokeStyle = "rgba(255, 255, 255, 0.35)";
                    docCtx.lineWidth = 2.5;
                    docCtx.moveTo(goalX, goalY);
                    docCtx.lineTo(goalX + goalWidth, goalY + 25);
                    docCtx.lineTo(goalX + goalWidth, goalY + goalHeight);
                    docCtx.stroke();

                    // Main front posts
                    docCtx.strokeStyle = "#ffffff";
                    docCtx.lineWidth = 4.5;
                    docCtx.beginPath();
                    docCtx.moveTo(goalX, goalY + goalHeight); // Left ground post
                    docCtx.lineTo(goalX, goalY);              // Left top corner
                    docCtx.lineTo(goalX, goalY + goalHeight); // Draw upright pipe
                    docCtx.moveTo(goalX, goalY);
                    docCtx.lineTo(goalX + 2, goalY + goalHeight); // Subtle projection depth
                    docCtx.stroke();
                }
                docCtx.restore();

                // 7. Draw Opposing Defenders along the pitch
                // They lunge/tackle dynamically as Aryan approaches them
                const oppositionDefenders = [
                    { x: 740, y: height * 0.72, num: "4", tackleStart: 6.0, tackleEnd: 7.6, speed: 1.1 },
                    { x: 1040, y: height * 0.69, num: "5", tackleStart: 8.6, tackleEnd: 10.1, speed: 1.4 },
                    { x: 1380, y: height * 0.73, num: "3", tackleStart: 11.4, tackleEnd: 12.9, speed: 0.9 }
                ];

                oppositionDefenders.forEach(def => {
                    const dx = def.x - state.cameraX;
                    const dy = def.y;

                    const isTackling = (t >= def.tackleStart && t <= def.tackleEnd);
                    let displayX = dx;
                    
                    if (isTackling) {
                        const tackleProgress = (t - def.tackleStart) / (def.tackleEnd - def.tackleStart);
                        // Slide forward horizontally
                        displayX -= tackleProgress * 30 * def.speed;
                        
                        // Kick up massive grass sparks at tackling foot
                        if (Math.random() < 0.6) {
                            particles.push(new Particle(displayX + 15, dy + 25, "grass"));
                            particles.push(new Particle(displayX + 15, dy + 25, "dust"));
                        }
                    }

                    // Only draw defender if visible on screen
                    if (displayX > -50 && displayX < width + 50) {
                        drawAthlete(docCtx, displayX, dy, {
                            isAryan: false,
                            isTackling,
                            legCycle: Math.sin(canvasTime * 2.5),
                            armCycle: Math.sin(canvasTime * 2.5),
                            isCelebrating: false,
                            skinColor: "#e0ac69",
                            hairColor: "#1e293b",
                            kitColor: "#dc2626", // Red opposition jerseys
                            jerseyNumber: def.num,
                            bodyBob: isTackling ? 10 : Math.sin(canvasTime * 2.5) * 3
                        });
                    }
                });

                // 8. Draw the Legendary Aryan Urs (Mysuru Messi)
                const playerScreenX = state.playerX - state.cameraX;
                const playerRunCycle = canvasTime * 2.6;

                drawAthlete(docCtx, playerScreenX, state.playerY, {
                    isAryan: true,
                    isTackling: false,
                    legCycle: Math.sin(playerRunCycle),
                    armCycle: Math.sin(playerRunCycle),
                    isCelebrating: state.isCelebrating,
                    skinColor: "#f5c299",
                    hairColor: "#090d16",
                    kitColor: "#1e3a8a", // PES Royal Blue
                    bodyBob: state.isCelebrating ? 8 : Math.sin(playerRunCycle * 2) * 4
                });

                // 9. Draw the Golden Bouncing Soccer Ball
                const ballScreenX = state.ballX - state.cameraX;
                const ballRadius = 8;
                const ballRotation = canvasTime * 1.8;

                docCtx.save();
                // Ground shadow for soccer ball
                docCtx.fillStyle = "rgba(0, 0, 0, 0.45)";
                docCtx.beginPath();
                docCtx.ellipse(ballScreenX, state.playerY + 36, 8, 3, 0, 0, Math.PI * 2);
                docCtx.fill();

                // Spin and draw soccer ball
                docCtx.translate(ballScreenX, state.ballY);
                docCtx.rotate(ballRotation);

                docCtx.fillStyle = "#ffffff";
                docCtx.beginPath();
                docCtx.arc(0, 0, ballRadius, 0, Math.PI * 2);
                docCtx.fill();

                docCtx.strokeStyle = "#111827";
                docCtx.lineWidth = 1;
                docCtx.stroke();

                // Distinct classic pentagon graphics on the ball
                docCtx.fillStyle = "#1e293b";
                for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2 / 5)) {
                    docCtx.beginPath();
                    docCtx.moveTo(0, 0);
                    const sx = Math.cos(angle) * (ballRadius * 0.55);
                    const sy = Math.sin(angle) * (ballRadius * 0.55);
                    docCtx.lineTo(sx, sy);
                    docCtx.arc(sx, sy, ballRadius * 0.28, 0, Math.PI * 2);
                    docCtx.fill();
                }
                docCtx.restore();
            } else {
                const curTime = Date.now();
                if (!hasLoggedZeroSize || curTime - lastLoggedTime > 5000) {
                    logErrorToPanel("CANVAS_ZERO", `Render skipped because canvas has 0 size: ${docCanvas.width}x${docCanvas.height} (bounding rect: ${Math.round(docCanvas.getBoundingClientRect().width)}x${Math.round(docCanvas.getBoundingClientRect().height)})`);
                    hasLoggedZeroSize = true;
                    lastLoggedTime = curTime;
                }
            }

            requestAnimationFrame(renderLoop);
        };

        // Kickoff the render loop
        renderLoop();

        const updateSubtitles = (currentTime) => {
            let activeSubtitle = subtitleTracks.find(sub => currentTime >= sub.start && currentTime < sub.end);
            
            if (activeSubtitle) {
                subtitleOverlay.innerText = activeSubtitle.text;
                subtitleOverlay.classList.add("active");
            } else {
                subtitleOverlay.classList.remove("active");
            }
        };

        const triggerDocumentaryFinished = () => {
            if (!isPlaying) return;
            logInfoToPanel("SYSTEM", "Documentary playback finished.");
            playDocBtn.innerHTML = "<span class='play-triangle'>▶</span>";
            videoArea.classList.remove("playing");
            subtitleOverlay.classList.remove("active");
            isPlaying = false;
            documentaryTime = 0;
            try {
                if (audioTrack) {
                    audioTrack.pause();
                    audioTrack.currentTime = 0;
                }
            } catch (e) {}
        };

        // Play/Pause interaction
        const togglePlayback = () => {
            if (isPlaying) {
                // Pause narration & animations
                try {
                    if (audioTrack) audioTrack.pause();
                } catch (e) {
                    logErrorToPanel("AUDIO", `Pause error: ${e.message}`);
                }
                try {
                    if (bgVideo) bgVideo.pause();
                } catch (e) {
                    logErrorToPanel("VIDEO", `Pause error: ${e.message}`);
                }
                playDocBtn.innerHTML = "<span class='play-triangle'>▶</span>";
                videoArea.classList.remove("playing");
                subtitleOverlay.classList.remove("active");
                isPlaying = false;
                logInfoToPanel("SYSTEM", "Documentary paused.");
            } else {
                // Play / resume
                isPlaying = true;
                lastFrameTime = performance.now(); // reset delta reference
                playDocBtn.innerHTML = "<span style='font-size:1.8rem; font-weight:bold;'>||</span>";
                videoArea.classList.add("playing");
                logInfoToPanel("SYSTEM", "Playback initiated. Starting synchronization loop.");
                
                // Play local background video
                if (bgVideo) {
                    const playVideoPromise = bgVideo.play();
                    if (playVideoPromise !== undefined) {
                        playVideoPromise.catch(error => {
                            console.error("Video play blocked by browser:", error);
                            logErrorToPanel("VIDEO_BLOCKED", `Video playback error: ${error.message}`);
                        });
                    }
                }

                if (audioTrack) {
                    const playAudioPromise = audioTrack.play();
                    if (playAudioPromise !== undefined) {
                        playAudioPromise.then(() => {
                            logInfoToPanel("AUDIO", "Audio narration started playing successfully.");
                        }).catch(error => {
                            console.log("Audio playback blocked by browser security. Retrying...", error);
                            logErrorToPanel("AUDIO_BLOCKED", "Audio playback was blocked or deferred by browser autoplay restrictions. The visual animation will play with programmatic timing, click again to attempt audio unmute.");
                        });
                    }
                } else {
                    logErrorToPanel("PLAYBACK", "No Audio Track found. Playing visual sequence in standalone video mode.");
                }
            }
        };

        playDocBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePlayback();
        });

        // Clicking the video container while playing pauses it
        videoArea.addEventListener("click", () => {
            if (isPlaying) {
                togglePlayback();
            }
        });

        if (audioTrack) {
            // Reset player UI state when audio track finishes playing
            audioTrack.addEventListener("ended", () => {
                try {
                    if (bgVideo) {
                        bgVideo.pause();
                        bgVideo.currentTime = 0;
                    }
                } catch (e) {}
                triggerDocumentaryFinished();
            });
        }
    }
});
