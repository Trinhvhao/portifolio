// ==========================================================================
// Visitor Counter Management - Using Visitor Badge API
// ==========================================================================
class VisitorCounter {
    constructor() {
        this.apiUrl = 'https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fportfolio.hayyie.click%2F&countColor=%23263759';
        this.init();
    }

    async init() {
        await this.fetchVisitorCount();
    }

    async fetchVisitorCount() {
        try {
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                const text = await response.text();
                // Extract number from SVG response
                const match = text.match(/>\s*(\d+)\s*</);
                const count = match ? match[1] : '0';
                this.renderCounter(count);
            }
        } catch (error) {
            console.log('Error fetching visitor count:', error);
            this.renderCounter('--');
        }
    }

    renderCounter(count) {
        const counterHTML = `
            <i class="fas fa-eye"></i>
            <span><span class="visitor-counter-number">${count}</span> views</span>
        `;
        
        const counterContainer = document.querySelector('.visitor-counter');
        if (counterContainer) {
            counterContainer.innerHTML = counterHTML;
        }
    }
}

// ==========================================================================
// Music Player Widget Management
// ==========================================================================
class MusicPlayerWidget {
    constructor() {
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        this.isMinimized = false;
        this.audioElement = document.getElementById('audioPlayer');
        
        // Default fallback playlist
        this.playlist = [
            {
                title: 'Deep Focus',
                artist: 'Ambient Music',
                file: 'deep-focus.mp3'
            },
            {
                title: 'Code Sessions',
                artist: 'Lo-fi Beats',
                file: 'code-sessions.mp3'
            },
            {
                title: 'Creative Flow',
                artist: 'Background Music',
                file: 'creative-flow.mp3'
            },
            {
                title: 'Night Coding',
                artist: 'Synthwave',
                file: 'night-coding.mp3'
            }
        ];

        this.currentTime = 0;
        this.duration = 0;
        this.loadMusicFolder();
    }

    async loadMusicFolder() {
        // Hardcode known files with correct relative paths
        const files = ['Ordinary.mp3', "Somebody'S Pleasure.mp3"];
        this.playlist = files.map(file => {
            // Convert filename to thumbnail name: remove extension, lowercase, replace spaces/special chars with underscore
            const baseName = file.replace('.mp3', '')
                .toLowerCase()
                .replace(/['']/g, '') // Remove apostrophes
                .replace(/\s+/g, '_') // Replace spaces with underscore
                .trim();
            
            return {
                title: file.replace('.mp3', ''),
                artist: 'Your Music',
                file: `./assets/music/${file}`,
                thumbnail: `./assets/images/${baseName}.jpg`
            };
        });
        console.log('Loaded playlist:', this.playlist);
        
        // Only init AFTER playlist is loaded
        this.init();
    }

