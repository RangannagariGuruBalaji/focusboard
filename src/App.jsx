import { useEffect, useMemo, useState } from 'react'
import {
  Bell, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, LayoutDashboard, Menu, MoreHorizontal, Plus, Search, Settings,
  SlidersHorizontal, Trash2, Pencil, X,
} from 'lucide-react'
import TaskForm from './components/TaskForm'
import { sampleTasks } from './data/sampleTasks'
import { useLocalStorage } from './hooks/useLocalStorage'

const statusOptions = ['All', 'To do', 'In progress', 'Completed']
const focusSlides = [
  { eyebrow: 'FOCUS NOTE · 1 OF 3', title: 'Plan your day', text: 'Organise your priorities and focus on what matters most.', accent: '#d9c7ff' },
  { eyebrow: 'FOCUS NOTE · 2 OF 3', title: 'Protect your attention', text: 'Keep distractions away and give your important work a clear window.', accent: '#b9e8dc' },
  { eyebrow: 'FOCUS NOTE · 3 OF 3', title: 'Finish with intention', text: 'Review what moved forward and close your day with a clear next step.', accent: '#ffd9b8' },
]

function formatDate(value) {
  if (!value) return 'No date'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
}

function StatCard({ title, value, icon, tone, progress }) {
  return (
    <article className="stat-card">
      <div className="stat-head"><span>{title}</span><div className={`stat-icon ${tone}`}>{icon}</div></div>
      <strong>{value}</strong>
      {progress !== undefined && <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>}
    </article>
  )
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('focusboard_tasks', sampleTasks)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [slide, setSlide] = useState(0)
  const [formTask, setFormTask] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTask, setDeleteTask] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [utilityPanel, setUtilityPanel] = useState(null)

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== 'Escape') return
      if (formOpen) setFormOpen(false)
      else if (deleteTask) setDeleteTask(null)
      else if (utilityPanel) setUtilityPanel(null)
      else if (notificationOpen) setNotificationOpen(false)
      else if (profileOpen) setProfileOpen(false)
      else if (mobileMenu) setMobileMenu(false)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [formOpen, deleteTask, utilityPanel, notificationOpen, profileOpen, mobileMenu])

  useEffect(() => {
    const modalOpen = formOpen || deleteTask || utilityPanel
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [formOpen, deleteTask, utilityPanel])

  const stats = useMemo(() => {
    const total = tasks.length
    const inProgress = tasks.filter((task) => task.status === 'In progress').length
    const completed = tasks.filter((task) => task.status === 'Completed').length
    return { total, inProgress, completed, percentage: total ? Math.round((completed / total) * 100) : 0 }
  }, [tasks])

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.trim().toLowerCase())
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  }), [tasks, search, statusFilter, priorityFilter])

  function openCreate() {
    setFormTask(null)
    setFormOpen(true)
  }

  function openEdit(task) {
    setFormTask(task)
    setFormOpen(true)
  }

  function saveTask(values) {
    if (formTask) {
      setTasks((current) => current.map((task) => task.id === formTask.id ? { ...task, ...values, id: task.id } : task))
    } else {
      setTasks((current) => [{ ...values, id: `task-${Date.now()}` }, ...current])
    }
    setFormOpen(false)
  }

  function updateStatus(taskId, status) {
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status } : task))
  }

  function resetFilters() {
    setSearch('')
    setStatusFilter('All')
    setPriorityFilter('All')
  }

  function moveSlide(direction) {
    setSlide((current) => (current + direction + focusSlides.length) % focusSlides.length)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateTo(name) {
    setActiveNav(name)
    setMobileMenu(false)
    setProfileOpen(false)
    setNotificationOpen(false)

    if (name === 'Dashboard') {
      scrollToTop()
    } else if (name === 'My Tasks') {
      document.querySelector('.task-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (name === 'Filters') {
      document.querySelector('.task-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.setTimeout(() => document.querySelector('#priority-filter')?.focus(), 350)
    } else if (name === 'Calendar') {
      setUtilityPanel('calendar')
    } else if (name === 'Help Center') {
      setUtilityPanel('help')
    } else if (name === 'Settings') {
      setUtilityPanel('settings')
    }
  }

  const currentSlide = focusSlides[slide]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><CheckCircle2 size={20} strokeWidth={2.5} /></div>
          <span>FocusBoard</span>
          <button className="mobile-close" type="button" onClick={() => setMobileMenu(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <nav className="primary-nav" aria-label="Main navigation">
          <button className={`nav-item ${activeNav === 'Dashboard' ? 'active' : ''}`} type="button" onClick={() => navigateTo('Dashboard')}><LayoutDashboard size={19} /><span>Dashboard</span></button>
          <button className={`nav-item ${activeNav === 'My Tasks' ? 'active' : ''}`} type="button" onClick={() => navigateTo('My Tasks')}><CheckCircle2 size={19} /><span>My Tasks</span><b>{tasks.length}</b></button>
          <button className={`nav-item ${activeNav === 'Calendar' ? 'active' : ''}`} type="button" onClick={() => navigateTo('Calendar')}><CalendarDays size={19} /><span>Calendar</span></button>
          <button className={`nav-item ${activeNav === 'Filters' ? 'active' : ''}`} type="button" onClick={() => navigateTo('Filters')}><SlidersHorizontal size={19} /><span>Filters</span></button>
        </nav>
        <div className="sidebar-bottom">
          <button className={`nav-item ${activeNav === 'Help Center' ? 'active' : ''}`} type="button" onClick={() => navigateTo('Help Center')}><CircleHelp size={19} /><span>Help Center</span></button>
          <button className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`} type="button" onClick={() => navigateTo('Settings')}><Settings size={19} /><span>Settings</span></button>
          <div className="profile">
            <button className="profile-button" type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label="Open profile menu">
              <div className="avatar">AM</div>
              <div><strong>Alex Morgan</strong><span>alex@example.com</span></div>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </aside>
      {mobileMenu && <button className="nav-overlay" type="button" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button" type="button" onClick={() => setMobileMenu(true)} aria-label="Open navigation"><Menu size={22} /></button>
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{activeNav}</strong></div>
          <div className="top-actions">
            <div className="header-popover-anchor">
              <button className="icon-button notification" type="button" aria-label="Notifications" aria-expanded={notificationOpen} onClick={() => { setNotificationOpen((open) => !open); setProfileOpen(false) }}>
                <Bell size={19} />{!notificationsRead && <i />}
              </button>
              {notificationOpen && (
                <div className="header-popover notification-popover" role="dialog" aria-label="Notifications">
                  <div className="popover-heading"><strong>Notifications</strong><button type="button" onClick={() => setNotificationsRead(true)}>Mark all read</button></div>
                  <div className="notification-item"><div className="notification-dot purple" /><div><strong>{stats.completed} tasks completed</strong><span>Your dashboard is up to date</span></div></div>
                  <div className="notification-item"><div className="notification-dot orange" /><div><strong>{stats.inProgress} tasks in progress</strong><span>Keep the momentum going</span></div></div>
                  <div className="notification-item"><div className="notification-dot green" /><div><strong>{tasks.length} total tasks</strong><span>Synced to this browser</span></div></div>
                </div>
              )}
            </div>
            <div className="header-popover-anchor">
              <button className="top-avatar" type="button" aria-label="Open profile" aria-expanded={profileOpen} onClick={() => { setProfileOpen((open) => !open); setNotificationOpen(false) }}>AM</button>
              {profileOpen && (
                <div className="header-popover profile-popover" role="menu" aria-label="Profile menu">
                  <strong>Alex Morgan</strong>
                  <span>alex@example.com</span>
                  <button type="button" role="menuitem" onClick={() => navigateTo('Settings')}><Settings size={15} />Account settings</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div><span className="eyebrow">OVERVIEW</span><h1>Good morning, Alex</h1></div>
            <button className="button primary add-task" type="button" onClick={openCreate}><Plus size={18} />Add task</button>
          </div>

          <section className="stats-grid" aria-label="Task overview">
            <StatCard title="Total tasks" value={stats.total} icon={<CheckCircle2 size={20} />} tone="purple" />
            <StatCard title="In progress" value={stats.inProgress} icon={<Clock3 size={20} />} tone="orange" />
            <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 size={20} />} tone="green" />
            <StatCard title="Completion" value={`${stats.percentage}%`} icon={<LayoutDashboard size={20} />} tone="blue" progress={stats.percentage} />
          </section>

          <section className="focus-card" aria-label="Focus notes carousel" style={{ '--slide-accent': currentSlide.accent }}>
            <div className="focus-main">
              <span>{currentSlide.eyebrow}</span>
              <h2>{currentSlide.title}</h2>
              <p>{currentSlide.text}</p>
            </div>
            <div className="focus-controls">
              <div className="slide-dots" aria-label="Choose a focus note">
                {focusSlides.map((_, index) => (
                  <button key={index} type="button" className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={`Show slide ${index + 1}`} aria-current={index === slide ? 'true' : undefined} />
                ))}
              </div>
              <div className="carousel-buttons">
                <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous focus note"><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => moveSlide(1)} aria-label="Next focus note"><ChevronRight size={18} /></button>
              </div>
            </div>
          </section>

          <section className="task-section">
            <div className="task-toolbar">
              <div className="search-box">
                <Search size={18} />
                <label className="sr-only" htmlFor="task-search">Search tasks</label>
                <input id="task-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." />
              </div>
              <div className="filters">
                <label className="priority-filter" htmlFor="priority-filter">
                  <SlidersHorizontal size={16} />
                  <span className="sr-only">Filter by priority</span>
                  <select id="priority-filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                    <option value="All">All priorities</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="status-tabs" role="tablist" aria-label="Filter tasks by status">
              {statusOptions.map((status) => (
                <button key={status} id={`status-tab-${status.toLowerCase().replaceAll(' ', '-')}`} role="tab" aria-controls="task-results" aria-selected={statusFilter === status} className={statusFilter === status ? 'active' : ''} type="button" onClick={() => setStatusFilter(status)}>
                  {status}<span>{status === 'All' ? tasks.length : tasks.filter((task) => task.status === status).length}</span>
                </button>
              ))}
            </div>

            <div className="task-list" id="task-results" role="tabpanel" aria-label={`${statusFilter} tasks`}>
              {visibleTasks.length ? visibleTasks.map((task) => (
                <article className="task-row" key={task.id}>
                  <button className={`task-check ${task.status === 'Completed' ? 'done' : ''}`} type="button" onClick={() => updateStatus(task.id, task.status === 'Completed' ? 'To do' : 'Completed')} aria-label={`${task.status === 'Completed' ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}>
                    {task.status === 'Completed' && <CheckCircle2 size={17} />}
                  </button>
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>
                  <span className="category-badge">{task.category}</span>
                  <label className="status-select">
                    <span className="sr-only">Status for {task.title}</span>
                    <select className={`status-${task.status.toLowerCase().replaceAll(' ', '-')}`} value={task.status} onChange={(event) => updateStatus(task.id, event.target.value)}>
                      <option>To do</option>
                      <option>In progress</option>
                      <option>Completed</option>
                    </select>
                  </label>
                  <span className={`priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span>
                  <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
                  <div className="row-actions">
                    <button type="button" onClick={() => openEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={16} /></button>
                    <button type="button" onClick={() => setDeleteTask(task)} aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button>
                  </div>
                </article>
              )) : (
                <div className="empty-state">
                  <Search size={24} />
                  <h3>No tasks found</h3>
                  <p>Try changing your search or filters.</p>
                  <button className="button secondary" type="button" onClick={resetFilters}>Reset filters</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {formOpen && <TaskForm task={formTask} onSubmit={saveTask} onClose={() => setFormOpen(false)} />}
      {utilityPanel && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setUtilityPanel(null)}>
          <div className="utility-modal" role="dialog" aria-modal="true" aria-labelledby="utility-title">
            <div className="modal-header">
              <div>
                <span className="eyebrow">{utilityPanel === 'calendar' ? 'TASK CALENDAR' : utilityPanel === 'settings' ? 'APP SETTINGS' : 'SUPPORT'}</span>
                <h2 id="utility-title">{utilityPanel === 'calendar' ? 'Upcoming tasks' : utilityPanel === 'settings' ? 'Settings' : 'Help Center'}</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setUtilityPanel(null)} aria-label="Close panel"><X size={20} /></button>
            </div>
            {utilityPanel === 'calendar' && (
              <div className="calendar-list">
                {[...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((task) => (
                  <button key={task.id} type="button" onClick={() => { setUtilityPanel(null); openEdit(task) }}>
                    <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
                    <div><strong>{task.title}</strong><span>{task.status} · {task.priority} priority</span></div>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            )}
            {utilityPanel === 'help' && (
              <div className="help-content">
                <p>Use <strong>Add task</strong> to create work, and use each task row to edit, delete, or update status.</p>
                <p>Search by title, combine status tabs with the priority filter, or reset filters from an empty result.</p>
                <p>Task changes are saved automatically in this browser.</p>
              </div>
            )}
            {utilityPanel === 'settings' && (
              <div className="settings-content">
                <div><strong>Local task storage</strong><span>Tasks are saved automatically in this browser.</span></div>
                <button className="button secondary" type="button" onClick={() => { setTasks(sampleTasks); resetFilters(); setUtilityPanel(null) }}>Restore sample tasks</button>
              </div>
            )}
          </div>
        </div>
      )}
      {deleteTask && (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="danger-icon"><Trash2 size={22} /></div>
            <h2 id="delete-title">Delete task?</h2>
            <p>“{deleteTask.title}” will be permanently removed.</p>
            <div className="modal-actions">
              <button className="button secondary" type="button" onClick={() => setDeleteTask(null)}>Cancel</button>
              <button className="button danger" type="button" onClick={() => { setTasks((current) => current.filter((task) => task.id !== deleteTask.id)); setDeleteTask(null) }}>Delete task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
