// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有组件
    initNavbar();
    initScrollEffects();
    initForms();
    initFAQ();
    initAnimations();
    initLanguage();
    initSearch();
    initRegionToggle();
    searchToolsInteraction();
    initHeroBannerAnimation();
    initWhyChooseUsAnimation();
});

// 导航栏功能
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// 搜索功能初始化
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchDropdown = document.querySelector('.search-dropdown');
    
    if (searchToggle && searchDropdown) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchDropdown.classList.toggle('active');
        });

        // 点击搜索框外部时关闭
        document.addEventListener('click', (e) => {
            if (!searchDropdown.contains(e.target) && !searchToggle.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });

        // 阻止搜索框内部点击事件冒泡
        searchDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// 区域/语言选择功能
function initRegionToggle() {
    const regionToggle = document.querySelector('.region-toggle');
    const regionDropdown = document.querySelector('.region-dropdown');
    const regionSelector = document.querySelector('.region-selector');
    
    if (regionToggle && regionDropdown && regionSelector) {
        let isDropdownVisible = false;

        regionToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownVisible = !isDropdownVisible;
            regionDropdown.classList.toggle('active', isDropdownVisible);
        });

        // 鼠标悬停时显示
        regionSelector.addEventListener('mouseenter', () => {
            regionDropdown.classList.add('active');
        });

        regionSelector.addEventListener('mouseleave', () => {
            if (!isDropdownVisible) {
                regionDropdown.classList.remove('active');
            }
        });

        // 点击下拉框外部时关闭
        document.addEventListener('click', (e) => {
            if (!regionDropdown.contains(e.target) && !regionToggle.contains(e.target)) {
                regionDropdown.classList.remove('active');
                isDropdownVisible = false;
            }
        });

        // 阻止下拉框内部点击事件冒泡
        regionDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 处理语言切换
        regionDropdown.querySelectorAll('a[data-lang]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                changeLanguage(lang);
            });
        });
    }
}

// 滚动效果
function initScrollEffects() {
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // 滚动显示动画
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (1 - offset));
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 0.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// 表单验证和处理
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // 显示加载状态
                const submitBtn = this.querySelector('[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '提交中...';
                }

                // 模拟表单提交
                setTimeout(() => {
                    showMessage('表单提交成功！我们会尽快与您联系。', 'success');
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '提交';
                    }
                }, 1500);
            }
        });
    });
}

// 表单验证
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showInputError(input, '此字段为必填项');
        } else {
            clearInputError(input);
            
            // 邮箱验证
            if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                showInputError(input, '请输入有效的邮箱地址');
            }
            
            // 电话验证
            if (input.type === 'tel' && !validatePhone(input.value)) {
                isValid = false;
                showInputError(input, '请输入有效的电话号码');
            }
        }
    });
    
    return isValid;
}

// 显示输入错误
function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        input.classList.add('error');
    }
}

// 清除输入错误
function clearInputError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        input.classList.remove('error');
    }
}

// 邮箱验证
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 电话验证
function validatePhone(phone) {
    return /^[\d\s-+()]{7,}$/.test(phone);
}

// 显示消息提示
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// FAQ 手风琴效果
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // 关闭其他打开的FAQ
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // 切换当前FAQ的状态
                item.classList.toggle('active', !isActive);
            });
        }
    });
}

// 页面动画效果
function initAnimations() {
    // 统计数字动画
    const stats = document.querySelectorAll('.stat-number');
    
    const animateNumber = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 动画持续时间（毫秒）
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };
        
        updateNumber();
    };
    
    // 创建Intersection Observer来触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// 语言相关功能
let currentLang = 'en';
let translations = {};

// 加载语言文件
async function loadTranslations(lang) {
    try {
        const response = await fetch(`/locales/${lang}.json`);
        translations = await response.json();
        return translations;
    } catch (error) {
        console.error('Error loading translations:', error);
        return null;
    }
}

// 更新页面文本
function updatePageContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[key];
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

// 初始化语言设置
async function initLanguage() {
    const userLanguage = localStorage.getItem('userLanguage') || 'zh-cn';
    await changeLanguage(userLanguage);
}

// 切换语言
async function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('userLanguage', lang);
    
    // 加载并更新翻译
    await loadTranslations(lang);
    updatePageContent();
    
    // 更新 HTML lang 属性
    document.documentElement.lang = lang;
}

// 搜索工具交互
document.addEventListener('DOMContentLoaded', function() {
    const searchTools = document.querySelectorAll('.search-tool');
    
    searchTools.forEach(tool => {
        const searchButton = tool.querySelector('button');
        const searchInput = tool.querySelector('input');
        
        // 点击搜索按钮时切换搜索框的显示状态
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            tool.classList.toggle('active');
            if (tool.classList.contains('active')) {
                searchInput.focus();
            }
        });
        
        // 点击页面其他地方时关闭搜索框
        document.addEventListener('click', function(e) {
            if (!tool.contains(e.target) && tool.classList.contains('active')) {
                tool.classList.remove('active');
            }
        });
        
        // 按下 ESC 键时关闭搜索框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && tool.classList.contains('active')) {
                tool.classList.remove('active');
            }
        });
        
        // 处理搜索表单提交
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // 这里添加搜索处理逻辑
                console.log('Searching for:', this.value);
            }
        });
    });
});

// 初始化开始封面动画
function initHeroBannerAnimation() {
    const heroBanner = document.querySelector('.hero-banner .banner-content h1');
    if (heroBanner) {
        heroBanner.classList.add('animate-fade-in');
    }
}

// 初始化WHY CHOOSE US动画
function initWhyChooseUsAnimation() {
    const whyChooseUsTitle = document.querySelector('.why-choose-us .section-title');
    const featureCards = document.querySelectorAll('.why-choose-us .feature-card');
    
    if (whyChooseUsTitle) {
        whyChooseUsTitle.classList.add('animate-slide-in');
    }
    
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-fade-in');
        }, index * 200); // 依次延迟动画
    });
}
