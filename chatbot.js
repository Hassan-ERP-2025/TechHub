/* =========================================================
   TechHub Shopping Assistant (Chatbot)
   Rule-based recommendation engine — no external API needed.
   Reads live `products` data from script.js (kept in sync via
   Socket.IO / localStorage) and suggests the closest matches
   to what the customer asks for (category + budget + specs).
   ========================================================= */

(function () {
    'use strict';

    // ---------- Category keyword dictionary ----------
    const CATEGORY_KEYWORDS = {
        laptops: ['لابتوب', 'لاب توب', 'لاب', 'كمبيوتر', 'كومبيوتر', 'بي سي', 'حاسوب', 'جهاز مكتبي', 'pc', 'laptop', 'notebook'],
        phones: ['موبايل', 'تليفون', 'هاتف', 'فون', 'ايفون', 'سامسونج', 'phone', 'mobile', 'iphone', 'samsung'],
        accessories: ['سماعة', 'سماعات', 'سماعه', 'ايربودز', 'ايربود', 'earphone', 'earbud', 'earbuds', 'headphone', 'headset', 'airpods'],
        tech_accessories: ['اكسسوار', 'اكسسوارات', 'ماوس', 'كيبورد', 'لوحة مفاتيح', 'شاحن', 'كابل', 'هب', 'mouse', 'keyboard', 'charger', 'cable', 'hub'],
        watches: ['ساعة', 'ساعات', 'ساعه', 'واتش', 'سمارت واتش', 'watch', 'smartwatch']
    };

    const CATEGORY_LABELS = {
        laptops: 'اللاب توبات',
        phones: 'الهواتف',
        accessories: 'السماعات',
        tech_accessories: 'الإكسسوارات',
        watches: 'الساعات'
    };

    // ---------- Usage-intent keywords (mainly for laptops) ----------
    // "Light" = office/browsing/study — should favor cheaper, everyday specs.
    // "Heavy" = gaming/design/engineering/programming — should favor
    // higher-end specs (workstation/gaming badges, i7/i9, more RAM...).
    const LIGHT_USE_KEYWORDS = [
        'اكسل', 'اكسيل', 'وورد', 'word', 'excel', 'اوفيس', 'أوفيس', 'office',
        'مكتبي', 'مكتبيه', 'بسيط', 'بسيطة', 'بسيطه', 'خفيف', 'خفيفة', 'خفيفه',
        'تصفح', 'براوزينج', 'انترنت', 'إنترنت', 'نت', 'مذاكرة', 'مذاكره', 'دراسة',
        'دراسه', 'طالب', 'طالبة', 'student', 'ايميل', 'إيميل', 'email',
        'باوربوينت', 'باور بوينت', 'powerpoint', 'كتابة', 'كتابه', 'يوتيوب', 'youtube', 'light'
    ];

    const HEAVY_USE_KEYWORDS = [
        'جيمنج', 'جيمينج', 'العاب', 'الالعاب', 'لعبة', 'لعبه', 'gaming', 'game', 'games',
        'تصميم', 'مصمم', 'design', 'مونتاج', 'رندر', 'رندرينج', 'render', 'rendering',
        'برمجة', 'برمجه', 'مبرمج', 'programming', 'developer', 'code', 'coding',
        'مهندس', 'هندسة', 'هندسه', 'engineering', 'autocad', 'اوتوكاد',
        'مونتير', 'editing', 'video editing', 'فيديو ايديتنج', '3d', 'ثري دي', 'ثريدي',
        'workstation', 'وركستيشن', 'ثقيل', 'ثقيلة', 'ثقيله', 'شغل تقيل', 'شغل ثقيل'
    ];

    // Spec-level signals inside a product's own text (name/description/badge)
    // — mostly meaningful for laptops; harmless no-op for other categories.
    const HEAVY_SPEC_PATTERN = /(i7|i9|ryzen\s?7|ryzen\s?9|workstation|zbook|quadro|rtx|geforce|gtx|32\s?(gb|جيجا)|64\s?(gb|جيجا))/i;
    const LIGHT_SPEC_PATTERN = /(i3|celeron|pentium|value|everyday|basic|student|office|8\s?(gb|جيجا))/i;

    // ---------- Budget-tier keywords (apply to EVERY category) ----------
    // "Economical" = cheaper option in whatever category is being asked about.
    // "Premium" = pricier/top-of-the-line option. Works generically because
    // it's resolved against the price *range of the matching candidates*,
    // not fixed numbers — so it works the same for a 500 EGP headphone
    // request as a 25,000 EGP laptop request.
    const ECONOMICAL_KEYWORDS = [
        'اقتصادي', 'اقتصادية', 'اقتصاديه', 'رخيص', 'رخيصة', 'رخيصه', 'رخيصين',
        'توفير', 'موفر', 'موفرة', 'موفره', 'ميزانية محدودة', 'ميزانيه محدوده',
        'affordable', 'cheap', 'budget', 'economical', 'inexpensive'
    ];

    const PREMIUM_KEYWORDS = [
        'فاخر', 'فاخرة', 'فاخره', 'بريميم', 'بريميوم', 'premium', 'فلاجشيب',
        'flagship', 'هاي اند', 'high-end', 'الأفضل', 'الافضل', 'مميز', 'مميزة',
        'مميزه', 'الأغلى', 'الاغلى', 'best quality'
    ];

    const STOPWORDS = new Set([
        'عايز', 'عاوز', 'محتاج', 'ابحث', 'عن', 'بسعر', 'ب', 'في', 'حد', 'اقصى', 'أقصى',
        'حوالي', 'تقريبا', 'تقريباً', 'جنيه', 'جنية', 'جنيها', 'ال', 'او', 'أو', 'و', 'مع',
        'لي', 'عندك', 'عندكم', 'فيه', 'متوفر', 'ايه', 'إيه', 'اقل', 'أقل', 'من', 'الى', 'إلى',
        'لحد', 'لغاية', 'حبة', 'شوية', 'يكون', 'كويس', 'كويسة', 'جيد', 'جيدة', 'الجهاز',
        'جهاز', 'نوع', 'انا', 'أنا', 'ممكن', 'لو', 'سمحت', 'من', 'فضلك', 'لأنه', 'عشان',
        'the', 'a', 'an', 'for', 'with', 'and', 'egp', 'price', 'around', 'under', 'about'
    ]);

    // ---------- Helpers ----------
    function normalizeArabicDigits(str) {
        const map = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };
        return str.replace(/[٠-٩]/g, d => map[d]);
    }

    function extractPriceInfo(rawText) {
        const text = normalizeArabicDigits(rawText);
        const hasThousandWord = /(الف|ألف|آلاف|الاف)/.test(text);
        const numRegex = /\d+(?:[.,]\d+)?/g;
        let nums = (text.match(numRegex) || []).map(n => parseFloat(n.replace(',', '')));
        if (!nums.length) return null;

        nums = nums.map(n => (n < 1000 && hasThousandWord ? n * 1000 : n)).filter(n => n > 0);
        if (!nums.length) return null;

        if (nums.length === 1) {
            return { target: nums[0] };
        }
        nums.sort((a, b) => a - b);
        return { min: nums[0], max: nums[nums.length - 1] };
    }

    // Common Arabic prefixes (و/ف/ب/ل/ال/لل...) attach directly to the next
    // word with no space ("للتصميم", "والمونتاج"). Whole-word matching alone
    // would miss these, but plain substring matching causes false positives
    // (e.g. "نت" is a substring hiding inside "المونتاج"). Stripping the
    // prefix first lets us keep exact-word matching safe from both problems.
    const ARABIC_PREFIXES = ['وال', 'فال', 'بال', 'كال', 'لل', 'و', 'ف', 'ب', 'ل', 'ك'];
    function stripArabicPrefix(word) {
        for (const pre of ARABIC_PREFIXES) {
            if (word.length > pre.length + 1 && word.startsWith(pre)) {
                return word.slice(pre.length);
            }
        }
        return word;
    }

    function getWordSet(lowerText) {
        const raw = normalizeArabicDigits(lowerText).split(/[\s,،؟!.\-_/]+/).filter(Boolean);
        const set = new Set();
        raw.forEach(w => {
            set.add(w);
            const stripped = stripArabicPrefix(w);
            if (stripped !== w) set.add(stripped);
        });
        return set;
    }

    // Multi-word keywords ("لاب توب", "باور بوينت") still use substring
    // matching since they span token boundaries; single-word keywords use
    // exact whole-word matching via the word set to avoid false positives.
    function hasKeyword(lowerText, wordSet, keyword) {
        return keyword.includes(' ') ? lowerText.includes(keyword) : wordSet.has(keyword);
    }

    function detectCategory(lowerText) {
        const wordSet = getWordSet(lowerText);
        for (const cat in CATEGORY_KEYWORDS) {
            if (CATEGORY_KEYWORDS[cat].some(k => hasKeyword(lowerText, wordSet, k))) return cat;
        }
        return null;
    }

    function detectUsageIntent(lowerText) {
        const wordSet = getWordSet(lowerText);
        const isHeavy = HEAVY_USE_KEYWORDS.some(k => hasKeyword(lowerText, wordSet, k));
        const isLight = LIGHT_USE_KEYWORDS.some(k => hasKeyword(lowerText, wordSet, k));
        if (isHeavy && !isLight) return 'heavy';
        if (isLight && !isHeavy) return 'light';
        return null; // ambiguous or not mentioned — stay neutral
    }

    function detectBudgetTier(lowerText) {
        const wordSet = getWordSet(lowerText);
        const isEconomical = ECONOMICAL_KEYWORDS.some(k => hasKeyword(lowerText, wordSet, k));
        const isPremium = PREMIUM_KEYWORDS.some(k => hasKeyword(lowerText, wordSet, k));
        if (isEconomical && !isPremium) return 'economical';
        if (isPremium && !isEconomical) return 'premium';
        return null;
    }

    // Merge the purpose-based signal (light/heavy use) and the plain
    // budget-tier wording (economical/premium) into one price preference
    // that drives ranking across every category.
    function derivePricePreference(usageIntent, budgetTier) {
        const wantsValue = usageIntent === 'light' || budgetTier === 'economical';
        const wantsPremium = usageIntent === 'heavy' || budgetTier === 'premium';
        if (wantsValue && wantsPremium) return null; // conflicting signals
        if (wantsValue) return 'value';
        if (wantsPremium) return 'premium';
        return null;
    }

    function tokenize(lowerText) {
        return normalizeArabicDigits(lowerText)
            .replace(/[\d.,]+/g, ' ')
            .split(/[\s,،؟!.\-_/]+/)
            .map(t => t.trim())
            .filter(t => t.length > 1 && !STOPWORDS.has(t));
    }

    function formatEGP(n) {
        return 'EGP ' + Math.round(n).toLocaleString('en-US');
    }

    function getProductImageHtml(product) {
        const img = product.image;
        const isRealImage = img && (img.startsWith('data:image') || img.startsWith('http') ||
            (!['💻', '📱', '🎧', '⌚', '🖱️', '🔋', '🔌'].includes(img)));
        if (isRealImage) {
            return `<img src="${img}" alt="${product.name}">`;
        }
        return img || '📦';
    }

    // ---------- Matching engine ----------
    function matchProducts(query) {
        const productsAvailable = (typeof products !== 'undefined' && Array.isArray(products) && products.length)
            ? products
            : [];

        const lower = query.toLowerCase();
        const category = detectCategory(lower);
        const priceInfo = extractPriceInfo(query);
        const tokens = tokenize(lower);
        const usageIntent = detectUsageIntent(lower);
        const budgetTier = detectBudgetTier(lower);
        const pricePreference = derivePricePreference(usageIntent, budgetTier);

        if (!productsAvailable.length) {
            return { category, priceInfo, tokens, usageIntent, budgetTier, pricePreference, results: [], productsLoaded: false };
        }

        // Candidate pool: same category if one was detected, otherwise
        // everything. Used to work out this category's own price range so
        // "economical"/"premium" is relative to what's actually on sale in
        // that section (a 500 EGP headphone vs a 20,000 EGP laptop).
        const candidates = productsAvailable.filter(p => !category || p.category === category);
        const candidatePrices = candidates.map(p => p.price);
        const minPrice = candidatePrices.length ? Math.min(...candidatePrices) : 0;
        const maxPrice = candidatePrices.length ? Math.max(...candidatePrices) : 0;
        const priceRange = maxPrice - minPrice || 1;

        // Hard price-tier filter — "رخيص/اقتصادي" or "فاخر/بريميوم" must
        // actually EXCLUDE the wrong half of the price range, not just
        // nudge the ranking. Without this, a single expensive item can
        // still out-score cheap ones (category match + token hit + high
        // rating) and sneak into the results whenever a category has few
        // products. Only applied when no explicit numeric budget was given
        // (priceInfo) — an explicit number always wins.
        let scoringPool = candidates;
        if (pricePreference && !priceInfo && candidatePrices.length > 1) {
            const sortedPrices = [...candidatePrices].sort((a, b) => a - b);
            const mid = Math.floor(sortedPrices.length / 2);
            const median = sortedPrices.length % 2
                ? sortedPrices[mid]
                : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;

            if (pricePreference === 'value') {
                scoringPool = candidates.filter(p => p.price <= median);
            } else if (pricePreference === 'premium') {
                scoringPool = candidates.filter(p => p.price >= median);
            }
            if (!scoringPool.length) scoringPool = candidates; // safety net
        }

        const scored = scoringPool.map(p => {
            let score = category ? 40 : 10;

            if (priceInfo) {
                if (priceInfo.target !== undefined) {
                    const t = priceInfo.target;
                    const diffRatio = Math.abs(p.price - t) / t;
                    if (p.price <= t) {
                        score += 35 - Math.min(35, diffRatio * 35);
                        score += 8;
                    } else {
                        score += Math.max(0, 22 - diffRatio * 55);
                    }
                } else {
                    const { min, max } = priceInfo;
                    if (p.price >= min && p.price <= max) {
                        score += 40;
                    } else {
                        const dist = p.price < min ? min - p.price : p.price - max;
                        score += Math.max(0, 25 - (dist / max) * 55);
                    }
                }
            }

            const haystack = `${p.name} ${p.description || ''} ${p.badge || ''}`.toLowerCase();
            let tokenHits = 0;
            tokens.forEach(t => { if (haystack.includes(t)) tokenHits++; });
            score += tokenHits * 14;

            // Spec-level signal (mostly relevant for laptops — a no-op for
            // categories whose text never mentions i7/RAM/etc).
            if (usageIntent === 'light') {
                if (HEAVY_SPEC_PATTERN.test(haystack)) score -= 35;
                if (LIGHT_SPEC_PATTERN.test(haystack)) score += 25;
            } else if (usageIntent === 'heavy') {
                if (HEAVY_SPEC_PATTERN.test(haystack)) score += 25;
                if (LIGHT_SPEC_PATTERN.test(haystack)) score -= 15;
            }

            // Universal price-tier preference — works the same for every
            // category since it's based on this category's own price
            // spread, not a fixed EGP scale. Only applied when the
            // customer didn't already give an explicit budget/range.
            if (pricePreference && !priceInfo) {
                const percentile = (p.price - minPrice) / priceRange; // 0 = cheapest, 1 = priciest
                if (pricePreference === 'value') {
                    score += (1 - percentile) * 30;
                } else if (pricePreference === 'premium') {
                    score += percentile * 25;
                }
            }

            score += (p.rating || 0) * 1.5;

            return { p, score };
        });

        scored.sort((a, b) => b.score - a.score);

        const results = scored
            .filter(x => x.score > (category ? 40 : 15))
            .slice(0, 3)
            .map(x => x.p);

        return { category, priceInfo, tokens, usageIntent, budgetTier, pricePreference, results, productsLoaded: true };
    }

    // ---------- Reply text builder ----------
    function buildIntroText(match) {
        const parts = [];
        if (match.category) parts.push(`في ${CATEGORY_LABELS[match.category]}`);
        if (match.usageIntent === 'light') {
            parts.push('مناسب للاستخدام الخفيف والمكتبي');
        } else if (match.usageIntent === 'heavy') {
            parts.push('بمواصفات قوية تناسب الاستخدام الاحترافي');
        } else if (match.pricePreference === 'value') {
            parts.push('بسعر اقتصادي ومناسب');
        } else if (match.pricePreference === 'premium') {
            parts.push('من الفئة المميزة');
        }
        if (match.priceInfo) {
            if (match.priceInfo.target !== undefined) {
                parts.push(`بسعر حوالي ${formatEGP(match.priceInfo.target)}`);
            } else {
                parts.push(`بسعر بين ${formatEGP(match.priceInfo.min)} و ${formatEGP(match.priceInfo.max)}`);
            }
        }

        if (match.results.length === 0) {
            if (!match.productsLoaded) {
                return 'المنتجات لسه بتتحمل، جرب تاني بعد لحظات 🙏';
            }
            if (parts.length) {
                return `للأسف مش لاقي حاجة مطابقة قوي ${parts.join(' ')} 😅 جرب تقولي ميزانية مختلفة، أو اكتب "الفئات المتاحة" عشان أوريك الأقسام كلها.`;
            }
            return 'ممكن توضحلي أكتر؟ مثلاً: "عايز لابتوب برمجة بسعر 15000" أو "سماعات لاسلكية ب 500 جنيه".';
        }

        const found = match.results.length === 1 ? 'دي أقرب حاجة لقيتها' : `دول أقرب ${match.results.length} منتجات لقيتها`;
        return `${found}${parts.length ? ' ' + parts.join(' ') : ''}:`;
    }

    function isGreeting(lower) {
        return /^(هاي|هلا|اهلا|أهلا|السلام عليكم|صباح الخير|مساء الخير|hi|hello|hey)\b/.test(lower.trim());
    }

    function isThanks(lower) {
        return /(شكرا|متشكر|تسلم|thank)/.test(lower);
    }

    function isAskingCategories(lower) {
        return /(الفئات المتاحة|الاقسام|الأقسام|categories)/.test(lower);
    }

    // ---------- UI wiring ----------
    const toggleBtn = document.getElementById('chatToggleBtn');
    const toggleBadge = document.getElementById('chatToggleBadge');
    const toggleTooltip = document.getElementById('chatToggleTooltip');
    const widget = document.getElementById('chatWidget');
    const closeBtn = document.getElementById('chatCloseBtn');
    const messagesEl = document.getElementById('chatMessages');
    const form = document.getElementById('chatInputForm');
    const input = document.getElementById('chatInput');
    const suggestionsEl = document.getElementById('chatSuggestions');

    if (!toggleBtn || !widget) return; // markup not present, bail safely

    let greeted = false;

    // ---------- Welcome tooltip (auto-shows on load, hides after 5s) ----------
    if (toggleTooltip) {
        let tooltipTimer = null;

        function hideTooltip() {
            toggleTooltip.classList.remove('visible');
            if (tooltipTimer) {
                clearTimeout(tooltipTimer);
                tooltipTimer = null;
            }
        }

        setTimeout(() => {
            // Don't show it if the user already opened the chat by then.
            if (widget.classList.contains('active')) return;
            toggleTooltip.classList.add('visible');
            tooltipTimer = setTimeout(hideTooltip, 5000);
        }, 600);

        toggleTooltip.addEventListener('click', () => {
            hideTooltip();
            openWidget();
        });

        toggleBtn.addEventListener('click', hideTooltip);
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addUserMessage(text) {
        const row = document.createElement('div');
        row.className = 'chat-msg-row user';
        row.innerHTML = `<div class="chat-bubble"></div>`;
        row.querySelector('.chat-bubble').textContent = text;
        messagesEl.appendChild(row);
        scrollToBottom();
    }

    function addBotText(text) {
        const row = document.createElement('div');
        row.className = 'chat-msg-row bot';
        row.innerHTML = `<div class="chat-bubble"></div>`;
        row.querySelector('.chat-bubble').textContent = text;
        messagesEl.appendChild(row);
        scrollToBottom();
    }

    function addBotProducts(products) {
        const row = document.createElement('div');
        row.className = 'chat-msg-row bot';

        const block = document.createElement('div');
        block.className = 'chat-bot-block';

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'chat-product-card';
            card.innerHTML = `
                <div class="chat-product-img">${getProductImageHtml(p)}</div>
                <div class="chat-product-info">
                    <h5>${p.name}</h5>
                    <div class="chat-product-meta">⭐ ${p.rating || '-'} · ${CATEGORY_LABELS[p.category] || p.category}</div>
                    <div class="chat-product-price">${formatEGP(p.price)}</div>
                </div>
                <div class="chat-product-actions">
                    <button class="chat-add-cart-btn" title="أضف للسلة"><i class="fas fa-cart-plus"></i></button>
                    <button class="chat-view-btn" title="عرض التفاصيل"><i class="fas fa-eye"></i></button>
                </div>
            `;
            card.querySelector('.chat-add-cart-btn').addEventListener('click', () => {
                if (typeof window.addToCart === 'function') window.addToCart(p.id);
            });
            card.querySelector('.chat-view-btn').addEventListener('click', () => {
                if (typeof window.openQuickView === 'function') window.openQuickView(p.id);
            });
            block.appendChild(card);
        });

        row.appendChild(block);
        messagesEl.appendChild(row);
        scrollToBottom();
    }

    function showTyping() {
        const row = document.createElement('div');
        row.className = 'chat-msg-row bot chat-typing-row';
        row.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
        messagesEl.appendChild(row);
        scrollToBottom();
        return row;
    }

    function respondTo(query) {
        const lower = query.toLowerCase().trim();
        const typingRow = showTyping();

        setTimeout(() => {
            typingRow.remove();

            if (isGreeting(lower)) {
                addBotText('أهلاً بيك في TechHub! 👋 قولي عايز تشتري إيه وبأي ميزانية تقريبية وهرشحلك أنسب منتج.');
                return;
            }
            if (isThanks(lower)) {
                addBotText('تحت أمرك في أي وقت 🙏');
                return;
            }
            if (isAskingCategories(lower)) {
                addBotText('الأقسام المتاحة عندنا: لابتوب/PC، هواتف، سماعات/AirPods، إكسسوارات، وساعات. قولي عايز إيه بالظبط وبأي سعر.');
                return;
            }

            const match = matchProducts(query);
            addBotText(buildIntroText(match));
            if (match.results.length) {
                addBotProducts(match.results);
            }
        }, 550 + Math.random() * 350);
    }

    function openWidget() {
        widget.classList.add('active');
        toggleBtn.classList.add('active');
        toggleBadge.classList.add('hidden');
        if (!greeted) {
            greeted = true;
            addBotText('أهلاً بيك في TechHub! 👋 قولي عايز تشتري إيه (لابتوب، موبايل، سماعات، ساعة أو إكسسوار) وبأي سعر تقريبي، وهرشحلك أقرب منتج للي بتدور عليه.');
        }
        input.focus();
    }

    function closeWidget() {
        widget.classList.remove('active');
        toggleBtn.classList.remove('active');
    }

    toggleBtn.addEventListener('click', () => {
        if (widget.classList.contains('active')) {
            closeWidget();
        } else {
            openWidget();
        }
    });

    closeBtn.addEventListener('click', closeWidget);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addUserMessage(text);
        input.value = '';
        respondTo(text);
    });

    if (suggestionsEl) {
        suggestionsEl.querySelectorAll('.chat-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const q = chip.dataset.query;
                if (!q) return;
                addUserMessage(q);
                respondTo(q);
            });
        });
    }

    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target) && !toggleBtn.contains(e.target)) {
            // clicking elsewhere doesn't force-close; keep it open for convenience
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && widget.classList.contains('active')) {
            closeWidget();
        }
    });
})();
