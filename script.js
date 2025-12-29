// 設定データの読み込み
let config = null;

// JSON設定ファイルの読み込み
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        return config;
    } catch (error) {
        console.error('設定ファイルの読み込みに失敗しました:', error);
        return null;
    }
}

// サーバーカードの生成
function createServerCard(server) {
    const card = document.createElement('div');
    card.className = 'server-card';
    
    const featuresList = server.features.map(feature => 
        `<li>${feature}</li>`
    ).join('');
    
    card.innerHTML = `
        <h2>${server.name}</h2>
        <p>${server.description}</p>
        <ul class="features">
            ${featuresList}
        </ul>
        <a href="${server.invite}" target="_blank" class="btn">サーバーに参加</a>
        <a href="${server.id}.html" class="btn" style="margin-left: 1rem; background: transparent; border-color: var(--primary-red);">詳細を見る</a>
    `;
    
    return card;
}

// メインページのサーバーリストを表示
async function displayServers() {
    const grid = document.getElementById('serversGrid');
    if (!grid) return;
    
    const config = await loadConfig();
    if (!config) {
        grid.innerHTML = '<p style="color: var(--primary-red);">サーバー情報の読み込みに失敗しました。</p>';
        return;
    }
    
    grid.innerHTML = '';
    config.servers.forEach(server => {
        const card = createServerCard(server);
        grid.appendChild(card);
    });
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // メインページの場合のみサーバーリストを表示
    if (document.getElementById('serversGrid')) {
        displayServers();
    }
    
    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ナビゲーションのアクティブ状態
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.style.color = 'var(--primary-red)';
        }
    });
});

// アニメーションのトリガー
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// アニメーション対象要素の監視
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.server-card, .info-section, .url-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // URLカードのアニメーション
    const urlCards = document.querySelectorAll('.url-card');
    urlCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // スクロールアニメーション
    initScrollAnimations();
    
    // パーティクルエフェクト
    createParticles();
    
    // マウス追従エフェクト
    initMouseFollowEffect();
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.error);
});

// 設定データの取得（PHP API経由でも可能）
async function fetchServerData(serverId) {
    try {
        const response = await fetch(`api.php?server=${serverId}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('PHP APIは利用できません。JSONファイルを使用します。');
    }
    return null;
}

// スクロールアニメーション
function initScrollAnimations() {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        scrollObserver.observe(el);
    });
}

// パーティクルエフェクト
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// マウス追従エフェクト
function initMouseFollowEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        const cursor = document.querySelector('.cursor-follow');
        if (cursor) {
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// ボタンのリップルエフェクト
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// リップルアニメーションをCSSに追加
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// URLカードのホバーアニメーション強化
document.querySelectorAll('.url-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.05) rotate(2deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    });
});

// タイピングアニメーション（オプション）
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ページ読み込み時の追加アニメーション
window.addEventListener('load', function() {
    // ヒーローセクションのアニメーション
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(50px)';
        setTimeout(() => {
            hero.style.transition = 'all 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // ナビゲーションのアニメーション
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            nav.style.transition = 'transform 0.5s ease';
            nav.style.transform = 'translateY(0)';
        }, 50);
    }
});

