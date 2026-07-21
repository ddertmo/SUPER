// ============================================================
// CIVILWATCH Admin Dashboard — App Shell
// Handles: Sidebar, Navbar, Notifications Panel
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {

  sidebarCollapsed: false,

  init() {
    this.renderSidebar();
    this.renderNavbar();
    this.renderNotifPanel();
    this.bindEvents();
    this.setActiveNav();
    this.loadTheme();
  },

  // ── Sidebar HTML ──────────────────────────────────────────
  renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">
          <span class="material-symbols-outlined">shield</span>
        </div>
        <div class="sidebar-logo-text">
          <div class="sidebar-logo-title">CIVILWATCH</div>
          <div class="sidebar-logo-subtitle">Digos City</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a class="nav-item" href="dashboard.html" data-page="dashboard">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="nav-item-label">Dashboard</span>
        </a>
        <a class="nav-item" href="pending-reports.html" data-page="pending-reports">
          <span class="material-symbols-outlined">pending_actions</span>
          <span class="nav-item-label">Pending Reports</span>
          <span class="nav-badge">24</span>
        </a>
        <a class="nav-item" href="assign-office.html" data-page="assign-office">
          <span class="material-symbols-outlined">assignment_ind</span>
          <span class="nav-item-label">Assign Office</span>
        </a>
        <a class="nav-item" href="monitoring.html" data-page="monitoring">
          <span class="material-symbols-outlined">track_changes</span>
          <span class="nav-item-label">Monitoring</span>
        </a>
        <a class="nav-item" href="gis-map.html" data-page="gis-map">
          <span class="material-symbols-outlined">map</span>
          <span class="nav-item-label">GIS Map</span>
        </a>
        <a class="nav-item" href="analytics.html" data-page="analytics">
          <span class="material-symbols-outlined">bar_chart</span>
          <span class="nav-item-label">Analytics</span>
        </a>
        <a class="nav-item" href="resolved-reports.html" data-page="resolved-reports">
          <span class="material-symbols-outlined">task_alt</span>
          <span class="nav-item-label">Resolved Reports</span>
        </a>
        <a class="nav-item" href="users.html" data-page="users">
          <span class="material-symbols-outlined">group</span>
          <span class="nav-item-label">Users</span>
        </a>
        <a class="nav-item" href="settings.html" data-page="settings">
          <span class="material-symbols-outlined">settings</span>
          <span class="nav-item-label">Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">SA</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">Super Administrator</div>
            <div class="sidebar-user-role">Super Admin</div>
          </div>
        </div>
        <div class="sidebar-user-status" style="padding: 2px 12px 8px; margin-left: 2px;">
          <div class="status-dot"></div>
          <span style="font-size:11px; color:rgba(255,255,255,0.5)">Online</span>
        </div>
      </div>
    `;
  },

  // ── Navbar HTML ───────────────────────────────────────────
  renderNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    navbar.innerHTML = `
      <div class="navbar-left">
        <button class="navbar-toggle" id="sidebarToggle" title="Toggle sidebar">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="navbar-search">
          <span class="material-symbols-outlined navbar-search-icon">search</span>
          <input type="text" placeholder="Search reports, locations, or barangays..." id="globalSearch" />
        </div>
      </div>
      <div class="navbar-right">
        <button class="navbar-icon-btn" id="darkModeBtn" title="Toggle Dark Mode">
          <span class="material-symbols-outlined" id="darkModeIcon">dark_mode</span>
        </button>
        <button class="navbar-icon-btn" id="notifBtn" title="Notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notif-badge">3</span>
        </button>
        <div class="navbar-profile" id="profileBtn">
          <div class="navbar-avatar">SA</div>
          <div class="navbar-profile-info">
            <span class="navbar-profile-name">Super Administrator</span>
            <span class="navbar-profile-role">Super Admin</span>
          </div>
          <span class="material-symbols-outlined">expand_more</span>
        </div>
      </div>
    `;
  },

  // ── Notifications Panel HTML ──────────────────────────────
  renderNotifPanel() {
    const existing = document.getElementById('notifPanel');
    if (existing) return;

    const panel = document.createElement('div');
    panel.className = 'notif-panel';
    panel.id = 'notifPanel';
    panel.innerHTML = `
      <div class="notif-panel-header">
        <div class="notif-panel-title-wrap">
          <span class="notif-panel-title">Notifications</span>
          <span class="notif-count-badge" id="notifCountBadge">3</span>
        </div>
        <div class="notif-panel-actions">
          <button class="notif-mark-read" id="markAllRead">Mark all as read</button>
          <button class="notif-close" id="notifClose">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      <div class="notif-list" id="notifList">
        ${this.buildNotifItems()}
      </div>
      <div class="notif-panel-footer">
        <span class="notif-view-all">
          <span class="material-symbols-outlined">notifications</span>
          View all notifications
          <span class="material-symbols-outlined">arrow_forward</span>
        </span>
      </div>
    `;
    document.body.appendChild(panel);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'notifOverlay';
    overlay.addEventListener('click', () => this.closeNotif());
    document.body.appendChild(overlay);
  },

  buildNotifItems() {
    const items = [
      { type: 'submit',   title: 'New report submitted',  desc: 'A new report "Damaged Road" was submitted in Aplaya.', time: '2 minutes ago', unread: true },
      { type: 'assign',   title: 'Report assigned',        desc: 'Report CW-2026-217 has been assigned to CENRO.',       time: '15 minutes ago', unread: true },
      { type: 'progress', title: 'Status updated',         desc: 'Report CW-2026-213 is now In Progress.',               time: '35 minutes ago', unread: true },
      { type: 'resolved', title: 'Report resolved',        desc: 'Report CW-2026-215 has been marked as Resolved.',      time: '1 hour ago',     unread: false },
      { type: 'comment',  title: 'New comment',            desc: 'A comment was added on report CW-2026-216.',           time: '2 hours ago',    unread: false },
      { type: 'system',   title: 'System notification',    desc: 'Scheduled maintenance on May 25, 2026 at 12:00 AM.',   time: '1 day ago',      unread: false },
    ];
    const iconMap = {
      submit:   { icon: 'description',   cls: 'submit' },
      assign:   { icon: 'person_add',    cls: 'assign' },
      progress: { icon: 'autorenew',     cls: 'progress' },
      resolved: { icon: 'check_circle',  cls: 'resolved' },
      comment:  { icon: 'chat_bubble',   cls: 'comment' },
      system:   { icon: 'notifications', cls: 'system' },
    };
    return items.map(item => {
      const im = iconMap[item.type];
      return `
        <div class="notif-item ${item.unread ? 'unread' : ''}">
          <div class="notif-icon ${im.cls}">
            <span class="material-symbols-outlined">${im.icon}</span>
          </div>
          <div class="notif-content">
            <div class="notif-title">${item.title}</div>
            <div class="notif-desc">${item.desc}</div>
            <div class="notif-time">${item.time}</div>
          </div>
          ${item.unread ? '<div class="unread-dot"></div>' : ''}
        </div>
      `;
    }).join('');
  },

  // ── Event Bindings ────────────────────────────────────────
  bindEvents() {
    // Sidebar toggle
    document.addEventListener('click', e => {
      const toggle = e.target.closest('#sidebarToggle');
      if (toggle) this.toggleSidebar();

      const notifBtn = e.target.closest('#notifBtn');
      if (notifBtn) this.openNotif();

      const notifClose = e.target.closest('#notifClose');
      if (notifClose) this.closeNotif();

      const markAll = e.target.closest('#markAllRead');
      if (markAll) this.markAllRead();

      const darkModeBtn = e.target.closest('#darkModeBtn');
      if (darkModeBtn) this.toggleDarkMode();
    });
  },

  // ── Sidebar toggle ────────────────────────────────────────
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainArea = document.getElementById('mainArea');
    const navbar = document.getElementById('navbar');
    this.sidebarCollapsed = !this.sidebarCollapsed;
    sidebar?.classList.toggle('collapsed', this.sidebarCollapsed);
    mainArea?.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
    navbar?.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
  },

  // ── Notification panel ────────────────────────────────────
  openNotif() {
    document.getElementById('notifPanel')?.classList.add('open');
    document.getElementById('notifOverlay')?.classList.add('active');
  },

  closeNotif() {
    document.getElementById('notifPanel')?.classList.remove('open');
    document.getElementById('notifOverlay')?.classList.remove('active');
  },

  markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(el => {
      el.classList.remove('unread');
      el.querySelector('.unread-dot')?.remove();
    });
    const badge = document.querySelector('.notif-badge');
    if (badge) badge.textContent = '0';
    const countBadge = document.getElementById('notifCountBadge');
    if (countBadge) countBadge.textContent = '0';
    Utils.showToast('All notifications marked as read', 'success');
  },

  // ── Dark Mode toggle ──────────────────────────────────────
  toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.getElementById('darkModeIcon');
    if (icon) icon.textContent = isDark ? 'dark_mode' : 'light_mode';
    
    Utils.showToast(`${isDark ? 'Light' : 'Dark'} mode enabled`, 'info');
  },

  // ── Load saved theme ──────────────────────────────────────
  loadTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const icon = document.getElementById('darkModeIcon');
    if (icon) icon.textContent = saved === 'dark' ? 'light_mode' : 'dark_mode';
  },

  // ── Active nav ────────────────────────────────────────────
  setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
  }
};
