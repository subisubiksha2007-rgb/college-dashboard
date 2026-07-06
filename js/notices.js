const STORAGE_KEY = 'cse-notices-module';

const defaultNotices = [
  {
    id: 1,
    noticeTitle: 'Internal Exam Schedule',
    department: 'Computer Science & Engineering',
    priority: 'High',
    publishedDate: '2026-06-18',
    expiryDate: '2026-06-30',
    status: 'Active',
    description: 'Internal exams for all 2nd, 3rd, and 4th year students will begin next week.'
  },
  {
    id: 2,
    noticeTitle: 'Placement Drive Announcement',
    department: 'Training & Placement',
    priority: 'High',
    publishedDate: '2026-06-20',
    expiryDate: '2026-07-10',
    status: 'Active',
    description: 'A campus placement drive has been scheduled for final-year students.'
  },
  {
    id: 3,
    noticeTitle: 'Hackathon Registration',
    department: 'Innovation Cell',
    priority: 'Medium',
    publishedDate: '2026-06-25',
    expiryDate: '2026-07-15',
    status: 'Active',
    description: 'Teams can register for the inter-college hackathon through the portal.'
  },
  {
    id: 4,
    noticeTitle: 'Semester Fee Payment',
    department: 'Accounts Office',
    priority: 'High',
    publishedDate: '2026-07-01',
    expiryDate: '2026-07-20',
    status: 'Scheduled',
    description: 'Semester fee payment deadline has been extended for all students.'
  },
  {
    id: 5,
    noticeTitle: 'NSS Camp Registration',
    department: 'National Service Scheme',
    priority: 'Medium',
    publishedDate: '2026-07-05',
    expiryDate: '2026-07-25',
    status: 'Scheduled',
    description: 'Student volunteers can enroll for the upcoming NSS camp.'
  },
  {
    id: 6,
    noticeTitle: 'Sports Meet',
    department: 'Physical Education',
    priority: 'Low',
    publishedDate: '2026-07-10',
    expiryDate: '2026-08-01',
    status: 'Scheduled',
    description: 'The annual sports meet will be hosted at the college grounds.'
  },
  {
    id: 7,
    noticeTitle: 'Symposium Registration',
    department: 'Research & Development',
    priority: 'Medium',
    publishedDate: '2026-06-01',
    expiryDate: '2026-06-15',
    status: 'Expired',
    description: 'Registration for the technical symposium has closed successfully.'
  }
];

let notices = [];
let editingId = null;

const state = {
  search: '',
  priority: 'All',
  status: 'All'
};

function loadNotices() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      notices = defaultNotices;
      saveNotices();
      return;
    }
    const parsed = JSON.parse(stored);
    notices = Array.isArray(parsed) && parsed.length ? parsed : defaultNotices;
  } catch (error) {
    notices = defaultNotices;
  }
}

function saveNotices() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
}

function getFilteredNotices() {
  return notices.filter((item) => {
    const matchesSearch = `${item.noticeTitle} ${item.department} ${item.description}`.toLowerCase().includes(state.search.toLowerCase());
    const matchesPriority = state.priority === 'All' || item.priority === state.priority;
    const matchesStatus = state.status === 'All' || item.status === state.status;
    return matchesSearch && matchesPriority && matchesStatus;
  });
}

function renderSummary() {
  document.getElementById('totalCount').textContent = notices.length;
  document.getElementById('activeCount').textContent = notices.filter((item) => item.status === 'Active').length;
  document.getElementById('expiredCount').textContent = notices.filter((item) => item.status === 'Expired').length;
  document.getElementById('highPriorityCount').textContent = notices.filter((item) => item.priority === 'High').length;
}

function renderTable() {
  const tableBody = document.getElementById('noticeTableBody');
  const filtered = getFilteredNotices();

  if (!filtered.length) {
    tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No notices match the current filters.</td></tr>';
    return;
  }

  tableBody.innerHTML = filtered.map((item) => `
    <tr>
      <td>${item.noticeTitle}</td>
      <td>${item.department}</td>
      <td><span class="priority-pill ${item.priority === 'High' ? 'priority-high' : item.priority === 'Medium' ? 'priority-medium' : 'priority-low'}">${item.priority}</span></td>
      <td>${item.publishedDate}</td>
      <td>${item.expiryDate}</td>
      <td><span class="status-pill ${item.status === 'Active' ? 'status-active' : item.status === 'Scheduled' ? 'status-scheduled' : 'status-expired'}">${item.status}</span></td>
      <td>
        <button class="action-btn edit" data-id="${item.id}" type="button"><i class="fas fa-edit"></i> Edit</button>
        <button class="action-btn delete" data-id="${item.id}" type="button"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

function openModal() {
  document.getElementById('noticeModal').classList.add('show');
}

function closeModal() {
  document.getElementById('noticeModal').classList.remove('show');
  document.getElementById('noticeForm').reset();
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add Notice';
}

function populateForm(notice) {
  document.getElementById('modalTitle').textContent = 'Edit Notice';
  document.getElementById('noticeTitle').value = notice.noticeTitle;
  document.getElementById('department').value = notice.department;
  document.getElementById('priority').value = notice.priority;
  document.getElementById('publishedDate').value = notice.publishedDate;
  document.getElementById('expiryDate').value = notice.expiryDate;
  document.getElementById('status').value = notice.status;
  document.getElementById('description').value = notice.description;
}

function validateForm(data) {
  return Object.values(data).every((value) => value !== '');
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    noticeTitle: formData.get('noticeTitle').toString().trim(),
    department: formData.get('department').toString().trim(),
    priority: formData.get('priority').toString().trim(),
    publishedDate: formData.get('publishedDate').toString().trim(),
    expiryDate: formData.get('expiryDate').toString().trim(),
    status: formData.get('status').toString().trim(),
    description: formData.get('description').toString().trim()
  };

  if (!validateForm(data)) {
    alert('Please fill in all fields before saving.');
    return;
  }

  if (editingId) {
    notices = notices.map((item) => item.id === editingId ? { ...item, ...data } : item);
  } else {
    notices.unshift({
      id: Date.now(),
      ...data
    });
  }

  saveNotices();
  render();
  closeModal();
}

function handleTableClick(event) {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const id = Number(button.getAttribute('data-id'));
  const notice = notices.find((item) => item.id === id);
  if (!notice) return;

  if (button.classList.contains('delete')) {
    const confirmed = window.confirm(`Delete notice "${notice.noticeTitle}"?`);
    if (!confirmed) return;
    notices = notices.filter((item) => item.id !== id);
    saveNotices();
    render();
    return;
  }

  editingId = id;
  populateForm(notice);
  openModal();
}

function attachEvents() {
  document.getElementById('addNoticeBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add Notice';
    document.getElementById('noticeForm').reset();
    editingId = null;
    openModal();
  });

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  document.getElementById('noticeForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('noticeModal').addEventListener('click', (event) => {
    if (event.target.id === 'noticeModal') {
      closeModal();
    }
  });

  document.getElementById('searchInput').addEventListener('input', (event) => {
    state.search = event.target.value;
    renderTable();
  });

  document.getElementById('priorityFilter').addEventListener('change', (event) => {
    state.priority = event.target.value;
    renderTable();
  });

  document.getElementById('statusFilter').addEventListener('change', (event) => {
    state.status = event.target.value;
    renderTable();
  });

  document.getElementById('noticeTableBody').addEventListener('click', handleTableClick);
}

function render() {
  renderSummary();
  renderTable();
}

function init() {
  loadNotices();
  attachEvents();
  render();
}

document.addEventListener('DOMContentLoaded', init);
