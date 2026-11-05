// Teorema Pythagoras (G.4) — halaman mandiri, memakai kunci riwayat yang sama
// dengan halaman lain (localStorage, tanpa server dan tanpa akun).
const HISTORY_KEY = 'mpi_history_v1';
const MODE_KEY = 'mpi_mode_v1';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch (e) { return []; }
}
function saveHistory(entry) {
  const list = getHistory();
  list.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
}
function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch (e) { return iso; }
}
function pythagorasHistory() {
  return getHistory().filter(function (h) { return h.materi.indexOf('Teorema Pythagoras') === 0; });
}
function applyMode(mode) {
  document.body.dataset.mode = mode;
  localStorage.setItem(MODE_KEY, mode);
  document.querySelectorAll('[data-mode-btn]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.modeBtn === mode));
    b.classList.toggle('amber', b.dataset.modeBtn === mode);
  });
}
function exportHistory() {
  const data = getHistory();
  if (!data.length) { alert('Belum ada riwayat untuk diekspor.'); return; }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'riwayat-belajar-mpi.json'; a.click();
  URL.revokeObjectURL(a.href);
}
function fmtDec(x) { return String(Math.round(x * 100) / 100).replace('.', ','); }
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ---------- Simulasi 1: kalkulator sisi + visual segitiga ----------
function drawTriangle(a, b, c) {
  const scale = Math.min(200 / Math.max(a, 0.1), 120 / Math.max(b, 0.1));
  const x = 20 + a * scale, y = 150 - b * scale;
  const poly = document.getElementById('triPoly');
  if (poly) poly.setAttribute('points', '20,150 ' + x.toFixed(1) + ',150 20,' + y.toFixed(1));
  const setText = function (id, txt, px, py) { const el = document.getElementById(id); if (el) { el.textContent = txt; el.setAttribute('x', px.toFixed(1)); el.setAttribute('y', py.toFixed(1)); } };
  setText('triLabelA', 'a = ' + fmtDec(a), (20 + x) / 2, 168);
  setText('triLabelB', 'b = ' + fmtDec(b), 12, (150 + y) / 2);
  setText('triLabelC', 'c = ' + fmtDec(c), (20 + x) / 2 + 8, (150 + y) / 2 - 4);
}
function runSideCalc() {
  const mode = document.getElementById('sideMode').value;
  const x = parseFloat(String(document.getElementById('sideX').value).replace(',', '.')) || 0;
  const y = parseFloat(String(document.getElementById('sideY').value).replace(',', '.')) || 0;
  const out = document.getElementById('sideResult');
  if (x <= 0 || y <= 0) { out.innerHTML = '<strong>Sisi harus lebih dari 0.</strong>'; return; }
  if (mode === 'c') {
    const c = Math.sqrt(x * x + y * y);
    drawTriangle(x, y, c);
    out.innerHTML = '<strong>c = √(' + fmtDec(x) + '² + ' + fmtDec(y) + '²) = √' + fmtDec(x * x + y * y) + ' = ' + fmtDec(c) + '.</strong> Periksa: ' + fmtDec(x) + '² + ' + fmtDec(y) + '² = ' + fmtDec(x * x) + ' + ' + fmtDec(y * y) + ' = ' + fmtDec(x * x + y * y) + ' = ' + fmtDec(c) + '².';
  } else if (mode === 'a') {
    if (x <= y) { out.innerHTML = '<strong>Hipotenusa harus lebih panjang dari kaki yang diketahui.</strong> Isi sisi pertama (c) lebih besar dari sisi kedua (b).'; return; }
    const a = Math.sqrt(x * x - y * y);
    drawTriangle(a, y, x);
    out.innerHTML = '<strong>a = √(c² − b²) = √(' + fmtDec(x) + '² − ' + fmtDec(y) + '²) = √' + fmtDec(x * x - y * y) + ' = ' + fmtDec(a) + '.</strong>';
  } else {
    if (y <= x) { out.innerHTML = '<strong>Hipotenusa harus lebih panjang dari kaki yang diketahui.</strong> Isi sisi kedua (c) lebih besar dari sisi pertama (a).'; return; }
    const b = Math.sqrt(y * y - x * x);
    drawTriangle(x, b, y);
    out.innerHTML = '<strong>b = √(c² − a²) = √(' + fmtDec(y) + '² − ' + fmtDec(x) + '²) = √' + fmtDec(y * y - x * x) + ' = ' + fmtDec(b) + '.</strong>';
  }
}

