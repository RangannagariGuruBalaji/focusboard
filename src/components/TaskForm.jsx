import { useState } from 'react'
import { X } from 'lucide-react'

const emptyTask = {
  title: '',
  description: '',
  category: 'Design',
  status: 'To do',
  priority: 'Medium',
  dueDate: '',
}

export default function TaskForm({ task, onSubmit, onClose }) {
  const [form, setForm] = useState(task ? { ...task } : emptyTask)
  const [error, setError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Please enter a task title.')
      return
    }
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-header">
          <div>
            <span className="eyebrow">TASK DETAILS</span>
            <h2 id="task-form-title">{task ? 'Edit task' : 'Create new task'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close task form">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="title">Task title <span>*</span></label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="Enter task title"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'task-form-error' : undefined}
            autoFocus
          />

          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={updateField} placeholder="Add a short description" rows="3" />

          <div className="form-grid">
            <div>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={updateField}>
                <option>Design</option>
                <option>Development</option>
                <option>Marketing</option>
                <option>Testing</option>
                <option>Research</option>
                <option>Planning</option>
              </select>
            </div>
            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={updateField}>
                <option>To do</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={updateField}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate">Due date</label>
              <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={updateField} />
            </div>
          </div>
          {error && <p className="form-error" id="task-form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button className="button secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button primary" type="submit">{task ? 'Save changes' : 'Create task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
