// MPI Matematika — prototipe statis untuk GitHub Pages.
// Semua progres disimpan di browser siswa (localStorage). Tidak ada server,
// tidak ada akun, dan tidak ada data yang dikirim ke pihak lain.
const HISTORY_KEY = 'mpi_history_v1';
const MODE_KEY = 'mpi_mode_v1';
const NAME_KEY = 'mpi_nama_v1';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch (e) { return []; }
}
function saveHistory(entry) {
  const list = getHistory();
  list.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  return list;
}
function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch (e) { return iso; }
}
function bilanganHistory() {
  return getHistory().filter(function (h) { return h.materi.indexOf('Bilangan Bulat') === 0; });
}

// ---------- Mode siswa / guru dan nama ----------
function applyMode(mode) {
  document.body.dataset.mode = mode;
  localStorage.setItem(MODE_KEY, mode);
  document.querySelectorAll('[data-mode-btn]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.modeBtn === mode));
    b.classList.toggle('amber', b.dataset.modeBtn === mode);
  });
}
function renderDashboard() {
  const list = bilanganHistory();
  const best = list.length ? Math.max.apply(null, list.map(function (h) { return h.persen; })) : 0;
  const last = list[0];
  const set = function (id, value) { const el = document.getElementById(id); if (el) el.textContent = value; };
  set('dashBest', list.length ? best + '%' : '—');
  set('dashAttempts', String(list.length));
  set('dashLast', last ? fmtDate(last.tanggal) : 'Belum ada kuis');
  set('dashStatus', best >= 70 ? 'Tuntas (target latihan 70%)' : (list.length ? 'Belum tuntas, terus berlatih' : 'Belum mulai kuis'));
  set('dashProgress', best + '%');
  const bar = document.getElementById('dashBar'); if (bar) bar.style.width = best + '%';
  const hist = document.getElementById('historyList');
  if (hist) {
    hist.innerHTML = list.length ? list.slice(0, 10).map(function (h) {
      return '<tr><td>' + fmtDate(h.tanggal) + '</td><td>' + h.materi + '</td><td>' + h.skor + '/' + h.total + '</td><td>' + h.persen + '%</td></tr>';
    }).join('') : '<tr><td colspan="4">Belum ada riwayat. Kerjakan kuis di halaman Bilangan Bulat.</td></tr>';
  }
  const qh = document.getElementById('quizHistory');
  if (qh) qh.innerHTML = list.length ? '<p>Skor terbaik: <strong>' + best + '%</strong> dari ' + list.length + ' percobaan. Terakhir: ' + fmtDate(last.tanggal) + '.</p>' : '<p>Belum ada riwayat kuis untuk materi ini.</p>';
  const nama = localStorage.getItem(NAME_KEY) || '';
  const halo = document.getElementById('haloText'); if (halo) halo.textContent = nama ? 'Halo, ' + nama + '!' : 'Halo!';
}
function exportHistory() {
  const data = getHistory();
  if (!data.length) { alert('Belum ada riwayat untuk diekspor.'); return; }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'riwayat-belajar-mpi.json'; a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- Simulasi garis bilangan ----------
function renderNumberLine(value) {
  const box = document.getElementById('numberLine'); if (!box) return;
  const min = -12, max = 12;
  let html = '';
  for (let n = min; n <= max; n++) {
    const left = ((n - min) / (max - min)) * 100;
    html += '<div class="tick" style="left:' + left + '%"><i></i>' + n + '</div>';
  }
  const left = ((value - min) / (max - min)) * 100;
  html += '<div class="marker" style="left:' + left + '%">▲<br><strong>' + value + '</strong></div>';
  box.innerHTML = html;
}
function runSimulator() {
  const a = parseInt(document.getElementById('simA').value, 10) || 0;
  const op = document.getElementById('simOp').value;
  const b = parseInt(document.getElementById('simB').value, 10) || 0;
  const hasil = op === '+' ? a + b : a - b;
  let arah = '';
  if (op === '+') arah = b >= 0 ? 'ke kanan sejauh ' + Math.abs(b) + ' langkah' : 'ke kiri sejauh ' + Math.abs(b) + ' langkah';
  else arah = b >= 0 ? 'berbalik arah lalu ke kiri sejauh ' + Math.abs(b) + ' langkah' : 'berbalik arah lalu ke kanan sejauh ' + Math.abs(b) + ' langkah';
  renderNumberLine(hasil);
  const out = document.getElementById('simResult');
  if (out) out.innerHTML = '<strong>' + a + ' ' + op + ' (' + b + ') = ' + hasil + '</strong><br>Dari ' + a + ', bergerak ' + arah + ' dan berhenti di ' + hasil + '.';
}

// ---------- Latihan bebas (tidak masuk riwayat) ----------
let practiceAnswer = null;
function newPractice() {
  const jenis = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];
  let a, b, ans, why;
  if (jenis === '+') { a = rnd(-20, 20); b = rnd(-20, 20); ans = a + b; why = a + ' + (' + b + ') = ' + ans + '.'; }
  else if (jenis === '-') { a = rnd(-20, 20); b = rnd(-20, 20); ans = a - b; why = a + ' − (' + b + ') = ' + ans + '.'; }
  else if (jenis === '×') { a = rnd(-12, 12); b = rnd(-12, 12); ans = a * b; why = '(' + a + ') × (' + b + ') = ' + ans + '. Ingat: tanda sama hasilnya positif, tanda berbeda hasilnya negatif.'; }
  else { b = rnd(-12, 12) || 3; ans = rnd(-12, 12); a = ans * b; why = '(' + a + ') ÷ (' + b + ') = ' + ans + ' karena ' + ans + ' × (' + b + ') = ' + a + '.'; }
  practiceAnswer = ans;
  const q = document.getElementById('practiceQ'); if (q) q.textContent = a + ' ' + jenis + ' (' + b + ') = ?';
  const f = document.getElementById('practiceFeedback'); if (f) f.innerHTML = '';
  const inp = document.getElementById('practiceAns'); if (inp) inp.value = '';
  document.getElementById('practiceWhy').textContent = why;
}
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function checkPractice() {
  const v = parseInt(document.getElementById('practiceAns').value, 10);
  const f = document.getElementById('practiceFeedback');
  if (isNaN(v)) { f.innerHTML = '<div class="feedback bad">Tulis dulu jawabanmu.</div>'; return; }
  if (v === practiceAnswer) f.innerHTML = '<div class="feedback good">Benar! ' + document.getElementById('practiceWhy').textContent + '</div>';
  else f.innerHTML = '<div class="feedback bad">Belum tepat. Coba hitung lagi tanda dan langkahnya. Pembahasan: ' + document.getElementById('practiceWhy').textContent + '</div>';
}