// ---------- Simulasi 2: kalkulator jarak dua titik + visual ----------
function drawDistance(x1, y1, x2, y2, d) {
  const minX = Math.min(x1, x2) - 1, maxX = Math.max(x1, x2) + 1;
  const minY = Math.min(y1, y2) - 1, maxY = Math.max(y1, y2) + 1;
  const sx = 200 / Math.max(1, maxX - minX), sy = 140 / Math.max(1, maxY - minY);
  const px = function (x) { return 30 + (x - minX) * sx; };
  const py = function (y) { return 170 - (y - minY) * sy; };
  const set = function (id, attrs) { const el = document.getElementById(id); if (!el) return; Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); }); };
  set('distP1', { cx: px(x1).toFixed(1), cy: py(y1).toFixed(1) });
  set('distP2', { cx: px(x2).toFixed(1), cy: py(y2).toFixed(1) });
  set('distLegX', { x1: px(x1).toFixed(1), y1: py(y1).toFixed(1), x2: px(x2).toFixed(1), y2: py(y1).toFixed(1) });
  set('distLegY', { x1: px(x2).toFixed(1), y1: py(y1).toFixed(1), x2: px(x2).toFixed(1), y2: py(y2).toFixed(1) });
  set('distHyp', { x1: px(x1).toFixed(1), y1: py(y1).toFixed(1), x2: px(x2).toFixed(1), y2: py(y2).toFixed(1) });
  const label = function (id, txt, x, y) { const el = document.getElementById(id); if (el) { el.textContent = txt; el.setAttribute('x', x.toFixed(1)); el.setAttribute('y', y.toFixed(1)); } };
  label('distLabelP1', '(' + x1 + ', ' + y1 + ')', px(x1), py(y1) + 18);
  label('distLabelP2', '(' + x2 + ', ' + y2 + ')', px(x2), py(y2) - 10);
  label('distLabelD', 'd = ' + fmtDec(d), (px(x1) + px(x2)) / 2 + 6, (py(y1) + py(y2)) / 2 - 4);
}
function runDistCalc() {
  const x1 = parseFloat(document.getElementById('distX1').value) || 0;
  const y1 = parseFloat(document.getElementById('distY1').value) || 0;
  const x2 = parseFloat(document.getElementById('distX2').value) || 0;
  const y2 = parseFloat(document.getElementById('distY2').value) || 0;
  const dx = x2 - x1, dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);
  drawDistance(x1, y1, x2, y2, d);
  document.getElementById('distResult').innerHTML = '<strong>d = √((' + x2 + ' − ' + x1 + ')² + (' + y2 + ' − ' + y1 + ')²) = √(' + fmtDec(dx * dx) + ' + ' + fmtDec(dy * dy) + ') = √' + fmtDec(dx * dx + dy * dy) + ' = ' + fmtDec(d) + '.</strong> Δx = ' + fmtDec(dx) + ', Δy = ' + fmtDec(dy) + '.';
}

