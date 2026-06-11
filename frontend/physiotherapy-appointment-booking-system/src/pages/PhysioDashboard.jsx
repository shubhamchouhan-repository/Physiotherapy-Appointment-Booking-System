import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { physioApi } from '../services/api';

function SlotManager({ onSlotsCreated }) {
  const [form, setForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '13:00',
    durationMinutes: 30,
  });
  const [loading, setLoading] = useState(false);
  const [existingSlots, setExistingSlots] = useState([]);

  useEffect(() => { loadSlots(form.date); }, [form.date]);

  const loadSlots = async (date) => {
    try {
      const res = await physioApi.getSlots(date);
      setExistingSlots(res.data);
    } catch { setExistingSlots([]); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await physioApi.createSlots(form);
      toast.success(`${res.data.length} slots created successfully!`);
      loadSlots(form.date);
      onSlotsCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create slots.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = async (slot) => {
    try {
      if (slot.status === 'AVAILABLE') {
        await physioApi.blockSlot(slot.id);
        toast.info('Slot blocked.');
      } else if (slot.status === 'BLOCKED') {
        await physioApi.unblockSlot(slot.id);
        toast.success('Slot unblocked.');
      }
      loadSlots(form.date);
    } catch {
      toast.error('Failed to update slot.');
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header"><h2>Create Appointment Slots</h2></div>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input"
                value={form.date} min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Slot Duration (minutes)</label>
              <select className="form-select" value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}>
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="time" className="form-input"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input type="time" className="form-input"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : '+ Generate Slots'}
          </button>
        </form>
      </div>

      {existingSlots.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Slots for {format(new Date(form.date), 'dd MMM yyyy')}</h2>
          </div>
          <div className="slot-grid">
            {existingSlots.map((slot) => (
              <button
                key={slot.id}
                className={`slot-chip ${slot.status === 'BOOKED' ? 'booked' : slot.status === 'BLOCKED' ? 'blocked' : ''}`}
                onClick={() => slot.status !== 'BOOKED' && toggleSlot(slot)}
                title={slot.status === 'BOOKED' ? 'Booked – cannot modify' : `Click to ${slot.status === 'AVAILABLE' ? 'block' : 'unblock'}`}
              >
                <div>{slot.startTime}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                  {slot.status === 'BOOKED' ? '🔒 Booked' : slot.status === 'BLOCKED' ? '⛔ Blocked' : '✓ Open'}
                </div>
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.75rem' }}>
            Click on an open slot to block it, or a blocked slot to reopen it.
          </p>
        </div>
      )}
    </div>
  );
}

function AppointmentRow({ appt, index, onDragStart, onDragOver, onDrop }) {
  return (
    <tr
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
      onDrop={() => onDrop(index)}
    >
      <td><span className="drag-handle">⋮⋮</span></td>
      <td style={{ fontWeight: 600 }}>#{appt.slotOrder}</td>
      <td>{appt.startTime} – {appt.endTime}</td>
      <td>{appt.patientName}</td>
      <td>
        <span className={`badge ${appt.status === 'CONFIRMED' ? 'badge-success' : 'badge-info'}`}>
          {appt.status}
        </span>
      </td>
      <td>₹{appt.amountPaid}</td>
    </tr>
  );
}

export default function PhysioDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('today');
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  useEffect(() => {
    if (tab === 'today') fetchTodayAppointments();
    else if (tab === 'bydate') fetchByDate(selectedDate);
  }, [tab, selectedDate]);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    try {
      const res = await physioApi.getTodayAppointments();
      setAppointments(res.data);
    } catch { toast.error('Failed to load appointments.'); }
    finally { setLoading(false); }
  };

  const fetchByDate = async (date) => {
    setLoading(true);
    try {
      const res = await physioApi.getAppointmentsByDate(date);
      setAppointments(res.data);
    } catch { toast.error('Failed to load appointments.'); }
    finally { setLoading(false); }
  };

  const handleDragStart = (index) => { dragItem.current = index; };
  const handleDragOver = (index) => { dragOver.current = index; };

  const handleDrop = async () => {
    if (dragItem.current === null || dragOver.current === null) return;
    const updated = [...appointments];
    const draggedItem = updated.splice(dragItem.current, 1)[0];
    updated.splice(dragOver.current, 0, draggedItem);
    setAppointments(updated);
    dragItem.current = null;
    dragOver.current = null;

    // Save new order
    try {
      await physioApi.reorderAppointments({ slotIds: updated.map((a) => a.id) });
      toast.success('Order saved.');
    } catch {
      toast.error('Failed to save order.');
    }
  };

  return (
    <div>
      <header className="app-header">
        <span className="logo">Physio<span>Book</span></span>
        <div className="header-actions">
          <span style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>🩺 Dr. {user.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign Out</button>
        </div>
      </header>

      <div className="page-container">
        <div className="dashboard-tabs">
          <button className={`tab-btn ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>
            Today's Schedule
          </button>
          <button className={`tab-btn ${tab === 'bydate' ? 'active' : ''}`} onClick={() => setTab('bydate')}>
            By Date
          </button>
          <button className={`tab-btn ${tab === 'slots' ? 'active' : ''}`} onClick={() => setTab('slots')}>
            Manage Slots
          </button>
        </div>

        {tab === 'slots' ? (
          <SlotManager onSlotsCreated={() => {}} />
        ) : (
          <>
            {tab === 'bydate' && (
              <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="date" className="form-input" style={{ width: 'auto' }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)} />
                <span style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>
                  {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {tab === 'today' && (
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  Today — {format(new Date(), 'EEEE, dd MMM yyyy')}
                </h2>
                <span className="badge badge-info">{appointments.length} booked</span>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
              </div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No appointments</h3>
                <p>{tab === 'today' ? 'No one has booked today yet.' : 'No bookings for this date.'}</p>
              </div>
            ) : (
              <div className="card">
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                  Drag rows to reorder patient sequence for the day.
                </p>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>#</th>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt, i) => (
                      <AppointmentRow
                        key={appt.id}
                        appt={appt}
                        index={i}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      />
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--teal-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--teal-700)' }}>
                  💰 Total earnings: <strong>₹{appointments.reduce((sum, a) => sum + (a.amountPaid || 0), 0)}</strong>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}