    init() {
        if (!this.audioElement) return;
        
        // Setup audio listeners ONCE at init
        if (!this.listenersSetup) {
            this.setupAudioListeners();
            this.listenersSetup = true;
        }
        
        // Load first track immediately
        if (this.playlist.length > 0) {
            this.loadTrack(0, true); // true = skip renderPlayer
        }
        
        // Render player UI (ONLY ONCE here)
        this.renderPlayer();
        
        // Attach click listeners
        this.attachEventListeners();
        
        // Auto-play after a delay to ensure audio is ready
        setTimeout(() => {
            if (this.audioElement && this.audioElement.src) {
                // Try to play
                const playPromise = this.audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Auto-play succeeded
                            this.isPlaying = true;
                            this.updatePlayButtonUI();
                        })
                        .catch(err => {
                            // Auto-play blocked (browser policy)
                            console.log('Auto-play blocked:', err);
                            this.isPlaying = false;
                            this.updatePlayButtonUI();
                        });
                }
            }
        }, 800);
    }

    updatePlayButtonUI() {
        const playBtn = document.querySelector('.music-player-play-btn i');
        if (playBtn) {
            playBtn.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        
        const widget = document.querySelector('.music-player-widget');
        if (widget) {
            if (this.isPlaying) {
                widget.classList.add('playing');
            } else {
                widget.classList.remove('playing');
            }
        }
    }

    setupAudioListeners() {
        if (!this.audioElement) return;
        
        // Remove old listeners properly (use stored references)
        if (this.onTimeUpdate) {
            this.audioElement.removeEventListener('timeupdate', this.onTimeUpdate);
        }
        if (this.onLoadedMetadata) {
            this.audioElement.removeEventListener('loadedmetadata', this.onLoadedMetadata);
        }
        if (this.onEnded) {
            this.audioElement.removeEventListener('ended', this.onEnded);
        }
        if (this.onPlay) {
            this.audioElement.removeEventListener('play', this.onPlay);
        }
        if (this.onPause) {
            this.audioElement.removeEventListener('pause', this.onPause);
        }
        
        // Bind context properly with arrow functions
        this.onTimeUpdate = () => {
            this.currentTime = this.audioElement.currentTime;
            this.updateProgress();
        };
        
        this.onLoadedMetadata = () => {
            this.duration = this.audioElement.duration;
            // Update duration display in player (only the duration part, not the entire element)
            const durationEl = document.querySelector('.music-player-time');
            if (durationEl) {
                // Find the current-time span and update only the duration text after it
                const currentTimeSpan = durationEl.querySelector('.current-time');
                if (currentTimeSpan) {
                    // Replace only the text after the span: " / old_duration" -> " / new_duration"
                    const textNode = durationEl.lastChild;
                    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                        textNode.textContent = ` / ${this.formatTime(this.duration)}`;
                    }
                }
            }
            this.updateProgress();
        };
        
        this.onEnded = () => {
            console.log('[ENDED] Track ended, moving to next');
            this.nextTrack();
        };
        
        this.onPlay = () => {
            console.log('Audio playing');
            this.isPlaying = true;
            this.updatePlayButtonUI();
        };
        
        this.onPause = () => {
            console.log('Audio paused');
            // Don't update isPlaying here - let togglePlay handle it
        };
        
        // Add all listeners
        this.audioElement.addEventListener('timeupdate', this.onTimeUpdate);
        this.audioElement.addEventListener('loadedmetadata', this.onLoadedMetadata);
        this.audioElement.addEventListener('ended', this.onEnded);
        this.audioElement.addEventListener('play', this.onPlay);
        this.audioElement.addEventListener('pause', this.onPause);
    }

    autoPlayOnLoad() {
        // Auto-play first track on page load
        setTimeout(() => {
            if (this.playlist.length > 0) {
                this.loadTrack(0);
                this.togglePlay();
            }
        }, 1000);
    }

    loadTrack(index, skipRender = false) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        if (this.audioElement) {
            // Load file and reset time
            this.audioElement.src = track.file;
            this.audioElement.currentTime = 0;
            this.currentTime = 0;
            this.duration = 0; // Reset duration until metadata loads
        }
        
        // Only render and re-attach if not skipping
        if (!skipRender) {
            this.renderPlayer();
            this.attachEventListeners();
        }
    }

    renderPlayer() {
        const track = this.playlist[this.currentTrackIndex];
        const duration = this.audioElement?.duration ? this.formatTime(this.audioElement.duration) : '0:00';
        const playerHTML = `
            <div class="music-player-header">
                <span class="music-player-title">▶ Now Playing</span>
                <button class="music-player-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="music-player-content">
                <div class="music-player-cover" style="background-image: url('${track.thumbnail}'); background-size: cover; background-position: center;">
                    ${!track.thumbnail ? '<i class="fas fa-music"></i>' : ''}
                </div>
                <div class="music-player-info">
                    <div>
                        <p class="music-player-song-title">${track.title}</p>
                        <p class="music-player-artist">${track.artist}</p>
                    </div>
                    <div class="music-player-progress">
                        <div class="music-player-progress-bar"></div>
                    </div>
                </div>
            </div>
            <div class="music-player-controls">
                <span class="music-player-time"><span class="current-time">0:00</span> / ${duration}</span>
                <button class="music-player-btn prev-btn" title="Previous">
                    <i class="fas fa-step-backward"></i>
                </button>
                <button class="music-player-play-btn" title="Play/Pause">
                    <i class="fas fa-play"></i>
                </button>
                <button class="music-player-btn next-btn" title="Next">
                    <i class="fas fa-step-forward"></i>
                </button>
                <button class="music-player-btn toggle-btn" title="Minimize">
                    <i class="fas fa-compress"></i>
                </button>
            </div>
            <button class="music-player-toggle-btn">
                <i class="fas fa-expand"></i>
            </button>
        `;

        const playerContainer = document.querySelector('.music-player-widget');
        if (playerContainer) {
            playerContainer.innerHTML = playerHTML;
        }
    }

    attachEventListeners() {
        const playerContainer = document.querySelector('.music-player-widget');
        if (!playerContainer) return;

        const playBtn = playerContainer.querySelector('.music-player-play-btn');
        const prevBtn = playerContainer.querySelector('.prev-btn');
        const nextBtn = playerContainer.querySelector('.next-btn');
        const closeBtn = playerContainer.querySelector('.music-player-close');
        const toggleBtn = playerContainer.querySelector('.toggle-btn');
        const minimizeToggleBtn = playerContainer.querySelector('.music-player-toggle-btn');
        const progressBar = playerContainer.querySelector('.music-player-progress');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay(playBtn));
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePlayer());
        }
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleMinimize());
        }
        if (minimizeToggleBtn) {
            minimizeToggleBtn.addEventListener('click', () => this.toggleMinimize());
        }
        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seek(e));
        }

        // Allow click on minimized widget (not on toggle/close) to expand back
        playerContainer.addEventListener('click', (e) => {
            if (!this.isMinimized) return;
            const target = e.target;
            if (target.closest('.toggle-btn') || target.closest('.music-player-close')) return;
            this.toggleMinimize();
        });
    }

    togglePlay(playBtn) {
        this.isPlaying = !this.isPlaying;
        
        if (this.audioElement) {
            if (this.isPlaying) {
                const playPromise = this.audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Playback started successfully
                            this.updatePlayButtonUI();
                        })
                        .catch(err => {
                            // Play failed, revert state
                            console.log('Play error:', err);
                            this.isPlaying = false;
                            this.updatePlayButtonUI();
                        });
                } else {
                    // Older browser without promise
                    this.updatePlayButtonUI();
                }
            } else {
                // Pause
                this.audioElement.pause();
                this.updatePlayButtonUI();
            }
        }
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex); // This WILL render + re-attach
        
        // Auto-play next track if currently playing
        if (this.isPlaying && this.audioElement) {
            setTimeout(() => {
                this.audioElement.play().catch(err => console.log('Auto-play next error:', err));
                this.updatePlayButtonUI();
            }, 100);
        }
    }

    previousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex); // This WILL render + re-attach
        
        // Auto-play previous track if currently playing
        if (this.isPlaying && this.audioElement) {
            setTimeout(() => {
                this.audioElement.play().catch(err => console.log('Auto-play prev error:', err));
                this.updatePlayButtonUI();
            }, 100);
        }
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const playerContainer = document.querySelector('.music-player-widget');
        if (playerContainer) {
            playerContainer.classList.toggle('minimized', this.isMinimized);
        }
    }

    closePlayer() {
        const playerContainer = document.querySelector('.music-player-widget');
        if (playerContainer) {
            playerContainer.style.display = 'none';
        }
    }

    seek(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        if (this.audioElement) {
            this.audioElement.currentTime = percent * this.duration;
            this.currentTime = this.audioElement.currentTime;
        }
        this.updateProgress();
    }

    updateProgress() {
        const progressFill = document.querySelector('.music-player-progress-bar');
        const currentTimeEl = document.querySelector('.current-time');
        
        // Debug: log progress update
        if (this.duration > 0) {
            const percent = (this.currentTime / this.duration) * 100;
            
            if (progressFill) {
                progressFill.style.width = Math.min(percent, 100) + '%';
            }
            
            if (currentTimeEl) {
                currentTimeEl.textContent = this.formatTime(this.currentTime);
            }
        }
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// ==========================================================================
// Theme Switcher
// ==========================================================================
class ThemeSwitcher {
    constructor() {
        this.themeKey = 'portfolio_theme_mode';
        this.toggleBtn = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem(this.themeKey) || 'dark';
        this.applyTheme(savedTheme);
        
        // Add toggle listener
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        const body = document.body;
        const icon = this.toggleBtn?.querySelector('i');
        
        if (theme === 'light') {
            body.classList.add('light-mode');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            body.classList.remove('light-mode');
            if (icon) icon.className = 'fas fa-moon';
        }
        
        localStorage.setItem(this.themeKey, theme);
        
        // Redraw radar chart if it exists
        if (typeof drawRadarChart === 'function') {
            setTimeout(() => drawRadarChart(), 100);
        }
    }
}

// ==========================================================================
// Initialize Components
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme Switcher
    const themeSwitcher = new ThemeSwitcher();
    
    // Initialize Visitor Counter
    const visitorCounter = new VisitorCounter();

    // Initialize Music Player
    const musicPlayer = new MusicPlayerWidget();
});
