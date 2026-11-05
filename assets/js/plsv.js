// PLSV dan PtLSV (A.2–A.3), Kelas 8 Semester 1 — halaman mandiri, memakai
// kunci riwayat yang sama dengan halaman lain (localStorage, tanpa server
// dan tanpa akun).
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
function plsvHistory() {
  return getHistory().filter(function (h) { return h.materi.indexOf('PLSV dan PtLSV') === 0; });
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
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; }
function simplify(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return [n / g, d / g];
}
function fmtNum(x) {
  if (Math.abs(x - Math.round(x)) < 0.000001) return String(Math.round(x));
  return String(Math.round(x * 100) / 100).replace('.', ',');
}
function fmtAx(a) {
  if (a === 1) return 'x';
  if (a === -1) return '−x';
  return fmtNum(a) + 'x';
}
function fmtEq(a, b, c, rel) {
  let kiri = fmtAx(a);
  if (b > 0) kiri += ' + ' + fmtNum(b);
  else if (b < 0) kiri += ' − ' + fmtNum(-b);
  return kiri + ' ' + rel + ' ' + fmtNum(c);
}
function signWord(s) {
  if (s === '<') return 'kurang dari';
  if (s === '<=') return 'kurang dari atau sama dengan';
  if (s === '>') return 'lebih dari';
  return 'lebih dari atau sama dengan';
}
function signSymbol(s) {
  if (s === '<=') return '≤';
  if (s === '>=') return '≥';
  return s;
}
function flipSign(s) {
  if (s === '<') return '>';
  if (s === '>') return '<';
  if (s === '<=') return '>=';
  return '<=';
}
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ---------- Simulator 1: penyelesai PLSV ax + b = c ----------
function solveEq() {
  const a = parseFloat((document.getElementById('eqA').value || '').replace(',', '.')) || 0;
  const b = parseFloat((document.getElementById('eqB').value || '').replace(',', '.')) || 0;
  const c = parseFloat((document.getElementById('eqC').value || '').replace(',', '.')) || 0;
  const out = document.getElementById('solveResult');
  if (a === 0) { out.innerHTML = '<div class="feedback bad">Koefisien x (a) tidak boleh 0, karena kalau a = 0 persamaannya bukan lagi persamaan linear satu variabel.</div>'; return; }
  const d = c - b;
  const x = d / a;
  const s = simplify(d, a);
  const pecahan = (Math.abs(x - Math.round(x)) < 0.000001) ? '' : ' = ' + s[0] + '/' + s[1];
  const cek = a * x + b;
  out.innerHTML = '<strong>' + fmtEq(a, b, c, '=') + '</strong><br>' +
    'Langkah 1 — samakan timbangan: kurangi kedua ruas dengan ' + fmtNum(b) + ', sehingga ' + fmtAx(a) + ' = ' + fmtNum(c) + ' − (' + fmtNum(b) + ') = ' + fmtNum(d) + '.<br>' +
    'Langkah 2 — bagi kedua ruas dengan ' + fmtNum(a) + ': x = ' + fmtNum(d) + ' ÷ ' + fmtNum(a) + ' = <strong>' + fmtNum(x) + pecahan + '</strong>.<br>' +
    'Cek: ' + fmtAx(a).replace('x', '(' + fmtNum(x) + ')') + ' + ' + fmtNum(b) + ' = ' + fmtNum(cek) + ', sama dengan ruas kanan ' + fmtNum(c) + '. Jadi penyelesaiannya x = ' + fmtNum(x) + '.';
}

