// Bilangan Rasional (B.3) — halaman mandiri, memakai kunci riwayat yang sama
// dengan halaman Bilangan Bulat (localStorage, tanpa server dan tanpa akun).
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
function rasionalHistory() {
  return getHistory().filter(function (h) { return h.materi.indexOf('Bilangan Rasional') === 0; });
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
function fmtDec(x) { return String(Math.round(x * 10000) / 10000).replace('.', ','); }

// ---------- Konverter ----------
function runConverter() {
  const n = parseInt(document.getElementById('convNum').value, 10) || 0;
  const d = parseInt(document.getElementById('convDen').value, 10) || 1;
  if (d === 0) { document.getElementById('convResult').textContent = 'Penyebut tidak boleh 0.'; return; }
  const s = simplify(n, d);
  const val = n / d;
  document.getElementById('convResult').innerHTML = '<strong>' + n + '/' + d + ' = ' + fmtDec(val) + ' = ' + fmtDec(val * 100) + '%.</strong> Bentuk sederhananya ' + s[0] + '/' + s[1] + '.';
  document.getElementById('convBar').style.width = Math.max(0, Math.min(100, val * 100)) + '%';
  document.getElementById('convSegments').textContent = val <= 1
    ? 'Bagian yang terisi: ' + n + ' dari ' + d + ' bagian.'
    : 'Nilainya lebih dari 1: ' + s[0] + '/' + s[1] + ' = ' + Math.floor(val) + ' utuh sisa ' + (n % d) + '/' + d + ' (bila pembilangnya positif).';
}

// ---------- Pembanding ----------
function runCompare() {
  const a = parseInt(document.getElementById('compA1').value, 10) || 0;
  const b = parseInt(document.getElementById('compA2').value, 10) || 1;
  const c = parseInt(document.getElementById('compB1').value, 10) || 0;
  const d = parseInt(document.getElementById('compB2').value, 10) || 1;
  const kiri = a * d, kanan = c * b;
  const tanda = kiri > kanan ? '>' : (kiri < kanan ? '<' : '=');
  document.getElementById('compResult').innerHTML = '<strong>' + a + '/' + b + ' ' + tanda + ' ' + c + '/' + d + '</strong> karena ' + a + '×' + d + ' = ' + kiri + ' dan ' + c + '×' + b + ' = ' + kanan + ', sedangkan ' + kiri + ' ' + tanda + ' ' + kanan + '. Dalam desimal: ' + fmtDec(a / b) + ' lawan ' + fmtDec(c / d) + '.';
}

// ---------- Latihan bebas ----------
let practiceValue = null, practiceWhy = '';
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function newPractice() {
  const jenis = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];
  const b = rnd(2, 9), d = rnd(2, 9);
  const a = rnd(1, b - 1), c = rnd(1, d - 1);
  let n, dd, why;
  if (jenis === '+') { n = a * d + c * b; dd = b * d; why = a + '/' + b + ' + ' + c + '/' + d + ' = ' + (a * d) + '/' + dd + ' + ' + (c * b) + '/' + dd + ' = ' + n + '/' + dd; }
  else if (jenis === '-') { n = a * d - c * b; dd = b * d; why = a + '/' + b + ' − ' + c + '/' + d + ' = ' + (a * d) + '/' + dd + ' − ' + (c * b) + '/' + dd + ' = ' + n + '/' + dd; }
  else if (jenis === '×') { n = a * c; dd = b * d; why = a + '/' + b + ' × ' + c + '/' + d + ' = ' + n + '/' + dd; }
  else { n = a * d; dd = b * c; why = a + '/' + b + ' ÷ ' + c + '/' + d + ' = ' + a + '/' + b + ' × ' + d + '/' + c + ' = ' + n + '/' + dd; }
  const s = simplify(n, dd);
  practiceValue = s[0] / s[1];
  practiceWhy = why + ' = ' + s[0] + '/' + s[1] + ' (bentuk sederhana).';
  document.getElementById('practiceQ').textContent = a + '/' + b + ' ' + jenis + ' ' + c + '/' + d + ' = ?';
  document.getElementById('practiceWhy').textContent = practiceWhy;
  document.getElementById('practiceFeedback').innerHTML = '';
  document.getElementById('practiceAns').value = '';
}
function checkPractice() {
  const raw = (document.getElementById('practiceAns').value || '').trim().replace(',', '.');
  const f = document.getElementById('practiceFeedback');
  let val = NaN;
  if (raw.indexOf('/') > -1) {
    const p = raw.split('/');
    if (p.length === 2 && parseFloat(p[1]) !== 0) val = parseFloat(p[0]) / parseFloat(p[1]);
  } else { val = parseFloat(raw); }
  if (isNaN(val)) { f.innerHTML = '<div class="feedback bad">Tulis dulu jawabanmu, misalnya 5/6.</div>'; return; }
  if (Math.abs(val - practiceValue) < 0.001) f.innerHTML = '<div class="feedback good">Benar! ' + practiceWhy + '</div>';
  else f.innerHTML = '<div class="feedback bad">Belum tepat. Pembahasan: ' + practiceWhy + '</div>';
}