// ---------- Kuis formatif B.1–B.2 (10 soal) ----------
const QUIZ = [
  { q: 'Bandingkan −7 dan −3. Tanda yang tepat adalah …', o: ['−7 > −3', '−7 < −3', '−7 = −3', '−7 ≥ −3'], a: 1, why: 'Pada garis bilangan, −7 terletak di kiri −3, jadi −7 lebih kecil dari −3.' },
  { q: 'Urutkan dari yang terkecil: 3, −5, 0, −2.', o: ['−5, −2, 0, 3', '3, 0, −2, −5', '−2, −5, 0, 3', '0, −2, −5, 3'], a: 0, why: 'Semakin ke kiri pada garis bilangan, nilainya semakin kecil.' },
  { q: 'Hasil dari −8 + 5 adalah …', o: ['−13', '−3', '3', '13'], a: 1, why: '−8 + 5 = −(8 − 5) = −3.' },
  { q: 'Hasil dari 6 − (−4) adalah …', o: ['2', '−10', '10', '−2'], a: 2, why: 'Mengurangi bilangan negatif sama dengan menambah lawannya: 6 − (−4) = 6 + 4 = 10.' },
  { q: 'Hasil dari −7 × 4 adalah …', o: ['28', '−28', '−11', '11'], a: 1, why: 'Tanda berbeda hasilnya negatif: 7 × 4 = 28, jadi −28.' },
  { q: 'Hasil dari −48 ÷ (−6) adalah …', o: ['−8', '8', '−42', '54'], a: 1, why: 'Tanda sama hasilnya positif: 48 ÷ 6 = 8.' },
  { q: 'Hasil dari −5 + (−9) − (−4) adalah …', o: ['−18', '−10', '10', '0'], a: 1, why: '−5 + (−9) = −14, lalu −14 − (−4) = −14 + 4 = −10.' },
  { q: 'Suhu awal −2°C, lalu naik 7°C. Suhu sekarang adalah …', o: ['−9°C', '−5°C', '5°C', '9°C'], a: 2, why: '−2 + 7 = 5.' },
  { q: 'Tabungan Dita Rp75.000, lalu ia menarik Rp100.000 (saldo boleh minus). Saldo akhirnya adalah …', o: ['Rp25.000', '−Rp25.000', 'Rp175.000', '−Rp175.000'], a: 1, why: '75.000 − 100.000 = −25.000. Tanda negatif berarti ia berutang Rp25.000.' },
  { q: 'Modal usaha Rp200.000, hasil penjualan Rp175.000. Keuntungan usaha itu adalah …', o: ['Rp25.000', '−Rp25.000', 'Rp375.000', 'Rp0'], a: 1, why: '175.000 − 200.000 = −25.000, artinya rugi Rp25.000. Keuntungan negatif berarti rugi.' }
];
let quizAnswered = 0;
function renderQuiz() {
  const box = document.getElementById('quizBox'); if (!box) return;
  box.innerHTML = QUIZ.map(function (item, i) {
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
      const item = QUIZ[qi];
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
  // Soal benar = kartu yang tidak punya tombol jawaban salah yang dipilih.
  const skor = QUIZ.filter(function (item, i) { return !document.getElementById('q' + i).querySelector('.opt.wrong'); }).length;
  const persen = Math.round(skor / QUIZ.length * 100);
  saveHistory({ tanggal: new Date().toISOString(), materi: 'Bilangan Bulat (B.1–B.2)', skor: skor, total: QUIZ.length, persen: persen });
  const res = document.getElementById('quizResult');
  if (res) res.innerHTML = '<div class="feedback good"><strong>Skor kamu: ' + skor + '/10 (' + persen + '%).</strong> Riwayat ini sudah tersimpan di perangkat ini. Kamu bisa mengekspornya dari beranda untuk dikirim ke guru.</div>';
  renderDashboard();
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', function () {
  applyMode(localStorage.getItem(MODE_KEY) || 'siswa');
  document.querySelectorAll('[data-mode-btn]').forEach(function (b) {
    b.addEventListener('click', function () { applyMode(b.dataset.modeBtn); });
  });
  const namaInput = document.getElementById('namaInput');
  if (namaInput) {
    namaInput.value = localStorage.getItem(NAME_KEY) || '';
    namaInput.addEventListener('input', function () { localStorage.setItem(NAME_KEY, namaInput.value.trim()); renderDashboard(); });
  }
  document.querySelectorAll('.exportBtn').forEach(function (b) { b.addEventListener('click', exportHistory); });
  document.querySelectorAll('.clearBtn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (confirm('Hapus semua riwayat belajar di perangkat ini?')) { localStorage.removeItem(HISTORY_KEY); renderDashboard(); }
    });
  });
  document.querySelectorAll('.printBtn').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  renderDashboard();
  renderNumberLine(0);
  const simBtn = document.getElementById('simBtn'); if (simBtn) simBtn.addEventListener('click', runSimulator);
  if (document.getElementById('practiceQ')) {
    newPractice();
    document.getElementById('newPracticeBtn').addEventListener('click', newPractice);
    document.getElementById('checkPracticeBtn').addEventListener('click', checkPractice);
  }
  renderQuiz();
  const fin = document.getElementById('finishQuiz'); if (fin) fin.addEventListener('click', finishQuiz);
  const refl = document.getElementById('refleksiInput');
  if (refl) {
    refl.value = localStorage.getItem('mpi_refleksi_bilangan') || '';
    refl.addEventListener('input', function () { localStorage.setItem('mpi_refleksi_bilangan', refl.value); });
  }
});