// ---------- Latihan bebas ----------
let practiceValue = null, practiceWhy = '';
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]];
function newPractice() {
  const jenis = ['hyp', 'leg', 'dist', 'special45', 'special30'][Math.floor(Math.random() * 5)];
  let q, why;
  if (jenis === 'hyp') {
    const t = TRIPLES[Math.floor(Math.random() * TRIPLES.length)];
    practiceValue = t[2];
    q = 'Sisi miring segitiga siku-siku dengan kaki ' + t[0] + ' dan ' + t[1] + ' adalah …';
    why = 'c = √(' + t[0] + '² + ' + t[1] + '²) = √(' + (t[0] * t[0]) + ' + ' + (t[1] * t[1]) + ') = √' + (t[2] * t[2]) + ' = ' + t[2] + '.';
  } else if (jenis === 'leg') {
    const t = TRIPLES[Math.floor(Math.random() * TRIPLES.length)];
    const hideA = Math.random() < 0.5;
    practiceValue = hideA ? t[0] : t[1];
    q = hideA
      ? 'Segitiga siku-siku dengan hipotenusa ' + t[2] + ' dan satu kaki ' + t[1] + '. Kaki satunya adalah …'
      : 'Segitiga siku-siku dengan hipotenusa ' + t[2] + ' dan satu kaki ' + t[0] + '. Kaki satunya adalah …';
    why = hideA
      ? 'a = √(' + t[2] + '² − ' + t[1] + '²) = √(' + (t[2] * t[2]) + ' − ' + (t[1] * t[1]) + ') = √' + (t[0] * t[0]) + ' = ' + t[0] + '.'
      : 'b = √(' + t[2] + '² − ' + t[0] + '²) = √(' + (t[2] * t[2]) + ' − ' + (t[0] * t[0]) + ') = √' + (t[1] * t[1]) + ' = ' + t[1] + '.';
  } else if (jenis === 'dist') {
    const t = TRIPLES[Math.floor(Math.random() * 4)];
    const x1 = rnd(0, 4), y1 = rnd(0, 4);
    const x2 = x1 + t[0], y2 = y1 + t[1];
    practiceValue = t[2];
    q = 'Jarak titik (' + x1 + ', ' + y1 + ') ke (' + x2 + ', ' + y2 + ') adalah …';
    why = 'Δx = ' + t[0] + ', Δy = ' + t[1] + ', jadi d = √(' + t[0] + '² + ' + t[1] + '²) = √' + (t[2] * t[2]) + ' = ' + t[2] + '.';
  } else if (jenis === 'special45') {
    const leg = rnd(2, 9);
    practiceValue = leg * Math.SQRT2;
    q = 'Segitiga 45°–45°–90° dengan kaki ' + leg + '. Hipotenusanya adalah … (tulis 2 angka di belakang koma)';
    why = 'Miring = kaki × √2 = ' + leg + ' × √2 ≈ ' + fmtDec(practiceValue) + '.';
  } else {
    const pendek = rnd(2, 10);
    if (Math.random() < 0.5) {
      practiceValue = pendek * 2;
      q = 'Segitiga 30°–60°–90° dengan sisi terpendek ' + pendek + '. Hipotenusanya adalah …';
      why = 'Miring = 2 × sisi terpendek = 2 × ' + pendek + ' = ' + (pendek * 2) + '.';
    } else {
      practiceValue = pendek * Math.sqrt(3);
      q = 'Segitiga 30°–60°–90° dengan sisi terpendek ' + pendek + '. Sisi di hadapan sudut 60° adalah … (tulis 2 angka di belakang koma)';
      why = 'Sisi di hadapan 60° = pendek × √3 = ' + pendek + ' × √3 ≈ ' + fmtDec(practiceValue) + '.';
    }
  }
  practiceWhy = why;
  document.getElementById('practiceQ').textContent = q;
  document.getElementById('practiceWhy').textContent = why;
  document.getElementById('practiceFeedback').innerHTML = '';
  document.getElementById('practiceAns').value = '';
}
function checkPractice() {
  const raw = (document.getElementById('practiceAns').value || '').trim().replace(',', '.');
  const f = document.getElementById('practiceFeedback');
  const val = parseFloat(raw);
  if (isNaN(val)) { f.innerHTML = '<div class="feedback bad">Tulis dulu jawabanmu sebagai bilangan.</div>'; return; }
  if (Math.abs(val - practiceValue) < 0.06) f.innerHTML = '<div class="feedback good">Benar! ' + practiceWhy + '</div>';
  else f.innerHTML = '<div class="feedback bad">Belum tepat. Pembahasan: ' + practiceWhy + '</div>';
}