// ---------- Kuis formatif B.3 (10 soal) ----------
const QUIZ_R = [
  { q: 'Bentuk desimal dari 3/4 adalah …', o: ['0,34', '0,75', '0,43', '1,34'], a: 1, why: '3 ÷ 4 = 0,75.' },
  { q: 'Bandingkan 2/3 dan 3/5. Tanda yang tepat adalah …', o: ['2/3 < 3/5', '2/3 > 3/5', '2/3 = 3/5', 'Tidak bisa dibandingkan'], a: 1, why: 'Kali silang: 2×5 = 10 dan 3×3 = 9, jadi 2/3 lebih besar.' },
  { q: 'Urutkan dari yang terkecil: 1/2, 3/4, 2/5.', o: ['2/5, 1/2, 3/4', '3/4, 1/2, 2/5', '1/2, 2/5, 3/4', '2/5, 3/4, 1/2'], a: 0, why: 'Dalam desimal: 2/5 = 0,4; 1/2 = 0,5; 3/4 = 0,75.' },
  { q: 'Hasil dari 1/2 + 1/3 adalah …', o: ['2/5', '5/6', '1/6', '2/6'], a: 1, why: 'Samakan penyebut: 3/6 + 2/6 = 5/6.' },
  { q: 'Hasil dari 3/4 − 1/6 adalah …', o: ['2/2', '7/12', '1/3', '2/10'], a: 1, why: 'Samakan penyebut: 9/12 − 2/12 = 7/12.' },
  { q: 'Hasil dari 2/3 × 3/4 adalah …', o: ['5/7', '6/7', '1/2', '5/12'], a: 2, why: '2×3 = 6 dan 3×4 = 12, lalu 6/12 = 1/2.' },
  { q: 'Hasil dari 3/5 ÷ 2/3 adalah …', o: ['6/15', '9/10', '2/5', '5/6'], a: 1, why: 'Bagi berarti kali kebalikan: 3/5 × 3/2 = 9/10.' },
  { q: 'Bentuk persen dari 0,6 adalah …', o: ['6%', '0,6%', '60%', '600%'], a: 2, why: '0,6 × 100% = 60%.' },
  { q: 'Estimasi terbaik dari 2,48 + 3,51 adalah …', o: ['5', '6', '7', '5,99'], a: 1, why: 'Bulatkan dulu: 2,5 + 3,5 = 6. Estimasi tidak harus sama persis dengan hasil tepat 5,99.' },
  { q: 'Harga Rp200.000 didiskon 25%. Harga yang harus dibayar adalah …', o: ['Rp50.000', 'Rp150.000', 'Rp175.000', 'Rp250.000'], a: 1, why: 'Diskon = 25% × 200.000 = 50.000, jadi bayar 200.000 − 50.000 = 150.000.' }
];
let quizAnswered = 0;
function renderQuizHistory() {
  const list = rasionalHistory();
  const best = list.length ? Math.max.apply(null, list.map(function (h) { return h.persen; })) : 0;
  const el = document.getElementById('quizHistory');
  if (el) el.innerHTML = list.length ? '<p>Skor terbaik: <strong>' + best + '%</strong> dari ' + list.length + ' percobaan. Terakhir: ' + fmtDate(list[0].tanggal) + '.</p>' : '<p>Belum ada riwayat kuis untuk materi ini.</p>';
}
function renderQuiz() {
  const box = document.getElementById('quizBox'); if (!box) return;
  box.innerHTML = QUIZ_R.map(function (item, i) {
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
      const item = QUIZ_R[qi];
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
  const skor = QUIZ_R.filter(function (item, i) { return !document.getElementById('q' + i).querySelector('.opt.wrong'); }).length;
  const persen = Math.round(skor / QUIZ_R.length * 100);
  saveHistory({ tanggal: new Date().toISOString(), materi: 'Bilangan Rasional (B.3)', skor: skor, total: QUIZ_R.length, persen: persen });
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

  const convBtn = document.getElementById('convBtn'); if (convBtn) convBtn.addEventListener('click', runConverter);
  const compBtn = document.getElementById('compBtn'); if (compBtn) compBtn.addEventListener('click', runCompare);
  if (document.getElementById('practiceQ')) {
    newPractice();
    document.getElementById('newPracticeBtn').addEventListener('click', newPractice);
    document.getElementById('checkPracticeBtn').addEventListener('click', checkPractice);
  }
  renderQuiz();
  renderQuizHistory();
  const fin = document.getElementById('finishQuiz'); if (fin) fin.addEventListener('click', finishQuiz);
  const refl = document.getElementById('refleksiRasional');
  if (refl) {
    refl.value = localStorage.getItem('mpi_refleksi_rasional') || '';
    refl.addEventListener('input', function () { localStorage.setItem('mpi_refleksi_rasional', refl.value); });
  }
});
