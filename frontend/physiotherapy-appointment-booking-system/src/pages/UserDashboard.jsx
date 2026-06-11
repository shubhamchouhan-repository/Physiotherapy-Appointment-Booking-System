import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';

function PaymentModal({ physio, slot, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    if (cardNum.replace(/\s/g, '').length < 12) { toast.error('Enter a valid card number'); return; }
    setLoading(true);
    // Mock payment - generate transaction ID
    const txnId = 'TXN' + Date.now();
    try {
      await userApi.bookAppointment({
        slotId: slot.id,
        paymentTransactionId: txnId,
        amountPaid: physio.feesPerAppointment,
      });
      toast.success('Appointment booked! Confirmation email sent.');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 className="modal-title">💳 Complete Payment</h3>
        <div className="payment-summary">
          <div className="payment-row"><span>Physiotherapist</span><span>Dr. {physio.name}</span></div>
          <div className="payment-row"><span>Date</span><span>{format(new Date(slot.date), 'dd MMM yyyy')}</span></div>
          <div className="payment-row"><span>Time</span><span>{slot.startTime} – {slot.endTime}</span></div>
          <div className="payment-row total"><span>Total</span><span>₹{physio.feesPerAppointment}</span></div>
        </div>
        <form onSubmit={handlePay}>
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
              value={cardNum}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim();
                setCardNum(v);
              }}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expiry</label>
              <input className="form-input" placeholder="MM/YY" maxLength={5}
                value={expiry}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g,'');
                  if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2);
                  setExpiry(v);
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input className="form-input" placeholder="123" maxLength={3}
                value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g,''))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Processing…' : `Pay ₹${physio.feesPerAppointment}`}
            </button>
          </div>
        </form>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textAlign: 'center', marginTop: '0.75rem' }}>
          🔒 This is a mock payment for demo purposes
        </p>
      </div>
    </div>
  );
}

function PhysioDetail({ physio, onBack, onBooked }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const fetchSlots = async (date) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    try {
      const res = await userApi.getAvailableSlots(physio.id, date);
      setSlots(res.data);
    } catch {
      toast.error('Failed to load slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => { fetchSlots(selectedDate); }, [selectedDate]);

  const handleBooked = () => {
    setShowPayment(false);
    setSelectedSlot(null);
    fetchSlots(selectedDate);
    onBooked();
  };

  return (
    <>
      <button className="btn btn-ghost" style={{ marginBottom: '1.25rem' }} onClick={onBack}>
        ← Back to Physiotherapists
      </button>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div className="physio-avatar" style={{ width: '72px', height: '72px', fontSize: '1.8rem', flexShrink: 0 }}>
            {physio.name[0]}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--teal-900)', marginBottom: '0.3rem' }}>
              Dr. {physio.name}
            </h2>
            <span className="physio-spec">{physio.specialization}</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.5rem' }}>
              <div>🎓 {physio.qualification}</div>
              {physio.clinicAddress && <div>📍 {physio.clinicAddress}</div>}
              {physio.contactNumber && <div>📞 {physio.contactNumber}</div>}
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '1.1rem', fontWeight: '700', color: 'var(--teal-700)' }}>
              ₹{physio.feesPerAppointment} <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--slate-500)' }}>per session</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Available Slots</h2>
            <input type="date" className="form-input" style={{ width: 'auto' }}
              value={selectedDate} min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        </div>

        {loadingSlots ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : slots.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No slots available</h3>
            <p>Try selecting a different date</p>
          </div>
        ) : (
          <>
            <div className="slot-grid">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  className={`slot-chip ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(selectedSlot?.id === slot.id ? null : slot)}
                >
                  <div>{slot.startTime}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>to {slot.endTime}</div>
                </button>
              ))}
            </div>
            {selectedSlot && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--teal-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--teal-200)' }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--teal-700)', marginBottom: '0.75rem' }}>
                  Selected: <strong>{selectedSlot.startTime} – {selectedSlot.endTime}</strong> on {format(new Date(selectedDate), 'dd MMM yyyy')}
                </div>
                <button className="btn btn-primary" onClick={() => setShowPayment(true)}>
                  Book & Pay ₹{physio.feesPerAppointment}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showPayment && selectedSlot && (
        <PaymentModal
          physio={physio}
          slot={{ ...selectedSlot, date: selectedDate }}
          onClose={() => setShowPayment(false)}
          onSuccess={handleBooked}
        />
      )}
    </>
  );
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('browse');
  const [physios, setPhysios] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPhysio, setSelectedPhysio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhysios();
    fetchAppointments();
  }, []);

  const fetchPhysios = async () => {
    try {
      const res = await userApi.getPhysiotherapists();
      setPhysios(res.data);
    } catch {
      toast.error('Failed to load physiotherapists.');
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await userApi.getMyAppointments();
      setAppointments(res.data);
    } catch { /* silent */ }
  };

  const handleBooked = () => {
    fetchAppointments();
    setTab('appointments');
    setSelectedPhysio(null);
  };

  return (
    <div>
      <header className="app-header">
        <span className="logo">Physio<span>Book</span></span>
        <div className="header-actions">
          <span style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>👋 {user.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign Out</button>
        </div>
      </header>

      <div className="page-container">
        {!selectedPhysio && (
          <div className="dashboard-tabs">
            <button className={`tab-btn ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>
              Find Physio
            </button>
            <button className={`tab-btn ${tab === 'appointments' ? 'active' : ''}`} onClick={() => { setTab('appointments'); fetchAppointments(); }}>
              My Appointments {appointments.length > 0 && <span className="badge badge-info" style={{ marginLeft: '0.3rem' }}>{appointments.length}</span>}
            </button>
          </div>
        )}

        {selectedPhysio ? (
          <PhysioDetail
            physio={selectedPhysio}
            onBack={() => setSelectedPhysio(null)}
            onBooked={handleBooked}
          />
        ) : tab === 'browse' ? (
          <>
            <h2 className="section-title">Available Physiotherapists</h2>
            {physios.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🩺</div>
                <h3>No physiotherapists yet</h3>
                <p>Check back soon</p>
              </div>
            ) : (
              <div className="physio-grid">
                {physios.map((p) => (
                  <div key={p.id} className="physio-card" onClick={() => setSelectedPhysio(p)}>
                    <div className="physio-avatar">{p.name[0]}</div>
                    <div className="physio-name">Dr. {p.name}</div>
                    <div className="physio-spec">{p.specialization}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', margin: '0.5rem 0' }}>
                      🎓 {p.qualification}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="physio-fee">₹{p.feesPerAppointment} <span>/ session</span></div>
                      <span className="btn btn-primary btn-sm">Book →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="section-title">Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No upcoming appointments</h3>
                <p>Book a session with a physiotherapist to get started</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setTab('browse')}>
                  Browse Physiotherapists
                </button>
              </div>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} className="appointment-item">
                  <div className="appt-date-block">
                    <div className="appt-date-day">{format(new Date(appt.date), 'd')}</div>
                    <div className="appt-date-month">{format(new Date(appt.date), 'MMM')}</div>
                  </div>
                  <div className="appt-info">
                    <div className="appt-physio">Dr. {appt.physiotherapistName}</div>
                    <div className="appt-time">
                      {appt.startTime} – {appt.endTime} · {appt.physiotherapistSpecialization}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <span className={`badge ${appt.status === 'CONFIRMED' ? 'badge-success' : appt.status === 'CANCELLED' ? 'badge-danger' : 'badge-info'}`}>
                      {appt.status}
                    </span>
                    <div className="appt-amount">₹{appt.amountPaid}</div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}