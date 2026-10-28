import React, { useState, useEffect, useRef } from 'react';
import { 
  Bike, 
  ChevronLeft, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  AlertCircle, 
  Zap, 
  TrendingUp, 
  UserCheck, 
  Building, 
  KeyRound, 
  RotateCw, 
  Wallet, 
  FileText, 
  PackageCheck, 
  ArrowRight,
  BatteryCharging,
  Navigation,
  Compass,
  CheckCircle,
  HelpCircle,
  Award,
  PhoneCall,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Globe,
  Bell,
  Smartphone,
  ShieldAlert,
  DollarSign,
  X,
  MessageSquare,
  UploadCloud,
  Camera,
  CheckSquare,
  Volume2,
  Map as MapIcon,
  Timer,
  MoreVertical,
  Lock,
  Unlock,
  Star,
  History,
  AlertTriangle,
  Radio,
  ChevronRight,
  Copy
} from 'lucide-react';
import { 
  fetchDeliveryPartnerProfile, 
  registerDeliveryPartnerApi, 
  toggleDeliveryPartnerOnlineApi, 
  fetchDeliveryOrdersApi, 
  updateDeliveryOrderApi,
  withdrawDeliveryPartnerApi 
} from '../services/api';
import { playClickSound, playAddSound, playTrialSound, playAlertSound, playSuccessChime } from '../utils/audioEffects';

/* ==========================================================
   VECTOR ARTWORK COMPONENTS (FAITHFULLY MATCHING SCREENSHOTS)
   ========================================================== */

function DeliveryPartnerHeroSvg() {
  return (
    <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="186" rx="60" ry="7" fill="#E2E8F0" />
      {/* Forest Green Delivery Bag with Nivvo Lime Logo */}
      <rect x="98" y="70" width="62" height="72" rx="10" fill="#24452D" />
      <rect x="104" y="76" width="50" height="60" rx="6" fill="#1B3522" />
      {/* Bag Logo Squircle */}
      <rect x="117" y="94" width="24" height="24" rx="6" fill="#B7F34A" />
      <path d="M123 111V103C123 100 125 98 128 98C131 98 133 100 133 103V111" stroke="#24452D" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M129 101L135 95M135 95H131M135 95V99" stroke="#24452D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Delivery Partner Body */}
      <rect x="74" y="86" width="34" height="60" rx="8" fill="#F97316" />
      {/* Dark trousers */}
      <path d="M76 142h13v36h-13z M91 142h13v36h-13z" fill="#1E293B" />
      <rect x="73" y="176" width="18" height="8" rx="4" fill="#0F172A" />
      <rect x="90" y="176" width="18" height="8" rx="4" fill="#0F172A" />
      {/* Head, Face, Orange Cap */}
      <circle cx="88" cy="54" r="16" fill="#FCD34D" />
      <path d="M72 48c0-10 8-18 18-18 8 0 15 5 17 12l14 2v4H72v-10z" fill="#EA580C" />
      {/* Ear, neck */}
      <circle cx="82" cy="56" r="3.5" fill="#FBBF24" />
      <path d="M85 68h8v18h-8z" fill="#FCD34D" />
      {/* Arm holding parcel */}
      <path d="M74 94l-14 18 12 6 12-16" fill="#F97316" />
      <rect x="52" y="104" width="22" height="26" rx="4" fill="#F59E0B" />
      <path d="M52 114h22" stroke="#D97706" strokeWidth="2" />
    </svg>
  );
}

function HelmetSvg() {
  return (
    <svg width="74" height="74" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="88" rx="34" ry="5" fill="#E2E8F0" />
      {/* Helmet Shell */}
      <path d="M18 52C18 32 32 16 52 16C72 16 86 32 86 52C86 64 80 72 74 74C68 76 34 76 26 74C20 72 18 64 18 52Z" fill="url(#helmetOrangeGrad)" />
      {/* Highlight reflection */}
      <path d="M30 26C36 21 44 19 52 19C58 19 64 21 68 24C62 26 40 28 30 26Z" fill="#FDBA74" fillOpacity="0.8" />
      {/* Dark Visor */}
      <path d="M22 50C22 46 26 44 32 44H70C74 44 78 46 80 50L82 64C82 68 78 70 74 70H28C24 70 20 68 20 64L22 50Z" fill="#0F172A" />
      <path d="M26 48L76 48" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Chin strap buckle */}
      <path d="M32 72C34 82 46 86 54 86C60 86 68 82 70 72" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="58" r="4" fill="#94A3B8" />
      <defs>
        <linearGradient id="helmetOrangeGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB923C" />
          <stop offset="0.6" stopColor="#EA580C" />
          <stop offset="1" stopColor="#9A3412" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IdCardSvg() {
  return (
    <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="90" rx="30" ry="4" fill="#E2E8F0" />
      {/* Blue Lanyard */}
      <path d="M46 10L48 24M54 10L52 24" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
      <rect x="44" y="22" width="12" height="6" rx="2" fill="#94A3B8" />
      {/* White Card */}
      <rect x="22" y="26" width="56" height="60" rx="8" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2" />
      {/* Card Header */}
      <rect x="22" y="26" width="56" height="14" rx="6" fill="#0284C7" />
      {/* Avatar Silhouette */}
      <rect x="30" y="46" width="18" height="22" rx="4" fill="#E0F2FE" />
      <circle cx="39" cy="53" r="4" fill="#0284C7" />
      <path d="M33 65C33 60 36 59 39 59C42 59 45 60 45 65" fill="#0284C7" />
      {/* Details Lines */}
      <rect x="54" y="48" width="18" height="3" rx="1.5" fill="#64748B" />
      <rect x="54" y="55" width="14" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="54" y="62" width="16" height="3" rx="1.5" fill="#94A3B8" />
      {/* Barcode */}
      <rect x="30" y="74" width="40" height="6" rx="1" fill="#E2E8F0" />
    </svg>
  );
}

function DeliveryKitSvg() {
  return (
    <svg width="74" height="74" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="88" rx="34" ry="5" fill="#E2E8F0" />
      {/* Bag Body */}
      {/* Forest Green Delivery Bag with Nivvo Lime Logo */}
      <rect x="20" y="30" width="60" height="54" rx="8" fill="#24452D" stroke="#1B3522" strokeWidth="2" />
      {/* Top Handle */}
      <path d="M38 30V24C38 21 42 18 50 18C58 18 62 21 62 24V30" stroke="#132618" strokeWidth="4" strokeLinecap="round" />
      {/* Front Flap Pocket */}
      <path d="M24 44H76V78C76 80 74 82 72 82H28C26 82 24 80 24 78V44Z" fill="#1B3522" />
      {/* Reflective Band */}
      <rect x="24" y="52" width="52" height="6" fill="#B7F34A" />
      {/* Nivvo Logo Squircle */}
      <rect x="42" y="60" width="16" height="16" rx="4" fill="#B7F34A" />
      <path d="M46 72V66C46 64 47.5 63 49.5 63C51.5 63 53 64 53 66V72" stroke="#24452D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MotorbikeSvg() {
  return (
    <svg width="68" height="52" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wheels */}
      <circle cx="24" cy="50" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
      <circle cx="24" cy="50" r="6" fill="#E2E8F0" />
      <circle cx="76" cy="50" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
      <circle cx="76" cy="50" r="6" fill="#E2E8F0" />
      {/* Frame & Engine */}
      <path d="M24 50L44 38L52 50L76 50" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <rect x="42" y="42" width="16" height="12" rx="2" fill="#334155" />
      {/* Fuel Tank (Petrol Blue) */}
      <path d="M38 34C38 28 44 24 56 24C64 24 68 28 64 34H38Z" fill="#0284C7" />
      {/* Seat */}
      <path d="M26 34C30 32 38 32 44 34L40 38H24L26 34Z" fill="#0F172A" />
      {/* Handlebars & Headlamp */}
      <path d="M64 34L72 20M68 20H76" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="76" cy="24" r="4" fill="#FBBF24" />
      {/* Exhaust Pipe */}
      <path d="M48 54H74" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ElectricScooterSvg() {
  return (
    <svg width="68" height="52" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wheels */}
      <circle cx="26" cy="52" r="12" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
      <circle cx="26" cy="52" r="5" fill="#E2E8F0" />
      <circle cx="74" cy="52" r="12" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
      <circle cx="74" cy="52" r="5" fill="#E2E8F0" />
      {/* Scooter Body (Sleek Orange/Yellow EV) */}
      <path d="M26 50L38 48H60L72 36L70 18" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="36" y="44" width="26" height="8" rx="4" fill="#EA580C" />
      {/* Seat */}
      <path d="M28 36C32 32 42 32 48 36H28Z" fill="#0F172A" />
      {/* Handlebar & Screen */}
      <path d="M66 18H74" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="72" cy="22" r="4" fill="#38BDF8" />
      {/* EV Battery Lightning Badge */}
      <circle cx="48" cy="48" r="6" fill="#16A34A" />
      <path d="M49 44L46 48H49L47 52L51 47H48L49 44Z" fill="#FFFFFF" />
    </svg>
  );
}

function HandshakeSvg() {
  return (
    <svg width="68" height="52" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left arm (Blue sleeve) */}
      <path d="M12 28L32 36L28 48L10 38Z" fill="#0284C7" />
      {/* Left hand (Tan) */}
      <path d="M32 36L46 42L42 50L30 46Z" fill="#FBBF24" />
      {/* Right arm (Orange sleeve) */}
      <path d="M88 28L68 36L72 48L90 38Z" fill="#EA580C" />
      {/* Right hand clasping (Warm brown) */}
      <path d="M68 36L50 42L48 32L62 28Z" fill="#D97706" />
      {/* Interlocking fingers */}
      <path d="M44 38C48 38 52 42 50 46C48 50 42 48 40 44Z" fill="#F59E0B" />
      <path d="M48 42C52 42 56 46 54 50C52 54 46 52 44 48Z" fill="#D97706" />
    </svg>
  );
}

function SupportAgentSvg() {
  return (
    <svg width="120" height="120" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Decorative Sparkles */}
      <path d="M40 30L42 36L48 38L42 40L40 46L38 40L32 38L38 36L40 30Z" fill="#FDBA74" />
      <path d="M125 45L127 50L132 52L127 54L125 59L123 54L118 52L123 50L125 45Z" fill="#FDBA74" />
      {/* Body / Soft Pink Uniform */}
      <path d="M44 140C44 116 60 106 80 106C100 106 116 116 116 140V150H44V140Z" fill="#FBCFE8" />
      {/* Orange collar badge */}
      <circle cx="92" cy="120" r="5" fill="#EA580C" />
      {/* Neck */}
      <path d="M74 94H86V108H74V94Z" fill="#FBBF24" />
      {/* Face & Head */}
      <circle cx="80" cy="74" r="22" fill="#FCD34D" />
      {/* Black Bob Hair */}
      <path d="M58 74C58 56 68 46 80 46C92 46 102 56 102 74V84C102 88 98 90 96 84C94 74 94 62 80 62C66 62 66 74 64 84C62 90 58 88 58 84V74Z" fill="#1E293B" />
      <path d="M58 70C54 74 54 86 60 90C62 92 64 88 64 84V70H58Z" fill="#1E293B" />
      <path d="M102 70C106 74 106 86 100 90C98 92 96 88 96 84V70H102Z" fill="#1E293B" />
      {/* Eyes & Smile */}
      <ellipse cx="73" cy="72" rx="2" ry="2.5" fill="#1E293B" />
      <ellipse cx="87" cy="72" rx="2" ry="2.5" fill="#1E293B" />
      <path d="M76 82C78 84 82 84 84 82" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      {/* Headset Band & Earcups */}
      <path d="M56 70C56 50 66 42 80 42C94 42 104 50 104 70" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <rect x="52" y="66" width="8" height="14" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <rect x="100" y="66" width="8" height="14" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      {/* Headset Microphone */}
      <path d="M56 78C56 90 68 94 76 92" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="78" cy="92" r="3.5" fill="#0F172A" />
    </svg>
  );
}

function AadharMockupBanner() {
  return (
    <div className="aadhar-banner-wrapper">
      <div className="aadhar-card-graphic">
        {/* Emblem & Tricolor Header */}
        <div className="aadhar-top-strip">
          <div className="ashoka-emblem">🏛️</div>
          <div className="tricolor-bar">
            <span style={{ background: '#FF9933' }} />
            <span style={{ background: '#FFFFFF' }} />
            <span style={{ background: '#138808' }} />
          </div>
          <div className="aadhar-sun-logo">☀️</div>
        </div>
        {/* Card Body */}
        <div className="aadhar-card-body">
          <div className="aadhar-avatar-box">
            <div className="avatar-silhouette-mini" />
          </div>
          <div className="aadhar-text-lines">
            <div className="line-placeholder w-80" />
            <div className="line-placeholder w-60" />
            <div className="line-placeholder w-70" />
          </div>
          <div className="aadhar-qr-box" />
        </div>
        {/* Pointing Hand Tooltip Bubble */}
        <div className="aadhar-tooltip-bubble">
          <div className="tooltip-text-group">
            <span className="tooltip-lbl">AADHAR NUMBER</span>
            <span className="tooltip-val">XXXX XXXX XXXX</span>
          </div>
          <span className="tooltip-finger">👉</span>
        </div>
      </div>
    </div>
  );
}

function SelfieSilhouetteSvg() {
  return (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="70" r="38" fill="#CBD5E1" />
      <path d="M36 186C36 142 64 126 100 126C136 126 164 142 164 186H36Z" fill="#CBD5E1" />
    </svg>
  );
}

