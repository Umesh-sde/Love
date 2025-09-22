        document.addEventListener('DOMContentLoaded', () => {
            const textContainer = document.getElementById('text-container');
            const heartContainer = document.querySelector('.heart-container');
            const cursorGlow = document.getElementById('cursor-glow');
            const customCursor = document.getElementById('custom-cursor');
            const stardustCanvas = document.getElementById('stardust-canvas');
            const ctx = stardustCanvas.getContext('2d');
            
            let particles = [];
            const mouse = { x: null, y: null };
            function init() {
                setupCanvas();
                initCursorListeners();
                initFloatingText();
                initSound();
                animateStardust();
            }
            function setupCanvas() {
                stardustCanvas.width = window.innerWidth;
                stardustCanvas.height = window.innerHeight;
                window.addEventListener('resize', () => {
                    stardustCanvas.width = window.innerWidth;
                    stardustCanvas.height = window.innerHeight;
                });
            }
            let synth;
            function initSound() {
                synth = new Tone.FMSynth({
                    harmonicity: 8,
                    modulationIndex: 2,
                    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }
                }).toDestination();
            }
            function initCursorListeners() {
                document.body.addEventListener('mousemove', (e) => {
                    const { clientX, clientY } = e;
                    mouse.x = clientX;
                    mouse.y = clientY;

                    const x = (clientX / window.innerWidth) - 0.5;
                    const y = (clientY / window.innerHeight) - 0.5;

                    textContainer.style.transform = `translate(${-x * 40}px, ${-y * 40}px)`;
                    heartContainer.style.transform = `translate(calc(-50% + ${-x * 20}px), calc(-50% + ${-y * 20}px))`;
                    
                    const cursorTransform = `translate(${clientX}px, ${clientY}px)`;
                    cursorGlow.style.transform = cursorTransform;
                    customCursor.style.transform = cursorTransform;
                });
                
                document.body.addEventListener('mousedown', () => {
                    customCursor.style.width = '15px';
                    customCursor.style.height = '15px';
                    if (Tone.context.state !== 'running') {
                        Tone.start();
                    }
                    synth.triggerAttackRelease('C5', '8n');
                });

                document.body.addEventListener('mouseup', () => {
                    customCursor.style.width = '8px';
                    customCursor.style.height = '8px';
                });
            }
            function initFloatingText() {
                const textCount = 80;
                const words = ['love you ❤️', 'Motu💋', 'Bubu🐼', 'Jaan👸🏻', 'Kucchumucchu🤜🏻'];
                for (let i = 0; i < textCount; i++) {
                    const textElement = document.createElement('span');
                    textElement.classList.add('floating-text');
                    textElement.textContent = words[Math.floor(Math.random() * words.length)];

                    textElement.style.left = `${Math.random() * 100}vw`;
                    textElement.style.fontSize = `${10 + Math.random() * 18}px`;
                    
                    const shade = 180 + Math.random() * 75;
                    textElement.style.color = `rgb(${shade}, ${shade}, ${shade})`;

                    const duration = 20 + Math.random() * 25;
                    textElement.style.animationDuration = `${duration}s`;
                    const delay = Math.random() * duration;
                    textElement.style.animationDelay = `-${delay}s`;

                    textElement.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
                    textElement.style.setProperty('--rotation', `${(Math.random() - 0.5) * 90}deg`);

                    textContainer.appendChild(textElement);
                }
            }
            class Particle {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.size = Math.random() * 1.5 + 0.5;
                    this.speedX = Math.random() * 2 - 1;
                    this.speedY = Math.random() * 2 - 1;
                    this.life = 1;
                    this.opacity = 1;
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    this.life -= 0.02;
                    if (this.life < 0) this.life = 0;
                    this.opacity = this.life;
                }
                draw() {
                    ctx.fillStyle = `rgba(255, 220, 230, ${this.opacity})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            function handleParticles() {
                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    particles[i].draw();
                    if (particles[i].life <= 0) {
                        particles.splice(i, 1);
                    }
                }
            }

            function animateStardust() {
                ctx.clearRect(0, 0, stardustCanvas.width, stardustCanvas.height);
                if (mouse.x && mouse.y) {
                    for (let i = 0; i < 2; i++) {
                        particles.push(new Particle(mouse.x, mouse.y));
                    }
                }
                handleParticles();
                requestAnimationFrame(animateStardust);
            }
            init();
        });