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

// ---------------------------------------------------------------------------------------//

// input field
document.querySelectorAll('[data-js="inputField"]').forEach((inputEl) => {
    new InputField(inputEl);
});

// tab
document.querySelectorAll('[data-js="tab"]').forEach((tabEl) => {
    new Tab(tabEl);
});
