// Bilangan Berpangkat dan Bentuk Akar (B.5–B.7) — halaman mandiri, memakai
// kunci riwayat yang sama dengan halaman lain (localStorage, tanpa server).
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
function berpangkatHistory() {
  return getHistory().filter(function (h) { return h.materi.indexOf('Bilangan Berpangkat') === 0; });
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
// Format bilangan dengan koma desimal ala Indonesia; bulatkan ke 4 desimal.
function fmtNum(x) {
  if (!isFinite(x)) return 'tidak terdefinisi';
  const r = Math.round(x * 10000) / 10000;
  if (Number.isInteger(r) && Math.abs(r) >= 1000) return r.toLocaleString('id-ID');
  return String(r).replace('.', ',');
}
function fmtPow(a, n) {
  return '<sup>' + n + '</sup>';
}

// ---------- Kalkulator pangkat ----------
function runPow() {
  const a = parseInt(document.getElementById('powBase').value, 10);
  const m = parseInt(document.getElementById('powM').value, 10);
  const n = parseInt(document.getElementById('powN').value, 10);
  const out = document.getElementById('powResult');
  if (isNaN(a) || isNaN(m) || isNaN(n)) { out.textContent = 'Isi basis dan kedua pangkat dengan bilangan bulat.'; return; }
  if (a === 0 && (m < 0 || n < 0)) { out.textContent = '0 berpangkat negatif tidak terdefinisi (pembagian dengan nol).'; return; }
  const am = Math.pow(a, m), an = Math.pow(a, n);
  const kali = Math.pow(a, m + n), bagi = Math.pow(a, m - n), pangkat = Math.pow(a, m * n);
  let html = '<strong>' + a + '<sup>' + m + '</sup> = ' + fmtNum(am) + '; ' + a + '<sup>' + n + '</sup> = ' + fmtNum(an) + '.</strong><br>' +
    a + '<sup>' + m + '</sup> × ' + a + '<sup>' + n + '</sup> = ' + a + '<sup>' + (m + n) + '</sup> = ' + fmtNum(kali) + ' (pangkat dijumlah).<br>' +
    a + '<sup>' + m + '</sup> ÷ ' + a + '<sup>' + n + '</sup> = ' + a + '<sup>' + (m - n) + '</sup> = ' + fmtNum(bagi) + ' (pangkat dikurang).<br>' +
    '(' + a + '<sup>' + m + '</sup>)<sup>' + n + '</sup> = ' + a + '<sup>' + (m * n) + '</sup> = ' + fmtNum(pangkat) + ' (pangkat dikali).';
  if (a > 0 && m > 0 && m <= 5) {
    const parts = [];
    for (let i = 0; i < m; i++) parts.push(a);
    html += '<br>Perluasan: ' + a + '<sup>' + m + '</sup> = ' + parts.join(' × ') + ' = ' + fmtNum(am) + '.';
  }
  out.innerHTML = html;
}

// ---------- Penyederhana bentuk akar ----------
function runRoot() {
  const n = parseInt(document.getElementById('rootNum').value, 10);
  const out = document.getElementById('rootResult');
  if (isNaN(n) || n < 1) { out.textContent = 'Isi bilangan bulat positif (1 sampai 10.000).'; return; }
  let s = 1;
  for (let k = Math.floor(Math.sqrt(n)); k >= 1; k--) {
    if (n % (k * k) === 0) { s = k; break; }
  }
  const inside = n / (s * s);
  const approx = Math.sqrt(n);
  if (inside === 1) out.innerHTML = '<strong>√' + n + ' = ' + s + '.</strong> ' + n + ' adalah kuadrat sempurna (' + s + ' × ' + s + ').';
  else out.innerHTML = '<strong>√' + n + ' = √(' + (s * s) + ' × ' + inside + ') = ' + s + '√' + inside + ' ≈ ' + fmtNum(approx) + '.</strong> Faktor kuadrat sempurna terbesarnya ' + (s * s) + '.';
}

// ---------- Konverter bentuk baku ----------
function toSci(x) {
  if (x === 0) return { coef: 0, exp: 0 };
  const exp = Math.floor(Math.log10(Math.abs(x)));
  const coef = Math.round((x / Math.pow(10, exp)) * 10000) / 10000;
  return { coef: coef, exp: exp };
}
function runSci() {
  const raw = (document.getElementById('sciNum').value || '').trim().replace(',', '.');
  const x = parseFloat(raw);
  const out = document.getElementById('sciResult');
  if (isNaN(x)) { out.textContent = 'Isi sebuah bilangan, misalnya 0,0072 atau 450000.'; return; }
  if (x === 0) { out.innerHTML = '<strong>0 = 0 × 10<sup>0</sup>.</strong>'; return; }
  const s = toSci(x);
  const arah = s.exp > 0 ? 'koma digeser ' + s.exp + ' tempat ke kiri' : (s.exp < 0 ? 'koma digeser ' + Math.abs(s.exp) + ' tempat ke kanan' : 'koma tidak digeser');
  out.innerHTML = '<strong>' + fmtNum(x) + ' = ' + fmtNum(s.coef) + ' × 10<sup>' + s.exp + '</sup>.</strong> ' + arah + ', dan koefisiennya ' + fmtNum(s.coef) + ' sudah di antara 1 dan 10.';
}
function runSciBack() {
  const raw = (document.getElementById('sciCoef').value || '').trim().replace(',', '.');
  const coef = parseFloat(raw);
  const exp = parseInt(document.getElementById('sciExp').value, 10);
  const out = document.getElementById('sciBackResult');
  if (isNaN(coef) || isNaN(exp)) { out.textContent = 'Isi koefisien dan pangkat 10.'; return; }
  if (coef < 1 || coef >= 10) {
    out.innerHTML = '<strong>' + fmtNum(coef) + ' × 10<sup>' + exp + '</sup> = ' + fmtNum(coef * Math.pow(10, exp)) + '.</strong> Catatan: ini belum bentuk baku karena koefisiennya harus di antara 1 dan 10.';
    return;
  }
  out.innerHTML = '<strong>' + fmtNum(coef) + ' × 10<sup>' + exp + '</sup> = ' + fmtNum(coef * Math.pow(10, exp)) + '.</strong>';
}

// ---------- Latihan bebas ----------
let practiceValue = null, practiceWhy = '';
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function newPractice() {
  const jenis = pick(['pow', 'powlaw', 'sqrt', 'rootsimp', 'sci']);
  let q, val, why;
  if (jenis === 'pow') {
    const a = rnd(2, 6), b = rnd(2, 3);
    val = Math.pow(a, b); q = a + '^' + b + ' = ?';
    why = a + '^' + b + ' = ' + Array(b).fill(a).join(' × ') + ' = ' + val + '.';
  } else if (jenis === 'powlaw') {
    const a = rnd(2, 3), m = rnd(1, 3), n = rnd(1, 3);
    val = Math.pow(a, m + n); q = a + '^' + m + ' × ' + a + '^' + n + ' = ?';
    why = a + '^' + m + ' × ' + a + '^' + n + ' = ' + a + '^' + (m + n) + ' = ' + val + '.';
  } else if (jenis === 'sqrt') {
    const s = rnd(4, 20), k = s * s;
    val = s; q = '√' + k + ' = ?';
    why = '√' + k + ' = ' + s + ' karena ' + s + ' × ' + s + ' = ' + k + '.';
  } else if (jenis === 'rootsimp') {
    const s = rnd(2, 5), m = pick([2, 3, 5, 6, 7, 10]), n = s * s * m;
    val = s; q = '√' + n + ' = __√' + m + ' (tulis koefisiennya)';
    why = '√' + n + ' = √(' + (s * s) + ' × ' + m + ') = ' + s + '√' + m + '.';
  } else {
    const a = pick([1.5, 2.5, 3.2, 4.5, 6, 7.2, 9]), k = pick([-3, -2, 2, 3, 4, 5]);
    val = a * Math.pow(10, k); q = String(a).replace('.', ',') + ' × 10^' + k + ' = ?';
    why = String(a).replace('.', ',') + ' × 10^' + k + ' = ' + fmtNum(val) + '.';
  }
  practiceValue = val;
  practiceWhy = why;
  document.getElementById('practiceQ').textContent = q;
  document.getElementById('practiceWhy').textContent = practiceWhy;
  document.getElementById('practiceFeedback').innerHTML = '';
  document.getElementById('practiceAns').value = '';
}
function checkPractice() {
  const raw = (document.getElementById('practiceAns').value || '').trim().replace(',', '.');
  const f = document.getElementById('practiceFeedback');
  const val = parseFloat(raw);
  if (isNaN(val)) { f.innerHTML = '<div class="feedback bad">Tulis dulu jawabanmu sebagai bilangan.</div>'; return; }
  const tol = 0.001 * Math.max(1, Math.abs(practiceValue));
  if (Math.abs(val - practiceValue) <= tol) f.innerHTML = '<div class="feedback good">Benar! ' + practiceWhy + '</div>';
  else f.innerHTML = '<div class="feedback bad">Belum tepat. Pembahasan: ' + practiceWhy + '</div>';
}

// ---------- Kuis formatif B.5–B.7 (10 soal) ----------
const QUIZ_P = [
  { q: 'Hasil dari 2^5 adalah …', o: ['10', '25', '32', '64'], a: 2, why: '2^5 = 2 × 2 × 2 × 2 × 2 = 32.' },
  { q: 'Hasil dari 3^2 × 3^3 dalam bentuk pangkat adalah …', o: ['3^5', '3^6', '9^5', '3^1'], a: 0, why: 'Basis sama, pangkat dijumlah: 2 + 3 = 5, jadi 3^5 (nilainya 243).' },
  { q: 'Hasil dari 5^4 ÷ 5^2 dalam bentuk pangkat adalah …', o: ['5^6', '5^2', '5^8', '1^2'], a: 1, why: 'Basis sama, pangkat dikurang: 4 − 2 = 2, jadi 5^2 (nilainya 25).' },
  { q: 'Hasil dari (2^3)^2 dalam bentuk pangkat adalah …', o: ['2^5', '2^6', '2^1', '4^6'], a: 1, why: 'Pangkat dari pangkat: pangkat dikali, 3 × 2 = 6, jadi 2^6 (nilainya 64).' },
  { q: 'Hasil dari 4^-2 adalah …', o: ['−8', '−16', '1/16', '16'], a: 2, why: 'Pangkat negatif berarti kebalikan: 4^-2 = 1/4^2 = 1/16.' },
  { q: 'Hasil dari √144 + √25 adalah …', o: ['12', '17', '37', '169'], a: 1, why: '√144 = 12 dan √25 = 5, jadi 12 + 5 = 17.' },
  { q: 'Bentuk sederhana dari √50 adalah …', o: ['5√2', '2√5', '10√5', '25√2'], a: 0, why: '√50 = √(25 × 2) = 5√2.' },
  { q: 'Hasil merasionalkan 1/√2 adalah …', o: ['√2', '√2/2', '2/√2', '1/2'], a: 1, why: 'Kalikan pembilang dan penyebut dengan √2: 1/√2 = √2/2.' },
  { q: 'Bentuk baku dari 0,0072 adalah …', o: ['7,2 × 10^-3', '72 × 10^-4', '7,2 × 10^3', '0,72 × 10^-2'], a: 0, why: '0,0072 = 7,2/1000 = 7,2 × 10^-3; koefisien harus di antara 1 dan 10.' },
  { q: 'Jarak sebuah bintang 4,5 × 10^5 km bila ditulis biasa adalah …', o: ['45.000 km', '450.000 km', '4.500.000 km', '45.000.000 km'], a: 1, why: '4,5 × 10^5 = 4,5 × 100.000 = 450.000 km.' }
];
let quizAnswered = 0;
function renderQuizHistory() {
  const list = berpangkatHistory();
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
  saveHistory({ tanggal: new Date().toISOString(), materi: 'Bilangan Berpangkat dan Bentuk Akar (B.5–B.7)', skor: skor, total: QUIZ_P.length, persen: persen });
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

  const powBtn = document.getElementById('powBtn'); if (powBtn) powBtn.addEventListener('click', runPow);
  const rootBtn = document.getElementById('rootBtn'); if (rootBtn) rootBtn.addEventListener('click', runRoot);
  const sciBtn = document.getElementById('sciBtn'); if (sciBtn) sciBtn.addEventListener('click', runSci);
  const sciBackBtn = document.getElementById('sciBackBtn'); if (sciBackBtn) sciBackBtn.addEventListener('click', runSciBack);
  if (document.getElementById('practiceQ')) {
    newPractice();
    document.getElementById('newPracticeBtn').addEventListener('click', newPractice);
    document.getElementById('checkPracticeBtn').addEventListener('click', checkPractice);
  }
  renderQuiz();
  renderQuizHistory();
  const fin = document.getElementById('finishQuiz'); if (fin) fin.addEventListener('click', finishQuiz);
  const refl = document.getElementById('refleksiBerpangkat');
  if (refl) {
    refl.value = localStorage.getItem('mpi_refleksi_berpangkat') || '';
    refl.addEventListener('input', function () { localStorage.setItem('mpi_refleksi_berpangkat', refl.value); });
  }
});
