/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RichTextEditor from './components/RichTextEditor';
import { 
  ChevronRight, 
  X, 
  Lock, 
  Unlock, 
  Type, 
  Calendar, 
  Clock, 
  Tag, 
  Info,
  Save,
  RotateCcw,
  User,
  RefreshCcw,
  AlertCircle,
  Filter,
  Check,
  Plus,
  Trash2
} from 'lucide-react';

// Firebase
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  getDocFromServer, 
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';

// Firebase Configuration (Directly Exposed for reliability as requested)
const firebaseConfig = {
  apiKey: "AIzaSyDfUlYV6JyoIEYPCOx1xAb9-rmze49X3ZI",
  authDomain: "gen-lang-client-0877601885.firebaseapp.com",
  projectId: "gen-lang-client-0877601885",
  storageBucket: "gen-lang-client-0877601885.firebasestorage.app",
  messagingSenderId: "715506466373",
  appId: "1:715506466373:web:8af61c9ae081a6804aed2c",
  firestoreDatabaseId: "(default)"
};

const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

// Initialize Firebase safely
let app: any = null;
let db: any = null;
let auth: any = null;
const provider = new GoogleAuthProvider();

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    // Explicitly handle (default) database ID
    db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") 
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
      : getFirestore(app);
    auth = getAuth(app);
    
    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence disabled');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser does not support persistence');
      }
    });
  } catch (error: any) {
    console.error("Firebase initialization failed:", error);
  }
}

// Types
interface Event {
  id: string;
  category: string;
  start: string;
  end: string;
  title: string;
  preview: string;
  details: string;
  poc: string;
}

interface Day {
  id: string;
  label: string;
  date: string;
  theme: string;
  events: Event[];
}

