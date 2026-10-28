import React, { useState } from 'react';
import { 
  Clock, ShieldAlert, CheckCircle2, AlertTriangle, FileText, 
  RefreshCw, LogOut, Upload, ArrowRight, Check, X, ShieldCheck 
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../utils/audioEffects';

export default function ApplicationStatusView({
  user,
  role, // 'seller' | 'rider'
  statusData,
  onResubmit,
  onLogout,
  onRefresh
}) {
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: statusData?.shop_name || statusData?.name || '',
    gstin: statusData?.gstin || '',
    pan_number: statusData?.pan_number || '',
    trade_license: statusData?.trade_license || '',
    license_number: statusData?.license_number || '',
    aadhaar_number: statusData?.aadhaar_number || '',
    vehicle_number: statusData?.vehicle_number || '',
    address: statusData?.address || '',
    docNote: ''
  });

  const status = (statusData?.verification_status || 'pending').toLowerCase();

  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return {
          label: 'Application Approved ✓',
          desc: 'Your application has been verified and approved by Nivvo Compliance. All operations are live.',
          color: '#238636',
          bg: '#E8F5E9',
          icon: <CheckCircle2 size={24} color="#238636" />
        };
      case 'under_review':
        return {
          label: 'Under Compliance Review',
          desc: 'Nivvo Verification Team is actively inspecting your business documents and credentials.',
          color: '#1D4ED8',
          bg: '#EFF6FF',
          icon: <Clock size={24} color="#1D4ED8" />
        };
      case 'additional_info_required':
        return {
          label: 'Additional Information Required',
          desc: 'Our compliance officers need updated or clearer documents to complete your verification.',
          color: '#D97706',
          bg: '#FFFBEB',
          icon: <AlertTriangle size={24} color="#D97706" />
        };
      case 'rejected':
        return {
          label: 'Application Rejected',
          desc: 'Your application could not be approved based on the submitted credentials. See feedback below.',
          color: '#BD3838',
          bg: '#FEF2F2',
          icon: <X size={24} color="#BD3838" />
        };
      case 'suspended':
        return {
          label: 'Account Suspended',
          desc: 'Your partner account has been suspended due to compliance or operational policy violations.',
          color: '#BD3838',
          bg: '#FEF2F2',
          icon: <ShieldAlert size={24} color="#BD3838" />
        };
      case 'pending':
      default:
        return {
          label: 'Pending Company Verification',
          desc: 'Your registration has been received. Nivvo Company Review is typically completed within 2 to 4 business hours.',
          color: '#B45309',
          bg: '#FEF3C7',
          icon: <Clock size={24} color="#B45309" />
        };
    }
  };

  const badge = getStatusBadge();

  const handleResubmitSubmit = async (e) => {
    e.preventDefault();
    playTrialSound();
    if (onResubmit) {
      await onResubmit(formData);
      setIsResubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '24px 20px',
      backgroundColor: '#FFFFFF',
      minHeight: '100%',
      fontFamily: 'var(--nv-font, sans-serif)'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/assets/nivvo_header_logo.svg" alt="Nivvo" width="28" height="28" style={{ borderRadius: '8px' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#20251F', letterSpacing: '-0.02em' }}>nivvo</div>
            <div style={{ fontSize: '10px', color: '#73796F', fontWeight: 600 }}>PARTNER ONBOARDING PORTAL</div>
          </div>
        </div>

        <button
          onClick={() => { playClickSound(); onLogout?.(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#F7F8F5',
            border: '1px solid #E7EAE3',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#73796F',
            cursor: 'pointer'
          }}
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Status Hero Card */}
      <div style={{
        backgroundColor: badge.bg,
        border: `1.5px solid ${badge.color}`,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          {badge.icon}
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#20251F', margin: '0 0 6px 0' }}>
          {badge.label}
        </h2>
        <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, lineHeight: 1.45 }}>
          {badge.desc}
        </p>

        <div style={{
          display: 'inline-block',
          backgroundColor: '#FFFFFF',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 700,
          color: badge.color,
          marginTop: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          {role === 'seller' ? `Shop ID: ${statusData?.shop_id || 'Generating...'}` : `Partner ID: ${statusData?.partner_id || 'Generating...'}`}
        </div>
      </div>

      {/* Verification Stepper */}
      <div style={{
        border: '1px solid #E7EAE3',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '20px',
        backgroundColor: '#FDFDFD'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#20251F', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Verification Progress
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { step: 1, title: 'Application Submitted', desc: 'Owner & business profile registered', done: true },
            { step: 2, title: 'Document Verification', desc: 'GSTIN, PAN & identity checks in progress', done: status !== 'pending' },
            { step: 3, title: 'Nivvo Company Review', desc: 'Compliance & dark-store dispatch sign-off', done: status === 'approved' },
            { step: 4, title: 'Live Activation', desc: 'Catalog publication and live order access', done: status === 'approved' }
          ].map((s) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: s.done ? '#B7F34A' : '#EDEFEA',
                color: '#20251F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                flexShrink: 0
              }}>
                {s.done ? <Check size={14} strokeWidth={3} /> : s.step}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: s.done ? '#20251F' : '#9CA3AF' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '11px', color: '#73796F' }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes / Rejection Reason (If Present) */}
      {(statusData?.admin_notes || statusData?.rejection_reason) && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#92400E', marginBottom: '6px' }}>
            <AlertTriangle size={15} />
            <span>Nivvo Compliance Feedback</span>
          </div>
          {statusData?.rejection_reason && (
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#B91C1C', marginBottom: '4px' }}>
              Reason: {statusData.rejection_reason}
            </div>
          )}
          {statusData?.admin_notes && (
            <p style={{ fontSize: '12px', color: '#78350F', margin: 0, lineHeight: 1.45 }}>
              {statusData.admin_notes}
            </p>
          )}
        </div>
      )}

      {/* Resubmission Section (Available if rejected or additional info needed) */}
      {(status === 'additional_info_required' || status === 'rejected' || status === 'under_review' || isResubmitting) && (
        <div style={{
          border: '1px solid #E7EAE3',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#20251F' }}>
              Resubmit Corrected Information
            </h3>
            <button
              onClick={() => setIsResubmitting(!isResubmitting)}
              style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              {isResubmitting ? 'Collapse' : 'Edit Application ▾'}
            </button>
          </div>

          {isResubmitting && (
            <form onSubmit={handleResubmitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {role === 'seller' ? (
                <>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', display: 'block', marginBottom: '4px' }}>
                      Shop / Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.shop_name}
                      onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', display: 'block', marginBottom: '4px' }}>
                      GSTIN Number (15 Digits)
                    </label>
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', display: 'block', marginBottom: '4px' }}>
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      value={formData.pan_number}
                      onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', display: 'block', marginBottom: '4px' }}>
                      Physical Shop Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', display: 'block', marginBottom: '4px' }}>
                      Driving License Number
                    </label>
                    <input
                      type="text"
                      value={formData.license_number}
                      onChange={(e) => setFormData({ ...formData, license_number: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', display: 'block', marginBottom: '4px' }}>
                      Vehicle Registration Plate (e.g. KA-03-EV-1234)
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle_number}
                      onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                style={{
                  backgroundColor: '#20251F',
                  color: '#B7F34A',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '6px'
                }}
              >
                <span>Submit Corrected Application</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={() => { playClickSound(); onRefresh?.(); }}
          style={{
            flex: 1,
            backgroundColor: '#24452D',
            color: '#FFFFFF',
            padding: '14px',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={16} />
          <span>Check Status Refresh</span>
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '20px' }}>
        Protected by Nivvo Compliance & Commercial Governance · Need help? Contact compliance@nivvo.in
      </p>
    </div>
  );
}