// ---------- Kuis formatif G.4 (10 soal) ----------
// Kunci dihitung ulang satu per satu — lihat laporan akhir (10/10 benar).
const QUIZ_P = [
  { q: 'Segitiga siku-siku dengan kaki 3 dan 4. Hipotenusanya adalah …', o: ['5', '7', '12', '25'], a: 0, why: 'c = √(3² + 4²) = √(9 + 16) = √25 = 5.' },
  { q: 'Segitiga siku-siku dengan hipotenusa 13 dan satu kaki 12. Kaki satunya adalah …', o: ['5', '6', '25', '1'], a: 0, why: 'a = √(13² − 12²) = √(169 − 144) = √25 = 5.' },
  { q: 'Manakah yang merupakan tripel Pythagoras?', o: ['(4, 5, 6)', '(5, 12, 13)', '(7, 9, 10)', '(2, 3, 4)'], a: 1, why: '5² + 12² = 25 + 144 = 169 = 13². Yang lain: 4² + 5² = 41 ≠ 36; 7² + 9² = 130 ≠ 100; 2² + 3² = 13 ≠ 16.' },
  { q: 'Manakah yang BUKAN segitiga siku-siku?', o: ['6, 8, 10', '9, 12, 15', '5, 12, 13', '8, 15, 16'], a: 3, why: '8² + 15² = 64 + 225 = 289, sedangkan 16² = 256. Tiga lainnya memenuhi a² + b² = c².' },
  { q: 'Segitiga 45°–45°–90° dengan kaki 7. Hipotenusanya adalah …', o: ['7', '9,90', '14', '4,95'], a: 1, why: 'Miring = 7 × √2 ≈ 9,90.' },
  { q: 'Segitiga 30°–60°–90° dengan sisi terpendek 6. Sisi di hadapan sudut 60° adalah …', o: ['6', '12', '10,39', '18'], a: 2, why: 'Sisi di hadapan 60° = 6 × √3 ≈ 10,39. Hipotenusanya 12.' },
  { q: 'Jarak titik (0, 0) ke (6, 8) adalah …', o: ['10', '14', '48', '7'], a: 0, why: 'd = √(6² + 8²) = √(36 + 64) = √100 = 10.' },
  { q: 'Jarak titik (0, 0) ke (5, 12) adalah …', o: ['7', '13', '17', '60'], a: 1, why: 'd = √(5² + 12²) = √(25 + 144) = √169 = 13.' },
  { q: 'Sebuah tangga 5 m bersandar pada dinding, kakinya 3 m dari dinding. Tinggi ujung tangga adalah …', o: ['4 m', '3 m', '5 m', '8 m'], a: 0, why: 'Tinggi = √(5² − 3²) = √(25 − 9) = √16 = 4 m.' },
  { q: 'Diagonal persegi panjang berukuran 8 × 6 adalah …', o: ['10', '14', '48', '7'], a: 0, why: 'Diagonal = √(8² + 6²) = √(64 + 36) = √100 = 10.' }
];
let quizAnswered = 0;
function renderQuizHistory() {
  const list = pythagorasHistory();
  const best = list.length ? Math.max.apply(null, list.map(function (h) { return h.persen; })) : 0;
  const el = document.getElementById('quizHistory');
  if (el) el.innerHTML = list.length ? '<p>Skor terbaik: <strong>' + best + '%</strong> dari ' + list.length + ' percobaan. Terakhir: ' + fmtDate(list[0].tanggal) + '.</p>' : '<p>Belum ada riwayat kuis untuk materi ini.</p>';
}
function renderQuiz() {
  const box = document.getElementById('quizBox'); if (!box) return;
  box.innerHTML = QUIZ_P.map(function (item, i) {
    return '<div class="card" id="q' + i + '"><p><strong>' + (i + 1) + '. ' + item.q + '</strong></p>' +
      item.o.map(function (opt, j) { return '<button class="opt" data-q="' + i + '" data-o="' + j + '">' + opt + '</button>'; }).join('') +
      '<div class="quiz-feedback"></div></div>';
  }).join('');
  box.querySelectorAll('.opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const qi = parseInt(btn.dataset.q, 10), oi = parseInt(btn.dataset.o, 10);
      const card = document.getElementById('q' + qi);
      if (card.dataset.done) return;
      card.dataset.done = '1'; quizAnswered++;
      const item = QUIZ_P[qi];
      card.querySelectorAll('.opt').forEach(function (b) {
        b.disabled = true;
        if (parseInt(b.dataset.o, 10) === item.a) b.classList.add('correct');
        if (b === btn && oi !== item.a) b.classList.add('wrong');
      });
      card.querySelector('.quiz-feedback').innerHTML = '<div class="feedback ' + (oi === item.a ? 'good' : 'bad') + '">' + (oi === item.a ? 'Benar!' : 'Belum tepat.') + ' ' + item.why + '</div>';
      const prog = document.getElementById('quizProgress'); if (prog) prog.textContent = 'Terjawab: ' + quizAnswered + '/10';
      if (quizAnswered === 10) { const fin = document.getElementById('finishQuiz'); if (fin) fin.disabled = false; }
    });
  });
}
function finishQuiz() {
  const skor = QUIZ_P.filter(function (item, i) { return !document.getElementById('q' + i).querySelector('.opt.wrong'); }).length;
  const persen = Math.round(skor / QUIZ_P.length * 100);
  saveHistory({ tanggal: new Date().toISOString(), materi: 'Teorema Pythagoras (G.4)', skor: skor, total: QUIZ_P.length, persen: persen });
  const res = document.getElementById('quizResult');
  if (res) res.innerHTML = '<div class="feedback good"><strong>Skor kamu: ' + skor + '/10 (' + persen + '%).</strong> Riwayat ini sudah tersimpan di perangkat ini. Kamu bisa mengekspornya dari beranda untuk dikirim ke guru.</div>';
  renderQuizHistory();
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', function () {
  applyMode(localStorage.getItem(MODE_KEY) || 'siswa');
  document.querySelectorAll('[data-mode-btn]').forEach(function (b) {
    b.addEventListener('click', function () { applyMode(b.dataset.modeBtn); });
  });
  document.querySelectorAll('.exportBtn').forEach(function (b) { b.addEventListener('click', exportHistory); });
  document.querySelectorAll('.clearBtn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (confirm('Hapus semua riwayat belajar di perangkat ini?')) { localStorage.removeItem(HISTORY_KEY); renderQuizHistory(); }
    });
  });
  document.querySelectorAll('.printBtn').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  drawTriangle(3, 4, 5);
  const sideBtn = document.getElementById('calcSideBtn'); if (sideBtn) sideBtn.addEventListener('click', runSideCalc);
  drawDistance(2, 2, 5, 6, 5);
  const distBtn = document.getElementById('calcDistBtn'); if (distBtn) distBtn.addEventListener('click', runDistCalc);
  if (document.getElementById('practiceQ')) {
    newPractice();
    document.getElementById('newPracticeBtn').addEventListener('click', newPractice);
    document.getElementById('checkPracticeBtn').addEventListener('click', checkPractice);
  }
  renderQuiz();
  renderQuizHistory();
  const fin = document.getElementById('finishQuiz'); if (fin) fin.addEventListener('click', finishQuiz);
  const refl = document.getElementById('refleksiPythagoras');
  if (refl) {
    refl.value = localStorage.getItem('mpi_refleksi_pythagoras') || '';
    refl.addEventListener('input', function () { localStorage.setItem('mpi_refleksi_pythagoras', refl.value); });
  }
});