const INITIAL_DATA: Day[] = [
  {
    id: 'day1',
    label: 'Day 1',
    date: 'April 29',
    theme: 'MY STORY, HIS GLORY',
    events: [
      { id: 'd1e1', category: 'Arrival', start: '8:00 AM', end: '9:00 AM', title: 'Registration & Check-In', preview: 'Campers arrive, register, receive kits, and get room assignments.', details: 'Campers arrive, register, receive kits, and get room assignments. Each camper will be greeted by the welcome team and guided to their designated quarters.', poc: 'Joy and Princess' },
      { id: 'd1e2', category: 'Orientation', start: '9:00 AM', end: '10:30 AM', title: 'Camp Orientation', preview: 'Introduction to camp schedule, rules, and the Battle Royale.', details: 'Introduction to camp schedule, house rules, and safety protocols. Announcement of the Battle Royale competition details, team names, theme song, and chants.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd1e3', category: 'Games', start: '10:30 AM', end: '12:00 PM', title: 'Indoor Game', preview: 'Fun group games and Bible challenges to break the ice.', details: 'High-energy indoor games designed to foster teamwork and familiarity among campers. Includes Bible-themed trivia and physical challenges.', poc: 'Beth' },
      { id: 'd1e4', category: 'Meal', start: '12:00 PM', end: '1:00 PM', title: 'Lunch', preview: 'Lunch break.', details: 'Nutritious lunch served in the main hall. An opportunity for teams to bond over their first meal together.', poc: 'ER' },
      { id: 'd1e5', category: 'Lesson', start: '1:00 PM', end: '2:00 PM', title: 'Lesson 1 — Pastor John Boromeo', preview: 'Eyes Locked in the Battle', details: 'Session 1 Speaker: Pastor John Boromeo Title: Eyes Locked in the Battle. Focusing on spiritual alertness and maintaining vision amidst challenges.', poc: 'Pastor John Boromeo' },
      { id: 'd1e6', category: 'Circle', start: '2:00 PM', end: '3:00 PM', title: 'EMPOWER CIRCLE 1', preview: 'Topic: THE GOOD NEWS', details: 'Small group discussion focusing on the core message of the Gospel and its personal impact.', poc: 'Pastor Joseph and Pastor Paul' },
      { id: 'd1e7', category: 'Team', start: '3:00 PM', end: '5:00 PM', title: 'Team Formation', preview: 'Teams organize and build team identity.', details: 'Teams work on their banners, war cries, and identity. This time is crucial for establishing team synergy for the coming competitions.', poc: 'Beth' },
      { id: 'd1e8', category: 'Free Time', start: '5:00 PM', end: '6:00 PM', title: 'Free Time', preview: 'Rest, refresh, or connect with other campers.', details: 'Unstructured time for campers to rest, shower, or engage in personal prayer and reflection.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd1e9', category: 'Meal', start: '6:00 PM', end: '7:00 PM', title: 'Dinner', preview: 'Dinner break.', details: 'Full dinner service for all campers and staff.', poc: 'ER' },
      { id: 'd1e10', category: 'Worship', start: '7:00 PM', end: '8:30 PM', title: 'Worship Night', preview: 'High-energy praise and worship.', details: 'A vibrant concert-style worship experience led by the Empower Worship Team, focusing on exuberant praise.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd1e11', category: 'Lesson', start: '8:30 PM', end: '9:30 PM', title: 'Lesson 2 — Pastor Jeral Sardiña', preview: 'The Battle Plan for Your Body', details: 'Speaker: Pastor Jeral Sardiña Topic: The Battle Plan for Your Body Theme line: My Story, His Glory. Discussing holiness and the physical vessel.', poc: 'Pastor Jeral Sardiña' },
      { id: 'd1e12', category: 'Circle', start: '9:30 PM', end: '10:00 PM', title: 'EMPOWER CIRCLE 2', preview: 'Topic: PATAY KUNG PATAY', details: 'Deeper dive into self-denial and the cost of discipleship following the evening session.', poc: 'Pastor Joseph and Pastor Paul' },
      { id: 'd1e13', category: 'Lights Off', start: '10:00 PM', end: '10:30 PM', title: 'Lights Off', preview: 'Rest for the next day.', details: 'Curfew for all campers to ensure adequate rest for Day 2 activities.', poc: 'Pastor Amoz and Jeem' }
    ]
  },
  {
    id: 'day2',
    label: 'Day 2',
    date: 'April 30',
    theme: 'MY HARDSHIPS, HIS WORSHIP',
    events: [
      { id: 'd2e1', category: 'Warm-Up', start: '6:00 AM', end: '6:30 AM', title: 'Warm-Up / Energizers', preview: 'Morning energizers to start the day.', details: 'Physical activities and spiritual wake-up calls to prepare the body and mind for a demanding day.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd2e2', category: 'Lesson', start: '6:30 AM', end: '7:00 AM', title: 'Lesson 3 — Pastor Joseph', preview: 'Winning the Battle Within', details: 'Speaker: Pastor Joseph. Focusing on internal spiritual warfare and personal victory through Christ.', poc: 'Pastor Joseph' },
      { id: 'd2e3', category: 'Meal', start: '7:00 AM', end: '8:00 AM', title: 'Breakfast', preview: 'Breakfast break.', details: 'Morning meal to fuel the teams for the upcoming physical challenges.', poc: 'ER' },
      { id: 'd2e4', category: 'Lesson', start: '8:00 AM', end: '9:00 AM', title: 'Lesson 4 — Ptr. Amoz', preview: 'Surrendering Control', details: 'Speaker: Ptr. Amoz Topic: Surrendering Control in the Battle. Learning the power of dependence on God.', poc: 'Ptr. Amoz' },
      { id: 'd2e5', category: 'Circle', start: '9:00 AM', end: '9:30 AM', title: 'EMPOWER CIRCLE 3', preview: 'Topic: Walang Atrasan', details: 'Group commitment session on perseverance and "No Retreat" mindset.', poc: 'Pastor Joseph and Pastor Paul' },
      { id: 'd2e6', category: 'Briefing', start: '9:30 AM', end: '10:00 AM', title: 'The Great 8 Explanation', preview: 'Instructions for the challenge.', details: 'Detailed instructions and safety rules for the main outdoor team competition.', poc: 'Beth' },
      { id: 'd2e7', category: 'Challenge', start: '10:00 AM', end: '11:30 AM', title: 'The Great 8 Challenges', preview: 'Outdoor team challenges.', details: 'A circuit of 8 demanding tasks that test strength, ingenuity, and teamwork. The heart of the Battle Royale.', poc: 'Beth' },
      { id: 'd2e16', category: 'Clean-up', start: '11:30 AM', end: '12:00 PM', title: 'Clean up Time', preview: 'Preparing for Lunch.', details: 'Freshen up and clean up after the intense outdoor challenges to prepare for lunch.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd2e8', category: 'Meal', start: '12:00 PM', end: '1:00 PM', title: 'Lunch', preview: 'Lunch break.', details: 'Recovery meal after the morning challenges.', poc: 'ER' },
      { id: 'd2e9', category: 'Team', start: '1:30 PM', end: '3:30 PM', title: 'Team Huddle', preview: 'Talent presentation prep.', details: 'Final preparation and rehearsal for the talent night presentations.', poc: 'Beth' },
      { id: 'd2e10', category: 'Games', start: '3:30 PM', end: '4:30 PM', title: 'Battle Plan', preview: 'Mini-games session.', details: 'Targeted competitive games to rack up additional points for the leaderboard.', poc: 'Beth' },
      { id: 'd2e11', category: 'Battle Royale', start: '4:30 PM', end: '5:30 PM', title: 'The Battle Royale', preview: 'The Last Battle.', details: 'The grand finale of the physical competitions. All teams converge for a final high-stakes showdown.', poc: 'Beth' },
      { id: 'd2e17', category: 'Circle', start: '5:30 PM', end: '6:00 PM', title: 'EMPOWER CIRCLE 4', preview: 'Small group processing.', details: 'Post-battle royale processing and team reflection before the evening activities.', poc: 'Pastor Joseph and Pastor Paul' },
      { id: 'd2e12', category: 'Presentation', start: '7:00 PM', end: '8:30 PM', title: 'Team Presentation', preview: 'Sprints, songs, or performances.', details: 'Creative expressions of faith and the camp theme. Maximum 5 minutes per team. Judged for creativity and message.', poc: 'Beth' },
      { id: 'd2e13', category: 'Lesson', start: '8:30 PM', end: '9:30 PM', title: 'Lesson 5 — Ptr. Neth Isip', preview: 'Walking Worthy', details: 'Speaker: Ptr. Neth Isip Topic: Walking Worthy in the Battle. Theme line: My Hardships, His Worship.', poc: 'Ptr. Neth Isip' },
      { id: 'd2e14', category: 'Campfire', start: '9:30 PM', end: '11:00 PM', title: 'Campfire', preview: 'What Are You Burning?', details: 'Facilitators: Ton / Theo / Lester / Venzen. Theme: What Are You Burning Tonight? A symbolic act of surrendering burdens.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd2e15', category: 'Lights Off', start: '11:00 PM', end: '11:30 PM', title: 'Lights Off', preview: 'Final night rest.', details: 'Rest for the concluding day of the camp.', poc: 'Pastor Amoz and Jeem' }
    ]
  },
  {
    id: 'day3',
    label: 'Day 3',
    date: 'May 1',
    theme: 'MY BODY, HIS CHOICE',
    events: [
      { id: 'd3e1', category: 'Lesson', start: '6:00 AM', end: '6:30 AM', title: 'Lesson 6 — Pastor Philip', preview: 'Standing Firm', details: 'Speaker: Pastor Philip Topic: Standing Firm in the Battle. Concluding spiritual instructions.', poc: 'Pastor Philip' },
      { id: 'd3e8', category: 'Counselling', start: '6:30 AM', end: '7:00 AM', title: 'FINAL Counselling Session', preview: 'Sharing of social contacts.', details: 'Final ministry moment for counselling and intentional sharing of social contacts to maintain community after camp.', poc: 'Pastor Joseph and Pastor Paul' },
      { id: 'd3e2', category: 'Meal', start: '7:00 AM', end: '8:00 AM', title: 'Breakfast', preview: 'Last camp breakfast.', details: 'Final shared meal and community reflection.', poc: 'ER' },
      { id: 'd3e3', category: 'Pack-Up', start: '8:00 AM', end: '9:00 AM', title: 'Pack-Up & Cleanup', preview: 'Balik Phone.', details: 'Clearing rooms and returning camp equipment. Mobile phones are returned to campers.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd3e4', category: 'Lesson', start: '9:00 AM', end: '10:00 AM', title: 'Lesson 7 — Ptr. YuSef Doca', preview: 'Displaying Christ', details: 'Speaker: Ptr. YuSef Doca Topic: Displaying Christ in the Battle. Application after camp.', poc: 'Ptr. YuSef Doca' },
      { id: 'd3e5', category: 'Q&A', start: '10:00 AM', end: '11:30 AM', title: 'Q&A Session', preview: 'Open floor discussion.', details: 'An interactive session addressing campers\' questions and providing clarity on the lessons learned.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd3e9', category: 'Circle', start: '11:30 AM', end: '12:00 PM', title: 'EMPOWER CIRCLE 5', preview: 'Final processing.', details: 'Concluding group session for reflection and looking forward to the mission beyond camp.', poc: 'Pastor Joseph and Pastor Paul' },
      { id: 'd3e10', category: 'Meal', start: '12:00 PM', end: '1:00 PM', title: 'Lunch', preview: 'Final camp lunch.', details: 'Concluding meal shared as a camp community.', poc: 'ER' },
      { id: 'd3e7', category: 'Awards', start: '1:05 PM', end: '1:30 PM', title: 'Awards Ceremony', preview: 'Recognition and farewell.', details: 'Awarding the Battle Royale champions and special individual citations. Final group photos.', poc: 'Pastor Amoz and Jeem' },
      { id: 'd3e11', category: 'Checkout', start: '1:30 PM', end: '2:30 PM', title: 'Getting Ready to Go Home', preview: 'Final preparations.', details: 'Final room checks, gathering belongings, and saying goodbyes.', poc: 'Pastor Amoz and Jeem' }
    ]
  }
];


