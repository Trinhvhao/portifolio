// ==========================================================================
// Scroll Restoration
// ==========================================================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ==========================================================================
// Particles.js Configuration
// ==========================================================================
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#00BFFF' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00BFFF',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});

// ==========================================================================
// Initialize Feather Icons
// ==========================================================================
feather.replace();

// ==========================================================================
// Loading Screen
// ==========================================================================
window.addEventListener('load', () => {
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1000);
});

// ==========================================================================
// Navbar Scroll Effect
// ==========================================================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================================================
// Mobile Menu Toggle
// ==========================================================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ==========================================================================
// Smooth Scrolling for Navigation Links
// ==========================================================================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        navLinks.classList.remove('active');
    });
});

// ==========================================================================
// Radar Chart
// ==========================================================================
function drawRadarChart() {
    const canvas = document.getElementById('radarChart');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;

    const skills = [
        { name: 'Giao tiếp', value: 90 },
        { name: 'Quản lý thời gian', value: 85 },
        { name: 'Làm việc nhóm', value: 88 },
        { name: 'Tư duy phản biện', value: 82 },
        { name: 'Marketing', value: 70 },
        { name: 'Sáng tạo', value: 85 }
    ];

    const angleStep = (Math.PI * 2) / skills.length;
    let currentAngle = -Math.PI / 2; // Start from top

    // Detect theme mode
    const isLightMode = document.body.classList.contains('light-mode');
    
    // Theme-aware colors
    const gridColor = isLightMode ? 'rgba(37, 99, 235, 0.3)' : 'rgba(0, 191, 255, 0.2)';
    const labelColor = isLightMode ? '#1F2937' : '#ffffff';
    const gradient1 = isLightMode ? '#2563EB' : '#FFD700';
    const gradient2 = isLightMode ? '#7C3AED' : '#FF6B35';
    const fillColor = isLightMode ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 215, 0, 0.2)';
    const pointStroke = isLightMode ? '#FFFFFF' : '#ffffff';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid circles
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Draw grid lines
    skills.forEach((_, index) => {
        const angle = currentAngle + (angleStep * index);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    });

    // Draw skill labels
    ctx.fillStyle = labelColor;
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'center';
    skills.forEach((skill, index) => {
        const angle = currentAngle + (angleStep * index);
        const labelRadius = radius + 20;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        
        ctx.fillText(skill.name, x, y);
    });

    // Draw skill polygon
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, gradient1);
    gradient.addColorStop(1, gradient2);

    ctx.beginPath();
    skills.forEach((skill, index) => {
        const angle = currentAngle + (angleStep * index);
        const skillRadius = (radius * skill.value) / 100;
        const x = centerX + Math.cos(angle) * skillRadius;
        const y = centerY + Math.sin(angle) * skillRadius;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw skill points
    skills.forEach((skill, index) => {
        const angle = currentAngle + (angleStep * index);
        const skillRadius = (radius * skill.value) / 100;
        const x = centerX + Math.cos(angle) * skillRadius;
        const y = centerY + Math.sin(angle) * skillRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = pointStroke;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// ==========================================================================
// Animate Radar Chart When Visible
// ==========================================================================
const radarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                drawRadarChart();
            }, 500);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

const radarChart = document.getElementById('radarChart');
if (radarChart) {
    radarObserver.observe(radarChart);
}

// ==========================================================================
// Scroll Animations
// ==========================================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__zoomIn');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections and timeline stats
document.querySelectorAll('section.animate__animated, #certificates .grid').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.animate__animated, .fade-in-up').forEach(el => {
    observer.observe(el);
});

// ==========================================================================
// Contact Form Submission
// ==========================================================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    submitBtn.disabled = true;
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Đã gửi!';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
        e.target.reset();
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }, 2000);
});

// ==========================================================================
// Confetti Effect
// ==========================================================================
function createConfetti() {
    const colors = ['#FFD700', '#00BFFF', '#8A2BE2', '#FF6B35'];
    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '10000';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        animation.onfinish = () => confetti.remove();
    }
}

// ==========================================================================
// Dark Mode Toggle (Placeholder - Already in Dark Mode)
// ==========================================================================
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        alert('Dark mode is already active! 🌙');
    });
}


// ==========================================================================
// Ripple Effect for Buttons
// ==========================================================================
document.querySelectorAll('.cta-button, .btn-primary').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ==========================================================================
// Timeline Observer
// ==========================================================================
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__fadeIn');
            const timelineProgress = document.querySelector('.timeline-progress');
            const timelineItems = document.querySelectorAll('.timeline-item.animate__fadeIn');
            if (timelineProgress && timelineItems.length > 0) {
                const progress = (timelineItems.length / document.querySelectorAll('.timeline-item').length) * 100;
                requestAnimationFrame(() => {
                    timelineProgress.style.height = progress + '%';
                });
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.timeline-item, .timeline-year, .timeline-end').forEach(item => {
    timelineObserver.observe(item);
});

// Observe timeline items
document.querySelectorAll('.timeline-item, .fade-in-up').forEach(el => {
    observer.observe(el);
});

// ==========================================================================
// Timeline Stats Counter Animation
// ==========================================================================
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log('Timeline Stats in view:', entry.isIntersecting);
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__zoomIn');
            const counters = entry.target.querySelectorAll('.orbitron');
            console.log('Counters found:', counters.length);
            counters.forEach(counter => {
                const target = parseFloat(counter.textContent);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
                        clearInterval(timer);
                    } else {
                        counter.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
                    }
                }, 30);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const timelineStats = document.querySelector('#certificates .grid');
if (timelineStats) {
    statsObserver.observe(timelineStats);
} else {
    console.error('Timeline Stats element not found');
}

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// ==========================================================================
// Timeline Card Click Interactions
// ==========================================================================
document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('click', function () {
        const title = this.querySelector('h3').textContent;
        const isAchievement = this.classList.contains('achievement-card');
        const type = isAchievement ? 'thành tích' : 'chứng chỉ';

        // Add pulse effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        console.log(`Xem chi tiết ${type}: ${title}`);
    });
});
