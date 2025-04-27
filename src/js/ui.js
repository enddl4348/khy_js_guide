console.log('ui.js 시작~');

// input field
class InputField {
    constructor(element) {
        this.element = element; // 부모 요소 저장
        this.input = this.element.querySelector(
            '[data-js="inputField__input"]',
        );
        this.deleteButton = this.element.querySelector(
            '[data-js="inputField__delete"]',
        );
        this.ACTIVE_CLASS = 'is-show';

        // 요소가 없으면 초기화하지 않음
        if (!this.input || !this.deleteButton) return;

        // 초기화 메서드 호출: 이벤트 바인딩 및 초기 상태 세팅
        this.init();
    }

    init() {
        // 이벤트 바인딩
        this.bindEvents();
    }

    // input의 값이 공백이 아니면 delete 버튼 처리
    toggleDeleteButton() {
        if (this.input.value.trim() !== '') {
            this.deleteButton.classList.add(this.ACTIVE_CLASS);
            this.deleteButton.setAttribute('aria-hidden', 'false');
        } else {
            this.deleteButton.classList.remove(this.ACTIVE_CLASS);
            this.deleteButton.setAttribute('aria-hidden', 'true');
        }
    }

    // input의 값을 빈 문자열로 만들고, delete 버튼 업데이트
    clearInput() {
        this.input.value = '';
        this.toggleDeleteButton();
        this.input.focus();
    }

    bindEvents() {
        // input 이벤트를 통해 텍스트의 변화 감지
        this.input.addEventListener('input', () => this.toggleDeleteButton());

        // delete 버튼을 클릭할 때, 텍스트 삭제
        this.deleteButton.addEventListener('click', () => this.clearInput());
    }
}

// tab
class Tab {
    constructor(element) {
        this.element = element;
        this.tabButtons = Array.from(
            this.element.querySelectorAll('[data-js="tabButton"]'),
        );
        this.tabPanels = Array.from(
            this.element.querySelectorAll('[data-js="tabPanel"]'),
        );

        this.ACTIVE_CLASS = 'is-active';

        this.init();
    }

    init() {
        this.setDefaultTab(); //default 탭 설정
        this.bindEvents(); //이벤트 바인딩
    }

    setDefaultTab() {
        // 기본적으로 첫 번째 탭을 활성화
        this.selectTab(0);
    }

    bindEvents() {
        this.tabButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => this.onClickTab(e));
        });
    }

    onClickTab(e) {
        const selected = e.currentTarget;
        const index = this.tabButtons.indexOf(selected); // 클릭한 버튼의 index 찾기
        this.selectTab(index); // 선택된 탭으로 전환
    }

    // 탭을 활성화하는 함수
    selectTab(index) {
        // 탭 버튼 클래스 토글
        this.tabButtons.forEach((btn, i) => {
            btn.classList.toggle(this.ACTIVE_CLASS, i === index);
            btn.setAttribute('aria-selected', i === index);
            btn.setAttribute('tabindex', i === index ? '0' : '-1');
        });

        // 탭 콘텐츠 토글
        this.tabPanels.forEach((panel, i) => {
            panel.classList.toggle(this.ACTIVE_CLASS, i === index);
        });

        // 활성화된 버튼 스크롤 위치 조정
        const activeBtn = this.tabButtons[index];
        const scrollContainer = activeBtn.closest('[data-js="tabList"]');

        if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();
            // console.log(
            //     btnRect.left,
            //     containerRect.left,
            //     containerRect.width / 2,
            //     btnRect.width / 2,
            // );
            // 버튼이 container 기준에서 어느 정도 떨어져 있는지 계산, 그 버튼이 container 가운데로 오기 위해 필요한 거리만큼 scroll 시킴
            const offset =
                btnRect.left -
                containerRect.left -
                (containerRect.width / 2 - btnRect.width / 2);

            scrollContainer.scrollBy({
                left: offset,
                behavior: 'smooth',
            });
        }
    }
}