// Utility to sort events by time
const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const [time, period] = parts;
  let [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;
  if (period?.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export default function App() {
  const [data, setData] = useState<Day[]>(INITIAL_DATA);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  const [activeDayId, setActiveDayId] = useState(INITIAL_DATA[0].id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventDayId, setSelectedEventDayId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDaySettings, setShowDaySettings] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'>('xl');
  const [filter, setFilter] = useState<'ALL' | 'LESSON' | 'CIRCLE'>('ALL');
  
  const [loginCreds, setLoginCreds] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState(false);
  const [loginStep, setLoginStep] = useState(0); // 0: Password, 1: Google
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    category: 'Lesson',
    start: '8:00 AM',
    end: '9:00 AM',
    title: '',
    preview: '',
    details: '',
    poc: ''
  });

  // Firestore Sync
  useEffect(() => {
    if (!isConfigValid || !db) return;
    
    setIsSyncing(true);
    const unsub = onSnapshot(collection(db, 'days'), (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if DB is empty 
        const seedData = async () => {
          try {
            for (const day of INITIAL_DATA) {
              await setDoc(doc(db, 'days', day.id), day);
            }
          } catch (err) {
            // If they aren't admin, this will fail. That's fine, 
            // the admin just needs to log in once to populate.
            console.warn('Initial seeding failed (likely due to permissions). Admin login required for first-time setup.');
          }
        };
        seedData().then(() => setIsSyncing(false));
      } else {
        const daysFromDb = snapshot.docs.map(doc => doc.data() as Day);
        
        // Merge with INITIAL_DATA to ensure all days are always present
        const merged = INITIAL_DATA.map(initDay => {
          const fromDb = daysFromDb.find(d => d.id === initDay.id);
          return fromDb || initDay;
        });

        // Add any extra days that might be in DB but not in INITIAL_DATA
        daysFromDb.forEach(dbDay => {
          if (!merged.find(m => m.id === dbDay.id)) {
            merged.push(dbDay);
          }
        });

        merged.sort((a, b) => a.id.localeCompare(b.id));
        setData(merged);
        setIsSyncing(false);
      }
    }, (err) => {
      console.error('Firestore Sync Error:', err);
      setSyncError('Cloud sync interrupted. Showing local data.');
      setIsSyncing(false);
    });

    return () => unsub();
  }, []);

  // Auth State
  useEffect(() => {
    if (!isConfigValid || !auth) return;

    const checkRedirect = async () => {
      const { getRedirectResult } = await import('firebase/auth');
      try {
        setAuthStatus('Checking auth result...');
        const result = await getRedirectResult(auth);
        
        if (result) {
          if (result.user.email === 'nethisip1313@gmail.com') {
            setIsAdmin(true);
            setShowLogin(false);
            setAuthStatus('Authorized successfully!');
          } else {
            setAuthStatus('Account not authorized.');
            await signOut(auth);
          }
        } else {
          setAuthStatus(null);
        }
      } catch (err: any) {
        console.error('Redirect result error:', err);
        setAuthStatus(err.message);
      }
    };
    checkRedirect();

    return onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      if (user && user.email === 'nethisip1313@gmail.com' && user.emailVerified) {
        setIsAdmin(true);
        // Only close if we are in admin mode
        if (showLogin) setShowLogin(false);
      }
    });
  }, []);

  // Connection Test
  useEffect(() => {
    if (!isConfigValid || !db) return;

    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          setSyncError("You are currently offline. Changes will sync when reconnected.");
        }
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const sizes = {
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px'
    };
    root.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  const activeDay = data.find(d => d.id === activeDayId) || data[0];
  const selectedEvent = selectedEventId && selectedEventDayId 
    ? data.find(d => d.id === selectedEventDayId)?.events.find(e => e.id === selectedEventId)
    : null;

  const handleUpdateEvent = async (dayId: string, eventId: string, updates: Partial<Event>) => {
    if (!isConfigValid || !db) return;
    const day = data.find(d => d.id === dayId);
    if (!day) return;

    let newEvents = day.events.map(event => {
      if (event.id !== eventId) return event;
      return { ...event, ...updates };
    });

    // Auto-sort events by start time
    newEvents.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

    try {
      await setDoc(doc(db, 'days', dayId), { ...day, events: newEvents });
    } catch (err) {
      console.error('Update Event error:', err);
      alert('Permission denied or network error. Please ensure you are logged in as admin.');
    }
  };

  const handleUpdateDay = async (dayId: string, updates: Partial<Day>) => {
    if (!isConfigValid || !db) return;
    const day = data.find(d => d.id === dayId);
    if (!day) return;

    try {
      await updateDoc(doc(db, 'days', dayId), updates);
    } catch (err) {
      console.error('Update Day error:', err);
      alert('Permission denied or network error.');
    }
  };

  const handleAddEvent = async () => {
    if (!isConfigValid || !db) return;
    const day = data.find(d => d.id === activeDayId);
    if (!day) return;

    const eventToAdd: Event = {
      ...newEvent,
      id: `e${Date.now()}`
    };

    const newEvents = [...day.events, eventToAdd];
    newEvents.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

    try {
      await setDoc(doc(db, 'days', activeDayId), { ...day, events: newEvents });
      setShowAddEvent(false);
      setNewEvent({
        category: 'Lesson',
        start: '8:00 AM',
        end: '9:00 AM',
        title: '',
        preview: '',
        details: '',
        poc: ''
      });
    } catch (err) {
      console.error('Add Event error:', err);
      alert('Failed to add event.');
    }
  };

  const handleDeleteEvent = async (dayId: string, eventId: string) => {
    if (!isConfigValid || !db || !window.confirm('Delete this event?')) return;
    const day = data.find(d => d.id === dayId);
    if (!day) return;

    const newEvents = day.events.filter(e => e.id !== eventId);
    try {
      await setDoc(doc(db, 'days', dayId), { ...day, events: newEvents });
      setSelectedEventId(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!isConfigValid || !db || !window.confirm('This will RESET ALL DAYS (1, 2, and 3) to their original camp schedule. Current custom changes will be lost. Proceed?')) return;
    
    setIsSyncing(true);
    try {
      for (const day of INITIAL_DATA) {
        await setDoc(doc(db, 'days', day.id), day);
      }
      alert('Day 1, 2, and 3 restored successfully!');
      setShowDaySettings(false);
    } catch (err) {
      console.error('Restore error:', err);
      alert('Failed to restore. Check permissions.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCheckPassword = () => {
    if (loginCreds.user === 'empower' && loginCreds.pass === 'battlecry121') {
      setLoginStep(1);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleGoogleLogin = async (mode: 'popup' | 'redirect' = 'popup') => {
    if (!isConfigValid || !auth) return;
    try {
      setAuthStatus(`Opening Google ${mode}...`);
      if (mode === 'popup') {
        const result = await signInWithPopup(auth, provider);
        if (result.user.email === 'nethisip1313@gmail.com') {
          setIsAdmin(true);
          setShowLogin(false);
          setLoginStep(0);
          setLoginCreds({ user: '', pass: '' });
          setAuthStatus(null);
        } else {
          setAuthStatus('Unauthorized email.');
          alert('Access denied: Please sign in with nethisip1313@gmail.com.');
          await signOut(auth);
        }
      } else {
        const { signInWithRedirect } = await import('firebase/auth');
        setAuthStatus('Redirecting to Google. Please wait...');
        // Save current path if needed, though here it's root
        await signInWithRedirect(auth, provider);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthStatus(err.message);
      if (mode === 'popup' && err.code !== 'auth/cancelled-by-user') {
        alert('Popup blocked or failed. Please use the "Sign in (Redirect)" button or allow popups in your browser.');
      }
    }
  };

  const handleSignOut = async () => {
    if (!isConfigValid || !auth) {
      setIsAdmin(false);
      return;
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error", err);
    }
    setIsAdmin(false);
  };

  const textSizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  }[fontSize];

  const headingSizeClass = {
    sm: 'text-xl',
    base: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
    '3xl': 'text-6xl'
  }[fontSize];

  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('lesson')) return 'bg-red-500/20 border-red-500/40 text-red-400';
    if (cat.includes('meal') || cat.includes('lunch') || cat.includes('dinner') || cat.includes('breakfast')) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500';
    if (cat.includes('circle')) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
    return 'bg-stone-500/10 border-white/5 text-white/40';
  };

  const getEventBoxStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('lesson')) return 'bg-red-500/[0.03] border-red-500/10 hover:bg-red-500/[0.06] hover:border-red-500/30';
    if (cat.includes('meal') || cat.includes('lunch') || cat.includes('dinner') || cat.includes('breakfast')) return 'bg-yellow-500/[0.03] border-yellow-500/10 hover:bg-yellow-500/[0.06] hover:border-yellow-500/30';
    if (cat.includes('circle')) return 'bg-emerald-500/[0.03] border-emerald-500/10 hover:bg-emerald-500/[0.06] hover:border-emerald-500/30';
    return 'bg-stone-500/[0.03] border-stone-500/10 hover:bg-stone-500/[0.06] hover:border-stone-500/30'; // Brown-ish/Stone
  };

  return (
    <div className={`min-h-screen bg-[#0d0d0f] text-[#f3f3f2] font-sans selection:bg-[#ff533d] selection:text-white`}>
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[120%] h-[50%] bg-radial-gradient from-[#ff533d]/20 to-transparent blur-[120px]" />
      </div>

      {!isConfigValid && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0c]/95 backdrop-blur-xl p-6">
          <div className="max-w-md w-full bg-stone-900 border border-white/10 rounded-[2rem] p-10 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-4 tracking-tight">Configuration Required</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Firebase API keys are missing. To secure your app and restore functionality, please add your secrets in the 
              <strong> AI Studio Secrets Panel</strong>.
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] font-mono text-left opacity-60">
                VITE_FIREBASE_API_KEY<br/>
                VITE_FIREBASE_PROJECT_ID<br/>
                ...and more
              </div>
            </div>
            <p className="mt-8 text-[10px] font-bold text-[#ff533d] uppercase tracking-[0.2em] animate-pulse">
              Waiting for setup...
            </p>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0c]/95 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="px-4 h-12 flex items-center justify-between border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#ff533d] flex items-center justify-center">
                <span className="font-black text-black text-[10px]">⚔</span>
              </div>
              <h1 className="text-[10px] font-black tracking-widest uppercase truncate text-white/80">Empower Camp</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setShowInfo(true)}
                className="p-1.5 bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                title="Information"
              >
                <Info className="w-4 h-4" />
              </button>
              {isAdmin && (
                <button 
                  onClick={() => setShowDaySettings(true)}
                  className="p-1.5 bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => isAdmin ? handleSignOut() : setShowLogin(true)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isAdmin 
                    ? 'bg-[#ff533d]/10 border-[#ff533d]/40 text-[#ff533d]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Unified Navigation Row - Fixed 5 Columns for Stability */}
          <div className="p-1 pb-3 grid grid-cols-5 gap-1.5 px-2">
            {/* Day 1, 2, 3 Anchors */}
            {['day1', 'day2', 'day3'].map((id) => {
              const day = data.find(d => d.id === id);
              const dayNum = id.replace('day', '');
              const dateLabel = day ? day.date : (id === 'day1' ? 'Apr 29' : id === 'day2' ? 'Apr 30' : 'May 1');
              
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveDayId(id);
                    setFilter('ALL');
                  }}
                  className={`py-3 rounded-2xl text-[10px] font-black uppercase text-center transition-all border leading-tight flex flex-col items-center justify-center min-h-[65px] ${
                    activeDayId === id && filter === 'ALL'
                      ? 'bg-[#ff533d] border-[#ff533d] text-black shadow-lg scale-[1.05]' 
                      : 'bg-white/5 border-white/5 text-white/30'
                  }`}
                >
                  <span className="block mb-0.5 opacity-60 truncate w-full px-1">{day ? day.label : `Day ${dayNum}`}</span>
                  <span className="font-black text-[12px] leading-none">{dateLabel}</span>
                </button>
              );
            })}

            {/* Camp Lessons Filter */}
            <button
              onClick={() => setFilter('LESSON')}
              className={`py-3 rounded-2xl text-[9px] font-black uppercase text-center transition-all border leading-tight flex flex-col items-center justify-center min-h-[65px] ${
                filter === 'LESSON'
                  ? 'bg-red-500 border-red-500 text-white shadow-lg scale-[1.05]' 
                  : 'bg-white/5 border-white/5 text-red-500/50'
              }`}
            >
              <span className="block mb-0.5 opacity-60">Camp</span>
              <span className="text-[12px] font-black leading-none">Lesson</span>
            </button>

            {/* Empower Circle Filter */}
            <button
              onClick={() => setFilter('CIRCLE')}
              className={`py-3 rounded-2xl text-[9px] font-black uppercase text-center transition-all border leading-tight flex flex-col items-center justify-center min-h-[65px] ${
                filter === 'CIRCLE'
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-[1.05]' 
                  : 'bg-white/5 border-white/5 text-emerald-500/50'
              }`}
            >
              <span className="block mb-0.5 opacity-60">Empower</span>
              <span className="text-[12px] font-black leading-none">Circle</span>
            </button>
          </div>
        </div>
        
        {/* Sync Status Bar */}
        {(isSyncing || syncError) && (
          <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest text-center transition-all ${
            syncError ? 'bg-red-500 text-white' : 'bg-[#ff533d] text-black'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {syncError ? <AlertCircle className="w-3 h-3" /> : <RefreshCcw className="w-3 h-3 animate-spin" />}
              {syncError || 'Syncing with cloud...'}
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              !isConfigValid ? 'bg-yellow-500/10 text-yellow-500' : 
              syncError ? 'bg-red-500/10 text-red-500' : 
              isSyncing ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 
              'bg-[#ff533d]/10 text-[#ff533d]'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                !isConfigValid ? 'bg-yellow-500' : 
                syncError ? 'bg-red-500 animate-bounce' : 
                isSyncing ? 'bg-blue-500' : 
                'bg-[#ff533d]'
              }`} />
              {!isConfigValid ? 'Database Config Error' : syncError ? 'Offline Mode' : isSyncing ? 'Cloud Syncing...' : 'Firebase Online'}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black mb-6"
          >
            Empower Camp 2026
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`font-black tracking-tight leading-[0.85] text-[#ff533d] mb-4 text-center ${headingSizeClass} uppercase drop-shadow-2xl`}
          >
            Battle <br className="sm:hidden" /> Cry
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 font-medium tracking-widest uppercase text-sm mb-12"
          >
            To Live Christ, To Die Gain
          </motion.p>
        </header>

        {/* Schedule List */}
        <section className="space-y-6">
          <div className="pt-4 border-b border-white/5 pb-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                {filter === 'ALL' ? `${activeDay.label} Theme` : filter === 'LESSON' ? 'All Camp Lessons' : 'All Empower Circles'}
                <span className="text-sm text-[#ff533d] px-2 py-0.5 rounded-full bg-[#ff533d]/10">
                  { (filter === 'ALL' 
                    ? activeDay.events 
                    : data.flatMap(d => d.events.filter(e => {
                        const cat = e.category.toLowerCase();
                        if (filter === 'LESSON') return cat.includes('lesson');
                        if (filter === 'CIRCLE') return cat.includes('circle');
                        return false;
                      }))
                  ).length } Found
                </span>
              </h3>
              {filter === 'ALL' && <p className="text-[#ff533d] font-bold uppercase tracking-widest text-xs tracking-[0.2em]">{activeDay.theme}</p>}
            </div>
          </div>

          <div className="grid gap-4 mt-8">
            {(filter === 'ALL' 
                ? activeDay.events 
                : data.flatMap(day => day.events.filter(event => {
                    const cat = event.category.toLowerCase();
                    if (filter === 'LESSON') return cat.includes('lesson');
                    if (filter === 'CIRCLE') return cat.includes('circle');
                    return false;
                  })).sort((a, b) => {
                    // Sorting by original day first, then by time
                    const dayA = data.find(d => d.events.some(e => e.id === a.id))?.id || '';
                    const dayB = data.find(d => d.events.some(e => e.id === b.id))?.id || '';
                    if (dayA !== dayB) return dayA.localeCompare(dayB);
                    return timeToMinutes(a.start) - timeToMinutes(b.start);
                  })
              ).map((event, idx) => {
                const eventDay = data.find(d => d.events.some(e => e.id === event.id));
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setSelectedEventDayId(eventDay?.id || activeDay.id);
                    }}
                    className={`group cursor-pointer border rounded-3xl p-5 sm:p-7 transition-all duration-200 ${getEventBoxStyles(event.category)}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      {/* Time Box */}
                      <div className="sm:w-32 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-6">
                        <div className={`text-xl font-black ${
                          event.category.toLowerCase().includes('lesson') ? 'text-red-400' :
                          (event.category.toLowerCase().includes('meal') || event.category.toLowerCase().includes('lunch') || event.category.toLowerCase().includes('dinner') || event.category.toLowerCase().includes('breakfast')) ? 'text-yellow-500' :
                          event.category.toLowerCase().includes('circle') ? 'text-emerald-400' :
                          'text-white/90'
                        }`}>{event.start}</div>
                        <div className="text-xs font-bold text-white/30 uppercase">{event.end || '—'}</div>
                        {filter !== 'ALL' && eventDay && (
                          <div className="text-[10px] font-black text-[#ff533d] uppercase mt-1">{eventDay.label}</div>
                        )}
                      </div>

                      {/* Info Box */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-tighter ${getCategoryStyles(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                        <h4 className={`text-lg font-black tracking-tight mb-2 transition-colors truncate ${
                          event.category.toLowerCase().includes('lesson') ? 'text-red-400 group-hover:text-red-300' :
                          (event.category.toLowerCase().includes('meal') || event.category.toLowerCase().includes('lunch') || event.category.toLowerCase().includes('dinner') || event.category.toLowerCase().includes('breakfast')) ? 'text-yellow-500 group-hover:text-yellow-400' :
                          event.category.toLowerCase().includes('circle') ? 'text-emerald-400 group-hover:text-emerald-300' :
                          'text-white/80 group-hover:text-white'
                        }`}>{event.title}</h4>
                        <p className="text-white/40 text-sm line-clamp-1">{event.preview}</p>
                      </div>

                      <div className="flex items-center justify-end sm:pl-4 gap-2">
                        {isAdmin ? (
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setSelectedEventId(event.id);
                                setSelectedEventDayId(eventDay?.id || activeDay.id);
                                setIsEditing(true);
                              }}
                              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-emerald-500 text-white/40 hover:text-white transition-all border border-white/5 active:scale-95"
                              title="Edit Item"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(eventDay?.id || activeDay.id, event.id)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-red-500 text-white/40 hover:text-white transition-all border border-white/5 active:scale-95"
                              title="Delete Item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-[#ff533d] group-hover:text-black transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedEventId(null);
                setIsEditing(false);
              }}
              className="absolute inset-0 bg-[#0a0a0c]/98 backdrop-blur-3xl"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="relative w-full h-full sm:h-[85vh] sm:max-w-4xl bg-white text-stone-900 sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => {
                  setSelectedEventId(null);
                  setIsEditing(false);
                }}
                className="fixed top-4 right-4 z-[200] w-12 h-12 flex items-center justify-center bg-black/5 active:bg-black/10 sm:bg-stone-100 sm:hover:bg-stone-200 rounded-full transition-all active:scale-90 shadow-sm"
              >
                <X className="w-6 h-6 text-stone-900" />
              </button>

              {/* Modal Header Area - Smaller & Compact to save space */}
              <div className="flex-none sm:p-10 border-b border-stone-100 bg-stone-50/50 pt-16 sm:pt-10 p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 px-3 py-0.5 bg-white rounded-full border border-stone-200 text-[9px] font-black uppercase tracking-widest text-stone-400">
                      <Calendar className="w-2.5 h-2.5 text-[#ff533d]" />
                      {selectedEventDayId && data.find(d=>d.id===selectedEventDayId)?.label} • {selectedEventDayId && data.find(d=>d.id===selectedEventDayId)?.date}
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getCategoryStyles(selectedEvent.category)}`}>
                      <Tag className="w-2.5 h-2.5" />
                      {selectedEvent.category}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1 block">Event Name</label>
                        <input
                          className="w-full text-lg font-black rounded-xl border border-stone-200 p-3 uppercase focus:ring-2 focus:ring-[#ff533d] outline-none shadow-sm"
                          value={selectedEvent.title}
                          onChange={(e) => handleUpdateEvent(selectedEventDayId!, selectedEvent.id, { title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1 block">Start</label>
                          <input
                            className="w-full bg-white border border-stone-200 rounded-lg p-3 font-bold text-sm"
                            value={selectedEvent.start}
                            onChange={(e) => handleUpdateEvent(selectedEventDayId!, selectedEvent.id, { start: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1 block">End</label>
                          <input
                            className="w-full bg-white border border-stone-200 rounded-lg p-3 font-bold text-sm"
                            value={selectedEvent.end}
                            onChange={(e) => handleUpdateEvent(selectedEventDayId!, selectedEvent.id, { end: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-4xl font-black tracking-tight leading-[1.1] uppercase text-stone-900 pr-10">
                        {selectedEvent.title}
                      </h2>
                      <div className={`flex items-center gap-1.5 font-black uppercase tracking-[0.1em] text-[10px] sm:text-sm ${
                        selectedEvent.category.toLowerCase().includes('lesson') ? 'text-red-500' :
                        selectedEvent.category.toLowerCase().includes('meal') ? 'text-yellow-600' :
                        'text-emerald-600'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {selectedEvent.start} {selectedEvent.end !== '—' && `— ${selectedEvent.end}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Content Area - MAX READABILITY */}
              <div className="flex-1 p-6 sm:p-12 overflow-y-auto bg-white no-scrollbar scroll-smooth pb-32 sm:pb-24">
                {isEditing ? (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1 block">Label</label>
                        <input
                          className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm font-bold"
                          value={selectedEvent.category}
                          onChange={(e) => handleUpdateEvent(selectedEventDayId!, selectedEvent.id, { category: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1 block">PIC</label>
                        <input
                          className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm font-bold"
                          value={selectedEvent.poc}
                          onChange={(e) => handleUpdateEvent(selectedEventDayId!, selectedEvent.id, { poc: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1 block">Full Content & Media</label>
                      <RichTextEditor 
                        content={selectedEvent.details}
                        onChange={(content) => handleUpdateEvent(selectedEventDayId!, selectedEvent.id, { details: content })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-10">
                    <div className="space-y-8">
                      <div className="flex items-center gap-2 text-stone-400 border-b border-stone-100 pb-3">
                        <Info className="w-4 h-4 text-[#ff533d]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Detailed Plan</span>
                      </div>
                      
                      <div className="prose prose-stone max-w-none prose-p:text-xl prose-p:leading-relaxed sm:prose-xl prose-p:sm:leading-loose">
                        <div 
                          className="text-stone-800 font-medium editor-view-output"
                          dangerouslySetInnerHTML={{ __html: selectedEvent.details }}
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-[2.5rem] bg-stone-50 border border-stone-100 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-300 shadow-sm shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-0.5">In-Charge</div>
                        <div className="text-lg font-black text-stone-900 uppercase tracking-tight leading-none">{selectedEvent.poc}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Toggle in Modal */}
              {isAdmin && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] w-full px-6 max-w-sm flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all border ${
                      isEditing 
                        ? 'bg-black text-white border-black' 
                        : 'bg-[#ff533d] text-white border-[#ff533d]'
                    }`}
                  >
                    {isEditing ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {isEditing ? 'Save Changes' : 'Admin Edit'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteEvent(selectedEventDayId!, selectedEvent.id)}
                      className="w-16 h-16 flex items-center justify-center bg-red-600 text-white rounded-full shadow-2xl border border-red-700 active:scale-95 transition-all"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Information Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-[#0d0d0f]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#ffffff] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 flex justify-between items-center border-b border-stone-100">
                <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tight">Camp Info</h3>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="p-2 bg-stone-50 rounded-xl text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 no-scrollbar">
                {/* Venue */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#ff533d]">
                    <Type className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Venue Location</span>
                  </div>
                  <div className="p-5 rounded-3xl bg-stone-50 border border-stone-100">
                    <h4 className="text-lg font-black text-stone-900 mb-2">Emmaus Bible Camp</h4>
                    <p className="text-stone-500 text-sm mb-4">Brgy. Sumalo, Hermosa, Bataan</p>
                    <a 
                      href="https://www.google.com/maps/place/Emmaus+Bible+Camp/@14.8424352,120.826643,17z/data=!3m1!4b1!4m6!3m5!1s0x339653b5102a5f45:0xd24178759c33a343!8m2!3d14.84243!4d120.8292179!16s%2Fg%2F11c1xppdh4?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#ff533d] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>

                {/* Things to Bring */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <Check className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Things to Bring</span>
                  </div>
                  <ul className="grid grid-cols-1 gap-2">
                    {[
                      'Bible & Notebook',
                      'Personal Toiletries',
                      'Beddings (Blanket/Pillow)',
                      'Clothes for 3 Days',
                      'Sports/Games Attire',
                      'Water Bottle',
                      'Personal Medications'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 text-stone-600 font-bold text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rules & Reminders */}
                <div className="space-y-4 pb-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Rules & Reminders</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100/50">
                      <p className="text-amber-800 text-xs font-bold leading-relaxed">
                        • Be on time for all sessions.<br/>
                        • Observe silence during rest hours.<br/>
                        • Respect camp property and staff.<br/>
                        • No gadgets allowed during sessions.<br/>
                        • Always wear your camp ID.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-stone-50 border-t border-stone-100">
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em]"
                >
                  Close Information
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-[#0d0d0f]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#18181c] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-[#ff533d] to-[#ff6b57] flex items-center justify-center shadow-[0_0_30px_rgba(255,83,61,0.4)]">
                   <Lock className="w-8 h-8 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-center uppercase tracking-tight mb-2">Admin Sign In</h3>
              <p className="text-white/40 text-center text-xs font-bold uppercase tracking-widest mb-10">Restricted Access</p>
              
              <div className="space-y-4">
                {loginStep === 0 ? (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input
                        type="text"
                        value={loginCreds.user}
                        onChange={(e) => setLoginCreds(prev => ({ ...prev, user: e.target.value }))}
                        placeholder="USERNAME"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#ff533d]/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input
                        type="password"
                        value={loginCreds.pass}
                        onKeyDown={(e) => e.key === 'Enter' && handleCheckPassword()}
                        onChange={(e) => setLoginCreds(prev => ({ ...prev, pass: e.target.value }))}
                        placeholder="PASSWORD"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#ff533d]/50 transition-all"
                      />
                    </div>
                    {loginError && <p className="text-[#ff533d] text-[10px] font-black uppercase text-center animate-shake">Incorrect Credentials</p>}
                    
                    <button
                      onClick={handleCheckPassword}
                      className="w-full bg-[#ff533d] text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_-5px_rgba(255,83,61,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
                    >
                      Next Step
                    </button>
                  </>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="bg-[#ff533d]/10 border border-[#ff533d]/20 rounded-2xl p-6">
                      <p className="text-xs font-black uppercase tracking-widest text-[#ff533d] mb-4">Credentials Verified!</p>
                      <p className="text-[10px] text-white/60 font-medium uppercase tracking-[0.1em] mb-0">
                        Now sign in with Google to enable cloud sync.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => handleGoogleLogin('popup')}
                        className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-stone-200 transition-all font-mono"
                      >
                        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" referrerPolicy="no-referrer" />
                        Option 1: POPUP
                      </button>
                      
                      <button
                        onClick={() => handleGoogleLogin('redirect')}
                        className="w-full bg-[#ff533d] text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_15px_30px_-5px_rgba(255,83,61,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all font-mono"
                      >
                         <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale brightness-0" alt="Google" referrerPolicy="no-referrer" />
                        Option 2: REDIRECT
                      </button>

                      <div className="py-2">
                        {authStatus ? (
                          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff533d] animate-pulse">
                            <RefreshCcw className="w-3 h-3 animate-spin" />
                            {authStatus}
                          </div>
                        ) : (
                          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                            Use Option 2 if Option 1 does not open. <br/>
                            This is common on Chrome and Mobile.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-4">Domain Help</p>
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 font-mono text-[9px] text-white/30 truncate select-all">
                        {window.location.hostname}
                      </div>
                      <p className="text-[8px] text-white/20 uppercase tracking-widest mt-2 leading-relaxed">
                        Add this domain to Firebase Console <br/>Authentication &gt; Settings &gt; Authorized Domains
                      </p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setLoginStep(0);
                  }}
                  className="w-full bg-transparent text-white/40 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Day Settings Modal */}
      <AnimatePresence>
        {showDaySettings && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDaySettings(false)}
              className="absolute inset-0 bg-[#0d0d0f]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#18181c] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">Day Settings</h3>
                <button 
                  onClick={() => setShowDaySettings(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">Display Label</label>
                  <input
                    type="text"
                    value={activeDay.label}
                    onChange={(e) => handleUpdateDay(activeDay.id, { label: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">Date</label>
                  <input
                    type="text"
                    value={activeDay.date}
                    onChange={(e) => handleUpdateDay(activeDay.id, { date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">Theme Tagline</label>
                  <input
                    type="text"
                    value={activeDay.theme}
                    onChange={(e) => handleUpdateDay(activeDay.id, { theme: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                  />
                </div>
                
                <button
                  onClick={() => setShowDaySettings(false)}
                  className="w-full bg-[#ff533d] text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_-5px_rgba(255,83,61,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
                >
                  Done Editing
                </button>

                <div className="pt-8 border-t border-white/5">
                  <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mb-4 text-center">Danger Zone</p>
                  <button
                    onClick={handleRestoreDefaults}
                    className="w-full bg-white/5 border border-white/10 text-white/40 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all"
                  >
                    Restore All 3 Days Content
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddEvent && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddEvent(false)}
              className="absolute inset-0 bg-[#0d0d0f]/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white text-stone-900 rounded-[3rem] p-8 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-stone-900">Add New Item</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Adding to {activeDay.label}</p>
                </div>
                <button 
                  onClick={() => setShowAddEvent(false)}
                  className="p-3 bg-stone-100 rounded-2xl text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">Category / Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Lesson, Meal"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">In-Charge (POC)</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newEvent.poc}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, poc: e.target.value }))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">Event Title</label>
                  <input
                    type="text"
                    placeholder="Enter title..."
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">Start Time</label>
                    <input
                      type="text"
                      placeholder="8:00 AM"
                      value={newEvent.start}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">End Time</label>
                    <input
                      type="text"
                      placeholder="9:00 AM"
                      value={newEvent.end}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#ff533d]/50 transition-all uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#ff533d] mb-2 block">Detailed Plan (Rich Text)</label>
                  <RichTextEditor 
                    content={newEvent.details}
                    onChange={(content) => setNewEvent(prev => ({ ...prev, details: content }))}
                  />
                </div>
                
                <button
                  onClick={handleAddEvent}
                  className="w-full bg-[#ff533d] text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 flex items-center justify-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  Create Event
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin FAB */}
      {isAdmin && !showAddEvent && !selectedEvent && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddEvent(true)}
          className="fixed bottom-8 right-8 z-[100] w-20 h-20 bg-[#ff533d] text-white rounded-full shadow-[0_20px_50px_rgba(255,83,61,0.5)] flex items-center justify-center border border-white/20 active:bg-[#ff3d22]"
        >
          <Plus className="w-10 h-10" />
        </motion.button>
      )}

      {/* Footer Decoration */}
      <footer className="max-w-7xl mx-auto px-4 py-20 text-center border-t border-white/5 mt-20">
        <div className="mb-8 opacity-20">⚔</div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          © 2026 EMPOWER CAMP — TO LIVE CHRIST, TO DIE GAIN
        </p>
      </footer>
    </div>
  );
}