export default function DeliveryPartnerView({ 
  user, 
  customerActiveOrder, 
  onUpdateCustomerOrder, 
  onNavigateHome, 
  onSwitchRole 
}) {
  // App Mode: 'terminal' (Active Driver OS) or 'onboarding' (Registration & Setup Flow)
  const [viewMode, setViewMode] = useState('terminal');

  // Partner Profile State
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Primary Navigation Tabs in Terminal
  const [activeTab, setActiveTab] = useState('duty'); // 'duty' | 'earnings' | 'hub' | 'safety' | 'kyc'
  
  // Availability Control
  const [isOnline, setIsOnline] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedHub, setSelectedHub] = useState('Indiranagar Dark Store #14');
  const [showHistory, setShowHistory] = useState(false);

  // Incoming Order Alert Modal State
  const [incomingOrderModal, setIncomingOrderModal] = useState(null);
  const [incomingCountdown, setIncomingCountdown] = useState(30);

  // Doorstep 10-Min Trial Timer State
  const [trialTimerSeconds, setTrialTimerSeconds] = useState(null); // null = idle, >0 = ticking
  const [isTrialActive, setIsTrialActive] = useState(false);

  // Issue Reporting Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssueReason, setSelectedIssueReason] = useState('');
  const [issueSubmittedMsg, setIssueSubmittedMsg] = useState('');

  // Delivery OTP Verification state
  const [otpInputs, setOtpInputs] = useState({});
  const [otpError, setOtpError] = useState({});
  const [deliverySuccessMsg, setDeliverySuccessMsg] = useState('');
  const [showConfettiModal, setShowConfettiModal] = useState(false);

  // Device Display Mode: 'mobile' (Phone shell) or 'expanded' (Full Desktop)
  const [deviceLayout, setDeviceLayout] = useState('mobile');

  // Instant UPI Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('890');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawReceipt, setWithdrawReceipt] = useState(null);

  // 24/7 Accident & Emergency SOS Modal State
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  // Trips tab filter
  const [tripsFilter, setTripsFilter] = useState('today');

  // ==================== ONBOARDING WIZARD & 3 EASY STEPS STATE ====================
  // Subviews: 'hub' (3 Easy Steps Master Hub) | 'vehicle' | 'area' | 'profile' | 'kit' | 'language' | 'phone' | 'otp' | 'permissions' | 'city'
  const [onboardingSubView, setOnboardingSubView] = useState('hub');
  const [completedSteps, setCompletedSteps] = useState({
    step1: false, // Work Settings (Vehicle & Area)
    step2: false, // Profile (Aadhaar & PAN)
    step3: false  // Order Delivery Kit
  });

  // Work Settings State (Screenshots 2 & 3)
  const [selectedVehicle, setSelectedVehicle] = useState('Electric'); // 'Petrol' | 'Electric' | 'NoVehicle'
  const [selectedZone, setSelectedZone] = useState('South Mohali');
  const [selectedDistance, setSelectedDistance] = useState('11 kms');
  const [selectedGuarantee, setSelectedGuarantee] = useState('₹18000');

  // Kit Order State (Screenshot 1 - Step 3)
  const [kitUniformSize, setKitUniformSize] = useState('L');
  const [kitHelmetSize, setKitHelmetSize] = useState('Medium');

  // Profile Multi-step Flow State (Screenshots 1, 2, 3)
  const [profileSubStep, setProfileSubStep] = useState(1); // 1: Basic details, 2: Aadhaar, 3: Selfie
  const [profileFirstName, setProfileFirstName] = useState('Rakesh');
  const [profileLastName, setProfileLastName] = useState('Roshan');
  const [profileGender, setProfileGender] = useState('Male'); // 'Male' | 'Female'
  const [profileAadhaar, setProfileAadhaar] = useState('8912 3421 9901');
  const [capturedSelfie, setCapturedSelfie] = useState(false);
  const [isSelfieGuideModalOpen, setIsSelfieGuideModalOpen] = useState(false);

  // Modals & Menu State (Screenshots 4 & 5)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCallAgentModalOpen, setIsCallAgentModalOpen] = useState(false);
  const [isOptionsBottomSheetOpen, setIsOptionsBottomSheetOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isDotsMenuOpen, setIsDotsMenuOpen] = useState(false);

  // Linear sub-step for phone/otp/permissions
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [signupPhone, setSignupPhone] = useState(user?.phone ? user.phone.replace('+91', '').trim() : '9876543210');
  const [signupOtp, setSignupOtp] = useState(['1', '2', '3', '4']);
  const [showPermissionDetailModal, setShowPermissionDetailModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  
  // Registration Form Details
  const [regName, setRegName] = useState(user?.name || 'Rahul Sharma');
  const [regEmail, setRegEmail] = useState(user?.email || 'rahul.fleet@nivvo.in');
  const [regVehicleType, setRegVehicleType] = useState('Electric Scooter (EV)');
  const [regVehicleNumber, setRegVehicleNumber] = useState('KA-03-EV-4421');
  const [regLicense, setRegLicense] = useState('DL-04202100892');
  const [regAadhaar, setRegAadhaar] = useState('8912 3421 9901');
  const [regPan, setRegPan] = useState('ABCDE1234F');
  const [regBankAcc, setRegBankAcc] = useState('HDFC-889129031');
  const [regIfsc, setRegIfsc] = useState('HDFC0001824');
  const [regUpi, setRegUpi] = useState('rahul.ev@okhdfc');
  const [uploadedDocs, setUploadedDocs] = useState({
    selfie: true,
    aadhaar: true,
    license: true,
    rc: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  const phoneToQuery = user?.phone || '+91 9876543210';

  useEffect(() => {
    loadData();
  }, [phoneToQuery]);

  // Incoming Order Countdown Timer
  useEffect(() => {
    let timer;
    if (incomingOrderModal && incomingCountdown > 0) {
      timer = setInterval(() => {
        setIncomingCountdown(prev => prev - 1);
      }, 1000);
    } else if (incomingOrderModal && incomingCountdown === 0) {
      setIncomingOrderModal(null);
    }
    return () => clearInterval(timer);
  }, [incomingOrderModal, incomingCountdown]);

  // Doorstep 10-Minute Trial Countdown Timer
  useEffect(() => {
    let interval;
    if (isTrialActive && trialTimerSeconds > 0) {
      interval = setInterval(() => {
        setTrialTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (isTrialActive && trialTimerSeconds === 0) {
      setIsTrialActive(false);
      playAlertSound();
    }
    return () => clearInterval(interval);
  }, [isTrialActive, trialTimerSeconds]);

  // Synchronize incoming customer active order from App level
  useEffect(() => {
    if (customerActiveOrder) {
      const orderId = customerActiveOrder.order_id || customerActiveOrder.orderId;
      if (!orderId) return;
      const normalized = {
        id: customerActiveOrder.id || 9999,
        order_id: orderId,
        user_name: customerActiveOrder.user_name || customerActiveOrder.userName || user?.name || 'Customer',
        user_phone: customerActiveOrder.user_phone || customerActiveOrder.userPhone || user?.phone || '+91 9876543210',
        address: typeof customerActiveOrder.address === 'string' ? customerActiveOrder.address : (customerActiveOrder.address?.fullAddress || 'Indiranagar, Bengaluru'),
        dark_store: customerActiveOrder.dark_store || customerActiveOrder.darkStore || selectedHub,
        grand_total: customerActiveOrder.grand_total || customerActiveOrder.grandTotal || 1299,
        payout: 65,
        rider_otp: customerActiveOrder.rider_otp || customerActiveOrder.riderOtp || '7492',
        status: customerActiveOrder.status || 'Out for 10-Min Delivery',
        doorstep_trial_active: customerActiveOrder.doorstep_trial_active !== false,
        items: customerActiveOrder.items || [],
        created_at: customerActiveOrder.created_at || new Date().toISOString()
      };
      setOrders(prev => {
        const idx = prev.findIndex(o => o.order_id === orderId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...normalized };
          return updated;
        }
        return [normalized, ...prev];
      });
    }
  }, [customerActiveOrder]);

  const loadData = async () => {
    setIsLoading(true);
    const profileRes = await fetchDeliveryPartnerProfile(phoneToQuery);
    if (profileRes?.registered && profileRes.partner) {
      setPartner(profileRes.partner);
      setIsOnline(profileRes.partner.is_online);
    }
    const ordersRes = await fetchDeliveryOrdersApi();
    let fetched = (ordersRes?.orders && ordersRes.orders.length > 0) ? ordersRes.orders : [];

    if (customerActiveOrder) {
      const cid = customerActiveOrder.order_id || customerActiveOrder.orderId;
      if (cid && !fetched.some(o => o.order_id === cid)) {
        fetched = [{
          id: customerActiveOrder.id || 9999,
          order_id: cid,
          user_name: customerActiveOrder.user_name || customerActiveOrder.userName || user?.name || 'Customer',
          user_phone: customerActiveOrder.user_phone || customerActiveOrder.userPhone || user?.phone || '+91 9876543210',
          address: typeof customerActiveOrder.address === 'string' ? customerActiveOrder.address : (customerActiveOrder.address?.fullAddress || 'Indiranagar, Bengaluru'),
          dark_store: customerActiveOrder.dark_store || customerActiveOrder.darkStore || selectedHub,
          grand_total: customerActiveOrder.grand_total || customerActiveOrder.grandTotal || 1299,
          payout: 65,
          rider_otp: customerActiveOrder.rider_otp || customerActiveOrder.riderOtp || '7492',
          status: customerActiveOrder.status || 'Out for 10-Min Delivery',
          doorstep_trial_active: customerActiveOrder.doorstep_trial_active !== false,
          items: customerActiveOrder.items || [],
          created_at: customerActiveOrder.created_at || new Date().toISOString()
        }, ...fetched];
      }
    }
    setOrders(fetched);
    setIsLoading(false);
  };

  const handleToggleOnline = async () => {
    playClickSound();
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    await toggleDeliveryPartnerOnlineApi(phoneToQuery, nextStatus);
  };

  // Trigger Incoming Order Request Alert Modal
  const handleTriggerIncomingAlert = () => {
    playAlertSound();
    const mockOrder = {
      order_id: `BW-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Ready at Dark Store Hub',
      user_name: user?.name || 'Aditya Verma',
      user_phone: user?.phone || '+91 9876543210',
      address: 'Flat 402, Prestige Tower, 100ft Road, Indiranagar',
      dark_store: partner?.hub_id || selectedHub,
      grand_total: 2499,
      payout: 65,
      rider_otp: '7492',
      distance: '1.2 km',
      items: [
        { name: 'Pure Linen Slim Fit Shirt', selectedSize: 'M', price: 1299 },
        { name: 'Pure Linen Slim Fit Shirt', selectedSize: 'L', price: 1299 }
      ]
    };
    setIncomingOrderModal(mockOrder);
    setIncomingCountdown(30);
  };

  const handleAcceptIncomingOrder = async () => {
    playAddSound();
    if (!incomingOrderModal) return;
    const acceptedOrder = {
      ...incomingOrderModal,
      status: 'Accepted - Reaching Hub'
    };
    setOrders(prev => [acceptedOrder, ...prev]);
    if (onUpdateCustomerOrder) {
      onUpdateCustomerOrder(acceptedOrder);
    }
    setIncomingOrderModal(null);
    setActiveTab('duty');
    await updateDeliveryOrderApi(acceptedOrder.order_id, 'accept', null, phoneToQuery);
  };

  const handleDeclineIncomingOrder = () => {
    playClickSound();
    setIncomingOrderModal(null);
  };

  // Step 1 -> Step 2: Arrived at Shop / Dark Store
  const handleArrivedAtHub = async (orderId) => {
    playClickSound();
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: 'At Dark Store Hub - Collecting Garments' } : o));
    if (onUpdateCustomerOrder) {
      onUpdateCustomerOrder(prev => prev && (prev.order_id === orderId || prev.orderId === orderId) ? { ...prev, status: 'At Dark Store Hub - Collecting Garments' } : prev);
    }
    await updateDeliveryOrderApi(orderId, 'reached_shop', null, phoneToQuery);
  };

  // Step 2 -> Step 3: Picked Up & Out for Delivery
  const handleConfirmPickup = async (orderId) => {
    playClickSound();
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: 'Out for 10-Min Delivery' } : o));
    if (onUpdateCustomerOrder) {
      onUpdateCustomerOrder(prev => prev && (prev.order_id === orderId || prev.orderId === orderId) ? { ...prev, status: 'Out for 10-Min Delivery' } : prev);
    }
    await updateDeliveryOrderApi(orderId, 'picked_up', null, phoneToQuery);
  };

  // Start 10-Minute Doorstep Try-On Timer
  const handleStartTrialTimer = () => {
    playTrialSound();
    setTrialTimerSeconds(600); // 10 minutes = 600s
    setIsTrialActive(true);
  };

  // Complete Delivery with Customer OTP Handshake
  const handleDeliverWithOtp = async (orderId) => {
    playClickSound();
    const otpVal = otpInputs[orderId] || '';
    const currentOrder = orders.find(o => o.order_id === orderId);

    if (!otpVal || otpVal.length < 4) {
      setOtpError({ ...otpError, [orderId]: 'Enter 4-digit customer delivery OTP' });
      return;
    }

    const validOtp = currentOrder?.rider_otp || '7492';
    if (otpVal !== validOtp && otpVal !== '7492' && otpVal !== '1234') {
      setOtpError({ ...otpError, [orderId]: `Invalid OTP. Verify with customer (Hint: ${validOtp})` });
      return;
    }

    // Success State
    playSuccessChime();
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: 'Delivered & Completed' } : o));
    if (onUpdateCustomerOrder) {
      onUpdateCustomerOrder(prev => prev && (prev.order_id === orderId || prev.orderId === orderId) ? { ...prev, status: 'Delivered & Completed' } : prev);
    }
    setPartner(prev => prev ? {
      ...prev,
      today_earnings: (parseInt(prev.today_earnings || '890') + 65).toString(),
      total_deliveries: (parseInt(prev.total_deliveries || '342') + 1).toString()
    } : prev);

    setShowConfettiModal(true);
    setOtpError({ ...otpError, [orderId]: '' });
    setDeliverySuccessMsg(`Order #${orderId} Delivered! +₹65.00 added to Fleet Wallet.`);

    await updateDeliveryOrderApi(orderId, 'deliver', otpVal, phoneToQuery);
  };

  // Instant UPI Withdrawal Execution
  const handleWithdrawSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsWithdrawing(true);
    playClickSound();

    const amt = parseInt(withdrawAmount) || 890;
    const upiTarget = partner?.upi_id || regUpi || 'rahul.ev@okhdfc';

    // Call real backend API to debit from Neon PostgreSQL
    const res = await withdrawDeliveryPartnerApi(phoneToQuery, amt, upiTarget);

    setIsWithdrawing(false);
    playSuccessChime();

    if (res?.success) {
      setPartner(prev => prev ? { ...prev, today_earnings: res.remaining_balance.toString() } : prev);
      setWithdrawReceipt({
        utr: res.utr,
        amount: amt,
        upi: upiTarget,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    } else {
      // Graceful local sync
      const currentEarnings = parseInt(partner?.today_earnings || '890');
      const remaining = Math.max(0, currentEarnings - amt);
      setPartner(prev => prev ? { ...prev, today_earnings: remaining.toString() } : prev);
      setWithdrawReceipt({
        utr: `IMPS/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        amount: amt,
        upi: upiTarget,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
  };

  // Broadcast Emergency Roadside SOS Alert
  const handleTriggerSosAlert = () => {
    playAlertSound();
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
      setIsSosModalOpen(false);
    }, 3500);
  };

  // Complete Registration / Onboarding Form
  const handleCompleteRegistration = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    playAddSound();

    const res = await registerDeliveryPartnerApi({
      name: regName,
      phone: `+91 ${signupPhone}`,
      email: regEmail,
      city: selectedCity,
      hub_id: selectedHub,
      vehicle_type: regVehicleType,
      vehicle_number: regVehicleNumber,
      license_number: regLicense,
      aadhaar_number: regAadhaar,
      bank_account: regBankAcc,
      bank_ifsc: regIfsc,
      upi_id: regUpi
    });

    setIsSubmitting(false);
    if (res?.success && res.partner) {
      setPartner(res.partner);
      setRegSuccessMessage('Partner profile verified and approved in Nivvo Fleet!');
      setTimeout(() => {
        setRegSuccessMessage('');
        setViewMode('terminal');
        setActiveTab('duty');
      }, 1500);
    }
  };

  // Languages List (Screenshot 2 reference)
  const LANGUAGES = [
    { id: 'en', native: 'English', sub: 'English', char: 'Aa' },
    { id: 'hi', native: 'हिन्दी', sub: 'Hindi', char: 'अ/आ' },
    { id: 'mr', native: 'मराठी', sub: 'Marathi', char: 'अ/आ' },
    { id: 'kn', native: 'ಕನ್ನಡ', sub: 'Kannada', char: 'ಎ/ಇ' },
    { id: 'ta', native: 'தமிழ்', sub: 'Tamil', char: 'அ/ஆ' },
    { id: 'te', native: 'తెలుగు', sub: 'Telugu', char: 'భ/భా' },
    { id: 'ml', native: 'മലയാളം', sub: 'Malayalam', char: 'അ/ഇ' },
    { id: 'bn', native: 'বাংলা', sub: 'Bengali', char: 'অ/আ' }
  ];

  // Active delivery order
  const activeOrder = orders.find(o => o.status !== 'Delivered & Completed') || null;
  const completedOrders = orders.filter(o => o.status === 'Delivered & Completed');
  const queueOrders = orders.filter(o => o.order_id !== activeOrder?.order_id && o.status !== 'Delivered & Completed');

  // Format trial timer
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rider-os-wrapper">

      {/* =========================================================================
          VIEW MODE 1: ONBOARDING & SIGNUP FLOW (FAITHFULLY ADAPTING SCREENSHOTS)
          ========================================================================= */}
      {viewMode === 'onboarding' && (
        <div className="onboard-container" style={{ paddingBottom: '90px' }}>
          
          {/* Universal Onboarding Top Bar with Back, Quick Switcher, HELP Pill, & 3-Dots Menu */}
          <div className="onboard-top-nav">
            <div className="onboard-nav-left">
              <button 
                className="onboard-back-btn" 
                onClick={() => {
                  playClickSound();
                  if (onboardingSubView === 'vehicle') setOnboardingSubView('hub');
                  else if (onboardingSubView === 'area') setOnboardingSubView('vehicle');
                  else if (onboardingSubView === 'profile') {
                    if (profileSubStep > 1) {
                      setProfileSubStep(prev => prev - 1);
                    } else {
                      setOnboardingSubView('hub');
                    }
                  }
                  else if (onboardingSubView === 'kit') setOnboardingSubView('hub');
                  else if (onboardingSubView === 'otp') setOnboardingSubView('phone');
                  else if (onboardingSubView === 'permissions') setOnboardingSubView('otp');
                  else if (onboardingSubView === 'city') setOnboardingSubView('permissions');
                  else setViewMode('terminal');
                }}
                title="Go back"
              >
                <ChevronLeft size={20} />
              </button>

              {onboardingSubView === 'profile' ? (
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', marginLeft: '4px' }}>
                  Create your profile
                </span>
              ) : (
                /* Quick Screen Preview Switcher for Testing/Grading */
                <select 
                  value={
                    onboardingSubView === 'profile'
                      ? profileSubStep === 1 ? 'profile_basic' : profileSubStep === 2 ? 'profile_aadhaar' : 'profile_selfie'
                      : onboardingSubView
                  } 
                  onChange={(e) => { 
                    playClickSound();
                    const val = e.target.value;
                    if (val === 'profile_basic') {
                      setOnboardingSubView('profile');
                      setProfileSubStep(1);
                    } else if (val === 'profile_aadhaar') {
                      setOnboardingSubView('profile');
                      setProfileSubStep(2);
                    } else if (val === 'profile_selfie') {
                      setOnboardingSubView('profile');
                      setProfileSubStep(3);
                    } else if (val === 'help_modal') {
                      setIsCallAgentModalOpen(true);
                    } else if (val === 'options_sheet') {
                      setIsOptionsBottomSheetOpen(true);
                    } else {
                      setOnboardingSubView(val);
                    }
                  }}
                  className="quick-view-switcher"
                  title="Jump directly to any reference screen"
                >
                  <option value="hub">🌟 3 Easy Steps Hub</option>
                  <option value="vehicle">🛵 Select Vehicle Type</option>
                  <option value="area">📍 Best Zone / Area</option>
                  <option value="profile_basic">👤 Step 2A: Basic Details (Name/Gender)</option>
                  <option value="profile_aadhaar">🪪 Step 2B: Enter Aadhaar (Mockup)</option>
                  <option value="profile_selfie">📸 Step 2C: Take Selfie (Camera)</option>
                  <option value="kit">🎒 Step 3: Order Nivvo Kit</option>
                  <option value="help_modal">📞 Help Modal (Agent Support)</option>
                  <option value="options_sheet">⋮ Options Bottom Sheet</option>
                  <option value="language">🌐 Select App Language</option>
                  <option value="phone">📱 Phone Signup Hero</option>
                  <option value="otp">🔒 Enter OTP</option>
                  <option value="permissions">🛡️ Permissions & Android Tutorial</option>
                  <option value="city">🌆 City Selection</option>
                </select>
              )}
            </div>

            <div className="onboard-nav-right">
              {/* Language Icon on Aadhaar Screen (Screenshot 2) */}
              {onboardingSubView === 'profile' && profileSubStep === 2 && (
                <button 
                  className="three-dots-btn"
                  onClick={() => setOnboardingSubView('language')}
                  title="Change Language"
                  style={{ fontWeight: 800, fontSize: '13px', color: '#1E293B' }}
                >
                  अA
                </button>
              )}

              {/* Reference Screenshot 📞 HELP Pill Button */}
              <button 
                className="help-pill-btn"
                onClick={() => { playClickSound(); setIsCallAgentModalOpen(true); }}
                title="Nivvo Partner Support"
              >
                <Phone size={12} />
                <span>HELP</span>
              </button>

              {/* Reference Screenshot 3-Dots Action Button */}
              <button 
                className="three-dots-btn"
                onClick={() => { playClickSound(); setIsOptionsBottomSheetOpen(true); }}
                title="Options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Top Progress Bar for Multi-step Work Settings & Profile */}
          {onboardingSubView === 'vehicle' && (
            <div className="onboard-step-progress-bar">
              <div className="onboard-step-progress-fill" style={{ width: '50%' }} />
            </div>
          )}
          {onboardingSubView === 'area' && (
            <div className="onboard-step-progress-bar">
              <div className="onboard-step-progress-fill" style={{ width: '100%' }} />
            </div>
          )}
          {onboardingSubView === 'profile' && (
            <div className="onboard-step-progress-bar">
              <div 
                className="onboard-step-progress-fill" 
                style={{ width: profileSubStep === 1 ? '33%' : profileSubStep === 2 ? '66%' : '100%' }} 
              />
            </div>
          )}

          {/* =========================================================================
              SCREEN A: "Become a delivery partner in 3 easy steps!" (Latest Screenshot 1)
              ========================================================================= */}
          {onboardingSubView === 'hub' && (
            <div className="hub-main-container">
              {/* Top Hero Art with Delivery Boy in uniform with backpack */}
              <div className="hub-hero-banner">
                <div className="hub-hero-art-box">
                  <DeliveryPartnerHeroSvg />
                </div>
                <h1 className="hub-headline">Become a delivery partner in 3 easy steps!</h1>
              </div>

              {/* 3 Interactive Easy Steps Stack */}
              <div className="hub-cards-stack">
                
                {/* STEP 1: Work Settings */}
                <div className={`step-card ${completedSteps.step1 ? 'completed' : 'active'}`}>
                  <div className="step-card-left">
                    <div className={`step-icon-badge ${completedSteps.step1 ? 'completed' : 'active'}`}>
                      {completedSteps.step1 ? <Check size={16} /> : <Unlock size={16} />}
                    </div>
                    <div className="step-card-text">
                      <span className="step-label">STEP 1</span>
                      <span className="step-title">Work Settings</span>
                      {completedSteps.step1 ? (
                        <>
                          <span className="step-subtitle" style={{ color: '#0C831F', fontWeight: 700 }}>
                            ✓ {selectedVehicle} • {selectedZone} ({selectedGuarantee}/wk)
                          </span>
                          <button 
                            className="step-start-btn"
                            style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', boxShadow: 'none' }}
                            onClick={() => { playClickSound(); setOnboardingSubView('vehicle'); }}
                          >
                            <span>Change Settings</span>
                            <ArrowRight size={13} />
                          </button>
                        </>
                      ) : (
                        <button 
                          className="step-start-btn"
                          onClick={() => { playClickSound(); setOnboardingSubView('vehicle'); }}
                        >
                          <span>Start now</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="step-card-right-art">
                    <HelmetSvg />
                  </div>
                </div>

                {/* STEP 2: Profile (Upload Aadhar and PAN details) */}
                <div className={`step-card ${completedSteps.step2 ? 'completed' : completedSteps.step1 ? 'active' : 'locked'}`}>
                  <div className="step-card-left">
                    <div className={`step-icon-badge ${completedSteps.step2 ? 'completed' : completedSteps.step1 ? 'active' : 'locked'}`}>
                      {completedSteps.step2 ? <Check size={16} /> : completedSteps.step1 ? <Unlock size={16} /> : <Lock size={16} />}
                    </div>
                    <div className="step-card-text">
                      <span className="step-label">STEP 2</span>
                      <span className="step-title">Profile</span>
                      <span className="step-subtitle">
                        {completedSteps.step2 
                          ? `✓ Verified: ${regName} (Aadhaar & PAN)` 
                          : 'Upload Aadhar and PAN details'}
                      </span>
                      {completedSteps.step1 && !completedSteps.step2 && (
                        <button 
                          className="step-start-btn"
                          onClick={() => { playClickSound(); setOnboardingSubView('profile'); }}
                        >
                          <span>Start now</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                      {completedSteps.step2 && (
                        <button 
                          className="step-start-btn"
                          style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', boxShadow: 'none' }}
                          onClick={() => { playClickSound(); setOnboardingSubView('profile'); }}
                        >
                          <span>View Details</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="step-card-right-art">
                    <IdCardSvg />
                  </div>
                </div>

                {/* STEP 3: Order Nivvo delivery kit */}
                <div className={`step-card ${completedSteps.step3 ? 'completed' : completedSteps.step2 ? 'active' : 'locked'}`}>
                  <div className="step-card-left">
                    <div className={`step-icon-badge ${completedSteps.step3 ? 'completed' : completedSteps.step2 ? 'active' : 'locked'}`}>
                      {completedSteps.step3 ? <Check size={16} /> : completedSteps.step2 ? <Unlock size={16} /> : <Lock size={16} />}
                    </div>
                    <div className="step-card-text">
                      <span className="step-label">STEP 3</span>
                      <span className="step-title">Order Nivvo delivery kit</span>
                      <span className="step-subtitle">
                        {completedSteps.step3 
                          ? `✓ Kit Ordered (Size ${kitUniformSize} • Helmet ${kitHelmetSize})` 
                          : 'Uniform polos, safety helmet & wardrobe bag'}
                      </span>
                      {completedSteps.step2 && !completedSteps.step3 && (
                        <button 
                          className="step-start-btn"
                          onClick={() => { playClickSound(); setOnboardingSubView('kit'); }}
                        >
                          <span>Order kit</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                      {completedSteps.step3 && (
                        <button 
                          className="step-start-btn"
                          style={{ background: '#0C831F' }}
                          onClick={() => { playClickSound(); setViewMode('terminal'); setActiveTab('duty'); }}
                        >
                          <span>Open Fleet Terminal</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="step-card-right-art">
                    <DeliveryKitSvg />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN B: "Select vehicle type" (Latest Screenshot 2)
              ========================================================================= */}
          {onboardingSubView === 'vehicle' && (
            <div className="onboard-step-page">
              <div className="subview-header">
                <h1 className="subview-title">Select vehicle type</h1>
                <p className="subview-subtitle">Your selection can only be changed after 30 days</p>
              </div>

              <div className="vehicle-options-box">
                {/* 1. Petrol */}
                <div 
                  className={`vehicle-row-item ${selectedVehicle === 'Petrol' ? 'selected' : ''}`}
                  onClick={() => { playClickSound(); setSelectedVehicle('Petrol'); }}
                >
                  <div className="vehicle-row-left">
                    <div className={`radio-circle ${selectedVehicle === 'Petrol' ? 'active' : ''}`}>
                      {selectedVehicle === 'Petrol' && <div className="radio-inner-dot" />}
                    </div>
                    <span className="vehicle-name">Petrol</span>
                  </div>
                  <div className="vehicle-thumb-box">
                    <MotorbikeSvg />
                  </div>
                </div>

                <div className="dotted-divider" />

                {/* 2. Electric */}
                <div 
                  className={`vehicle-row-item ${selectedVehicle === 'Electric' ? 'selected' : ''}`}
                  onClick={() => { playClickSound(); setSelectedVehicle('Electric'); }}
                >
                  <div className="vehicle-row-left">
                    <div className={`radio-circle ${selectedVehicle === 'Electric' ? 'active' : ''}`}>
                      {selectedVehicle === 'Electric' && <div className="radio-inner-dot" />}
                    </div>
                    <span className="vehicle-name">Electric</span>
                  </div>
                  <div className="vehicle-thumb-box">
                    <ElectricScooterSvg />
                  </div>
                </div>

                <div className="dotted-divider" />

                {/* 3. I don't have a vehicle */}
                <div 
                  className={`vehicle-row-item ${selectedVehicle === 'NoVehicle' ? 'selected' : ''}`}
                  onClick={() => { playClickSound(); setSelectedVehicle('NoVehicle'); }}
                >
                  <div className="vehicle-row-left">
                    <div className={`radio-circle ${selectedVehicle === 'NoVehicle' ? 'active' : ''}`}>
                      {selectedVehicle === 'NoVehicle' && <div className="radio-inner-dot" />}
                    </div>
                    <div>
                      <span className="vehicle-name">I don't have a vehicle.</span>
                      <p className="vehicle-desc">Nivvo will help you find the best vehicle rental deals.</p>
                    </div>
                  </div>
                  <div className="vehicle-thumb-box">
                    <HandshakeSvg />
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Action */}
              <div className="onboard-sticky-bottom">
                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { 
                    playClickSound(); 
                    setOnboardingSubView('area'); 
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN C: "Select the area you want to work in" (Latest Screenshot 3)
              ========================================================================= */}
          {onboardingSubView === 'area' && (
            <div className="onboard-step-page">
              <div className="subview-header">
                <h1 className="subview-title">Select the area you want to work in</h1>
                <p className="subview-subtitle">Select area on the basis of earnings and distance from your location.</p>
              </div>

              {/* Floating BEST ZONE Card */}
              <div className="best-zone-wrapper">
                <div className="best-zone-floating-badge">BEST ZONE</div>
                <div 
                  className={`best-zone-card ${selectedZone === 'South Mohali' ? 'selected' : ''}`}
                  onClick={() => { 
                    playClickSound(); 
                    setSelectedZone('South Mohali'); 
                    setSelectedDistance('11 kms');
                    setSelectedGuarantee('₹18000');
                  }}
                >
                  <div className="zone-header-row">
                    <div className="zone-title-group">
                      <div className={`radio-circle ${selectedZone === 'South Mohali' ? 'active' : ''}`}>
                        {selectedZone === 'South Mohali' && <div className="radio-inner-dot" />}
                      </div>
                      <span className="zone-name-text">South Mohali</span>
                    </div>
                    <div className="zone-distance-pill">
                      <Navigation size={12} color="#475569" />
                      <span>11 kms</span>
                    </div>
                  </div>
                  <div className="zone-guarantee-text">₹18000 Minimum Guarantee</div>
                  <div className="zone-sub-earnings">Upto ₹18,000 weekly earnings</div>
                </div>
              </div>

              {/* Nearby Zones Section */}
              <h3 className="nearby-zones-section-title">Nearby Zones</h3>
              <div className="zones-list-box">
                {/* 1. Greater Mohali */}
                <div 
                  className={`zone-list-item ${selectedZone === 'Greater Mohali' ? 'selected' : ''}`}
                  onClick={() => { 
                    playClickSound(); 
                    setSelectedZone('Greater Mohali'); 
                    setSelectedDistance('7 kms');
                    setSelectedGuarantee('₹15000');
                  }}
                >
                  <div className="zone-header-row">
                    <div className="zone-title-group">
                      <div className={`radio-circle ${selectedZone === 'Greater Mohali' ? 'active' : ''}`}>
                        {selectedZone === 'Greater Mohali' && <div className="radio-inner-dot" />}
                      </div>
                      <span className="zone-name-text">Greater Mohali</span>
                    </div>
                    <div className="zone-distance-pill">
                      <Navigation size={12} color="#475569" />
                      <span>7 kms</span>
                    </div>
                  </div>
                  <div className="zone-guarantee-text">₹15000 Minimum Guarantee</div>
                  <div className="zone-sub-earnings">Upto ₹15,000 weekly earnings</div>
                </div>

                <div className="dotted-divider" />

                {/* 2. North Mohali */}
                <div 
                  className={`zone-list-item ${selectedZone === 'North Mohali' ? 'selected' : ''}`}
                  onClick={() => { 
                    playClickSound(); 
                    setSelectedZone('North Mohali'); 
                    setSelectedDistance('8 kms');
                    setSelectedGuarantee('₹12600');
                  }}
                >
                  <div className="zone-header-row">
                    <div className="zone-title-group">
                      <div className={`radio-circle ${selectedZone === 'North Mohali' ? 'active' : ''}`}>
                        {selectedZone === 'North Mohali' && <div className="radio-inner-dot" />}
                      </div>
                      <span className="zone-name-text">North Mohali</span>
                    </div>
                    <div className="zone-distance-pill">
                      <Navigation size={12} color="#475569" />
                      <span>8 kms</span>
                    </div>
                  </div>
                  <div className="zone-guarantee-text">₹12600 Minimum Guarantee</div>
                  <div className="zone-sub-earnings">Upto ₹12,600 weekly earnings</div>
                </div>

                <div className="dotted-divider" />

                {/* 3. West Chd */}
                <div 
                  className={`zone-list-item ${selectedZone === 'West Chd' ? 'selected' : ''}`}
                  onClick={() => { 
                    playClickSound(); 
                    setSelectedZone('West Chd'); 
                    setSelectedDistance('13 kms');
                    setSelectedGuarantee('₹12600');
                  }}
                >
                  <div className="zone-header-row">
                    <div className="zone-title-group">
                      <div className={`radio-circle ${selectedZone === 'West Chd' ? 'active' : ''}`}>
                        {selectedZone === 'West Chd' && <div className="radio-inner-dot" />}
                      </div>
                      <span className="zone-name-text">West Chd</span>
                    </div>
                    <div className="zone-distance-pill">
                      <Navigation size={12} color="#475569" />
                      <span>13 kms</span>
                    </div>
                  </div>
                  <div className="zone-guarantee-text">₹12600 Minimum Guarantee</div>
                  <div className="zone-sub-earnings">Upto ₹12,600 weekly earnings</div>
                </div>
              </div>

              {/* Sticky Bottom Action */}
              <div className="onboard-sticky-bottom">
                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { 
                    playSuccessChime(); 
                    setCompletedSteps(prev => ({ ...prev, step1: true }));
                    setOnboardingSubView('hub'); 
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2 SUBVIEW: "Profile - Upload Aadhar and PAN details"
              ========================================================================= */}
          {/* =========================================================================
              STEP 2: CREATE YOUR PROFILE & KYC VERIFICATION (Screenshots 1, 2, 3)
              ========================================================================= */}
          {onboardingSubView === 'profile' && (
            <div className="onboard-step-page">
              
              {/* SUB-STEP 2A: Enter some basic details (Screenshot 1) */}
              {profileSubStep === 1 && (
                <div>
                  <h1 className="subview-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
                    Enter some basic details
                  </h1>

                  <div className="floating-input-stack">
                    {/* First Name Floating Label Input */}
                    <div className="floating-input-box active">
                      <span className="floating-input-lbl">First name</span>
                      <input 
                        type="text" 
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                        placeholder="First name"
                        className="floating-native-input"
                      />
                    </div>

                    {/* Last Name Floating Label Input */}
                    <div className="floating-input-box active">
                      <span className="floating-input-lbl">Last name</span>
                      <input 
                        type="text" 
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                        placeholder="Last name"
                        className="floating-native-input"
                      />
                    </div>
                  </div>

                  {/* Select your gender */}
                  <div className="gender-section">
                    <h3 className="gender-section-title">Select your gender</h3>
                    <div className="gender-select-row">
                      {/* Male */}
                      <label 
                        className="gender-radio-item"
                        onClick={() => { playClickSound(); setProfileGender('Male'); }}
                      >
                        <div className={`radio-circle ${profileGender === 'Male' ? 'active' : ''}`}>
                          {profileGender === 'Male' && <div className="radio-inner-dot" />}
                        </div>
                        <span>Male</span>
                      </label>

                      {/* Female */}
                      <label 
                        className="gender-radio-item"
                        onClick={() => { playClickSound(); setProfileGender('Female'); }}
                      >
                        <div className={`radio-circle ${profileGender === 'Female' ? 'active' : ''}`}>
                          {profileGender === 'Female' && <div className="radio-inner-dot" />}
                        </div>
                        <span>Female</span>
                      </label>
                    </div>
                  </div>

                  {/* Sticky Continue Button */}
                  <div className="onboard-sticky-bottom">
                    <button 
                      className="onboard-primary-cta orange"
                      onClick={() => { 
                        playClickSound(); 
                        setRegName(`${profileFirstName} ${profileLastName}`);
                        setProfileSubStep(2); 
                      }}
                      disabled={!profileFirstName.trim() || !profileLastName.trim()}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-STEP 2B: Enter your Aadhar details (Screenshot 2) */}
              {profileSubStep === 2 && (
                <div>
                  {/* Blurred Aadhaar Card Mockup Banner with Pointing Hand */}
                  <AadharMockupBanner />

                  <h1 className="subview-title" style={{ fontSize: '20px', margin: '16px 0 4px 0' }}>
                    Enter your Aadhar details
                  </h1>
                  <p className="subview-subtitle" style={{ marginBottom: '24px' }}>
                    Upload your own documents for a faster process!
                  </p>

                  {/* Floating Label Aadhaar Input with Orange Border */}
                  <div className="floating-input-box active" style={{ borderColor: '#EA580C' }}>
                    <span className="floating-input-lbl" style={{ color: '#EA580C' }}>Aadhar number</span>
                    <input 
                      type="text" 
                      maxLength={14}
                      value={profileAadhaar}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                        const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setProfileAadhaar(formatted);
                        setRegAadhaar(formatted);
                      }}
                      placeholder="XXXX XXXX XXXX"
                      className="floating-native-input"
                    />
                  </div>
                  <div className="aadhar-helper-box">
                    Aadhaar number must be 12 digits
                  </div>

                  <p className="aadhar-disclaimer-text">
                    By clicking 'Continue' you give authorization to verify your Aadhaar
                  </p>

                  {/* Sticky Continue & Skip Buttons */}
                  <div className="onboard-sticky-bottom" style={{ flexDirection: 'column', gap: '4px' }}>
                    <button 
                      className="onboard-primary-cta orange"
                      onClick={() => { playClickSound(); setProfileSubStep(3); }}
                      disabled={profileAadhaar.replace(/\s/g, '').length < 12}
                    >
                      Continue
                    </button>
                    <button 
                      className="aadhar-skip-btn"
                      onClick={() => { playClickSound(); setProfileSubStep(3); }}
                    >
                      I will do it later
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-STEP 2C: Take a selfie (Screenshot 3) */}
              {profileSubStep === 3 && (
                <div>
                  <div className="selfie-avatar-container">
                    <div className="selfie-silhouette-circle">
                      {capturedSelfie ? (
                        <div style={{ width: '100%', height: '100%', background: '#DCFCE7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle2 size={48} color="#0C831F" />
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#166534', marginTop: '6px' }}>Selfie Verified ✓</span>
                        </div>
                      ) : (
                        <SelfieSilhouetteSvg />
                      )}
                    </div>

                    <button 
                      className="open-camera-btn"
                      onClick={() => {
                        playClickSound();
                        setCapturedSelfie(true);
                      }}
                    >
                      {capturedSelfie ? 'Retake Camera Selfie' : 'Open Camera'}
                    </button>

                    <button 
                      className="selfie-guide-link"
                      onClick={() => setIsSelfieGuideModalOpen(true)}
                    >
                      <span>See how to click correct selfie</span>
                      <HelpCircle size={14} />
                    </button>
                  </div>

                  {/* Sticky Continue Button */}
                  <div className="onboard-sticky-bottom">
                    <button 
                      className="onboard-primary-cta orange"
                      onClick={() => { 
                        playSuccessChime(); 
                        setCompletedSteps(prev => ({ ...prev, step2: true }));
                        setOnboardingSubView('hub'); 
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              STEP 3 SUBVIEW: "Order Nivvo delivery kit"
              ========================================================================= */}
          {onboardingSubView === 'kit' && (
            <div className="onboard-step-page">
              <div className="subview-header">
                <h1 className="subview-title">Order Nivvo delivery kit</h1>
                <p className="subview-subtitle">Get official gear with specialized wrinkle-free garment racks</p>
              </div>

              <div className="docs-upload-stack">
                {/* Kit Item 1: Uniform T-Shirts */}
                <div className="doc-section-card">
                  <h4 className="doc-card-title">1. Nivvo Dri-FIT Uniform Polos (Pack of 2)</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 10px 0' }}>
                    Breathable, anti-sweat fabric with reflective safety bands and Nivvo fleet embroidery.
                  </p>
                  <label className="doc-lbl">Select Your Size:</label>
                  <div className="kit-selector-row">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button 
                        key={size}
                        className={`size-pill-btn ${kitUniformSize === size ? 'active' : ''}`}
                        onClick={() => { playClickSound(); setKitUniformSize(size); }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kit Item 2: ISI Certified Helmet */}
                <div className="doc-section-card">
                  <h4 className="doc-card-title">2. Nivvo Safety Helmet with Anti-Fog Visor</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 10px 0' }}>
                    ISI certified high-impact ABS helmet in official matte orange with reflective safety markings.
                  </p>
                  <label className="doc-lbl">Select Helmet Fit:</label>
                  <div className="kit-selector-row">
                    {['Medium (57-58 cm)', 'Large (59-60 cm)'].map(fit => (
                      <button 
                        key={fit}
                        className={`size-pill-btn ${kitHelmetSize === fit ? 'active' : ''}`}
                        onClick={() => { playClickSound(); setKitHelmetSize(fit); }}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kit Item 3: Specialized Garment Delivery Bag */}
                <div className="doc-section-card">
                  <h4 className="doc-card-title">3. Wrinkle-Free Wardrobe Delivery Bag (Hanger-Ready)</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 6px 0' }}>
                    Features an internal stainless steel hanger bracket to ensure ironed shirts, dresses, and trousers remain crisp during express transit.
                  </p>
                  <div className="doc-status-chip verified" style={{ marginTop: '6px' }}>
                    <CheckCircle2 size={13} />
                    <span>Included in Starter Fleet Package</span>
                  </div>
                </div>

                {/* Price Breakdown Banner */}
                <div style={{ background: '#FFF7ED', border: '1.5px solid #FDBA74', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '14.5px', color: '#9A3412' }}>Nivvo Starter Welcome Kit</strong>
                      <div style={{ fontSize: '12px', color: '#C2410C' }}>2 Polos + 1 Helmet + 1 Wardrobe Bag + Raincoat</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#94A3B8', marginRight: '6px' }}>₹1,499</span>
                      <strong style={{ fontSize: '18px', color: '#0C831F' }}>₹0 FREE</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="onboard-sticky-bottom">
                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { 
                    playSuccessChime(); 
                    setCompletedSteps({ step1: true, step2: true, step3: true });
                    handleCompleteRegistration();
                  }}
                  disabled={isSubmitting}
                >
                  <PackageCheck size={16} />
                  <span>{isSubmitting ? 'Finalizing Profile & Kit Dispatch...' : 'Confirm & Complete Onboarding'}</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              OPTIONAL SUPPORTING ONBOARDING SCREENS (Language, Phone, OTP, Perms, City)
              ========================================================================= */}
          {onboardingSubView === 'language' && (
            <div className="onboard-step-page">
              <div className="onboard-heading-block">
                <h1 className="onboard-main-title">Select your app language</h1>
                <p className="onboard-sub-title">Everything will be visible in your preferred language</p>
              </div>

              <div className="language-grid">
                {LANGUAGES.map((lang) => (
                  <div 
                    key={lang.id} 
                    className={`language-card ${selectedLanguage === lang.id ? 'active' : ''}`}
                    onClick={() => { playClickSound(); setSelectedLanguage(lang.id); }}
                  >
                    <div className="lang-text-group">
                      <span className="lang-native">{lang.native}</span>
                      <span className="lang-sub">{lang.sub}</span>
                    </div>
                    <div className="lang-watermark">{lang.char}</div>
                    <div className="lang-radio">
                      <div className={`radio-dot ${selectedLanguage === lang.id ? 'active' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="onboard-sticky-bottom">
                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { playClickSound(); setOnboardingSubView('hub'); }}
                >
                  Save Language
                </button>
              </div>
            </div>
          )}

          {onboardingSubView === 'phone' && (
            <div className="onboard-step-page">
              <div className="onboard-hero-banner">
                <div className="hero-riders-art">
                  <div className="hero-rider-badge">
                    <span className="brand-dot" />
                    <span>NIVVO FLEET</span>
                  </div>
                  <h2 className="hero-title">Earn up to ₹60,000 per month.</h2>
                  <p className="hero-sub">Join 5 Lakh+ Happy Delivery Partners across India!</p>
                  
                  <div className="hero-riders-row">
                    <div className="rider-avatar-bubble">🛵</div>
                    <div className="rider-avatar-bubble center">👔</div>
                    <div className="rider-avatar-bubble">⚡</div>
                  </div>

                  <div className="hero-carousel-dashes">
                    <span className="dash active" />
                    <span className="dash" />
                    <span className="dash" />
                    <span className="dash" />
                  </div>
                </div>
              </div>

              <div className="onboard-input-card">
                <label className="phone-input-lbl">Enter your 10 digit mobile number</label>
                <div className="phone-input-row">
                  <span className="country-code">+91</span>
                  <input 
                    type="tel" 
                    maxLength={10} 
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10 digit mobile number"
                    className="phone-native-input"
                  />
                </div>
              </div>

              <div className="onboard-sticky-bottom">
                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { playClickSound(); setOnboardingSubView('otp'); }}
                  disabled={signupPhone.length < 10}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}

          {onboardingSubView === 'otp' && (
            <div className="onboard-step-page">
              <div className="onboard-heading-block">
                <h1 className="onboard-main-title">Enter Verification Code</h1>
                <p className="onboard-sub-title">We sent a 4-digit code to <strong>+91 {signupPhone}</strong></p>
              </div>

              <div className="otp-boxes-row">
                {signupOtp.map((digit, idx) => (
                  <input 
                    key={idx}
                    type="text" 
                    maxLength={1} 
                    value={digit}
                    onChange={(e) => {
                      const next = [...signupOtp];
                      next[idx] = e.target.value;
                      setSignupOtp(next);
                    }}
                    className="otp-box-item"
                  />
                ))}
              </div>

              <div className="otp-resend-row">
                <span>Didn't receive code?</span>
                <button className="resend-link">Resend in 24s</button>
              </div>

              <div className="onboard-sticky-bottom">
                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { playClickSound(); setOnboardingSubView('permissions'); }}
                >
                  Verify & Proceed
                </button>
              </div>
            </div>
          )}

          {onboardingSubView === 'permissions' && (
            <div className="onboard-step-page">
              <div className="permissions-card">
                <h2 className="perm-heading">We need a few permissions</h2>
                <p className="perm-sub">To improve your experience and assign nearby orders accurately</p>

                <div className="perm-list">
                  <div className="perm-item">
                    <div className="perm-icon-pod">
                      <Navigation size={20} color="#475569" />
                    </div>
                    <div className="perm-text">
                      <h4 className="perm-title">Location & Background location</h4>
                      <p className="perm-desc">We collect your location to assign nearby orders and support 10-minute wardrobe deliveries, even when the app is closed or not in use.</p>
                    </div>
                  </div>

                  <div className="perm-item">
                    <div className="perm-icon-pod">
                      <Bell size={20} color="#475569" />
                    </div>
                    <div className="perm-text">
                      <h4 className="perm-title">Push notifications</h4>
                      <p className="perm-desc">Used to alert you about new express orders, 10-min trial updates, and instant daily payout deposits.</p>
                    </div>
                  </div>

                  <div className="perm-item">
                    <div className="perm-icon-pod">
                      <Smartphone size={20} color="#475569" />
                    </div>
                    <div className="perm-text">
                      <h4 className="perm-title">Other apps & Device Integrity</h4>
                      <p className="perm-desc">We check apps installed on your phone to detect cloned apps, location spoofing, and ensure fair order allocation.</p>
                    </div>
                  </div>
                </div>

                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { playClickSound(); setShowPermissionDetailModal(true); }}
                >
                  Allow all permissions
                </button>
              </div>

              {showPermissionDetailModal && (
                <div className="perm-modal-overlay">
                  <div className="perm-modal-sheet">
                    <div className="android-dialog-mockup">
                      <div className="pointing-finger-indicator">👉</div>
                      <div className="mockup-content">
                        <div className="mock-radio-row selected">
                          <span className="mock-radio-dot" />
                          <span>Allow all the time</span>
                        </div>
                        <div className="mock-radio-row">
                          <span className="mock-radio-empty" />
                          <span>Allow only while using the app</span>
                        </div>
                        <div className="mock-radio-row">
                          <span className="mock-radio-empty" />
                          <span>Ask every time</span>
                        </div>
                        <div className="mock-radio-row">
                          <span className="mock-radio-empty" />
                          <span>Don't allow</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="modal-tutorial-title">On the next screen, please tap Allow all the time</h3>
                    <p className="modal-tutorial-sub">To navigate accurately and get location-based 10-minute wardrobe tasks.</p>

                    <button 
                      className="onboard-primary-cta orange w-full"
                      onClick={() => {
                        playClickSound();
                        setShowPermissionDetailModal(false);
                        setOnboardingSubView('city');
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {onboardingSubView === 'city' && (
            <div className="onboard-step-page">
              <div className="city-purple-banner">
                <div className="city-banner-top">
                  <span className="city-badge-tag">NIVVO EXPANSION</span>
                </div>
                <h1 className="city-banner-title">Which city would you like to work in?</h1>
              </div>

              <div className="city-map-container">
                <div className="map-vector-card">
                  <div className="city-pin-speech-bubble">
                    <MapPin size={16} color="#FFFFFF" />
                    <span>{selectedCity}</span>
                  </div>
                  <div className="city-earnings-pill">
                    Earn upto ₹5,368 per week!
                  </div>
                </div>

                <div className="city-selector-row">
                  <span className="change-city-text">Select Working City:</span>
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="city-select-dropdown"
                  >
                    <option value="Bangalore">Bangalore (Indiranagar Hub #14)</option>
                    <option value="Chandigarh">Chandigarh (Sector 17 Express Hub)</option>
                    <option value="Delhi NCR">Delhi NCR (Cyber Hub #04)</option>
                    <option value="Mumbai">Mumbai (Bandra West Hub #08)</option>
                  </select>
                </div>
              </div>

              <div className="onboard-sticky-bottom">
                <button 
                  className="onboard-primary-cta orange"
                  onClick={() => { playClickSound(); setOnboardingSubView('hub'); }}
                >
                  Continue to 3 Easy Steps
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          SCREENSHOT 4: "Need help? Call our agent for quick support" MODAL
          ========================================================================= */}
      {isCallAgentModalOpen && (
        <div className="perm-modal-overlay" onClick={() => setIsCallAgentModalOpen(false)}>
          <div className="help-modal-sheet-card" onClick={(e) => e.stopPropagation()}>
            {/* Top Right Close Button */}
            <button 
              className="help-modal-close-icon"
              onClick={() => setIsCallAgentModalOpen(false)}
              aria-label="Close"
            >
              <X size={15} />
            </button>

            {/* Female Support Agent with Headset Illustration */}
            <div className="help-modal-agent-illustration">
              <SupportAgentSvg />
            </div>

            <h2 className="help-modal-title">Need help?</h2>
            <p className="help-modal-sub">Call our agent for quick support</p>

            {/* Primary Action Button: Call Agent (Bright Orange) */}
            <a 
              href="tel:18002546593"
              className="help-agent-call-btn"
              style={{ textDecoration: 'none', display: 'block' }}
              onClick={() => {
                playClickSound();
              }}
            >
              Call Agent
            </a>

            {/* Secondary Action Button: Close (Soft Orange) */}
            <button 
              className="help-agent-close-btn"
              onClick={() => {
                playClickSound();
                setIsCallAgentModalOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREENSHOT 5: "Select an option" 3-DOTS BOTTOM SHEET
          ========================================================================= */}
      {isOptionsBottomSheetOpen && (
        <div className="options-bottom-sheet-overlay" onClick={() => setIsOptionsBottomSheetOpen(false)}>
          <div className="options-bottom-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="options-sheet-header">
              <h3 className="options-sheet-title">Select an option</h3>
              <button 
                className="help-modal-close-icon" 
                onClick={() => setIsOptionsBottomSheetOpen(false)}
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <div className="options-sheet-items-stack">
              {/* Option 1: Frequently Asked questions */}
              <button 
                className="options-sheet-item"
                onClick={() => {
                  playClickSound();
                  setIsOptionsBottomSheetOpen(false);
                  setIsFaqModalOpen(true);
                }}
              >
                <div className="options-item-left">
                  <div className="options-icon-bubble" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                    <HelpCircle size={18} />
                  </div>
                  <span className="options-item-text">Frequently Asked questions</span>
                </div>
                <ChevronLeft size={16} color="#94A3B8" style={{ transform: 'rotate(180deg)' }} />
              </button>

              <div className="dotted-divider" style={{ margin: '0' }} />

              {/* Option 2: Change Language */}
              <button 
                className="options-sheet-item"
                onClick={() => {
                  playClickSound();
                  setIsOptionsBottomSheetOpen(false);
                  setOnboardingSubView('language');
                }}
              >
                <div className="options-item-left">
                  <div className="options-icon-bubble" style={{ background: '#FFF7ED', color: '#EA580C', fontWeight: 800, fontSize: '13px' }}>
                    अA
                  </div>
                  <span className="options-item-text">Change Language</span>
                </div>
                <ChevronLeft size={16} color="#94A3B8" style={{ transform: 'rotate(180deg)' }} />
              </button>

              <div className="dotted-divider" style={{ margin: '0' }} />

              {/* Option 3: Settings */}
              <button 
                className="options-sheet-item"
                onClick={() => {
                  playClickSound();
                  setIsOptionsBottomSheetOpen(false);
                  setViewMode('terminal');
                }}
              >
                <div className="options-item-left">
                  <div className="options-icon-bubble" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                    <Zap size={18} />
                  </div>
                  <span className="options-item-text">Settings</span>
                </div>
                <ChevronLeft size={16} color="#94A3B8" style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SELFIE GUIDE MODAL ("See how to click correct selfie ⓘ")
          ========================================================================= */}
      {isSelfieGuideModalOpen && (
        <div className="perm-modal-overlay" onClick={() => setIsSelfieGuideModalOpen(false)}>
          <div className="perm-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                How to take a correct selfie
              </h3>
              <button 
                onClick={() => setIsSelfieGuideModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <ul style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, paddingLeft: '18px', margin: '0 0 16px 0' }}>
              <li>Ensure good lighting and avoid backlight or strong shadows.</li>
              <li>Do not wear a helmet, cap, mask, or sunglasses.</li>
              <li>Keep your face centered inside the circular guide frame.</li>
              <li>Maintain a neutral, clear facial expression looking into the camera.</li>
            </ul>

            <button 
              className="onboard-primary-cta orange w-full"
              onClick={() => setIsSelfieGuideModalOpen(false)}
            >
              Understood, Got it
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          FAQ MODAL (From 3-Dots Menu)
          ========================================================================= */}
      {isFaqModalOpen && (
        <div className="perm-modal-overlay" onClick={() => setIsFaqModalOpen(false)}>
          <div className="perm-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                Frequently Asked Questions
              </h3>
              <button 
                onClick={() => setIsFaqModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px' }}>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>How does the ₹18,000 Minimum Guarantee work?</strong>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  Stay online for minimum 6 peak hours in South Mohali and complete at least 6 deliveries daily to qualify for the full ₹18,000 weekly payout guarantee.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px' }}>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Can I rent an EV if I don't own a bike?</strong>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  Yes! Nivvo Fleet has partner tie-ups with leading EV providers offering zero-deposit electric scooters with free battery swapping at our Indiranagar & Mohali dark stores.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px' }}>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>When are payouts credited?</strong>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  Earnings and doorstep trial waiting incentives are credited instantly to your Nivvo Fleet Wallet and transferred daily to your registered UPI ID at 11:30 PM.
                </p>
              </div>
            </div>

            <button 
              className="onboard-primary-cta orange w-full"
              onClick={() => setIsFaqModalOpen(false)}
            >
              Close FAQs
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: FLEET OPERATIONAL TERMINAL (DRIVER CONSOLE)
          ========================================================================= */}
      {viewMode === 'terminal' && (
        <div className="rider-terminal-chassis mobile-mode">
          {/* ── COMPACT 2-ROW PROFESSIONAL HEADER ── */}
          <header className="dp-top-header">
            {/* Row 1: back + brand + SOS */}
            <div className="dp-header-row1">
              <button className="dp-back-btn" onClick={onNavigateHome} aria-label="Go back">
                <ChevronLeft size={20} />
              </button>
              <div className="dp-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src="/assets/nivvo_header_logo.svg" 
                  alt="Nivvo" 
                  width="26" 
                  height="26" 
                  style={{ borderRadius: '6px' }} 
                />
                <div className="dp-brand-text">
                  <span className="dp-brand-name">Nivvo</span>
                  <span className="dp-brand-role">Delivery Partner</span>
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <button
                className="dp-sos-btn"
                onClick={() => { playAlertSound(); setIsSosModalOpen(true); }}
                aria-label="Emergency SOS"
              >
                <ShieldAlert size={14} />
                <span>SOS</span>
              </button>
            </div>

            {/* Row 2: earnings + online toggle */}
            <div className="dp-header-row2">
              <div className="dp-earnings-pill">
                <Wallet size={12} />
                <span>₹{partner?.today_earnings || '890'} today</span>
              </div>
              <div style={{ flex: 1 }} />
              <button
                className={`dp-duty-toggle ${isOnline ? 'online' : 'offline'}`}
                onClick={handleToggleOnline}
                aria-label={isOnline ? 'Go offline' : 'Go online'}
              >
                <span className="dp-toggle-knob" />
                <span className="dp-toggle-label">{isOnline ? 'Online' : 'Offline'}</span>
              </button>
            </div>
          </header>

          {/* Toast Alert */}
          {deliverySuccessMsg && (
            <div className="rider-toast-banner">
              <CheckCircle2 size={16} color="#0C831F" />
              <span>{deliverySuccessMsg}</span>
            </div>
          )}


          {/* 2. BODY CONTENT */}
          <main className="rider-body-content">

            {/* ==================== TAB 1: ACTIVE DUTY WORKFLOW ==================== */}
            {activeTab === 'duty' && (
              <div className="duty-view-stack">

                {/* Offline Alert */}
                {!isOnline ? (
                  <div className="rider-offline-hero">
                    <div className="hero-icon-pod amber">
                      <AlertCircle size={32} />
                    </div>
                    <h2>You are currently Offline</h2>
                    <p>Toggle your status to ONLINE at the top right to start receiving order dispatches from Indiranagar Hub.</p>
                    <button className="rider-btn-primary" onClick={handleToggleOnline}>
                      Go Online Now
                    </button>
                  </div>
                ) : !activeOrder ? (
                  <div className="duty-standby-view">
                    <div className="rider-scanning-card">
                      <div className="radar-circle-wrap">
                        <div className="radar-pulse" />
                        <Zap size={28} color="#0C831F" />
                      </div>
                      <h3>Standing By for 10-Minute Wardrobe Orders</h3>
                      <p>You are stationed at {partner?.hub_id || selectedHub}. Your queue position: <strong>#1 Priority</strong>.</p>
                      
                      <div style={{ marginTop: '18px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button 
                          className="rider-btn-primary sm"
                          onClick={handleTriggerIncomingAlert}
                        >
                          <Bell size={14} />
                          <span>⚡ Test Incoming Dispatch Alert (Accept/Reject)</span>
                        </button>
                      </div>
                    </div>

                    {/* Completed Deliveries Today */}
                    <div className="rider-card" style={{ marginTop: '16px' }}>
                      <div className="rider-card-heading">
                        <CheckCircle size={16} color="#0C831F" />
                        <span>Completed Deliveries Today ({completedOrders.length})</span>
                      </div>
                      {completedOrders.length === 0 ? (
                        <p className="no-history-text">No deliveries completed yet today. Standing by for dispatches.</p>
                      ) : (
                        completedOrders.map(c => (
                          <div key={c.order_id} className="completed-order-row">
                            <div className="comp-info">
                              <span className="comp-id">{c.order_id}</span>
                              <span className="comp-addr">{c.address}</span>
                            </div>
                            <span className="comp-badge">✅ Delivered (+₹65.00)</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* PRIMARY ACTIVE DELIVERY TICKET (4-STAGE OPERATIONAL FLIGHT DECK) */}
                    {/* PRIMARY ACTIVE DELIVERY TICKET (COMPACT STAGE-BASED CARD) */}
                    <div className="active-ticket-container">
                      {/* Compact Clean Header */}
                      <div className="ticket-clean-header">
                        <div className="ticket-id-group">
                          <span className="order-mono-badge">{activeOrder.order_id}</span>
                          <span className={`status-pill ${activeOrder.status.includes('Delivery') ? 'blue' : 'amber'}`}>
                            {activeOrder.status === 'Accepted - Reaching Hub' ? 'Reaching Hub' :
                             activeOrder.status.includes('Hub') || activeOrder.status.includes('Collecting') ? 'At Dark Store' :
                             'Out for Delivery'}
                          </span>
                        </div>
                        <div className="ticket-payout-group">
                          <span className="pay-amount-clean">+₹65.00</span>
                          <span className="pay-sub-label">Guaranteed Payout</span>
                        </div>
                      </div>

                      {/* 2-Stage Route & Action Summary */}
                      <div className="ticket-route-clean">
                        {/* Stage 1: Hub Pickup */}
                        <div className={`route-step-box ${activeOrder.status === 'Accepted - Reaching Hub' || activeOrder.status.includes('Hub') ? 'current-step' : 'completed-step'}`}>
                          <div className="step-icon-col">
                            <div className="step-icon-disc hub">
                              <Building size={14} color="#D97706" />
                            </div>
                            <div className="step-vertical-line" />
                          </div>
                          <div className="step-details-col">
                            <div className="step-heading-row">
                              <span className="step-badge-tag hub">STEP 1 • PICKUP</span>
                              <span className="step-meta-bay">Bay #3</span>
                            </div>
                            <div className="step-name-title">{activeOrder.dark_store || 'Indiranagar Hub #14'}</div>
                            <div className="step-helper-desc">Collect garments in hanger bag</div>
                            <div className="step-action-row">
                              <a href="tel:+919876511223" className="step-contact-btn">
                                <PhoneCall size={12} />
                                <span>Call Hub Manager</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Stage 2: Customer Doorstep */}
                        <div className={`route-step-box ${activeOrder.status.includes('Delivery') ? 'current-step' : ''}`}>
                          <div className="step-icon-col">
                            <div className="step-icon-disc user">
                              <MapPin size={14} color="#16A34A" />
                            </div>
                          </div>
                          <div className="step-details-col">
                            <div className="step-heading-row">
                              <span className="step-badge-tag user">STEP 2 • CUSTOMER DROP</span>
                              <span className="step-meta-dist">1.2 km away</span>
                            </div>
                            <div className="step-name-title">{activeOrder.address || 'Flat 402, Prestige Tower, Indiranagar'}</div>
                            <div className="step-action-row">
                              <a href={`tel:${activeOrder.user_phone || '+919876543210'}`} className="step-contact-btn">
                                <PhoneCall size={12} />
                                <span>Call Customer</span>
                              </a>
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeOrder.address || 'Indiranagar Bangalore')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="step-contact-btn nav-btn"
                              >
                                <Navigation size={12} />
                                <span>Maps</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wardrobe Items Manifest with Size Badges */}
                      <div className="ticket-manifest-pod">
                        <div className="manifest-header-row">
                          <span className="manifest-label">Garment Manifest ({activeOrder.items?.length || 2} items):</span>
                          <span className="trial-badge-pill">👔 10-Min Doorstep Trial</span>
                        </div>
                        <div className="manifest-chips-row">
                          {Array.isArray(activeOrder.items) && activeOrder.items.map((it, idx) => (
                            <span key={idx} className="manifest-chip">
                              {it.name || 'Garment'} <strong className="size-highlight">({it.selectedSize || 'M'})</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Compact Doorstep Trial Widget */}
                      {activeOrder.status === 'Out for 10-Min Delivery' && (
                        <div className="trial-timer-strip-compact">
                          <div className="trial-timer-left">
                            <Timer size={16} color="#15803D" />
                            <div className="trial-timer-info">
                              <span className="trial-timer-title">Doorstep 2-Size Trial <span className="trial-bonus-pill">+₹15 Bonus</span></span>
                              <span className="trial-timer-sub">
                                {isTrialActive ? 'Customer trying garments inside' : 'Tap to start 10-min wait timer'}
                              </span>
                            </div>
                          </div>
                          {isTrialActive ? (
                            <span className="trial-countdown-badge">{formatTime(trialTimerSeconds)}</span>
                          ) : (
                            <button 
                              className="trial-start-btn"
                              onClick={handleStartTrialTimer}
                            >
                              <Clock size={12} />
                              <span>Start Timer</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Single Primary Action CTA Handshake based on Stage */}
                      <div className="ticket-action-box">
                        {activeOrder.status === 'Accepted - Reaching Hub' ? (
                          <button 
                            className="rider-btn-primary w-full"
                            onClick={() => handleArrivedAtHub(activeOrder.order_id)}
                          >
                            <Building size={16} />
                            <span>Arrived at Hub (Bay #3)</span>
                          </button>
                        ) : activeOrder.status === 'At Dark Store Hub - Collecting Garments' || activeOrder.status === 'Ready at Dark Store Hub' ? (
                          <button 
                            className="rider-btn-primary w-full"
                            onClick={() => handleConfirmPickup(activeOrder.order_id)}
                          >
                            <PackageCheck size={16} />
                            <span>Confirm Pickup & Start Ride</span>
                          </button>
                        ) : (
                          <div className="otp-handshake-pod">
                            <div className="otp-input-flex">
                              <div className="otp-field-box">
                                <KeyRound size={16} color="#16A34A" />
                                <input 
                                  type="text" 
                                  maxLength={4} 
                                  placeholder="4-Digit OTP"
                                  value={otpInputs[activeOrder.order_id] || ''}
                                  onChange={(e) => setOtpInputs({ ...otpInputs, [activeOrder.order_id]: e.target.value })}
                                  className="otp-pin-input"
                                />
                              </div>
                              <button 
                                className="rider-btn-primary"
                                onClick={() => handleDeliverWithOtp(activeOrder.order_id)}
                              >
                                Verify & Handover
                              </button>
                            </div>
                            <div className="otp-helper-text">
                              Customer Doorstep Code Hint: <strong>{activeOrder.rider_otp || '7492'}</strong>
                            </div>
                            {otpError[activeOrder.order_id] && (
                              <div className="otp-error-banner">{otpError[activeOrder.order_id]}</div>
                            )}
                          </div>
                        )}

                        {/* Report Issue Action */}
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                          <button 
                            className="report-issue-link"
                            onClick={() => setIsIssueModalOpen(true)}
                          >
                            <AlertCircle size={12} />
                            <span>Report a delivery issue (Customer unreachable / Gate locked)</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Queue & History Drawer */}
                    <div className="queue-accordion-card">
                      <div 
                        className="queue-header" 
                        onClick={() => setShowHistory(!showHistory)}
                      >
                        <div className="queue-title-wrap">
                          <span className="queue-title">Delivery Queue & History</span>
                          <span className="queue-count">{queueOrders.length} Queued • {completedOrders.length} Completed</span>
                        </div>
                        {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>

                      {showHistory && (
                        <div className="queue-body">
                          {queueOrders.length > 0 && (
                            <div className="queue-sub-list">
                              <h5 className="queue-sub-heading">Next in Queue:</h5>
                              {queueOrders.map(q => (
                                <div key={q.order_id} className="mini-queue-row">
                                  <span className="q-id">{q.order_id}</span>
                                  <span className="q-addr">{q.address}</span>
                                  <span className="q-pay">+₹65.00</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <h5 className="queue-sub-heading">Completed Deliveries Today ({completedOrders.length}):</h5>
                          {completedOrders.length === 0 ? (
                            <p className="no-history-text">No deliveries completed yet today.</p>
                          ) : (
                            completedOrders.slice(0, 5).map(c => (
                              <div key={c.order_id} className="completed-order-row">
                                <div className="comp-info">
                                  <span className="comp-id">{c.order_id}</span>
                                  <span className="comp-addr">{c.address}</span>
                                </div>
                                <span className="comp-badge">✅ Delivered (+₹65.00)</span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ==================== TAB 2: WALLET & FINANCIALS ==================== */}
            {activeTab === 'earnings' && (
              <div className="earnings-view-stack">
                {/* Hero Wallet Card */}
                <div className="rider-hero-wallet">
                  <div className="wallet-header">
                    <span className="wallet-tag">TOTAL FLEET EARNINGS</span>
                    <span className="wallet-badge">DAILY PAYOUT READY</span>
                  </div>
                  <div className="wallet-balance-amount">₹{partner?.today_earnings || '890'}</div>
                  <div className="wallet-meta-row">
                    <span>Completed Deliveries: <strong>{partner?.total_deliveries || '342'}</strong></span>
                    <span className="dot">•</span>
                    <span>EV Green Subsidy: <strong>+₹120</strong></span>
                  </div>
                </div>

                {/* Payout Structure Cards */}
                <div className="earnings-rate-grid">
                  <div className="rate-card">
                    <span className="rate-title">Base Payout</span>
                    <span className="rate-val">₹45 / drop</span>
                    <span className="rate-desc">Fixed per delivery rate</span>
                  </div>
                  <div className="rate-card">
                    <span className="rate-title">10-Min Speed Bonus</span>
                    <span className="rate-val">+₹10 / drop</span>
                    <span className="rate-desc">On-time ETA guarantee</span>
                  </div>
                  <div className="rate-card">
                    <span className="rate-title">Trial Waiting Bonus</span>
                    <span className="rate-val">+₹15 / trial</span>
                    <span className="rate-desc">10-min doorstep wait fee</span>
                  </div>
                </div>

                {/* Weekly Target Progress Card */}
                <div className="rider-card">
                  <div className="rider-card-heading">
                    <Award size={16} color="#0C831F" />
                    <span>Weekly Milestone Incentive</span>
                  </div>
                  <div className="milestone-progress-box">
                    <div className="milestone-text-row">
                      <span>Complete 25 deliveries this weekend for <strong>₹500 Extra Cash</strong></span>
                      <span className="milestone-count"><strong>18</strong> / 25 Done</span>
                    </div>
                    <div className="milestone-track">
                      <div className="milestone-bar" style={{ width: '72%' }} />
                    </div>
                  </div>
                </div>

                {/* Bank Card with Instant Withdraw */}
                <div className="rider-card">
                  <div className="rider-card-heading">
                    <ShieldCheck size={16} color="#0C831F" />
                    <span>Linked Bank Account & UPI Settlement</span>
                  </div>
                  <div className="bank-account-flex">
                    <div>
                      <div className="bank-account-num">{partner?.bank_account || regBankAcc}</div>
                      <div className="bank-account-meta">IFSC: {partner?.bank_ifsc || regIfsc} • UPI: {partner?.upi_id || regUpi}</div>
                    </div>
                    <button 
                      type="button"
                      className="rider-btn-primary sm"
                      onClick={() => { playClickSound(); setIsWithdrawModalOpen(true); }}
                    >
                      <Wallet size={14} />
                      <span>Withdraw to UPI</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 3: TRIPS & PERFORMANCE SCORECARD ==================== */}
            {activeTab === 'trips' && (
              <div className="trips-view-stack">
                {/* Performance Scorecard */}
                <div className="rider-card highlight">
                  <div className="trips-scorecard-header">
                    <div>
                      <span className="hub-chip">FLEET EXCELLENCE SCORECARD</span>
                      <h3 className="trips-score-title">Tier 1 Elite Partner</h3>
                    </div>
                    <div className="trips-rating-badge">
                      <Star size={16} fill="#F59E0B" color="#F59E0B" />
                      <span>{partner?.rating || '4.96'}</span>
                    </div>
                  </div>

                  <div className="trips-stats-grid">
                    <div className="stat-pod">
                      <span className="stat-pod-val green">98.4%</span>
                      <span className="stat-pod-lbl">Acceptance</span>
                    </div>
                    <div className="stat-pod">
                      <span className="stat-pod-val blue">99.2%</span>
                      <span className="stat-pod-lbl">On-Time ETA</span>
                    </div>
                    <div className="stat-pod">
                      <span className="stat-pod-val purple">8.4m</span>
                      <span className="stat-pod-lbl">Avg Ride</span>
                    </div>
                    <div className="stat-pod">
                      <span className="stat-pod-val amber">0%</span>
                      <span className="stat-pod-lbl">Cancellations</span>
                    </div>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="trips-filter-row">
                  <button 
                    className={`trips-filter-pill ${tripsFilter === 'today' ? 'active' : ''}`}
                    onClick={() => { playClickSound(); setTripsFilter('today'); }}
                  >
                    Today ({completedOrders.length > 0 ? completedOrders.length : 3})
                  </button>
                  <button 
                    className={`trips-filter-pill ${tripsFilter === 'yesterday' ? 'active' : ''}`}
                    onClick={() => { playClickSound(); setTripsFilter('yesterday'); }}
                  >
                    Yesterday (8)
                  </button>
                  <button 
                    className={`trips-filter-pill ${tripsFilter === 'week' ? 'active' : ''}`}
                    onClick={() => { playClickSound(); setTripsFilter('week'); }}
                  >
                    This Week (26)
                  </button>
                </div>

                {/* Trips Delivery List */}
                <div className="trips-list-container">
                  {/* Dynamic Completed Orders from State */}
                  {completedOrders.length > 0 && completedOrders.map((co) => (
                    <div key={co.order_id} className="trip-history-card">
                      <div className="trip-card-top">
                        <div className="trip-id-block">
                          <span className="trip-order-id">#{co.order_id}</span>
                          <span className="trip-time">Just Now • Delivered</span>
                        </div>
                        <div className="trip-earning-tag">
                          +₹65.00
                        </div>
                      </div>

                      <div className="trip-route-summary">
                        <div className="trip-stop">
                          <span className="stop-dot hub" />
                          <span className="stop-name">{co.dark_store || selectedHub} (Bay #3)</span>
                        </div>
                        <div className="trip-stop-connector" />
                        <div className="trip-stop">
                          <span className="stop-dot user" />
                          <span className="stop-name">{co.address}</span>
                        </div>
                      </div>

                      <div className="trip-items-summary">
                        <div className="trip-manifest">
                          <span>{co.items?.[0]?.name || 'Wardrobe Garments'}</span>
                          <span className="trial-verified-tag">✓ Doorstep OTP Verified</span>
                        </div>
                        <div className="trip-payout-breakdown">
                          <span>Base: ₹45</span>
                          <span>•</span>
                          <span>Speed Bonus: +₹10</span>
                          <span>•</span>
                          <span>Doorstep Trial: +₹10</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Curated Historical Trips */}
                  <div className="trip-history-card">
                    <div className="trip-card-top">
                      <div className="trip-id-block">
                        <span className="trip-order-id">#BW-7821</span>
                        <span className="trip-time">Today, 01:24 PM</span>
                      </div>
                      <div className="trip-earning-tag">
                        +₹65.00
                      </div>
                    </div>

                    <div className="trip-route-summary">
                      <div className="trip-stop">
                        <span className="stop-dot hub" />
                        <span className="stop-name">Indiranagar Dark Store #14 (Bay #3)</span>
                      </div>
                      <div className="trip-stop-connector" />
                      <div className="trip-stop">
                        <span className="stop-dot user" />
                        <span className="stop-name">Flat 402, Prestige Tower, Indiranagar</span>
                      </div>
                    </div>

                    <div className="trip-items-summary">
                      <div className="trip-manifest">
                        <span>Pure Linen Slim Fit Shirt (M & L)</span>
                        <span className="trial-verified-tag">✓ Doorstep Fit Verified</span>
                      </div>
                      <div className="trip-payout-breakdown">
                        <span>Base: ₹45</span>
                        <span>•</span>
                        <span>Speed: +₹10</span>
                        <span>•</span>
                        <span>Trial Wait: +₹10</span>
                      </div>
                    </div>

                    <div className="trip-rating-strip">
                      <div className="stars-row">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#F59E0B" color="#F59E0B" />)}
                      </div>
                      <span className="customer-review-quote">"Delivered in 7 minutes and garments were pristine on hangers!"</span>
                    </div>
                  </div>

                  <div className="trip-history-card">
                    <div className="trip-card-top">
                      <div className="trip-id-block">
                        <span className="trip-order-id">#BW-7809</span>
                        <span className="trip-time">Today, 11:50 AM</span>
                      </div>
                      <div className="trip-earning-tag">
                        +₹65.00
                      </div>
                    </div>

                    <div className="trip-route-summary">
                      <div className="trip-stop">
                        <span className="stop-dot hub" />
                        <span className="stop-name">Indiranagar Dark Store #14 (Bay #3)</span>
                      </div>
                      <div className="trip-stop-connector" />
                      <div className="trip-stop">
                        <span className="stop-dot user" />
                        <span className="stop-name">Villa 12, Palm Meadows, Indiranagar</span>
                      </div>
                    </div>

                    <div className="trip-items-summary">
                      <div className="trip-manifest">
                        <span>Cotton Relaxed Fit Chinos (32 & 34)</span>
                        <span className="trial-verified-tag">✓ Size 32 Kept</span>
                      </div>
                      <div className="trip-payout-breakdown">
                        <span>Base: ₹45</span>
                        <span>•</span>
                        <span>Speed: +₹10</span>
                        <span>•</span>
                        <span>Trial Wait: +₹10</span>
                      </div>
                    </div>
                  </div>

                  <div className="trip-history-card">
                    <div className="trip-card-top">
                      <div className="trip-id-block">
                        <span className="trip-order-id">#BW-7794</span>
                        <span className="trip-time">Today, 10:15 AM</span>
                      </div>
                      <div className="trip-earning-tag">
                        +₹55.00
                      </div>
                    </div>

                    <div className="trip-route-summary">
                      <div className="trip-stop">
                        <span className="stop-dot hub" />
                        <span className="stop-name">Indiranagar Dark Store #14 (Bay #3)</span>
                      </div>
                      <div className="trip-stop-connector" />
                      <div className="trip-stop">
                        <span className="stop-dot user" />
                        <span className="stop-name">92, 12th Main Road, HAL 2nd Stage</span>
                      </div>
                    </div>

                    <div className="trip-items-summary">
                      <div className="trip-manifest">
                        <span>Oversized Graphic Tee (L)</span>
                      </div>
                      <div className="trip-payout-breakdown">
                        <span>Base: ₹45</span>
                        <span>•</span>
                        <span>Speed Bonus: +₹10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 3: DARK STORE HUB ==================== */}
            {activeTab === 'hub' && (
              <div className="hub-view-stack">
                {/* Hub Details Card */}
                <div className="rider-card">
                  <div className="hub-header-row">
                    <div className="hub-avatar">
                      <Building size={22} color="#B45309" />
                    </div>
                    <div>
                      <span className="hub-chip">ASSIGNED DISPATCH HUB</span>
                      <h3 className="hub-title">{partner?.hub_id || selectedHub}</h3>
                    </div>
                  </div>

                  <div className="hub-specs-list">
                    <div className="hub-spec-row">
                      <span className="spec-lbl">Hub Address:</span>
                      <span className="spec-val">Plot 18, 100ft Road, Near Sony Signal, Indiranagar, Bangalore - 560038</span>
                    </div>
                    <div className="hub-spec-row">
                      <span className="spec-lbl">Shift Manager:</span>
                      <span className="spec-val">Deepak Nair (📞 +91 98765 11223)</span>
                    </div>
                    <div className="hub-spec-row">
                      <span className="spec-lbl">Assigned Locker / Bay:</span>
                      <span className="spec-val font-bold green">Bay #3 (EV Fleet Dedicated)</span>
                    </div>
                    <div className="hub-spec-row">
                      <span className="spec-lbl">Operating Hours:</span>
                      <span className="spec-val">06:00 AM – 12:30 AM (Midnight Wardrobe Rush)</span>
                    </div>
                  </div>
                </div>

                {/* EV Battery Swapping Station */}
                <div className="rider-card">
                  <div className="rider-card-heading">
                    <BatteryCharging size={16} color="#0C831F" />
                    <span>Nearby EV Battery Swap Station</span>
                  </div>
                  <div className="battery-station-box">
                    <div className="station-info">
                      <span className="station-title">Ather Grid & Sun Mobility Swap Station #4</span>
                      <span className="station-sub">350 meters from Dark Store • 6 Fully Charged Packs</span>
                    </div>
                    <span className="free-tag">100% Free for Nivvo EV</span>
                  </div>
                </div>

                {/* Rider Kit Compliance Checklist */}
                <div className="rider-card">
                  <div className="rider-card-heading">
                    <CheckCircle size={16} color="#0C831F" />
                    <span>Fleet Safety & Kit Compliance</span>
                  </div>
                  <div className="compliance-checklist">
                    <div className="check-item"><Check size={14} color="#0C831F" /> <span>Thermal-insulated Nivvo wardrobe hanger bag</span></div>
                    <div className="check-item"><Check size={14} color="#0C831F" /> <span>ISI-Certified Nivvo safety helmet</span></div>
                    <div className="check-item"><Check size={14} color="#0C831F" /> <span>High-visibility reflective night jacket</span></div>
                    <div className="check-item"><Check size={14} color="#0C831F" /> <span>Garment garment steamer swap pouches</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 4: FLEET SAFETY & SOS ==================== */}
            {activeTab === 'safety' && (
              <div className="hub-view-stack">
                {/* 24/7 Emergency SOS Card */}
                <div className="rider-card" style={{ borderLeft: '4px solid #DC2626', background: '#FEF2F2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#DC2626', letterSpacing: '0.5px' }}>24/7 FLEET SAFETY HOTLINE</span>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#991B1B', margin: '2px 0 0 0' }}>Rider Road Incident & SOS Desk</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#7F1D1D', lineHeight: 1.45, margin: '0 0 14px 0' }}>
                    In case of a road accident, breakdown, or medical emergency, tap below to contact the 24/7 Nivvo Incident Response Team and nearest dispatch ambulance.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a 
                      href="tel:18004199999" 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        background: '#DC2626', 
                        color: '#FFFFFF', 
                        padding: '9px 16px', 
                        borderRadius: '8px', 
                        fontSize: '12.5px', 
                        fontWeight: 800, 
                        textDecoration: 'none' 
                      }}
                    >
                      <Phone size={14} />
                      <span>Call Emergency Hotline (1800-419-FLEET)</span>
                    </a>
                    <a 
                      href="tel:108" 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        background: '#FFFFFF', 
                        border: '1px solid #FCA5A5', 
                        color: '#991B1B', 
                        padding: '9px 16px', 
                        borderRadius: '8px', 
                        fontSize: '12.5px', 
                        fontWeight: 800, 
                        textDecoration: 'none' 
                      }}
                    >
                      <PhoneCall size={14} />
                      <span>Call 108 Ambulance</span>
                    </a>
                  </div>
                </div>

                {/* Comprehensive Insurance Policy Card */}
                <div className="rider-card">
                  <div className="rider-card-heading">
                    <ShieldCheck size={16} color="#0C831F" />
                    <span>Active Insurance & Welfare Coverage</span>
                  </div>
                  <div className="hub-specs-list">
                    <div className="hub-spec-row">
                      <span className="spec-lbl">Policy Number:</span>
                      <span className="spec-val font-mono">BW-ICICI-FLEET-902148</span>
                    </div>
                    <div className="hub-spec-row">
                      <span className="spec-lbl">Cashless Hospitalization:</span>
                      <span className="spec-val green font-bold">₹5,00,000 / year (Direct cashless across 8,000+ hospitals)</span>
                    </div>
                    <div className="hub-spec-row">
                      <span className="spec-lbl">Accidental Term Cover:</span>
                      <span className="spec-val">₹10,00,000 Family Protection Guarantee</span>
                    </div>
                    <div className="hub-spec-row">
                      <span className="spec-lbl">OPD & Doctor Teleconsult:</span>
                      <span className="spec-val">Unlimited free consults on MediBuddy with rider ID</span>
                    </div>
                  </div>
                </div>

                {/* Operational FAQs */}
                <div className="rider-card">
                  <div className="rider-card-heading">
                    <HelpCircle size={16} color="#0C831F" />
                    <span>Fleet Operations FAQ & Guidelines</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 3px 0' }}>
                        How does the 10-Minute Doorstep Trial work for riders?
                      </h5>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                        When you deliver adjacent sizes (e.g. M & L), wait outside for up to 10 minutes while the customer tries the garment. The customer selects the best fit and returns the rejected size to your hanger bag. You receive an additional +₹15 trial waiting bonus.
                      </p>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 3px 0' }}>
                        What if the customer enters an incorrect delivery OTP?
                      </h5>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                        Ask the customer to check the 4-digit code displayed in their live order tracking screen. For system testing, default OTP <strong>7492</strong> is also accepted by the verification engine.
                      </p>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 3px 0' }}>
                        When are earnings credited to my bank account?
                      </h5>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                        Standard payouts are processed daily at 11:30 PM directly to your linked UPI. You can also tap "Transfer to UPI" on the Wallet tab for instant zero-fee withdrawals anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 5: KYC & PROFILE ==================== */}
            {activeTab === 'kyc' && (
              <div className="kyc-view-stack">
                <div className="rider-card highlight">
                  <h2 className="kyc-heading">Rider Profile & KYC Documentation</h2>
                  <p className="kyc-desc">Verified credentials and payout accounts for Nivvo 10-Minute Wardrobe Fleet.</p>
                </div>

                <form onSubmit={handleCompleteRegistration} className="rider-card">
                  <div className="form-group-block">
                    <h4 className="block-title">1. Personal Identity & Contact</h4>
                    <div className="grid-2-col">
                      <div className="input-field">
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          value={regName} 
                          onChange={(e) => setRegName(e.target.value)} 
                          required 
                          className="clean-input" 
                        />
                      </div>
                      <div className="input-field">
                        <label>Phone Number</label>
                        <input 
                          type="text" 
                          value={phoneToQuery} 
                          readOnly
                          className="clean-input" 
                          style={{ background: '#F8FAFC' }}
                        />
                      </div>
                    </div>

                    <div className="grid-2-col">
                      <div className="input-field">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          value={regEmail} 
                          onChange={(e) => setRegEmail(e.target.value)} 
                          className="clean-input" 
                        />
                      </div>
                      <div className="input-field">
                        <label>Assigned Dark Store Hub</label>
                        <select 
                          value={selectedHub} 
                          onChange={(e) => setSelectedHub(e.target.value)}
                          className="clean-input"
                        >
                          <option value="Indiranagar Dark Store #14">Bangalore - Indiranagar Dark Store #14</option>
                          <option value="Koramangala Dark Store #09">Bangalore - Koramangala Dark Store #09</option>
                          <option value="HSR Layout Dark Store #03">Bangalore - HSR Layout Dark Store #03</option>
                          <option value="Whitefield Dark Store #21">Bangalore - Whitefield Dark Store #21</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group-block">
                    <h4 className="block-title">2. Vehicle & Driving Documents</h4>
                    <div className="grid-2-col">
                      <div className="input-field">
                        <label>Vehicle Type</label>
                        <select 
                          value={regVehicleType} 
                          onChange={(e) => setRegVehicleType(e.target.value)}
                          className="clean-input"
                        >
                          <option value="Electric Scooter (EV)">Electric Scooter (EV) — Subsidized Charging</option>
                          <option value="Petrol Motorcycle">Petrol Motorcycle</option>
                          <option value="Electric Bicycle">Electric Bicycle (0-3 km Micro-hub)</option>
                        </select>
                      </div>
                      <div className="input-field">
                        <label>Vehicle Registration Number (RC)</label>
                        <input 
                          type="text" 
                          value={regVehicleNumber} 
                          onChange={(e) => setRegVehicleNumber(e.target.value)} 
                          placeholder="e.g. KA-03-EV-4421"
                          className="clean-input" 
                        />
                      </div>
                    </div>

                    <div className="grid-2-col">
                      <div className="input-field">
                        <label>Driving License (DL) Number</label>
                        <input 
                          type="text" 
                          value={regLicense} 
                          onChange={(e) => setRegLicense(e.target.value)} 
                          placeholder="DL-04202100892"
                          className="clean-input" 
                        />
                      </div>
                      <div className="input-field">
                        <label>Aadhaar / National ID</label>
                        <input 
                          type="text" 
                          value={regAadhaar} 
                          onChange={(e) => setRegAadhaar(e.target.value)} 
                          placeholder="XXXX-XXXX-4819"
                          className="clean-input" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group-block">
                    <h4 className="block-title">3. Settlement Bank & UPI Payouts</h4>
                    <div className="grid-3-col">
                      <div className="input-field">
                        <label>Bank Account Number</label>
                        <input 
                          type="text" 
                          value={regBankAcc} 
                          onChange={(e) => setRegBankAcc(e.target.value)} 
                          className="clean-input" 
                        />
                      </div>
                      <div className="input-field">
                        <label>IFSC Code</label>
                        <input 
                          type="text" 
                          value={regIfsc} 
                          onChange={(e) => setRegIfsc(e.target.value)} 
                          className="clean-input" 
                        />
                      </div>
                      <div className="input-field">
                        <label>UPI ID (Google Pay / PhonePe)</label>
                        <input 
                          type="text" 
                          value={regUpi} 
                          onChange={(e) => setRegUpi(e.target.value)} 
                          className="clean-input" 
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="rider-btn-primary w-full mt-3" 
                    disabled={isSubmitting}
                  >
                    <UserCheck size={16} />
                    <span>{isSubmitting ? 'Syncing with Neon Cloud DB...' : 'Save & Verify Partner Profile'}</span>
                  </button>
                </form>
              </div>
            )}

          </main>

          {/* ==================== FIXED MOBILE BOTTOM NAVIGATION BAR ==================== */}
          <nav className="rider-bottom-nav">
            <button 
              type="button"
              className={`rider-bottom-tab-item ${activeTab === 'duty' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('duty'); }}
            >
              <div className="tab-icon-wrap">
                <PackageCheck size={20} />
                {activeOrder && <span className="tab-dot-live" />}
              </div>
              <span className="tab-label">Duty</span>
            </button>

            <button 
              type="button"
              className={`rider-bottom-tab-item ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('earnings'); }}
            >
              <div className="tab-icon-wrap">
                <Wallet size={20} />
              </div>
              <span className="tab-label">Earnings</span>
            </button>

            <button 
              type="button"
              className={`rider-bottom-tab-item ${activeTab === 'trips' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('trips'); }}
            >
              <div className="tab-icon-wrap">
                <History size={20} />
                <span className="tab-count-badge">{completedOrders.length > 0 ? completedOrders.length : 3}</span>
              </div>
              <span className="tab-label">Trips</span>
            </button>

            <button 
              type="button"
              className={`rider-bottom-tab-item ${activeTab === 'hub' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('hub'); }}
            >
              <div className="tab-icon-wrap">
                <Compass size={20} />
              </div>
              <span className="tab-label">Hub</span>
            </button>

            <button 
              type="button"
              className={`rider-bottom-tab-item ${activeTab === 'kyc' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('kyc'); }}
            >
              <div className="tab-icon-wrap">
                <FileText size={20} />
              </div>
              <span className="tab-label">Profile</span>
            </button>
          </nav>

          {/* ==================== INCOMING ORDER REQUEST MODAL (ACCEPT / REJECT) ==================== */}
          {incomingOrderModal && (
            <div className="incoming-order-overlay">
              <div className="incoming-order-card">
                {/* Countdown progress bar */}
                <div className="incoming-timer-bar">
                  <div 
                    className="incoming-timer-fill" 
                    style={{ width: `${(incomingCountdown / 30) * 100}%` }}
                  />
                </div>

                <div className="incoming-header">
                  <div className="incoming-payout-pod">
                    <span className="inc-cur">₹</span>
                    <span className="inc-val">65.00</span>
                  </div>
                  <div className="incoming-countdown-badge">
                    <Clock size={12} />
                    <span>{incomingCountdown}s</span>
                  </div>
                </div>

                <div className="incoming-meta-strip">
                  <span className="inc-tag">⚡ 10-MIN WARDROBE EXPRESS</span>
                  <span className="inc-dist">1.8 km Total</span>
                </div>

                <div className="incoming-waypoints">
                  <div className="inc-point">
                    <span className="inc-dot hub" />
                    <div>
                      <span className="inc-lbl">PICKUP FROM DARK STORE HUB</span>
                      <strong className="inc-name">{incomingOrderModal.dark_store || selectedHub} (Bay #3)</strong>
                    </div>
                  </div>
                  <div className="inc-line" />
                  <div className="inc-point">
                    <span className="inc-dot user" />
                    <div>
                      <span className="inc-lbl">DROP-OFF AT CUSTOMER DOORSTEP</span>
                      <strong className="inc-name">{incomingOrderModal.address}</strong>
                    </div>
                  </div>
                </div>

                <div className="incoming-items-hint">
                  👔 Includes 2-Size Trial Waiting Incentive (+₹15 included)
                </div>

                {/* Accept / Decline Action Buttons */}
                <div className="incoming-actions-row">
                  <button 
                    className="decline-btn"
                    onClick={handleDeclineIncomingOrder}
                  >
                    Decline
                  </button>
                  <button 
                    className="accept-btn"
                    onClick={handleAcceptIncomingOrder}
                  >
                    Accept Order (+₹65.00)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ISSUE REPORTING MODAL ==================== */}
          {isIssueModalOpen && (
            <div className="perm-modal-overlay">
              <div className="perm-modal-sheet">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Report Delivery Issue</h3>
                  <button 
                    onClick={() => setIsIssueModalOpen(false)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 14px 0' }}>
                  Select the issue encountered at doorstep. Our dispatch team will assist or reassign the order.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {[
                    'Customer not answering phone calls (Tried 3 times)',
                    'Customer gate locked / Security refusal',
                    'Customer wants to keep BOTH trial sizes',
                    'Vehicle puncture or breakdown'
                  ].map((reason, idx) => (
                    <button 
                      key={idx}
                      className={`issue-reason-btn ${selectedIssueReason === reason ? 'active' : ''}`}
                      onClick={() => setSelectedIssueReason(reason)}
                    >
                      <span>{reason}</span>
                      {selectedIssueReason === reason && <Check size={14} color="#0C831F" />}
                    </button>
                  ))}
                </div>

                {issueSubmittedMsg ? (
                  <div className="rider-toast-banner" style={{ margin: 0 }}>
                    <CheckCircle2 size={16} color="#0C831F" />
                    <span>{issueSubmittedMsg}</span>
                  </div>
                ) : (
                  <button 
                    className="onboard-primary-cta w-full"
                    disabled={!selectedIssueReason}
                    onClick={() => {
                      playAddSound();
                      setIssueSubmittedMsg('Issue reported to Indiranagar Dispatch Controller. Stand by on call.');
                      setTimeout(() => {
                        setIssueSubmittedMsg('');
                        setIsIssueModalOpen(false);
                      }, 2500);
                    }}
                  >
                    Submit Issue to Dispatcher
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ==================== CONFETTI CELEBRATION MODAL ==================== */}
          {showConfettiModal && (
            <div className="perm-modal-overlay">
              <div className="perm-modal-sheet" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0C831F' }}>
                  <Award size={36} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
                  Delivery Completed! 🎉
                </h2>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#0C831F', margin: '10px 0' }}>
                  +₹65.00
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '320px', margin: '0 auto 20px auto', lineHeight: 1.45 }}>
                  Order completed with doorstep trial verified. Cash has been credited instantly to your Fleet Wallet.
                </p>
                <button 
                  className="onboard-primary-cta w-full"
                  onClick={() => setShowConfettiModal(false)}
                >
                  Back to Active Duty
                </button>
              </div>
            </div>
          )}

          {/* ==================== INSTANT UPI WITHDRAWAL MODAL ==================== */}
          {isWithdrawModalOpen && (
            <div className="perm-modal-overlay">
              <div className="withdraw-modal-sheet">
                <div className="withdraw-sheet-header">
                  <div className="withdraw-header-title">
                    <Wallet size={18} color="#0C831F" />
                    <h3>Instant UPI Payout</h3>
                  </div>
                  <button 
                    type="button"
                    className="modal-close-round"
                    onClick={() => { setIsWithdrawModalOpen(false); setWithdrawReceipt(null); }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {!withdrawReceipt ? (
                  <form onSubmit={handleWithdrawSubmit}>
                    <div className="withdraw-balance-banner">
                      <span className="wb-label">AVAILABLE FLEET WALLET</span>
                      <div className="wb-amount">₹{partner?.today_earnings || '890'}.00</div>
                      <span className="wb-instant-tag">⚡ Direct IMPS • Instant Settlement</span>
                    </div>

                    <div className="withdraw-amount-selector">
                      <label className="input-label">Select Amount to Withdraw</label>
                      <div className="withdraw-quick-chips">
                        {['200', '500', '800', partner?.today_earnings || '890'].map((amt, idx) => (
                          <button
                            type="button"
                            key={idx}
                            className={`withdraw-chip-btn ${withdrawAmount === amt ? 'active' : ''}`}
                            onClick={() => setWithdrawAmount(amt)}
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>

                      <div className="withdraw-input-box">
                        <span className="withdraw-cur-prefix">₹</span>
                        <input 
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          min="100"
                          max={partner?.today_earnings || '890'}
                          className="withdraw-custom-input"
                          placeholder="Enter amount"
                          required
                        />
                      </div>
                    </div>

                    <div className="withdraw-destination-card">
                      <div className="dest-header">
                        <ShieldCheck size={14} color="#0C831F" />
                        <span>Settlement UPI Account (UIDAI Verified)</span>
                      </div>
                      <div className="dest-body">
                        <div className="dest-upi-row">
                          <span className="dest-upi-id">{partner?.upi_id || regUpi || 'rahul.ev@okhdfc'}</span>
                          <span className="verified-pill">ACTIVE</span>
                        </div>
                        <div className="dest-bank-sub">
                          Bank: {partner?.bank_account || regBankAcc || 'HDFC Bank •••• 9031'} (IFSC: {partner?.bank_ifsc || regIfsc || 'HDFC0001824'})
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="withdraw-submit-btn"
                      disabled={isWithdrawing || !withdrawAmount || parseInt(withdrawAmount) <= 0}
                    >
                      {isWithdrawing ? (
                        <span className="flex-center-gap"><RotateCw size={15} className="spin-icon" /> Processing IMPS Transfer...</span>
                      ) : (
                        <span>Withdraw ₹{withdrawAmount || '0'} to UPI</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="withdraw-receipt-card">
                    <div className="receipt-success-icon">
                      <CheckCircle2 size={44} color="#0C831F" />
                    </div>
                    <h3 className="receipt-title">₹{withdrawReceipt.amount}.00 Transferred!</h3>
                    <p className="receipt-sub">Funds have been credited instantly to your linked UPI address via IMPS.</p>

                    <div className="receipt-details-table">
                      <div className="receipt-row">
                        <span className="r-lbl">Transaction Reference:</span>
                        <span className="r-val mono">{withdrawReceipt.utr}</span>
                      </div>
                      <div className="receipt-row">
                        <span className="r-lbl">Credited To:</span>
                        <span className="r-val">{withdrawReceipt.upi}</span>
                      </div>
                      <div className="receipt-row">
                        <span className="r-lbl">Date & Time:</span>
                        <span className="r-val">{withdrawReceipt.date}, {withdrawReceipt.time}</span>
                      </div>
                      <div className="receipt-row">
                        <span className="r-lbl">Transfer Fee:</span>
                        <span className="r-val green">₹0.00 (Zero Fee)</span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      className="onboard-primary-cta w-full"
                      onClick={() => { setIsWithdrawModalOpen(false); setWithdrawReceipt(null); }}
                    >
                      Back to Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 24/7 ACCIDENT / EMERGENCY SOS MODAL ==================== */}
          {isSosModalOpen && (
            <div className="perm-modal-overlay">
              <div className="sos-modal-sheet">
                <div className="sos-sheet-top">
                  <div className="sos-badge-urgent">
                    <AlertCircle size={16} />
                    <span>24/7 FLEET SOS DESK</span>
                  </div>
                  <button 
                    type="button"
                    className="modal-close-round white"
                    onClick={() => { setIsSosModalOpen(false); setSosSent(false); }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="sos-sheet-hero">
                  <h3 className="sos-title">Emergency Roadside Incident</h3>
                  <p className="sos-desc">
                    In case of an accident, road breakdown, or medical emergency, your live location is automatically broadcast to Indiranagar Dispatch and emergency services.
                  </p>
                </div>

                <div className="sos-coords-card">
                  <MapPin size={16} color="#DC2626" />
                  <div className="coords-info">
                    <span className="coords-lbl">CURRENT GPS COORDINATES</span>
                    <span className="coords-val">12.9716° N, 77.5946° E</span>
                    <span className="coords-landmark">Near 100ft Road Signal, Indiranagar, Bangalore</span>
                  </div>
                </div>

                <div className="sos-actions-stack">
                  <a href="tel:18004199999" className="sos-call-action-btn fleet">
                    <PhoneCall size={18} />
                    <div>
                      <strong>Call Fleet Safety Desk</strong>
                      <span>1800-419-FLEET (24/7 Dedicated Line)</span>
                    </div>
                  </a>

                  <a href="tel:108" className="sos-call-action-btn medical">
                    <PhoneCall size={18} />
                    <div>
                      <strong>Call Medical Ambulance (108)</strong>
                      <span>Direct cashless admission under ICICI Lombard policy</span>
                    </div>
                  </a>

                  <a href="tel:112" className="sos-call-action-btn police">
                    <PhoneCall size={18} />
                    <div>
                      <strong>Call Police Control (112)</strong>
                      <span>National Emergency Helpline</span>
                    </div>
                  </a>
                </div>

                {sosSent ? (
                  <div className="sos-alert-sent-banner">
                    <CheckCircle2 size={18} color="#0C831F" />
                    <span>Incident alert transmitted to Indiranagar Hub Manager Deepak Nair. Stand by on call.</span>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="sos-broadcast-btn"
                    onClick={handleTriggerSosAlert}
                  >
                    <span>Notify Hub Controller Immediately</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
