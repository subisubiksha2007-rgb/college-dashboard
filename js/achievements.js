const STORAGE_KEY = 'cse-achievements-module';
const defaultAchievements = [
  {
    id: 1,
    title: 'National Coding Championship Winner',
    name: 'Aarav Sharma',
    category: 'Technical',
    awardLevel: 'National',
    date: '2026-03-15',
    status: 'Completed',
    description: 'Secured first prize in the national-level coding championship held at IIT Delhi.'
  },
  {
    id: 2,
    title: 'State Football Tournament Runner-Up',
    name: 'Karthik Rao',
    category: 'Sports',
    awardLevel: 'State Level',
    date: '2026-02-20',
    status: 'Completed',
    description: 'Contributed as the team captain and reached the finals of the state football tournament.'
  },
  {
    id: 3,
    title: 'Best Paper Presentation Award',
    name: 'Meera Nair',
    category: 'Academic',
    awardLevel: 'International',
    date: '2026-04-10',
    status: 'Completed',
    description: 'Presented an innovative research paper and received the best presentation accolade.'
  },
  {
    id: 4,
    title: 'Faculty Innovation Grant',
    name: 'Dr. Suresh Kumar',
    category: 'Faculty',
    awardLevel: 'National',
    date: '2026-05-01',
    status: 'Upcoming',
    description: 'Selected for the faculty innovation grant for upcoming research initiatives.'
  }
];

let achievements = [];
let editingId = null;

const state = {
  search: '',
  category: 'All'
};

function loadAchievements() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      achievements = defaultAchievements;
      saveAchievements();
      return;
    }
    const parsed = JSON.parse(stored);
    achievements = Array.isArray(parsed) && parsed.length ? parsed : defaultAchievements;
  } catch (error) {
    achievements = defaultAchievements;
  }
}

function saveAchievements() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
}

function getFilteredAchievements() {
  return achievements.filter((item) => {
    const matchesSearch = `${item.title} ${item.name} ${item.category}`.toLowerCase().includes(state.search.toLowerCase());
    const matchesCategory = state.category === 'All' || item.category === state.category;
    return matchesSearch && matchesCategory;
  });
}

function renderSummary() {
  document.getElementById('totalCount').textContent = achievements.length;
  document.getElementById('academicCount').textContent = achievements.filter((item) => item.category === 'Academic').length;
  document.getElementById('sportsCount').textContent = achievements.filter((item) => item.category === 'Sports').length;
  document.getElementById('facultyCount').textContent = achievements.filter((item) => item.category === 'Faculty').length;
}

function renderTable() {
  const tableBody = document.getElementById('achievementTableBody');
  const filtered = getFilteredAchievements();

  if (!filtered.length) {
    tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No achievements match the current filters.</td></tr>';
    return;
  }

  tableBody.innerHTML = filtered.map((item) => `
    <tr>
      <td>${item.title}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.awardLevel}</td>
      <td>${item.date}</td>
      <td><span class="status-pill ${item.status === 'Completed' ? 'status-completed' : 'status-upcoming'}">${item.status}</span></td>
      <td>
        <button class="action-btn edit" data-id="${item.id}" type="button"><i class="fas fa-edit"></i> Edit</button>
        <button class="action-btn delete" data-id="${item.id}" type="button"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

function openModal() {
  document.getElementById('achievementModal').classList.add('show');
}

function closeModal() {
  document.getElementById('achievementModal').classList.remove('show');
  document.getElementById('achievementForm').reset();
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add Achievement';
}

function populateForm(achievement) {
  document.getElementById('modalTitle').textContent = 'Edit Achievement';
  document.getElementById('title').value = achievement.title;
  document.getElementById('name').value = achievement.name;
  document.getElementById('category').value = achievement.category;
  document.getElementById('awardLevel').value = achievement.awardLevel;
  document.getElementById('date').value = achievement.date;
  document.getElementById('status').value = achievement.status;
  document.getElementById('description').value = achievement.description;
}

function validateForm(formData) {
  const requiredFields = ['title', 'name', 'category', 'awardLevel', 'date', 'status', 'description'];
  return requiredFields.every((field) => formData[field].trim() !== '');
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = {
    title: formData.get('title').toString().trim(),
    name: formData.get('name').toString().trim(),
    category: formData.get('category').toString().trim(),
    awardLevel: formData.get('awardLevel').toString().trim(),
    date: formData.get('date').toString().trim(),
    status: formData.get('status').toString().trim(),
    description: formData.get('description').toString().trim()
  };

  if (!validateForm(data)) {
    alert('Please fill in all fields before saving.');
    return;
  }

  if (editingId) {
    achievements = achievements.map((item) => item.id === editingId ? { ...item, ...data } : item);
  } else {
    const newAchievement = {
      id: Date.now(),
      ...data
    };
    achievements.unshift(newAchievement);
  }

  saveAchievements();
  render();
  closeModal();
}

function handleTableClick(event) {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const id = Number(button.getAttribute('data-id'));
  const achievement = achievements.find((item) => item.id === id);
  if (!achievement) return;

  if (button.classList.contains('delete')) {
    const confirmed = window.confirm(`Delete achievement "${achievement.title}"?`);
    if (!confirmed) return;
    achievements = achievements.filter((item) => item.id !== id);
    saveAchievements();
    render();
    return;
  }

  editingId = id;
  populateForm(achievement);
  openModal();
}

function attachEvents() {
  document.getElementById('addAchievementBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add Achievement';
    document.getElementById('achievementForm').reset();
    editingId = null;
    openModal();
  });

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  document.getElementById('achievementForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('achievementModal').addEventListener('click', (event) => {
    if (event.target.id === 'achievementModal') {
      closeModal();
    }
  });

  document.getElementById('searchInput').addEventListener('input', (event) => {
    state.search = event.target.value;
    renderTable();
  });

  document.getElementById('categoryFilter').addEventListener('change', (event) => {
    state.category = event.target.value;
    renderTable();
  });

  document.getElementById('achievementTableBody').addEventListener('click', handleTableClick);
}

function render() {
  renderSummary();
  renderTable();
}

function init() {
  loadAchievements();
  attachEvents();
  render();
}

document.addEventListener('DOMContentLoaded', init);