// ---------- Simulator 2: penyelesai PtLSV + garis bilangan + penguji ----------
function drawIneqLine(boundary, resultSign) {
  const box = document.getElementById('ineqLine'); if (!box) return;
  const lo = Math.min(-10, Math.floor(boundary) - 2);
  const hi = Math.max(10, Math.ceil(boundary) + 2);
  const span = hi - lo;
  const pos = function (v) { return ((v - lo) / span) * 100; };
  let html = '';
  for (let n = lo; n <= hi; n++) {
    html += '<div class="tick" style="left:' + pos(n) + '%"><i></i>' + n + '</div>';
  }
  const less = (resultSign === '<' || resultSign === '<=');
  const left = less ? pos(lo) : pos(boundary);
  const width = less ? pos(boundary) - pos(lo) : pos(hi) - pos(boundary);
  html += '<div style="position:absolute;bottom:34px;left:' + left + '%;width:' + width + '%;height:8px;background:#0f766e;border-radius:99px"></div>';
  const dot = (resultSign === '<=' || resultSign === '>=') ? '●' : '○';
  html += '<div class="marker" style="left:' + pos(boundary) + '%;color:#115e59">' + dot + '<br><strong>' + fmtNum(boundary) + '</strong></div>';
  box.innerHTML = html;
}
function solveIneq() {
  const a = parseFloat((document.getElementById('ineqA').value || '').replace(',', '.')) || 0;
  const b = parseFloat((document.getElementById('ineqB').value || '').replace(',', '.')) || 0;
  const sign = document.getElementById('ineqSign').value;
  const c = parseFloat((document.getElementById('ineqC').value || '').replace(',', '.')) || 0;
  const out = document.getElementById('ineqResult');
  if (a === 0) { out.innerHTML = '<div class="feedback bad">Koefisien x (a) tidak boleh 0, karena kalau a = 0 pertidaksamaannya bukan lagi pertidaksamaan linear satu variabel.</div>'; return; }
  const d = c - b;
  const boundary = d / a;
  const flipped = a < 0;
  const resultSign = flipped ? flipSign(sign) : sign;
  const sym = signSymbol(resultSign);
  out.innerHTML = '<strong>' + fmtEq(a, b, c, signSymbol(sign)) + '</strong><br>' +
    'Langkah 1: ' + fmtAx(a) + ' ' + signSymbol(sign) + ' ' + fmtNum(d) + ' (kedua ruas dikurangi ' + fmtNum(b) + ').<br>' +
    'Langkah 2: bagi kedua ruas dengan ' + fmtNum(a) + (flipped ? ' — karena pembaginya negatif, tanda pertidaksamaan <strong>berbalik</strong>.' : ' — pembaginya positif, tanda tetap.') + '<br>' +
    'Himpunan penyelesaian: <strong>x ' + sym + ' ' + fmtNum(boundary) + '</strong>, artinya x ' + signWord(resultSign) + ' ' + fmtNum(boundary) + '. Lingkaran ' + ((resultSign === '<=' || resultSign === '>=') ? 'penuh (●) berarti batasnya ikut' : 'kosong (○) berarti batasnya tidak ikut') + ' dan arsiran menuju ' + ((resultSign === '<' || resultSign === '<=') ? 'kiri' : 'kanan') + '.';
  drawIneqLine(boundary, resultSign);
  window._ineq = { a: a, b: b, sign: sign, c: c };
}
function testIneq() {
  const raw = (document.getElementById('testX').value || '').trim().replace(',', '.');
  const x = parseFloat(raw);
  const out = document.getElementById('testResult');
  if (isNaN(x) || !window._ineq) { out.innerHTML = '<div class="feedback bad">Selesaikan dulu pertidaksamaannya di atas, lalu tulis bilangan yang mau diuji.</div>'; return; }
  const q = window._ineq;
  const kiri = q.a * x + q.b;
  let ok = false;
  if (q.sign === '<') ok = kiri < q.c;
  else if (q.sign === '<=') ok = kiri <= q.c;
  else if (q.sign === '>') ok = kiri > q.c;
  else ok = kiri >= q.c;
  out.innerHTML = '<div class="feedback ' + (ok ? 'good' : 'bad') + '">Uji x = ' + fmtNum(x) + ': ruas kiri = ' + fmtNum(kiri) + ' ' + signSymbol(q.sign) + ' ' + fmtNum(q.c) + ' → <strong>' + (ok ? 'MEMENUHI' : 'TIDAK MEMENUHI') + '</strong>. Jadi x = ' + fmtNum(x) + (ok ? ' termasuk' : ' bukan termasuk') + ' dalam himpunan penyelesaian.</div>';
}

