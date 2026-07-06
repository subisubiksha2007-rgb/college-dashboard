const STORAGE_KEY = 'cseSettingsData';

const defaultSettings = {
  adminName: 'Dr. Anitha Kumar',
  email: 'admin@cse.edu',
  phone: '+91 98765 43210',
  department: 'Computer Science & Engineering',
  designation: 'Head of Department',
  profilePhoto: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  language: 'English',
  darkMode: false,
  notificationToggle: true,
  autoSaveToggle: true,
  sessionTimeout: true,
  twoFactor: false,
  loginAlert: true,
  rememberMe: false,
  collegeName: 'St. Joseph University',
  aboutDepartment: 'Computer Science & Engineering',
  erpVersion: '1.0.0',
  developerName: 'CSE ERP Team',
  academicYear: '2026-2027'
};

function getSettings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : { ...defaultSettings };
}

function saveSettingsToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  const button = document.getElementById('themeToggle');
  if (button) {
    button.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  }
}

function renderDashboardCards(settings) {
  const totalAdmins = document.getElementById('totalAdmins');
  const activeUsers = document.getElementById('activeUsers');
  const systemStatus = document.getElementById('systemStatus');
  const lastBackup = document.getElementById('lastBackup');

  if (totalAdmins) totalAdmins.textContent = '4';
  if (activeUsers) activeUsers.textContent = settings.notificationToggle ? '24' : '18';
  if (systemStatus) systemStatus.textContent = settings.twoFactor ? 'Protected' : 'Online';
  if (lastBackup) lastBackup.textContent = settings.autoSaveToggle ? 'Today' : 'Pending';
}

function populateForm(settings) {
  const fields = [
    ['adminName', settings.adminName],
    ['email', settings.email],
    ['phone', settings.phone],
    ['department', settings.department],
    ['designation', settings.designation],
    ['profilePhoto', settings.profilePhoto],
    ['language', settings.language],
    ['collegeName', settings.collegeName],
    ['aboutDepartment', settings.aboutDepartment],
    ['erpVersion', settings.erpVersion],
    ['developerName', settings.developerName],
    ['academicYear', settings.academicYear]
  ];

  fields.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
  });

  const toggles = [
    ['darkModeToggle', settings.darkMode],
    ['lightModeToggle', !settings.darkMode],
    ['notificationToggle', settings.notificationToggle],
    ['autoSaveToggle', settings.autoSaveToggle],
    ['sessionTimeout', settings.sessionTimeout],
    ['twoFactor', settings.twoFactor],
    ['loginAlert', settings.loginAlert],
    ['rememberMe', settings.rememberMe]
  ];

  toggles.forEach(([id, checked]) => {
    const el = document.getElementById(id);
    if (el) el.checked = checked;
  });

  applyTheme(settings.darkMode);
}

function collectFormData() {
  const settings = getSettings();
  settings.adminName = document.getElementById('adminName')?.value.trim() || '';
  settings.email = document.getElementById('email')?.value.trim() || '';
  settings.phone = document.getElementById('phone')?.value.trim() || '';
  settings.department = document.getElementById('department')?.value.trim() || '';
  settings.designation = document.getElementById('designation')?.value.trim() || '';
  settings.profilePhoto = document.getElementById('profilePhoto')?.value.trim() || '';
  settings.language = document.getElementById('language')?.value || 'English';
  settings.darkMode = document.getElementById('darkModeToggle')?.checked || false;
  settings.notificationToggle = document.getElementById('notificationToggle')?.checked || false;
  settings.autoSaveToggle = document.getElementById('autoSaveToggle')?.checked || false;
  settings.sessionTimeout = document.getElementById('sessionTimeout')?.checked || false;
  settings.twoFactor = document.getElementById('twoFactor')?.checked || false;
  settings.loginAlert = document.getElementById('loginAlert')?.checked || false;
  settings.rememberMe = document.getElementById('rememberMe')?.checked || false;
  settings.collegeName = document.getElementById('collegeName')?.value.trim() || '';
  settings.aboutDepartment = document.getElementById('aboutDepartment')?.value.trim() || '';
  settings.erpVersion = document.getElementById('erpVersion')?.value.trim() || '';
  settings.developerName = document.getElementById('developerName')?.value.trim() || '';
  settings.academicYear = document.getElementById('academicYear')?.value.trim() || '';
  return settings;
}

