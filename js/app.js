// ==============================
// CSE Department Dashboard
// app.js
// ==============================

window.addEventListener('DOMContentLoaded', () => {
  console.log('Welcome to CSE Department Dashboard');
  updateClock();
  drawCharts();
});

// ------------------------------
// Live Date & Time
// ------------------------------

function updateClock() {
  const clock = document.getElementById('clock');

  if (!clock) return;

  const now = new Date();
  clock.textContent = now.toLocaleDateString() + ' | ' + now.toLocaleTimeString();
}

setInterval(updateClock, 1000);



// ------------------------------
// Search Dashboard Notices
// ------------------------------

function searchDashboard() {
  const input = document.getElementById('dashboardSearch');
  const table = document.getElementById('noticeTable');
  if (!input || !table) return;

  const filter = input.value.toUpperCase();
  const rows = table.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i += 1) {
    const cells = rows[i].getElementsByTagName('td');
    if (!cells.length) continue;

    const rowText = Array.from(cells)
      .map(cell => cell.textContent || '')
      .join(' ')
      .toUpperCase();

    rows[i].style.display = rowText.indexOf(filter) > -1 ? '' : 'none';
  }
}

// ------------------------------
// Search Students / Faculty
// ------------------------------

function searchStudent() {
  const input = document.getElementById('searchInput');
  const table = document.getElementById('studentTable');
  if (!input || !table) return;

  const filter = input.value.trim().toUpperCase();
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const cells = row.getElementsByTagName('td');
    if (cells.length < 2) return;

    const regNo = cells[0].textContent || '';
    const name = cells[1].textContent || '';
    const dept = cells[2] ? (cells[2].textContent || '') : '';
    const status = cells[5] ? (cells[5].textContent || '') : '';

    const combinedText = `${regNo} ${name} ${dept} ${status}`.toUpperCase();

    if (combinedText.indexOf(filter) > -1) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// ------------------------------
// Notification Toast
// ------------------------------

let toastTimeout = null;

function showNotification(message) {
  let toast = document.getElementById('dashboard-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dashboard-toast';
    toast.className = 'dashboard-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2800);
}

// ------------------------------
// Chart Drawing
// ------------------------------

function drawCharts() {
  drawEnrollmentChart();
  drawAttendanceChart();
}

function drawEnrollmentChart() {
  const canvas = document.getElementById('enrollmentChart');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const data = [46, 54, 62, 58, 69, 77];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const width = canvas.width;
  const height = canvas.height;
  const padding = 38;
  const max = Math.max(...data) + 10;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#e9d5ff';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(124, 58, 237, 0.16)';

  for (let i = 0; i < 5; i += 1) {
    const y = padding + ((height - padding * 2) / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  const stepX = (width - padding * 2) / (data.length - 1);
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - (data[0] / max) * (height - padding * 2));
  for (let i = 1; i < data.length; i += 1) {
    const x = padding + stepX * i;
    const y = height - padding - (data[i] / max) * (height - padding * 2);
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = 'rgba(124, 58, 237, 0.1)';
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  for (let i = 0; i < data.length; i += 1) {
    const x = padding + stepX * i;
    const y = height - padding - (data[i] / max) * (height - padding * 2);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width - padding, height - padding);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#7c3aed';
  data.forEach((value, i) => {
    const x = padding + stepX * i;
    const y = height - padding - (value / max) * (height - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(labels[i], x - 10, height - padding + 22);
  });
}

function drawAttendanceChart() {
  const canvas = document.getElementById('attendanceChart');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const segments = [68, 23, 9];
  const colors = ['#7c3aed', '#fbbf24', '#c084fc'];
  const labels = ['Present', 'Absent', 'Late'];
  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.min(width, height) / 3;
  const centerX = width / 2;
  const centerY = height / 2.2;
  let startAngle = -0.5 * Math.PI;

  ctx.clearRect(0, 0, width, height);
  segments.forEach((value, index) => {
    const slice = (value / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    startAngle += slice;
  });

  let legendY = centerY + radius + 22;
  labels.forEach((label, index) => {
    ctx.fillStyle = colors[index];
    ctx.fillRect(centerX - radius, legendY + index * 20, 12, 12);
    ctx.fillStyle = varColor('#1f2d3d');
    ctx.font = '13px Arial';
    ctx.fillText(`${label} ${segments[index]}%`, centerX - radius + 20, legendY + 12 + index * 20);
  });
}

function varColor(defaultColor) {
  if (window.getComputedStyle(document.body).getPropertyValue('--text')) {
    return window.getComputedStyle(document.body).getPropertyValue('--text').trim() || defaultColor;
  }
  return defaultColor;
}

// ------------------------------
// Student Detail Modal Utilities
// ------------------------------

function openStudentModal(row) {
  const modal = document.getElementById('studentModal');
  if (!modal) return;

  // Set detail elements
  document.getElementById('detail-photo').src = row.getAttribute('data-photo') || '';
  document.getElementById('detail-name').textContent = row.getAttribute('data-name') || 'N/A';
  document.getElementById('detail-reg').textContent = row.getAttribute('data-reg') || 'N/A';
  document.getElementById('detail-dept').textContent = row.getAttribute('data-dept') || 'N/A';
  document.getElementById('detail-year').textContent = row.getAttribute('data-year') || 'N/A';
  document.getElementById('detail-sem').textContent = row.getAttribute('data-sem') || 'N/A';
  document.getElementById('detail-cgpa').textContent = row.getAttribute('data-cgpa') || 'N/A';
  document.getElementById('detail-attendance').textContent = row.getAttribute('data-attendance') || 'N/A';
  document.getElementById('detail-phone').textContent = row.getAttribute('data-phone') || 'N/A';
  document.getElementById('detail-email').textContent = row.getAttribute('data-email') || 'N/A';

  // Show modal
  modal.classList.add('active');
}

function closeStudentModal(event) {
  const modal = document.getElementById('studentModal');
  if (!modal) return;
  modal.classList.remove('active');
}
// Allow closing with Escape key globally
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeStudentModal();
  }
});
    
// ============================
// FACULTY PAGE
// ============================

document.addEventListener("DOMContentLoaded", function () {

    const addBtn = document.getElementById("addFacultyBtn");
    const table = document.querySelector("#facultyTable tbody");

    if (!addBtn || !table) return;

    addBtn.addEventListener("click", function () {

        let id = prompt("Faculty ID");
        if (!id) return;

        let name = prompt("Faculty Name");
        if (!name) return;

        let designation = prompt("Designation");
        if (!designation) return;

        let dept = prompt("Department");
        if (!dept) return;

        let subject = prompt("Subject");
        if (!subject) return;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${designation}</td>
            <td>${dept}</td>
            <td>${subject}</td>
            <td><span class="status active">Active</span></td>
            <td>
                <button class="edit-btn">✏ Edit</button>
                <button class="delete-btn">🗑 Delete</button>
            </td>
        `;

        table.appendChild(row);
    });

    table.addEventListener("click", function (e) {

        if (e.target.classList.contains("delete-btn")) {

            if (confirm("Delete this faculty?")) {

                e.target.closest("tr").remove();

            }

        }

        if (e.target.classList.contains("edit-btn")) {

            const row = e.target.closest("tr");

            row.cells[0].innerText = prompt("Faculty ID", row.cells[0].innerText);
            row.cells[1].innerText = prompt("Faculty Name", row.cells[1].innerText);
            row.cells[2].innerText = prompt("Designation", row.cells[2].innerText);
            row.cells[3].innerText = prompt("Department", row.cells[3].innerText);
            row.cells[4].innerText = prompt("Subject", row.cells[4].innerText);

        }

    });

});