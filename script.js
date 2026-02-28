// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                initAnimations();
            }, 500);
        }, 1500);
    } else {
        initAnimations();
    }
    
    initModal();
    initMobileMenu();
    initHeroSlideshow();
    initDeepLinking();
});

function initHeroSlideshow() {
    const heroImage = document.getElementById('hero-image');
    if (!heroImage) return;

    // Optional: Add more images to this array for a slideshow effect
    const images = ['FB_IMG_1767419803312.jpg'];
    heroImage.src = images[0];
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    let isOpen = false;

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                // Open Menu
                menu.classList.remove('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.classList.add('overflow-hidden');
                
                // Animate Links
                gsap.fromTo(links, 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
                );
            } else {
                // Close Menu
                menu.classList.add('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('overflow-hidden');
            }
        });

        // Close on Link Click
        links.forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                menu.classList.add('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('overflow-hidden');
            });
        });
    }
}

function initAnimations() {
    const reduceAnimations = (window.matchMedia && (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(max-width: 768px)').matches
    ));

    // Navbar Animation
    gsap.from("nav", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    });

    // Hero Section Animations
    gsap.from("#hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    });

    gsap.from("#hero-image", {
        scale: 1,
        opacity: 0,
        duration: 1,
        ease: "power1.out",
        delay: 0.8
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navbar = document.getElementById('navbar');
            
            if (targetSection) {
                const top = targetSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top, behavior: reduceAnimations ? 'auto' : 'smooth' });
            }
        });
    });

    if (reduceAnimations) return;

    gsap.from("#music-player", {
        scrollTrigger: {
            trigger: "#music",
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from("#booking-card", {
        scrollTrigger: {
            trigger: "#booking",
            start: "top 70%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from("#gallery-main-image", {
        scrollTrigger: {
            trigger: "#gallery",
            start: "top 75%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out"
    });

    gsap.from(".gallery-thumb", {
        scrollTrigger: {
            trigger: "#gallery",
            start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
    });

    gsap.from(".event-item", {
        scrollTrigger: {
            trigger: "#events",
            start: "top 70%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    });
}

// Audio Player Logic
const audio = new Audio();
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const downloadBtn = document.getElementById('download-btn');
const progressBar = document.getElementById('progress-bar');
const trackTitle = document.getElementById('current-track');
const trackArtist = document.getElementById('current-artist');
const playerCover = document.getElementById('player-cover');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackItems = document.querySelectorAll('.track-item');

const tracks = [
    {
        file: 'PacMan SD - Wo Manini [Feat. Saphiwa].mp3.mpeg',
        title: 'Wo Manini [Feat. Saphiwa]',
        artist: 'Pacman SD',
        cover: 'IMG-20260226-WA0033.jpg'
    },
    {
        file: 'AUD-20260107-WA0017.mp3',
        title: 'Umdlalo Wemoya',
        artist: 'Pacman SD',
        cover: 'cover.jpg'
    },
    {
        file: 'AUD-20260107-WA0018.mp3',
        title: 'Thank You',
        artist: 'Pacman SD',
        cover: 'cover.jpg'
    },
    {
        file: 'AUD-20260107-WA0019.mp3',
        title: 'Ziphi Lah [Feat. Mthobisi]',
        artist: 'Pacman SD',
        cover: 'IMG-20251009-WA0030~2.png'
    },
    {
        file: 'AUD-20260107-WA0020.mp3',
        title: 'Black Anthem [Feat. SmoothRamz]',
        artist: 'Pacman SD',
        cover: 'FB_IMG_1767419803312.jpg'
    },
    {
        file: 'AUD-20260108-WA0001.mp3',
        title: 'Delayed Visions [Feat. Plord]',
        artist: 'Pacman SD',
        cover: 'FB_IMG_1767419848838.jpg'
    },
    {
        file: 'AUD-20260108-WA0002.mp3',
        title: 'Wrong Time',
        artist: 'Pacman SD',
        cover: '1000186736.png'
    },
    {
        file: 'AUD-20260108-WA0003.mp3',
        title: 'Army Commander',
        artist: 'Pacman SD',
        cover: 'PSX_20251020_233755~3 (2) (1) (1) (1).png'
    },
    {
        file: 'AUD-20260108-WA0004.mp3',
        title: 'Makasane',
        artist: 'Pacman SD',
        cover: '1000186749.png'
    }
];

let currentIndex = 0;
let isPlaying = false;
let isSeeking = false;

function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    const floored = Math.floor(seconds);
    const m = Math.floor(floored / 60);
    const s = floored % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updatePlayIcon() {
    if (!playIcon) return;
    if (isPlaying) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}

function highlightTrack(index) {
    trackItems.forEach((item, i) => {
        const playIconDiv = item.querySelector('.fa-play, .fa-pause').parentElement;
        const icon = item.querySelector('.fa-play, .fa-pause');
        
        if (i === index) {
            // Active styles
            item.classList.remove('bg-white', 'border-gray-300');
            item.classList.add('border-swazi-yellow', 'shadow-md', 'bg-white', 'border-2');
            
            // Update icon container
            if (playIconDiv) {
                // No change needed for active icon color (white on yellow)
            }
        } else {
            // Inactive styles
            item.classList.add('bg-white', 'border-gray-300');
            item.classList.remove('border-swazi-yellow', 'shadow-md', 'border-2');
            
            // Update icon container
            if (playIconDiv) {
                // No change needed for inactive icon color (white on yellow)
            }
        }
    });
}

function updateDownloadLink(track) {
    if (!downloadBtn) return;
    downloadBtn.href = track.file;
    const safeName = track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadBtn.setAttribute('download', `${safeName}.mp3`);
}

function loadTrack(index) {
    if (!tracks[index]) return;
    currentIndex = index;
    const track = tracks[index];
    
    // Only change src if it's different (prevents reloading if clicking same track)
    // But we need to allow reloading if it was stopped
    if (audio.src.indexOf(encodeURI(track.file)) === -1 || audio.src === '') {
        audio.src = track.file;
    }

    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (playerCover && track.cover) playerCover.src = track.cover;
    
    // Reset progress if it's a new track
    if (progressBar && audio.currentTime === 0) {
        progressBar.value = 0;
    }
    
    highlightTrack(index);
    updateDownloadLink(track);
}

function playCurrent() {
    audio.play().then(() => {
        isPlaying = true;
        updatePlayIcon();
    }).catch(err => console.log("Audio play error:", err));
}

function pauseCurrent() {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
}

function togglePlay() {
    if (!audio.src || audio.src === window.location.href) { // Safety check
        loadTrack(currentIndex);
    }
    
    if (isPlaying) {
        pauseCurrent();
    } else {
        playCurrent();
    }
}

function playNext() {
    const nextIndex = (currentIndex + 1) % tracks.length;
    loadTrack(nextIndex);
    playCurrent();
}

function playPrevious() {
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(prevIndex);
    playCurrent();
}

// Event Listeners for Player
if (playBtn) playBtn.addEventListener('click', togglePlay);
if (nextBtn) nextBtn.addEventListener('click', playNext);
if (prevBtn) prevBtn.addEventListener('click', playPrevious);

// Track Item Click Listeners
trackItems.forEach(item => {
    const indexAttr = item.getAttribute('data-index');
    const index = indexAttr ? parseInt(indexAttr, 10) : 0;
    
    // Make the whole card clickable
    item.addEventListener('click', (e) => {
        // Prevent if clicking share button
        if (e.target.closest('button')) return;
        
        loadTrack(index);
        playCurrent();
    });
});

// Progress Bar
if (progressBar) {
    progressBar.addEventListener('input', () => {
        isSeeking = true;
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(progressBar.value);
        }
    });
    progressBar.addEventListener('change', () => {
        audio.currentTime = Number(progressBar.value);
        isSeeking = false;
    });
}

// Audio Events
audio.addEventListener('timeupdate', () => {
    if (!progressBar || isSeeking) return;
    progressBar.max = audio.duration || 100;
    progressBar.value = audio.currentTime;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    if (progressBar) progressBar.max = audio.duration || 100;
    if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    playNext();
});

// Load first track initially without playing
if (tracks.length > 0) {
    loadTrack(0);
}

// Bio Modal Logic
function initModal() {
    const bioModal = document.getElementById('bio-modal');
    const openBioBtn = document.getElementById('open-bio-btn');
    const closeBioBtn = document.getElementById('close-bio');

    if (openBioBtn && bioModal && closeBioBtn) {
        openBioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bioModal.classList.remove('hidden');
            setTimeout(() => bioModal.classList.remove('opacity-0'), 10);
            document.body.classList.add('overflow-hidden');
        });

        closeBioBtn.addEventListener('click', () => {
            bioModal.classList.add('opacity-0');
            setTimeout(() => {
                bioModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }, 500);
        });
        
        // Close on outside click
        bioModal.addEventListener('click', (e) => {
            // Check if clicking the backdrop (not the content)
            if (e.target === bioModal || e.target.querySelector('.container') === e.target) {
                 closeBioBtn.click();
            }
        });
    }
}

// WhatsApp booking
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-whatsapp');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const name = document.getElementById('booking-name')?.value || '';
            const email = document.getElementById('booking-email')?.value || '';
            const message = document.getElementById('booking-message')?.value || '';
            const errorEl = document.getElementById('booking-error');
            
            if (errorEl) errorEl.classList.add('hidden');

            if (!name.trim() || !message.trim()) {
                if (errorEl) errorEl.classList.remove('hidden');
                return;
            }

            const composed = `Booking Inquiry\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
            const encoded = encodeURIComponent(composed);
            const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const base = isMobile ? 'whatsapp://send?phone=26878270065&text=' : 'https://wa.me/26878270065?text=';
            window.open(base + encoded, '_blank');
        });
    }
});

// Lightbox Logic
// Note: This needs to be global if called via onclick in HTML
window.openLightbox = function(element) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const sourceImg = element.querySelector('img');
    const sourceCaption = element.getAttribute('data-caption') || ''; // Use data attribute

    if (modal && img && sourceImg) {
        img.src = sourceImg.src;
        caption.innerText = sourceCaption;
        
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('close-lightbox');

    if (modal && closeBtn) {
        const close = () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                close();
            }
        });
    }
    
    // Gallery Thumbnails Logic
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const galleryMain = document.getElementById('gallery-main-image');
    const galleryCaption = document.getElementById('gallery-caption');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    let galleryIndex = 0;

    function setGalleryImage(index) {
        if (index < 0 || index >= galleryThumbs.length) return;
        const thumb = galleryThumbs[index];
        if (!thumb) return;
        
        galleryIndex = index;
        const src = thumb.getAttribute('data-src');
        const caption = thumb.getAttribute('data-caption');
        
        if(galleryMain) {
            // Fade out
            gsap.to(galleryMain, {opacity: 0.5, duration: 0.2, onComplete: () => {
                galleryMain.src = src;
                gsap.to(galleryMain, {opacity: 1, duration: 0.2});
            }});
        }
        if(galleryCaption) galleryCaption.textContent = caption;
        
        // Update active state
        galleryThumbs.forEach(t => t.classList.remove('border-swazi-blue', 'border-2'));
        galleryThumbs.forEach(t => t.classList.add('border-transparent', 'border-2'));
        
        thumb.classList.remove('border-transparent');
        thumb.classList.add('border-swazi-blue');
    }

    galleryThumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            setGalleryImage(index);
        });
    });

    if (galleryPrev) {
        galleryPrev.addEventListener('click', () => {
            const nextIndex = (galleryIndex - 1 + galleryThumbs.length) % galleryThumbs.length;
            setGalleryImage(nextIndex);
        });
    }

    if (galleryNext) {
        galleryNext.addEventListener('click', () => {
            const nextIndex = (galleryIndex + 1) % galleryThumbs.length;
            setGalleryImage(nextIndex);
        });
    }

    // Scroll Background Logic
    const navbar = document.getElementById('navbar');
    const desktopMenu = document.getElementById('desktop-menu');
    
    // Scroll listener removed as per new design (fixed header)
});

// Deep Linking and Sharing
function initDeepLinking() {
    const urlParams = new URLSearchParams(window.location.search);
    const trackIndex = urlParams.get('track');
    
    if (trackIndex !== null) {
        const index = parseInt(trackIndex, 10);
        if (!isNaN(index) && index >= 0 && index < tracks.length) {
            // Delay slightly to ensure elements are ready
            setTimeout(() => {
                loadTrack(index);
                
                // Scroll to music section
                const musicSection = document.getElementById('music');
                if (musicSection) {
                    musicSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }
}

// Global function for Share Button
window.copyShareLink = function(index) {
    const baseUrl = window.location.origin + window.location.pathname;
    // Strip any existing query params
    const cleanUrl = baseUrl.split('?')[0];
    const shareUrl = `${cleanUrl}?track=${index}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        showToast('Failed to copy link');
    });
}

function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-[100] transition-all duration-300 opacity-0 pointer-events-none text-sm font-bold flex items-center gap-2';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<i class="fas fa-check-circle text-green-500"></i> ${message}`;
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }, 3000);
}
