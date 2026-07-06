const STORAGE_KEY = 'cse-events-module';

const defaultEvents = [
  {
    id: 1,
    eventName: 'National Level Hackathon',
    category: 'Hackathon',
    venue: 'Innovation Lab',
    organizer: 'Placement Cell',
    coordinator: 'Dr. Anitha',
    eventDate: '2026-08-02',
    startTime: '09:00',
    endTime: '17:00',
    participants: 180,
    status: 'Upcoming',
    description: 'A national-level hackathon bringing together top student teams from across the region.'
  },
  {
    id: 2,
    eventName: 'AI Workshop',
    category: 'Workshop',
    venue: 'CSE Lab 1',
    organizer: 'Department of CSE',
    coordinator: 'Ms. Priya',
    eventDate: '2026-07-10',
    startTime: '10:00',
    endTime: '13:00',
    participants: 120,
    status: 'Upcoming',
    description: 'A hands-on workshop on machine learning and AI tools for student development.'
  },
  {
    id: 3,
    eventName: 'Placement Training Program',
    category: 'Seminar',
    venue: 'Seminar Hall',
    organizer: 'Training & Placement',
    coordinator: 'Mr. Rohit',
    eventDate: '2026-06-18',
    startTime: '11:00',
    endTime: '14:00',
    participants: 200,
    status: 'Completed',
    description: 'Career readiness and aptitude training session for final-year students.'
  },
  {
    id: 4,
    eventName: 'Project Expo',
    category: 'Technical',
    venue: 'Conference Hall',
    organizer: 'Project Coordinators',
    coordinator: 'Dr. Kumar',
    eventDate: '2026-08-18',
    startTime: '09:30',
    endTime: '16:00',
    participants: 140,
    status: 'Upcoming',
    description: 'A showcase of innovative student projects and prototypes.'
  },
  {
    id: 5,
    eventName: 'Technical Symposium',
    category: 'Conference',
    venue: 'Main Auditorium',
    organizer: 'CSE Department',
    coordinator: 'Prof. Lakshmi',
    eventDate: '2026-09-15',
    startTime: '09:00',
    endTime: '17:00',
    participants: 250,
    status: 'Upcoming',
    description: 'An interdisciplinary symposium featuring expert talks and research showcases.'
  },
  {
    id: 6,
    eventName: 'Cultural Fest',
    category: 'Cultural',
    venue: 'College Ground',
    organizer: 'Student Council',
    coordinator: 'Ms. Kavya',
    eventDate: '2026-10-20',
    startTime: '10:00',
    endTime: '20:00',
    participants: 300,
    status: 'Upcoming',
    description: 'A vibrant cultural celebration with music, dance, and performances.'
  }
];

let events = [];
let editingId = null;

const state = {
  search: '',
  category: 'All',
  status: 'All'
};