// ---------- Latihan bebas (tidak masuk riwayat) ----------
let practiceAnswer = null, practiceWhy = '';
function newPractice() {
  const isIneq = Math.random() < 0.5;
  let a = 0;
  while (a === 0) a = rnd(-6, 6);
  const x0 = rnd(-8, 8);
  const b = rnd(-10, 10);
  const c = a * x0 + b;
  if (!isIneq) {
    practiceAnswer = x0;
    practiceWhy = fmtEq(a, b, c, '=') + ' → ' + fmtAx(a) + ' = ' + fmtNum(c) + ' − (' + fmtNum(b) + ') = ' + fmtNum(c - b) + ' → x = ' + fmtNum(c - b) + ' ÷ ' + fmtNum(a) + ' = ' + fmtNum(x0) + '.';
    document.getElementById('practiceQ').textContent = 'Selesaikan ' + fmtEq(a, b, c, '=') + '.  x = ?';
  } else {
    const signs = ['<', '<=', '>', '>='];
    const sign = signs[rnd(0, 3)];
    const resultSign = a < 0 ? flipSign(sign) : sign;
    practiceAnswer = x0;
    practiceWhy = fmtEq(a, b, c, signSymbol(sign)) + ' → ' + fmtAx(a) + ' ' + signSymbol(sign) + ' ' + fmtNum(c - b) + (a < 0 ? ' → bagi dengan ' + fmtNum(a) + ' (negatif), tanda berbalik' : '') + ' → x ' + signSymbol(resultSign) + ' ' + fmtNum(x0) + '. Batas penyelesaiannya x = ' + fmtNum(x0) + '.';
    document.getElementById('practiceQ').textContent = 'Tentukan batas penyelesaian dari ' + fmtEq(a, b, c, signSymbol(sign)) + '.  Batas x = ?';
  }
  document.getElementById('practiceWhy').textContent = practiceWhy;
  document.getElementById('practiceFeedback').innerHTML = '';
  document.getElementById('practiceAns').value = '';
}
function checkPractice() {
  const raw = (document.getElementById('practiceAns').value || '').trim().replace(',', '.');
  const v = parseFloat(raw);
  const f = document.getElementById('practiceFeedback');
  if (isNaN(v)) { f.innerHTML = '<div class="feedback bad">Tulis dulu jawabanmu sebagai bilangan.</div>'; return; }
  if (Math.abs(v - practiceAnswer) < 0.01) f.innerHTML = '<div class="feedback good">Benar! ' + practiceWhy + '</div>';
  else f.innerHTML = '<div class="feedback bad">Belum tepat. Pembahasan: ' + practiceWhy + '</div>';
}

