import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../services/api';

export default function RegisterPage() {
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const [userForm, setUserForm] = useState({
    name: '', email: '', password: '', age: '', gender: 'MALE', contactNumber: ''
  });

  const [physioForm, setPhysioForm] = useState({
    name: '', email: '', password: '', qualification: '',
    specialization: '', clinicAddress: '', feesPerAppointment: '', contactNumber: ''
  });

  const handleUserChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handlePhysioChange = (e) => setPhysioForm({ ...physioForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (role === 'USER') {
        await authApi.registerUser({ ...userForm, age: Number(userForm.age) });
      } else {
        await authApi.registerPhysio({ ...physioForm, feesPerAppointment: Number(physioForm.feesPerAppointment) });
      }
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h2 className="auth-title">Check your email</h2>
          <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
            We've sent a verification link to your email address. Please verify to activate your account.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="auth-container">
        <div className="auth-logo">
          <h1 className="logo">Physio<span>Book</span></h1>
        </div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Who are you joining as?</p>

        <div className="role-selector">
          <div className={`role-card ${role === 'USER' ? 'active' : ''}`} onClick={() => setRole('USER')}>
            <div className="role-icon">🙋</div>
            <h3>Patient</h3>
            <p>Book appointments with physios</p>
          </div>
          <div className={`role-card ${role === 'PHYSIOTHERAPIST' ? 'active' : ''}`} onClick={() => setRole('PHYSIOTHERAPIST')}>
            <div className="role-icon">🩺</div>
            <h3>Physiotherapist</h3>
            <p>Manage your practice & patients</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {role === 'USER' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" name="name" required placeholder="Arjun Sharma"
                    value={userForm.name} onChange={handleUserChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" name="email" required placeholder="you@example.com"
                    value={userForm.email} onChange={handleUserChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" name="password" required placeholder="Min. 8 characters"
                  value={userForm.password} onChange={handleUserChange} minLength={8} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" className="form-input" name="age" placeholder="28"
                    value={userForm.age} onChange={handleUserChange} min={1} max={120} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" name="gender" value={userForm.gender} onChange={handleUserChange}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input className="form-input" name="contactNumber" placeholder="+91 98765 43210"
                  value={userForm.contactNumber} onChange={handleUserChange} />
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" name="name" required placeholder="Dr. Priya Nair"
                    value={physioForm.name} onChange={handlePhysioChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" name="email" required placeholder="dr@clinic.com"
                    value={physioForm.email} onChange={handlePhysioChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" name="password" required
                  value={physioForm.password} onChange={handlePhysioChange} minLength={8} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input className="form-input" name="qualification" required placeholder="BPTh, MPTh"
                    value={physioForm.qualification} onChange={handlePhysioChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input className="form-input" name="specialization" required placeholder="Sports Injury"
                    value={physioForm.specialization} onChange={handlePhysioChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Clinic Address</label>
                <input className="form-input" name="clinicAddress" placeholder="123 MG Road, Pune"
                  value={physioForm.clinicAddress} onChange={handlePhysioChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fees per Appointment (₹)</label>
                  <input type="number" className="form-input" name="feesPerAppointment" required placeholder="800"
                    value={physioForm.feesPerAppointment} onChange={handlePhysioChange} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input className="form-input" name="contactNumber" placeholder="+91 98765 43210"
                    value={physioForm.contactNumber} onChange={handlePhysioChange} />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}