function loadEvents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      events = defaultEvents;
      saveEvents();
      return;
    }
    const parsed = JSON.parse(stored);
    events = Array.isArray(parsed) && parsed.length ? parsed : defaultEvents;
  } catch (error) {
    events = defaultEvents;
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function getFilteredEvents() {
  return events.filter((item) => {
    const matchesSearch = `${item.eventName} ${item.category} ${item.venue} ${item.organizer}`.toLowerCase().includes(state.search.toLowerCase());
    const matchesCategory = state.category === 'All' || item.category === state.category;
    const matchesStatus = state.status === 'All' || item.status === state.status;
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function renderSummary() {
  document.getElementById('totalCount').textContent = events.length;
  document.getElementById('upcomingCount').textContent = events.filter((item) => item.status === 'Upcoming').length;
  document.getElementById('completedCount').textContent = events.filter((item) => item.status === 'Completed').length;
  document.getElementById('workshopCount').textContent = events.filter((item) => item.category === 'Workshop' || item.category === 'Seminar').length;
}

function renderTable() {
  const tableBody = document.getElementById('eventTableBody');
  const filtered = getFilteredEvents();

  if (!filtered.length) {
    tableBody.innerHTML = '<tr><td colspan="10" class="empty-state">No events match the current filters.</td></tr>';
    return;
  }

  tableBody.innerHTML = filtered.map((item) => `
    <tr>
      <td>${item.eventName}</td>
      <td>${item.category}</td>
      <td>${item.venue}</td>
      <td>${item.organizer}</td>
      <td>${item.eventDate}</td>
      <td>${item.startTime}</td>
      <td>${item.endTime}</td>
      <td><span class="status-pill ${item.status === 'Completed' ? 'status-completed' : item.status === 'Cancelled' ? 'status-cancelled' : 'status-upcoming'}">${item.status}</span></td>
      <td>${item.participants}</td>
      <td>
        <button class="action-btn edit" data-id="${item.id}" type="button"><i class="fas fa-edit"></i> Edit</button>
        <button class="action-btn delete" data-id="${item.id}" type="button"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

function openModal() {
  document.getElementById('eventModal').classList.add('show');
}

function closeModal() {
  document.getElementById('eventModal').classList.remove('show');
  document.getElementById('eventForm').reset();
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add Event';
}

function populateForm(eventItem) {
  document.getElementById('modalTitle').textContent = 'Edit Event';
  document.getElementById('eventName').value = eventItem.eventName;
  document.getElementById('category').value = eventItem.category;
  document.getElementById('venue').value = eventItem.venue;
  document.getElementById('organizer').value = eventItem.organizer;
  document.getElementById('coordinator').value = eventItem.coordinator;
  document.getElementById('eventDate').value = eventItem.eventDate;
  document.getElementById('startTime').value = eventItem.startTime;
  document.getElementById('endTime').value = eventItem.endTime;
  document.getElementById('participants').value = eventItem.participants;
  document.getElementById('status').value = eventItem.status;
  document.getElementById('description').value = eventItem.description;
}

function validateForm(data) {
  return Object.values(data).every((value) => value !== '');
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    eventName: formData.get('eventName').toString().trim(),
    category: formData.get('category').toString().trim(),
    venue: formData.get('venue').toString().trim(),
    organizer: formData.get('organizer').toString().trim(),
    coordinator: formData.get('coordinator').toString().trim(),
    eventDate: formData.get('eventDate').toString().trim(),
    startTime: formData.get('startTime').toString().trim(),
    endTime: formData.get('endTime').toString().trim(),
    participants: formData.get('participants').toString().trim(),
    status: formData.get('status').toString().trim(),
    description: formData.get('description').toString().trim()
  };

  if (!validateForm(data)) {
    alert('Please fill in all fields before saving.');
    return;
  }

  if (editingId) {
    events = events.map((item) => item.id === editingId ? { ...item, ...data, participants: Number(data.participants) } : item);
  } else {
    events.unshift({
      id: Date.now(),
      ...data,
      participants: Number(data.participants)
    });
  }

  saveEvents();
  render();
  closeModal();
}

function handleTableClick(event) {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const id = Number(button.getAttribute('data-id'));
  const eventItem = events.find((item) => item.id === id);
  if (!eventItem) return;

  if (button.classList.contains('delete')) {
    const confirmed = window.confirm(`Delete event "${eventItem.eventName}"?`);
    if (!confirmed) return;
    events = events.filter((item) => item.id !== id);
    saveEvents();
    render();
    return;
  }

  editingId = id;
  populateForm(eventItem);
  openModal();
}

function attachEvents() {
  document.getElementById('addEventBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add Event';
    document.getElementById('eventForm').reset();
    editingId = null;
    openModal();
  });

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  document.getElementById('eventForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('eventModal').addEventListener('click', (event) => {
    if (event.target.id === 'eventModal') {
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

  document.getElementById('statusFilter').addEventListener('change', (event) => {
    state.status = event.target.value;
    renderTable();
  });

  document.getElementById('eventTableBody').addEventListener('click', handleTableClick);
}

function render() {
  renderSummary();
  renderTable();
}

function init() {
  loadEvents();
  attachEvents();
  render();
}

document.addEventListener('DOMContentLoaded', init);
