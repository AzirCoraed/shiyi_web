class ClientLogoSlider {
    constructor(options = {}) {
        // 选择器
        this.containerSelector = options.containerSelector || '.clients-container';
        this.trackSelector = options.trackSelector || '.clients-track';
        this.prevBtnSelector = options.prevBtnSelector || '.prev-btn';
        this.nextBtnSelector = options.nextBtnSelector || '.next-btn';
        this.logoWrapperSelector = options.logoWrapperSelector || '.client-logo-wrapper';

        // DOM元素
        this.container = document.querySelector(this.containerSelector);
        this.track = document.querySelector(this.trackSelector);
        this.prevBtn = document.querySelector(this.prevBtnSelector);
        this.nextBtn = document.querySelector(this.nextBtnSelector);
        this.logos = document.querySelectorAll(this.logoWrapperSelector);

        // 配置
        this.scrollStep = 0;
        this.autoScrollInterval = options.autoScrollInterval || 3000;
        this.autoScrollTimer = null;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;

        // 初始化
        this.init();
    }

    init() {
        if (!this.container || !this.track || !this.logos.length) return;

        // 克隆logo以实现无缝滚动
        this.cloneLogos();
        
        // 更新滚动步长
        this.updateScrollStep();
        
        // 绑定事件
        this.initEvents();
        
        // 开始自动滚动
        this.startAutoScroll();
    }

    updateScrollStep() {
        if (this.logos.length === 0) return;
        const logo = this.logos[0];
        const style = window.getComputedStyle(logo);
        const width = logo.offsetWidth;
        const marginRight = parseInt(style.marginRight) || 0;
        this.scrollStep = width + marginRight;
    }

    cloneLogos() {
        // 克隆前后各一组logo
        const firstSetClones = Array.from(this.logos).map(logo => logo.cloneNode(true));
        const lastSetClones = Array.from(this.logos).map(logo => logo.cloneNode(true));
        
        // 添加到track
        firstSetClones.forEach(clone => this.track.appendChild(clone));
        lastSetClones.reverse().forEach(clone => this.track.insertBefore(clone, this.track.firstChild));
        
        // 更新位置
        this.track.style.transform = `translateX(-${this.logos.length * this.scrollStep}px)`;
    }

    initEvents() {
        // 按钮点击事件
        this.prevBtn.addEventListener('click', () => this.scroll('prev'));
        this.nextBtn.addEventListener('click', () => this.scroll('next'));

        // 鼠标事件
        this.track.addEventListener('mouseenter', () => this.stopAutoScroll());
        this.track.addEventListener('mouseleave', () => this.startAutoScroll());

        // 拖动事件
        this.track.addEventListener('mousedown', e => this.handleDragStart(e));
        this.track.addEventListener('mousemove', e => this.handleDragMove(e));
        this.track.addEventListener('mouseup', () => this.handleDragEnd());
        this.track.addEventListener('mouseleave', () => this.handleDragEnd());

        // 触摸事件
        this.track.addEventListener('touchstart', e => this.handleDragStart(e.touches[0]));
        this.track.addEventListener('touchmove', e => this.handleDragMove(e.touches[0]));
        this.track.addEventListener('touchend', () => this.handleDragEnd());

        // 窗口调整事件
        window.addEventListener('resize', () => {
            this.updateScrollStep();
            this.updateTrackPosition();
        });
    }

    handleDragStart(e) {
        this.isDragging = true;
        this.startX = e.pageX - this.track.offsetLeft;
        this.scrollLeft = this.track.scrollLeft;
        this.track.style.cursor = 'grabbing';
    }

    handleDragMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.pageX - this.track.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.track.scrollLeft = this.scrollLeft - walk;
    }

    handleDragEnd() {
        this.isDragging = false;
        this.track.style.cursor = 'grab';
    }

    scroll(direction) {
        const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(this.track).transform);
        let translateX = currentTransform.m41;
        
        if (direction === 'prev') {
            translateX += this.scrollStep;
        } else {
            translateX -= this.scrollStep;
        }

        this.track.style.transition = 'transform 0.3s ease';
        this.track.style.transform = `translateX(${translateX}px)`;

        // 检查边界
        setTimeout(() => this.checkBoundary(), 300);
    }

    updateTrackPosition() {
        const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(this.track).transform);
        const translateX = currentTransform.m41;
        this.track.style.transition = 'none';
        this.track.style.transform = `translateX(${translateX}px)`;
    }

    checkBoundary() {
        const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(this.track).transform);
        const translateX = currentTransform.m41;
        
        if (translateX > -this.scrollStep) {
            // 到达左边界
            this.track.style.transition = 'none';
            this.track.style.transform = `translateX(-${this.logos.length * this.scrollStep}px)`;
        } else if (translateX < -(this.logos.length * 2 * this.scrollStep)) {
            // 到达右边界
            this.track.style.transition = 'none';
            this.track.style.transform = `translateX(-${this.logos.length * this.scrollStep}px)`;
        }
    }

    startAutoScroll() {
        if (this.autoScrollTimer) return;
        this.autoScrollTimer = setInterval(() => this.scroll('next'), this.autoScrollInterval);
    }

    stopAutoScroll() {
        if (this.autoScrollTimer) {
            clearInterval(this.autoScrollTimer);
            this.autoScrollTimer = null;
        }
    }
}

// 当DOM加载完成后初始化轮播
document.addEventListener('DOMContentLoaded', () => {
    new ClientLogoSlider();
}); 