function showToast(message) {
  if (window.alert) {
    window.alert(message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const settings = getSettings();
  populateForm(settings);
  renderDashboardCards(settings);

  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const resetProfileBtn = document.getElementById('resetProfileBtn');
  const backupBtn = document.getElementById('backupBtn');
  const restoreBtn = document.getElementById('restoreBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const saveAboutBtn = document.getElementById('saveAboutBtn');
  const themeToggle = document.getElementById('themeToggle');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const lightModeToggle = document.getElementById('lightModeToggle');

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = collectFormData();
      saveSettingsToStorage(data);
      renderDashboardCards(data);
      showToast('Profile settings saved successfully.');
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = document.getElementById('currentPassword')?.value || '';
      const next = document.getElementById('newPassword')?.value || '';
      const confirm = document.getElementById('confirmPassword')?.value || '';
      if (!current || !next || !confirm) {
        showToast('Please fill all password fields.');
        return;
      }
      if (next.length < 6) {
        showToast('New password should be at least 6 characters.');
        return;
      }
      if (next !== confirm) {
        showToast('Passwords do not match.');
        return;
      }
      const data = collectFormData();
      data.currentPassword = current;
      data.newPassword = next;
      data.confirmPassword = confirm;
      saveSettingsToStorage(data);
      passwordForm.reset();
      showToast('Password updated successfully.');
    });
  }

  if (resetProfileBtn) {
    resetProfileBtn.addEventListener('click', () => {
      populateForm(defaultSettings);
      saveSettingsToStorage(defaultSettings);
      renderDashboardCards(defaultSettings);
      showToast('Settings reset to default values.');
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const data = collectFormData();
      data.darkMode = !data.darkMode;
      document.getElementById('darkModeToggle').checked = data.darkMode;
      document.getElementById('lightModeToggle').checked = !data.darkMode;
      saveSettingsToStorage(data);
      applyTheme(data.darkMode);
      renderDashboardCards(data);
    });
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      const data = collectFormData();
      data.darkMode = darkModeToggle.checked;
      document.getElementById('lightModeToggle').checked = !darkModeToggle.checked;
      saveSettingsToStorage(data);
      applyTheme(data.darkMode);
      renderDashboardCards(data);
    });
  }

  if (lightModeToggle) {
    lightModeToggle.addEventListener('change', () => {
      const data = collectFormData();
      data.darkMode = !lightModeToggle.checked;
      document.getElementById('darkModeToggle').checked = !lightModeToggle.checked;
      saveSettingsToStorage(data);
      applyTheme(data.darkMode);
      renderDashboardCards(data);
    });
  }

  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      saveSettingsToStorage(collectFormData());
      showToast('Backup completed successfully.');
    });
  }

  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      const restored = getSettings();
      populateForm(restored);
      renderDashboardCards(restored);
      showToast('Restored the latest saved settings.');
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = JSON.stringify(getSettings(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'settings.json';
      link.click();
      URL.revokeObjectURL(url);
      showToast('Settings exported.');
    });
  }

  if (importBtn) {
    importBtn.addEventListener('click', () => {
      const imported = prompt('Paste exported settings JSON here:');
      if (!imported) return;
      try {
        const parsed = JSON.parse(imported);
        const data = { ...defaultSettings, ...parsed };
        saveSettingsToStorage(data);
        populateForm(data);
        renderDashboardCards(data);
        showToast('Settings imported successfully.');
      } catch (error) {
        showToast('Invalid settings JSON.');
      }
    });
  }

  if (saveAboutBtn) {
    saveAboutBtn.addEventListener('click', () => {
      const data = collectFormData();
      saveSettingsToStorage(data);
      renderDashboardCards(data);
      showToast('About information saved successfully.');
    });
  }
});