// DatePicker
class DatePicker {
    constructor(element) {
        this.element = element;
        this.type = this.element.dataset.option || 'default'; // 기본값 설정
        this.instance = null;
        this.init();
    }

    init() {
        const options = this.getOptionsByType(this.type);
        this.instance = flatpickr(this.element, options);
    }

    getOptionsByType(type) {
        const baseOptions = {
            locale: 'ko',
            dateFormat: 'Y-m-d',
            defaultDate: 'today',
        };

        const typeOptions = {
            default: {},
            // minDate
            minDate: {
                minDate: 'today',
            },
            // maxDate
            maxDate: {
                minDate: 'today',
                maxDate: new Date().fp_incr(14), // 오늘부터 14 days
            },
            multipleDates: {
                mode: 'multiple',
                dateFormat: 'Y-m-d',
                defaultDate: 'today',
            },

            // 특정 날짜 disabled
            specialDisabled: {
                defaultDate: '2025-04-20',
                disable: [
                    '2025-04-15',
                    '2025-04-24',
                    '2025-04-25',
                    '2025-04-26',
                ],
            },
            // range mode
            range: {
                mode: 'range',
                defaultDate: [
                    'today',
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 뒤
                ],
            },
            inline: {
                inline: true,
            },
        };

        return { ...baseOptions, ...(typeOptions[type] || {}) };
    }
}

// tooltip
class Tooltip {
    constructor(element) {
        this.element = element;
        this.tooltipButton = this.element.querySelector(
            '[data-js="tooltip__button"]',
        );
        this.tooltipClose = this.element.querySelector(
            '[data-js="tooltip__closeButton"]',
        );
        this.ACTIVE_CLASS = 'is-active';

        if (this.tooltipButton && this.tooltipClose) {
            this.init();
        }
    }

    init() {
        this.bindEvents(); //이벤트 바인딩
    }

    bindEvents() {
        this.tooltipButton.addEventListener('click', () => this.onClickOpen());
        this.tooltipClose.addEventListener('click', () => this.onClickClose());
    }

    // tooltip open
    onClickOpen() {
        this.element.classList.add(this.ACTIVE_CLASS);
    }

    // tooltip close
    onClickClose() {
        this.element.classList.toggle(this.ACTIVE_CLASS);
    }

    // 외부에서 툴팁을 닫을 수 있는 메서드
    close() {
        this.element.classList.remove(this.ACTIVE_CLASS);
    }
}

// accordion
class Accordion {
    constructor(element, mode = 'multi') {
        this.element = element;
        this.items = Array.from(
            this.element.querySelectorAll('[data-js="accordionItem"]'),
        );
        this.mode = mode; // 'single' || 'multi'
        this.activeClass = 'is-active';
        this.init();
    }

    init() {
        this.items.forEach((item) => {
            const button = item.querySelector('[data-js="accordionButton"]');
            button.addEventListener('click', () => this.handleClick(item));
            //
            //1.각 item마다 버튼을 찾아서 click 이벤트를 붙입니다. 그때 화살표 함수 () => this.toggleItem(item)를 등록
            //2.() => this.toggleItem(item) 는 'item' 값을 기억하고 있는 함수 ((클로저(closure))
        });
    }

    handleClick(item) {
        if (this.mode === 'single') {
            this.toggleSingle(item);
        } else {
            this.toggleMulti(item);
        }
    }

    toggleSingle(item) {
        this.items.forEach((otherItem) => {
            if (otherItem !== item) {
                this.closeItem(otherItem);
            }
        });

        if (this.isOpen(item)) {
            this.closeItem(item);
        } else {
            this.openItem(item);
        }
    }

    toggleMulti(item) {
        if (this.isOpen(item)) {
            this.closeItem(item);
        } else {
            this.openItem(item);
        }
    }

    openItem(item) {
        item.classList.add(this.activeClass);
        const button = item.querySelector('[data-js="accordionButton"]');
        this.setAttributes(button, {
            'aria-expanded': 'true',
            'aria-label': '아코디언 닫기',
        });
    }

