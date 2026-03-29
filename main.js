// ===== 카테고리 라벨 =====
const CATEGORY_LABELS = {
  programming: '프로그래밍',
  math: '수학',
  science: '과학',
  language: '어학',
  exam: '시험/자격증',
  etc: '기타',
};

// ===== 샘플 데이터 =====
const sampleMaterials = [
  {
    id: 1,
    title: '운영체제 중간고사 핵심 정리',
    desc: '프로세스, 스레드, 메모리 관리 등 핵심 개념을 한눈에 볼 수 있도록 정리한 노트입니다.',
    category: 'programming',
    price: 3000,
    file: 'os_midterm.pdf',
    date: '2026-03-25',
  },
  {
    id: 2,
    title: '선형대수학 공식 모음',
    desc: '행렬, 벡터, 고유값 등 선형대수학 주요 공식을 정리했습니다.',
    category: 'math',
    price: 0,
    file: 'linear_algebra.pdf',
    date: '2026-03-22',
  },
  {
    id: 3,
    title: 'TOEIC 900점 단어장',
    desc: '빈출 단어 1200개를 주제별로 분류하고 예문과 함께 정리했습니다.',
    category: 'language',
    price: 5000,
    file: 'toeic_vocab.pdf',
    date: '2026-03-20',
  },
  {
    id: 4,
    title: 'React 기초부터 실전까지',
    desc: 'useState, useEffect, 컴포넌트 패턴 등을 예제 코드와 함께 정리한 자료입니다.',
    category: 'programming',
    price: 4000,
    file: 'react_guide.pdf',
    date: '2026-03-18',
  },
  {
    id: 5,
    title: '정보처리기사 실기 요약',
    desc: '정보처리기사 실기 시험 대비 핵심 요약본입니다. SQL, 소프트웨어 공학 포함.',
    category: 'exam',
    price: 7000,
    file: 'engineer_summary.pdf',
    date: '2026-03-15',
  },
  {
    id: 6,
    title: '일반화학 개념 노트',
    desc: '원자 구조, 화학 결합, 열역학 등 일반화학 전 범위를 다룹니다.',
    category: 'science',
    price: 2500,
    file: 'chemistry_notes.pdf',
    date: '2026-03-12',
  },
];

// ===== State =====
let materials = JSON.parse(localStorage.getItem('materials')) || [...sampleMaterials];
let nextId = materials.reduce((max, m) => Math.max(max, m.id), 0) + 1;

function saveMaterials() {
  localStorage.setItem('materials', JSON.stringify(materials));
}

// ===== 페이지 라우팅 =====
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

function showPage(name) {
  pages.forEach(p => p.hidden = p.id !== `page-${name}`);
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === name));
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// ===== 자료 목록 렌더링 =====
const grid = document.getElementById('materials-grid');
const noResults = document.getElementById('no-results');

function formatPrice(price) {
  if (price === 0) return '무료';
  return price.toLocaleString('ko-KR') + '원';
}

function renderMaterials(list) {
  grid.innerHTML = '';
  noResults.hidden = list.length > 0;

  list.forEach(m => {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.innerHTML = `
      <span class="card-category">${CATEGORY_LABELS[m.category] || m.category}</span>
      <h3 class="card-title">${m.title}</h3>
      <p class="card-desc">${m.desc}</p>
      <div class="card-footer">
        <span class="card-price ${m.price === 0 ? 'free' : ''}">${formatPrice(m.price)}</span>
        <span class="card-date">${m.date}</span>
      </div>
    `;
    card.addEventListener('click', () => openModal(m));
    grid.appendChild(card);
  });
}

// ===== 검색 & 필터 =====
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

function filterMaterials() {
  const query = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;

  const filtered = materials.filter(m => {
    const matchQuery = !query
      || m.title.toLowerCase().includes(query)
      || m.desc.toLowerCase().includes(query);
    const matchCat = cat === 'all' || m.category === cat;
    return matchQuery && matchCat;
  });

  renderMaterials(filtered);
}

searchInput.addEventListener('input', filterMaterials);
categoryFilter.addEventListener('change', filterMaterials);

// ===== 모달 =====
const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

function openModal(m) {
  modalBody.innerHTML = `
    <span class="modal-category">${CATEGORY_LABELS[m.category] || m.category}</span>
    <h2 class="modal-title">${m.title}</h2>
    <p class="modal-desc">${m.desc}</p>
    <p class="modal-price ${m.price === 0 ? 'free' : ''}">${formatPrice(m.price)}</p>
    <p class="modal-date">등록일: ${m.date}</p>
    <p class="modal-file">파일: ${m.file || '없음'}</p>
    <button class="btn-buy">${m.price === 0 ? '무료 다운로드' : '구매하기'}</button>
  `;
  modalOverlay.hidden = false;
}

modalClose.addEventListener('click', () => modalOverlay.hidden = true);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.hidden = true;
});

// ===== 업로드 =====
const uploadForm = document.getElementById('upload-form');

uploadForm.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('upload-title').value.trim();
  const desc = document.getElementById('upload-desc').value.trim();
  const category = document.getElementById('upload-category').value;
  const price = parseInt(document.getElementById('upload-price').value, 10) || 0;
  const fileInput = document.getElementById('upload-file');
  const fileName = fileInput.files[0] ? fileInput.files[0].name : '';

  const today = new Date().toISOString().slice(0, 10);

  const newMaterial = {
    id: nextId++,
    title,
    desc,
    category,
    price,
    file: fileName,
    date: today,
  };

  materials.unshift(newMaterial);
  saveMaterials();
  uploadForm.reset();
  alert('자료가 등록되었습니다!');
  showPage('home');
  filterMaterials();
});

// ===== 초기 렌더링 =====
renderMaterials(materials);
