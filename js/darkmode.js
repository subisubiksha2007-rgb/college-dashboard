// ==========================================
// CSE Dashboard - darkmode.js
// ==========================================

// 1. Immediately apply dark mode class to html element if stored theme is dark (prevents flashing)
(function () {
  const storedTheme = localStorage.getItem('dashboardTheme') || 'light';
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 2. Transfer theme state to body element
  const storedTheme = localStorage.getItem('dashboardTheme') || 'light';
  if (storedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');
  }

  // 3. Initialize theme toggle button
  initThemeToggle();
});

function initThemeToggle() {
  let toggleBtn = document.getElementById('themeToggle');

  // If button does not exist statically in HTML, try to inject it dynamically into the header
  if (!toggleBtn) {
    const header = document.querySelector('.header, header');
    if (header) {
      // Style header to act as a flex container containing title and toggle button
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.width = '100%';
      header.style.gap = '18px';

      toggleBtn = document.createElement('button');
      toggleBtn.id = 'themeToggle';
      toggleBtn.style.border = 'none';
      toggleBtn.style.padding = '10px 18px';
      toggleBtn.style.borderRadius = '20px';
      toggleBtn.style.cursor = 'pointer';
      toggleBtn.style.fontSize = '14px';
      toggleBtn.style.fontWeight = '600';
      toggleBtn.style.display = 'flex';
      toggleBtn.style.alignItems = 'center';
      toggleBtn.style.gap = '8px';
      toggleBtn.style.outline = 'none';
      toggleBtn.style.whiteSpace = 'nowrap';

      header.appendChild(toggleBtn);
    }
  }

  if (toggleBtn) {
    // Inline onclick plus addEventListener causes a double toggle, so keep one handler.
    toggleBtn.removeAttribute('onclick');
    if (!toggleBtn.dataset.themeReady) {
      toggleBtn.addEventListener('click', toggleDarkMode);
      toggleBtn.dataset.themeReady = 'true';
    }
    // Update button text and colors according to the initial theme
    updateThemeToggleUI(toggleBtn);
  }
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');

  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');

  // Sync state with HTML tag for consistency
  if (isDark) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }

  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    updateThemeToggleUI(toggleBtn);
  }
}

function updateThemeToggleUI(btn) {
  const isDark = document.body.classList.contains('dark-mode');
  
  // Set sun icon (☀️) for light mode toggle (when dark mode is active)
  // and moon icon (🌙) for dark mode toggle (when light mode is active)
  btn.innerHTML = isDark ? '&#127774; Light' : '&#127769; Dark';

  // Apply light/dark styling to button
  if (isDark) {
    btn.style.background = '#64ffda';
    btn.style.color = '#0a192f';
  } else {
    btn.style.background = '#54208f';
    btn.style.color = '#ffffff';
  }
}

// 4. Make functions globally available for elements with inline onclick handlers (e.g. onclick="toggleDarkMode()")
window.toggleDarkMode = toggleDarkMode;
window.initThemeToggle = initThemeToggle;