    closeItem(item) {
        item.classList.remove(this.activeClass);
        const button = item.querySelector('[data-js="accordionButton"]');
        this.setAttributes(button, {
            'aria-expanded': 'false',
            'aria-label': '아코디언 열기',
        });
    }

    isOpen(item) {
        return item.classList.contains(this.activeClass);
    }
    setAttributes(element, attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
}

// swiper slide
class SwiperSlide {
    constructor(element) {
        this.element = element;
        this.instance = null;

        // 1. 기본 옵션
        this.defaultOptions = {
            loop: true,
            autoplay: {
                delay: 4000,
            },
        };

        // 2. 타입별 옵션
        this.optionsMap = {
            basic: {
                pagination: {
                    el: '[data-js="swiper__pagination"]',
                    clickable: true,
                },
                navigation: {
                    nextEl: '[data-js="swiper__next"]',
                    prevEl: '[data-js="swiper__prev"]',
                },
                autoplay: {
                    delay: 5000,
                },
            },
            onlyNavigation: {
                navigation: {
                    nextEl: '[data-js="swiper__next"]',
                    prevEl: '[data-js="swiper__prev"]',
                },
            },
            onlyPagination: {
                pagination: {
                    el: '[data-js="swiper__pagination"]',
                    clickable: true,
                },
            },
            paginationFraction: {
                pagination: {
                    el: '[data-js="swiper__pagination"]',
                    clickable: true,
                    type: 'fraction',
                },
                navigation: {
                    nextEl: '[data-js="swiper__next"]',
                    prevEl: '[data-js="swiper__prev"]',
                },
            },
            perViewAuto: {
                loop: false, // 기본 옵션(loop: true)을 덮어쓰기
                slidesPerView: 'auto',
                pagination: {
                    el: '[data-js="swiper__pagination"]',
                    clickable: true,
                },
                navigation: {
                    nextEl: '[data-js="swiper__next"]',
                    prevEl: '[data-js="swiper__prev"]',
                },
            },
            progressbar: {
                pagination: {
                    el: '[data-js="swiper__pagination"]',
                    type: 'progressbar',
                },
                autoplay: {
                    delay: 3000,
                },
            },
        };

        this.init();
    }

    init() {
        const options = this.getOptions();
        this.instance = new Swiper(this.element, options);
    }

    getOptions() {
        const optionKey = this.element.getAttribute('data-option');
        if (!optionKey) return { ...this.defaultOptions }; // 기본 옵션 복사

        const typeOptions = this.optionsMap[optionKey];
        if (!typeOptions) {
            console.warn(
                `SwiperSlide: "${optionKey}" 옵션이 존재하지 않습니다.`,
            );
            return { ...this.defaultOptions };
        }

        // 3. 기본 옵션 + 타입별 옵션 merge
        return this.deepMerge(this.defaultOptions, typeOptions);
    }

    // 🔥 깊은 병합(Deep Merge) 함수
    deepMerge(target, source) {
        const output = { ...target };
        for (const key in source) {
            if (
                typeof source[key] === 'object' &&
                source[key] !== null &&
                !Array.isArray(source[key])
            ) {
                output[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                output[key] = source[key];
            }
        }
        return output;
    }
}

// ---------------------------------------------------------------------------------------//

// input field
document.querySelectorAll('[data-js="inputField"]').forEach((el) => {
    new InputField(el);
});

// tab
document.querySelectorAll('[data-js="tab"]').forEach((el) => {
    new Tab(el);
});

// datepicker
document.querySelectorAll('[data-js="datePicker"]').forEach((el) => {
    new DatePicker(el);
});

// tooltip
document.querySelectorAll('[data-js="tooltip"]').forEach((el) => {
    new Tooltip(el);
});

// accordion
document.querySelectorAll('[data-js="accordion"]').forEach((el) => {
    const mode = el.dataset.type || 'multi'; // data-type 속성으로 mode 설정 (기본값: multi)
    new Accordion(el, mode);
});

//swiper slide
document.querySelectorAll('[data-js="swiper"]').forEach((el) => {
    new SwiperSlide(el);
});