// ---------- Kuis formatif A.2–A.3 (10 soal) ----------
// Kunci dihitung ulang satu per satu (lihat laporan): 10/10 benar, 0 kesalahan.
const QUIZ_P = [
  { q: '“Tiga kali suatu bilangan ditambah 5 sama dengan 20.” Model PLSV-nya adalah …', o: ['3x + 5 = 20', '3x − 5 = 20', 'x + 3 = 20', '3(x + 5) = 20'], a: 0, why: '“Tiga kali suatu bilangan” = 3x, “ditambah 5” = +5, “sama dengan 20” → 3x + 5 = 20.' },
  { q: 'Penyelesaian dari 2x + 5 = 13 adalah …', o: ['x = 9', 'x = 4', 'x = 3', 'x = 6'], a: 1, why: '2x = 13 − 5 = 8, lalu x = 8 ÷ 2 = 4.' },
  { q: 'Penyelesaian dari 5x − 7 = 18 adalah …', o: ['x = 4', 'x = 6', 'x = 5', 'x = 11'], a: 2, why: '5x = 18 + 7 = 25, lalu x = 25 ÷ 5 = 5.' },
  { q: 'Penyelesaian dari 3(x − 2) = 12 adalah …', o: ['x = 4', 'x = 2', 'x = 10', 'x = 6'], a: 3, why: 'Bagi kedua ruas dengan 3: x − 2 = 4, lalu x = 4 + 2 = 6.' },
  { q: 'Penyelesaian dari −2x + 8 = 2 adalah …', o: ['x = −3', 'x = 3', 'x = 5', 'x = −5'], a: 1, why: '−2x = 2 − 8 = −6, lalu x = (−6) ÷ (−2) = 3.' },
  { q: 'Himpunan penyelesaian dari x + 4 > 9 adalah …', o: ['x < 5', 'x ≥ 5', 'x > 5', 'x ≤ 5'], a: 2, why: 'x > 9 − 4, jadi x > 5.' },
  { q: 'Himpunan penyelesaian dari 3x − 5 ≤ 10 adalah …', o: ['x > 5', 'x ≤ 5', 'x ≥ 5', 'x < 5'], a: 1, why: '3x ≤ 10 + 5 = 15, lalu x ≤ 15 ÷ 3 = 5.' },
  { q: 'Himpunan penyelesaian dari −2x + 6 ≥ 2 adalah …', o: ['x ≥ 2', 'x ≤ 2', 'x < 2', 'x > −2'], a: 1, why: '−2x ≥ 2 − 6 = −4. Bagi kedua ruas dengan −2 (negatif), tanda berbalik: x ≤ 2.' },
  { q: 'Harga 1 kg gula Rp15.000. Seorang pembeli membayar Rp75.000 untuk x kg gula. Nilai x adalah …', o: ['4 kg', '6 kg', '15 kg', '5 kg'], a: 3, why: 'Modelnya 15.000x = 75.000, jadi x = 75.000 ÷ 15.000 = 5.' },
  { q: 'Sebuah lift hanya boleh mengangkut paling banyak 400 kg. Jika rata-rata berat satu orang 50 kg, banyak orang yang boleh naik sekaligus adalah …', o: ['x < 8 orang', 'x ≥ 8 orang', 'x > 8 orang', 'x ≤ 8 orang'], a: 3, why: 'Modelnya 50x ≤ 400, jadi x ≤ 8. Paling banyak 8 orang.' }
];
let quizAnswered = 0;
function renderQuizHistory() {
  const list = plsvHistory();
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
  saveHistory({ tanggal: new Date().toISOString(), materi: 'PLSV dan PtLSV (A.2–A.3)', skor: skor, total: QUIZ_P.length, persen: persen });
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

  const solveBtn = document.getElementById('solveBtn'); if (solveBtn) solveBtn.addEventListener('click', solveEq);
  const ineqBtn = document.getElementById('ineqBtn'); if (ineqBtn) ineqBtn.addEventListener('click', solveIneq);
  const testBtn = document.getElementById('testBtn'); if (testBtn) testBtn.addEventListener('click', testIneq);
  if (document.getElementById('practiceQ')) {
    newPractice();
    document.getElementById('newPracticeBtn').addEventListener('click', newPractice);
    document.getElementById('checkPracticeBtn').addEventListener('click', checkPractice);
  }
  renderQuiz();
  renderQuizHistory();
  const fin = document.getElementById('finishQuiz'); if (fin) fin.addEventListener('click', finishQuiz);
  const refl = document.getElementById('refleksiPlsv');
  if (refl) {
    refl.value = localStorage.getItem('mpi_refleksi_plsv') || '';
    refl.addEventListener('input', function () { localStorage.setItem('mpi_refleksi_plsv', refl.value); });
  }
});
