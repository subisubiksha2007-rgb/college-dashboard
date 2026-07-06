(function () {
  const USERS_KEY = 'cseUsers';
  const CURRENT_USER_KEY = 'cseCurrentUser';
  const STUDENT_ACCOUNTS_KEY = 'cseStudentAccounts';
  const FACULTY_ACCOUNTS_KEY = 'cseFacultyAccounts';
  const FACULTY_STORAGE_KEY = 'facultyList';
  const STUDENTS_STORAGE_KEY = 'dashboardStudents';

  const roleAccessMap = {
    admin: ['dashboard', 'students', 'faculty', 'attendance', 'courses', 'placements', 'projects', 'achievements', 'events', 'notices', 'chatbot', 'settings'],
    faculty: ['dashboard', 'attendance', 'projects', 'achievements', 'events', 'courses', 'placements', 'notices', 'chatbot'],
    student: ['dashboard', 'attendance', 'courses', 'placements', 'projects', 'achievements', 'events', 'notices', 'chatbot']
  };

  function normalizeName(value) {
    return String(value || '').trim();
  }

  function getUsers() {
    const saved = localStorage.getItem(USERS_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (error) {
      return null;
    }
  }

  function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  function getStoredStudents() {
    const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function getStoredFaculty() {
    const saved = localStorage.getItem(FACULTY_STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function buildUserFromFaculty(faculty) {
    return {
      username: normalizeName(faculty.name),
      password: String(faculty.id || faculty.employeeId || 'faculty123'),
      role: 'Faculty',
      department: normalizeName(faculty.department || 'CSE'),
      email: normalizeName(faculty.email || ''),
      phone: normalizeName(faculty.phone || ''),
      profilePicture: normalizeName(faculty.photo || ''),
      accountType: 'faculty',
      accountIdentifier: normalizeName(faculty.id || faculty.employeeId || faculty.name)
    };
  }

  function buildUserFromStudent(student) {
    return {
      username: normalizeName(student.name),
      password: String(student.reg || student.registerNo || 'student123'),
      role: 'Student',
      department: normalizeName(student.dept || 'CSE'),
      email: normalizeName(student.email || ''),
      phone: normalizeName(student.phone || ''),
      profilePicture: normalizeName(student.photo || ''),
      accountType: 'student',
      accountIdentifier: normalizeName(student.reg || student.registerNo || student.name)
    };
  }

  function createOrUpdateUser(userData) {
    const users = getUsers();
    const identifier = normalizeName(userData.accountIdentifier || userData.identifier || userData.username || '');
    const existingIndex = users.findIndex(item => {
      const sameType = item.accountType === userData.accountType;
      const sameIdentifier = identifier && normalizeName(item.accountIdentifier || item.identifier || '').toLowerCase() === identifier.toLowerCase();
      const sameUsername = !identifier && item.username && userData.username && item.username.toLowerCase() === userData.username.toLowerCase();
      return sameType && (sameIdentifier || sameUsername);
    });
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userData, accountIdentifier: identifier || users[existingIndex].accountIdentifier };
    } else {
      users.push({ ...userData, accountIdentifier: identifier });
    }
    saveUsers(users);
    return users;
  }

  function removeUserByType(type, username) {
    const users = getUsers().filter(user => !(user.accountType === type && user.username === username));
    saveUsers(users);
    return users;
  }

  function syncStudentAccounts() {
    const users = getUsers();
    const filtered = users.filter(user => user.accountType !== 'student');
    const studentAccounts = getStoredStudents().map(buildUserFromStudent);
    studentAccounts.forEach(account => filtered.push(account));
    saveUsers(filtered);
    localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(studentAccounts));
    return filtered;
  }

  function syncFacultyAccounts() {
    const users = getUsers();
    const filtered = users.filter(user => user.accountType !== 'faculty');
    const facultyAccounts = getStoredFaculty().map(buildUserFromFaculty);
    facultyAccounts.forEach(account => filtered.push(account));
    saveUsers(filtered);
    localStorage.setItem(FACULTY_ACCOUNTS_KEY, JSON.stringify(facultyAccounts));
    return filtered;
  }

  function ensureDefaultUsers() {
    const users = getUsers();
    const hasAdmin = users.some(user => normalizeName(user.username).toLowerCase() === 'admin');

    if (!hasAdmin) {
      users.push({
        username: 'admin',
        password: 'admin123',
        role: 'Admin',
        department: 'CSE',
        email: 'admin@cse.edu',
        phone: '+91 98765 43210',
        profilePicture: '',
        accountType: 'admin',
        accountIdentifier: 'admin'
      });
    }

    const upsertUser = (userData) => {
      const identifier = normalizeName(userData.accountIdentifier || userData.identifier || userData.username || '');
      const existingIndex = users.findIndex(item => {
        const sameType = item.accountType === userData.accountType;
        const sameIdentifier = identifier && normalizeName(item.accountIdentifier || item.identifier || '').toLowerCase() === identifier.toLowerCase();
        const sameUsername = !identifier && item.username && userData.username && item.username.toLowerCase() === userData.username.toLowerCase();
        return sameType && (sameIdentifier || sameUsername);
      });

      if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...userData, accountIdentifier: identifier || users[existingIndex].accountIdentifier };
      } else {
        users.push({ ...userData, accountIdentifier: identifier });
      }
    };

    const defaultFaculty = [
      { id: 'FAC001', name: 'Dr. Mageshwari', department: 'CSE', email: 'mageshwari@cse.edu', phone: '+91 98765 43211', photo: '' },
      { id: 'FAC002', name: 'Dr. Revathi', department: 'CSE', email: 'revathi@cse.edu', phone: '+91 98765 43212', photo: '' },
      { id: 'FAC003', name: 'Dr. Jeyanthi', department: 'CSE', email: 'jeyanthi@cse.edu', phone: '+91 98765 43213', photo: '' },
      { id: 'FAC004', name: 'Dr. Govindaraj', department: 'CSE', email: 'govindaraj@cse.edu', phone: '+91 98765 43214', photo: '' },
      { id: 'FAC005', name: 'Mrs. Jeya Geetha', department: 'CSE', email: 'jeyageetha@cse.edu', phone: '+91 98765 43215', photo: '' },
      { id: 'FAC006', name: 'Mrs. swathi', department: 'CSE', email: 'swathi@cse.edu', phone: '+91 98765 43216', photo: '' }
    ];

    const defaultStudents = [
      { reg: '240310101001', name: 'Hari Prakash', dept: 'CSE', email: 'hariprakash@example.com', phone: '+91 98765 43217', photo: '../assets/students/hari-prakash.jpeg' },
      { reg: '240310101002', name: 'Lokeshwaran', dept: 'CSE', email: 'lokeshwaran@example.com', phone: '+91 98765 43218', photo: '../assets/students/lokeshwaran.jpeg' },
      { reg: '240310101003', name: 'Lorin', dept: 'CSE', email: 'lorin@example.com', phone: '+91 98765 43219', photo: '../assets/students/lorin.jpeg' },
      { reg: '240310101004', name: 'Meenakshi', dept: 'CSE', email: 'meenakshi@example.com', phone: '+91 98765 43220', photo: '../assets/students/meenakshi.jpg' },
      { reg: '240310101005', name: 'Satish Kumar', dept: 'CSE', email: 'satish@example.com', phone: '+91 98765 43221', photo: '../assets/students/satish-kumar.jpeg' },
      { reg: '240310101006', name: 'Subiksha', dept: 'CSE', email: 'subiksha@example.com', phone: '+91 98765 43222', photo: '../assets/students/subiksha.png' },
      { reg: '240310101007', name: 'Varalakshmi', dept: 'CSE', email: 'varalakshmi@example.com', phone: '+91 98765 43223', photo: '../assets/students/varalakshmi.jpg' }
    ];

    defaultFaculty.forEach(faculty => upsertUser(buildUserFromFaculty(faculty)));
    defaultStudents.forEach(student => upsertUser(buildUserFromStudent(student)));

    saveUsers(users);
    localStorage.setItem(FACULTY_ACCOUNTS_KEY, JSON.stringify(defaultFaculty.map(buildUserFromFaculty)));
    localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(defaultStudents.map(buildUserFromStudent)));
    return users;
  }

  function authenticateUser(username, password) {
    const users = ensureDefaultUsers();
    const normalized = normalizeName(username);
    return users.find(user => normalizeName(user.username).toLowerCase() === normalized.toLowerCase() && String(user.password) === String(password));
  }

  function getCurrentPageName() {
    const path = window.location.pathname.split('/').pop() || 'dashboard.html';
    return path.toLowerCase();
  }

  function isProtectedPage(pageName) {
    return ['login.html', 'index.html', ''].indexOf(pageName) === -1;
  }

  function getRoleAccess(role) {
    const roleName = String(role || '').toLowerCase();
    return roleAccessMap[roleName] || [];
  }

  function canAccessPage(user, pageName) {
    if (!user) return false;
    const pageKey = pageName.replace(/\.html$/i, '');
    const access = getRoleAccess(user.role);
    return access.includes(pageKey);
  }

  function redirectToDashboard() {
    window.location.replace('dashboard.html');
  }

  function redirectToLogin() {
    window.location.replace('login.html');
  }

  function renderHeaderUser(user) {
    const header = document.querySelector('.header');
    if (!header) return;

    let badge = document.getElementById('auth-user-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'auth-user-badge';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.gap = '10px';
      badge.style.padding = '10px 14px';
      badge.style.background = '#f5ebff';
      badge.style.borderRadius = '999px';
      badge.style.color = '#54208f';
      badge.style.fontSize = '14px';
      badge.style.fontWeight = '600';
      header.appendChild(badge);
    }

    const avatar = user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=54208f&color=fff&size=96`;
    badge.innerHTML = `
      <img src="${avatar}" alt="${user.username}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #54208f;">
      <div>
        <div>Welcome, ${user.username}</div>
        <div style="font-size:12px;color:#6b7280;">Role: ${user.role}</div>
        <div style="font-size:12px;color:#6b7280;">Dept: ${user.department || 'CSE'} • ${user.email || ''}</div>
      </div>
    `;
  }

  function hideUnauthorizedSidebar(user) {
    const links = document.querySelectorAll('.sidebar a');
    const access = getRoleAccess(user.role);

    links.forEach(link => {
      const href = normalizeName(link.getAttribute('href') || '');
      const pageKey = href.replace(/\.html$/i, '');
      const isLogout = href.toLowerCase().indexOf('index.html') >= 0 || link.textContent.toLowerCase().indexOf('logout') >= 0;
      if (isLogout) return;
      if (!access.includes(pageKey)) {
        const listItem = link.closest('li');
        if (listItem) {
          listItem.style.display = 'none';
        }
      }
    });
  }

  function hideUnauthorizedButtons(user) {
    const role = String(user.role || '').toLowerCase();
    if (role === 'student') {
      document.querySelectorAll('.add-btn, .edit-btn, .delete-btn, .save-btn, .cancel-btn, .btn-danger').forEach(btn => {
        btn.style.display = 'none';
      });
      document.querySelectorAll('.modal-close').forEach(btn => {
        btn.style.display = 'none';
      });
    } else if (role === 'faculty') {
      document.querySelectorAll('.delete-btn, .btn-danger').forEach(btn => {
        btn.style.display = 'none';
      });
    }
  }

  function bindLogoutLinks() {
    document.querySelectorAll('a').forEach(link => {
      const text = link.textContent || '';
      if (text.toLowerCase().indexOf('logout') >= 0 || (link.getAttribute('href') || '').toLowerCase().indexOf('index.html') >= 0) {
        link.addEventListener('click', function (event) {
          event.preventDefault();
          clearCurrentUser();
          window.location.href = 'login.html';
        });
      }
    });
  }

  function seedInitialAccountsFromDom() {
    const facultyRows = document.querySelectorAll('#facultyTable tbody tr');
    facultyRows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
      if (cells.length >= 5) {
        const facultyId = cells[0];
        const facultyName = cells[1];
        const department = cells[3] || 'CSE';
        const email = '';
        const phone = '';
        createOrUpdateUser({
          username: facultyName,
          password: facultyId,
          role: 'Faculty',
          department,
          email,
          phone,
          profilePicture: '',
          accountType: 'faculty',
          accountIdentifier: facultyId
        });
      }
    });

    const studentRows = document.querySelectorAll('#studentTable tbody tr');
    studentRows.forEach(row => {
      const reg = row.getAttribute('data-reg') || '';
      const name = row.getAttribute('data-name') || '';
      const department = row.getAttribute('data-dept') || 'CSE';
      const email = row.getAttribute('data-email') || '';
      const phone = row.getAttribute('data-phone') || '';
      const photo = row.getAttribute('data-photo') || '';
      if (reg && name) {
        createOrUpdateUser({
          username: name,
          password: reg,
          role: 'Student',
          department,
          email,
          phone,
          profilePicture: photo,
          accountType: 'student',
          accountIdentifier: reg
        });
      }
    });
  }

  function initializeAuth() {
    ensureDefaultUsers();
    seedInitialAccountsFromDom();

    const pageName = getCurrentPageName();
    const currentUser = getCurrentUser();

    if (pageName === 'login.html') {
      if (currentUser) {
        redirectToDashboard();
      }
      return;
    }

    if (!isProtectedPage(pageName)) {
      return;
    }

    if (!currentUser) {
      redirectToLogin();
      return;
    }

    if (!canAccessPage(currentUser, pageName)) {
      redirectToDashboard();
      return;
    }

    renderHeaderUser(currentUser);
    hideUnauthorizedSidebar(currentUser);
    hideUnauthorizedButtons(currentUser);
    bindLogoutLinks();
  }

  window.authenticateUser = authenticateUser;
  window.setCurrentUser = setCurrentUser;
  window.clearCurrentUser = clearCurrentUser;
  window.ensureDefaultUsers = ensureDefaultUsers;
  window.syncStudentAccounts = syncStudentAccounts;
  window.syncFacultyAccounts = syncFacultyAccounts;
  window.createOrUpdateUser = createOrUpdateUser;
  window.removeUserByType = removeUserByType;
  window.getCurrentUser = getCurrentUser;

  document.addEventListener('DOMContentLoaded', initializeAuth);
})();
