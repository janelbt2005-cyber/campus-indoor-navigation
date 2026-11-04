import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navigation, MapPin, Compass, Search, User, ShieldCheck, 
  Send, Bot, Clock, FileText, HelpCircle, LogOut, CheckCircle, 
  ArrowRight, Building, UserCheck, Key, X, Footprints, Sparkles,
  Layers, ChevronRight, RefreshCw, MessageSquare, Edit3, Trash2, PlusCircle, BarChart3, TrendingUp, Users,
  Play, Pause, RotateCcw
} from 'lucide-react';

// Safe environment variable and Supabase initialization for standalone preview & production builds
const getEnvVar = (key, fallback = '') => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // Ignore meta errors in ES2015 targets
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://zvuwbdnqxqtomjafatjt.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', '');

// Fallback dummy supabase client when @supabase/supabase-js is not installed in local environment
export const supabase = (typeof window !== 'undefined' && window.supabase) 
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: async () => ({ data: null, error: new Error('Supabase client fallback in preview') })
      })
    };

// ==========================================
// COMPREHENSIVE JAAH BUILDING MAP NODES & HALLWAY WAYPOINTS
// Normalized 0-1000 Coordinate Scale for Realistic Corridor Pathfinding
// ==========================================
const INITIAL_MAP_NODES = {
  // --- GROUND FLOOR TRANSIT WAYPOINTS & HALLWAYS ---
  'f1-entrance': { id: 'f1-entrance', name: 'Main Canopy Entrance', floor: 1, x: 520, y: 920, type: 'transit' },
  'f1-foyer': { id: 'f1-foyer', name: 'Front Main Foyer', floor: 1, x: 520, y: 840, type: 'transit' },
  'f1-south-hall': { id: 'f1-south-hall', name: 'South Corridor Junction', floor: 1, x: 520, y: 730, type: 'transit' },
  'f1-lobby': { id: 'f1-lobby', name: 'General Lobby Hallway', floor: 1, x: 505, y: 430, type: 'transit' },
  'f1-north-hall': { id: 'f1-north-hall', name: 'North Corridor Junction', floor: 1, x: 508, y: 235, type: 'transit' },
  'f1-stairs': { id: 'f1-stairs', name: 'Main Stairs (Up to 2nd Floor)', floor: 1, x: 508, y: 140, type: 'elevator' },

  // Ground Floor East Wing Corridor Waypoints
  'f1-east-hall-mid': { id: 'f1-east-hall-mid', name: 'East Wing Main Hallway', floor: 1, x: 740, y: 310, type: 'transit' },
  'f1-east-hall-top': { id: 'f1-east-hall-top', name: 'East Wing North Corridor', floor: 1, x: 740, y: 280, type: 'transit' },
  'f1-east-hall-south': { id: 'f1-east-hall-south', name: 'East Wing South Corridor', floor: 1, x: 740, y: 730, type: 'transit' },

  // Ground Floor Offices & Rooms (Exact Scaled Centers)
  'f1-auditorium': { id: 'f1-auditorium', name: 'Auditorium', floor: 1, x: 195, y: 360, type: 'facility' },
  'f1-stage': { id: 'f1-stage', name: 'Stage', floor: 1, x: 185, y: 715, type: 'facility' },
  'f1-vacant': { id: 'f1-vacant', name: 'Vacant Room', floor: 1, x: 120, y: 865, type: 'facility' },
  'f1-stock': { id: 'f1-stock', name: 'Stock Room (Left)', floor: 1, x: 242, y: 865, type: 'facility' },
  'f1-marketing': { id: 'f1-marketing', name: 'Marketing Center', floor: 1, x: 320, y: 850, type: 'office', code: 'GF-MKT' },
  'f1-warehouse': { id: 'f1-warehouse', name: 'Warehouse', floor: 1, x: 390, y: 135, type: 'facility' },

  'f1-supply-equip': { id: 'f1-supply-equip', name: 'Supply & Equipment Storage', floor: 1, x: 620, y: 135, type: 'facility' },
  'f1-storage-top': { id: 'f1-storage-top', name: 'Storage Room (Top)', floor: 1, x: 700, y: 135, type: 'facility' },
  'f1-acct-file': { id: 'f1-acct-file', name: 'Accounting File Room', floor: 1, x: 772, y: 135, type: 'office', code: 'GF-AFR' },
  'f1-cashier-file': { id: 'f1-cashier-file', name: 'Cashier File Room', floor: 1, x: 847, y: 135, type: 'office', code: 'GF-CFR' },
  'f1-coa': { id: 'f1-coa', name: 'Commission on Audit', floor: 1, x: 930, y: 135, type: 'office', code: 'GF-COA' },

  'f1-cashier': { id: 'f1-cashier', name: 'Cashier Office', floor: 1, x: 740, y: 415, type: 'office', code: 'GF-CSH' },
  'f1-clerks': { id: 'f1-clerks', name: "Clerk's Office", floor: 1, x: 858, y: 415, type: 'office', code: 'GF-CLR' },
  'f1-budget': { id: 'f1-budget', name: 'Budget Office', floor: 1, x: 935, y: 415, type: 'office', code: 'GF-BDG' },
  'f1-accounting': { id: 'f1-accounting', name: 'Accounting Office', floor: 1, x: 740, y: 550, type: 'office', code: 'GF-ACC' },
  'f1-accountant': { id: 'f1-accountant', name: 'Accountant Office', floor: 1, x: 935, y: 550, type: 'office', code: 'GF-ACT' },

  'f1-security': { id: 'f1-security', name: 'Security Office', floor: 1, x: 690, y: 840, type: 'office', code: 'GF-SEC' },
  'f1-supply': { id: 'f1-supply', name: 'Supply Office', floor: 1, x: 748, y: 840, type: 'office', code: 'GF-SUP' },
  'f1-cao-finance': { id: 'f1-cao-finance', name: 'CAO, Finance', floor: 1, x: 895, y: 840, type: 'office', code: 'GF-CAO' },

  // --- SECOND FLOOR TRANSIT WAYPOINTS & HALLWAYS ---
  'f2-stairs': { id: 'f2-stairs', name: 'Main Staircase Landing', floor: 2, x: 508, y: 140, type: 'elevator' },
  'f2-atrium': { id: 'f2-atrium', name: 'Central Atrium Corridor', floor: 2, x: 500, y: 440, type: 'transit' },
  'f2-west-hall': { id: 'f2-west-hall', name: 'West Wing Corridor', floor: 2, x: 310, y: 290, type: 'transit' },
  'f2-east-hall': { id: 'f2-east-hall', name: 'East Wing Corridor', floor: 2, x: 720, y: 560, type: 'transit' },

  // Second Floor Offices & Rooms
  'f2-dj': { id: 'f2-dj', name: 'DJ Office', floor: 2, x: 85, y: 125, type: 'office', code: '2F-DJ' },
  'f2-powder': { id: 'f2-powder', name: 'Powder Room', floor: 2, x: 155, y: 175, type: 'facility' },
  'f2-pdo': { id: 'f2-pdo', name: 'PDO', floor: 2, x: 232, y: 125, type: 'office', code: '2F-PDO' },
  'f2-alumni': { id: 'f2-alumni', name: 'Alumni Affairs Office', floor: 2, x: 395, y: 110, type: 'office', code: '2F-ALU' },
  'f2-conference': { id: 'f2-conference', name: 'Conference Room', floor: 2, x: 232, y: 290, type: 'facility' },
  'f2-faculty': { id: 'f2-faculty', name: 'Faculty Room', floor: 2, x: 110, y: 520, type: 'office', code: '2F-FAC' },
  'f2-prog-chair': { id: 'f2-prog-chair', name: 'Program Chair Office', floor: 2, x: 232, y: 425, type: 'office', code: '2F-PCO' },
  'f2-citcs': { id: 'f2-citcs', name: 'CITCS Facility', floor: 2, x: 310, y: 425, type: 'office', code: '2F-CITCS' },
  'f2-nstp': { id: 'f2-nstp', name: 'NSTP Office', floor: 2, x: 232, y: 580, type: 'office', code: '2F-NSTP' },
  'f2-accreditation': { id: 'f2-accreditation', name: 'Accreditation Office', floor: 2, x: 310, y: 580, type: 'office', code: '2F-ACC' },
  'f2-registrar': { id: 'f2-registrar', name: 'Office of the Registrar', floor: 2, x: 388, y: 595, type: 'office', code: '2F-REG' },

  'f2-president': { id: 'f2-president', name: 'Office of the President', floor: 2, x: 885, y: 125, type: 'office', code: '2F-PRES' },
  'f2-board-room': { id: 'f2-board-room', name: 'Board Room', floor: 2, x: 885, y: 290, type: 'facility' },
  'f2-dasa': { id: 'f2-dasa', name: 'Director for Student Affairs', floor: 2, x: 692, y: 445, type: 'office', code: '2F-DASA' },
  'f2-plant': { id: 'f2-plant', name: 'Physical Plant & Site Dev.', floor: 2, x: 885, y: 445, type: 'office', code: '2F-PLANT' },
  'f2-vpsa': { id: 'f2-vpsa', name: 'VP for Student Affairs', floor: 2, x: 720, y: 635, type: 'office', code: '2F-VPSA' },
  'f2-info': { id: 'f2-info', name: 'Information Office', floor: 2, x: 890, y: 600, type: 'office', code: '2F-INFO' }
};

// ==========================================
// GRAPH NETWORK CONNECTING HALLWAYS TO ROOM DOORS
// ==========================================
const INITIAL_GRAPH = {
  // Ground Floor Hallway Network Backbone
  'f1-entrance': [{ node: 'f1-foyer', dist: 10 }],
  'f1-foyer': [{ node: 'f1-entrance', dist: 10 }, { node: 'f1-south-hall', dist: 12 }, { node: 'f1-marketing', dist: 15 }],
  'f1-south-hall': [{ node: 'f1-foyer', dist: 12 }, { node: 'f1-lobby', dist: 25 }, { node: 'f1-security', dist: 15 }, { node: 'f1-east-hall-south', dist: 20 }],
  'f1-lobby': [
    { node: 'f1-south-hall', dist: 25 },
    { node: 'f1-north-hall', dist: 20 },
    { node: 'f1-auditorium', dist: 30 },
    { node: 'f1-east-hall-mid', dist: 20 }
  ],
  'f1-north-hall': [{ node: 'f1-lobby', dist: 20 }, { node: 'f1-stairs', dist: 10 }, { node: 'f1-warehouse', dist: 12 }, { node: 'f1-supply-equip', dist: 12 }, { node: 'f1-east-hall-top', dist: 20 }],
  'f1-stairs': [{ node: 'f1-north-hall', dist: 10 }, { node: 'f2-stairs', dist: 15 }],

  // East Wing Hallway Connection Nodes
  'f1-east-hall-top': [{ node: 'f1-north-hall', dist: 20 }, { node: 'f1-east-hall-mid', dist: 15 }, { node: 'f1-storage-top', dist: 8 }, { node: 'f1-acct-file', dist: 8 }, { node: 'f1-cashier-file', dist: 12 }, { node: 'f1-coa', dist: 18 }],
  'f1-east-hall-mid': [{ node: 'f1-lobby', dist: 20 }, { node: 'f1-east-hall-top', dist: 15 }, { node: 'f1-east-hall-south', dist: 20 }, { node: 'f1-cashier', dist: 5 }, { node: 'f1-clerks', dist: 12 }, { node: 'f1-budget', dist: 18 }, { node: 'f1-accounting', dist: 10 }],
  'f1-east-hall-south': [{ node: 'f1-east-hall-mid', dist: 20 }, { node: 'f1-south-hall', dist: 20 }, { node: 'f1-supply', dist: 5 }, { node: 'f1-cao-finance', dist: 15 }, { node: 'f1-accountant', dist: 15 }],

  // Room Specific Entry Nodes to Corridors
  'f1-auditorium': [{ node: 'f1-lobby', dist: 30 }, { node: 'f1-stage', dist: 25 }],
  'f1-stage': [{ node: 'f1-auditorium', dist: 25 }, { node: 'f1-vacant', dist: 15 }, { node: 'f1-stock', dist: 15 }],
  'f1-vacant': [{ node: 'f1-stage', dist: 15 }, { node: 'f1-stock', dist: 10 }],
  'f1-stock': [{ node: 'f1-vacant', dist: 10 }, { node: 'f1-marketing', dist: 10 }],
  'f1-marketing': [{ node: 'f1-stock', dist: 10 }, { node: 'f1-foyer', dist: 15 }],
  'f1-warehouse': [{ node: 'f1-north-hall', dist: 12 }],
  'f1-supply-equip': [{ node: 'f1-north-hall', dist: 12 }],
  'f1-storage-top': [{ node: 'f1-east-hall-top', dist: 8 }],
  'f1-acct-file': [{ node: 'f1-east-hall-top', dist: 8 }],
  'f1-cashier-file': [{ node: 'f1-east-hall-top', dist: 12 }],
  'f1-coa': [{ node: 'f1-east-hall-top', dist: 18 }],
  'f1-cashier': [{ node: 'f1-east-hall-mid', dist: 5 }],
  'f1-clerks': [{ node: 'f1-east-hall-mid', dist: 12 }],
  'f1-budget': [{ node: 'f1-east-hall-mid', dist: 18 }],
  'f1-accounting': [{ node: 'f1-east-hall-mid', dist: 10 }],
  'f1-accountant': [{ node: 'f1-east-hall-south', dist: 15 }],
  'f1-security': [{ node: 'f1-south-hall', dist: 15 }],
  'f1-supply': [{ node: 'f1-east-hall-south', dist: 5 }],
  'f1-cao-finance': [{ node: 'f1-east-hall-south', dist: 15 }],

  // Second Floor Hallway Backbone
  'f2-stairs': [{ node: 'f1-stairs', dist: 15 }, { node: 'f2-alumni', dist: 10 }, { node: 'f2-atrium', dist: 20 }],
  'f2-atrium': [{ node: 'f2-stairs', dist: 20 }, { node: 'f2-west-hall', dist: 15 }, { node: 'f2-east-hall', dist: 20 }, { node: 'f2-registrar', dist: 15 }],
  'f2-west-hall': [{ node: 'f2-atrium', dist: 15 }, { node: 'f2-conference', dist: 10 }, { node: 'f2-citcs', dist: 10 }, { node: 'f2-prog-chair', dist: 12 }, { node: 'f2-faculty', dist: 20 }, { node: 'f2-nstp', dist: 20 }, { node: 'f2-accreditation', dist: 20 }, { node: 'f2-pdo', dist: 15 }],
  'f2-east-hall': [{ node: 'f2-atrium', dist: 20 }, { node: 'f2-dasa', dist: 10 }, { node: 'f2-vpsa', dist: 10 }, { node: 'f2-info', dist: 15 }, { node: 'f2-president', dist: 25 }, { node: 'f2-board-room', dist: 20 }, { node: 'f2-plant', dist: 15 }],

  'f2-dj': [{ node: 'f2-powder', dist: 8 }],
  'f2-powder': [{ node: 'f2-dj', dist: 8 }, { node: 'f2-pdo', dist: 8 }],
  'f2-pdo': [{ node: 'f2-powder', dist: 8 }, { node: 'f2-west-hall', dist: 15 }],
  'f2-alumni': [{ node: 'f2-stairs', dist: 10 }],
  'f2-conference': [{ node: 'f2-west-hall', dist: 10 }],
  'f2-faculty': [{ node: 'f2-west-hall', dist: 20 }],
  'f2-prog-chair': [{ node: 'f2-west-hall', dist: 12 }],
  'f2-citcs': [{ node: 'f2-west-hall', dist: 10 }],
  'f2-nstp': [{ node: 'f2-west-hall', dist: 20 }],
  'f2-accreditation': [{ node: 'f2-west-hall', dist: 20 }],
  'f2-registrar': [{ node: 'f2-atrium', dist: 15 }],
  'f2-president': [{ node: 'f2-east-hall', dist: 25 }],
  'f2-board-room': [{ node: 'f2-east-hall', dist: 20 }],
  'f2-dasa': [{ node: 'f2-east-hall', dist: 10 }],
  'f2-plant': [{ node: 'f2-east-hall', dist: 15 }],
  'f2-vpsa': [{ node: 'f2-east-hall', dist: 10 }],
  'f2-info': [{ node: 'f2-east-hall', dist: 15 }]
};

const INITIAL_OFFICES = [
  {
    id: 'f1-cashier',
    name: 'Cashier Office',
    code: 'GF-CSH',
    floor: 1,
    hours: '8:00 AM - 4:00 PM (Mon-Fri)',
    head: 'Mr. Robert Vance',
    contact: 'finance@univ.edu | Ext. 102',
    services: ['Tuition & Assessment Fee Payment Processing', 'Official Receipt Issuance', 'Student Clearance Verification'],
    keywords: ['pay', 'tuition', 'fee', 'cashier', 'receipt', 'clearance'],
    visitCount: 1420
  },
  {
    id: 'f1-accounting',
    name: 'Accounting Office',
    code: 'GF-ACC',
    floor: 1,
    hours: '8:00 AM - 5:00 PM (Mon-Fri)',
    head: 'Ms. Clara Thorne',
    contact: 'accounting@univ.edu | Ext. 105',
    services: ['Student Account Balances & Ledger Verification', 'Financial Statement Auditing'],
    keywords: ['accounting', 'balance', 'ledger'],
    visitCount: 980
  },
  {
    id: 'f2-registrar',
    name: 'Office of the Registrar',
    code: '2F-REG',
    floor: 2,
    hours: '8:00 AM - 5:00 PM (Mon-Fri)',
    head: 'Dr. Evelyn Martinez',
    contact: 'registrar@univ.edu | Ext. 101',
    services: ['Official Transcript of Records (TOR)', 'Certificate of Grades & Graduation Verification', 'Diploma Reissuance'],
    keywords: ['transcript', 'tor', 'grades', 'diploma', 'registrar'],
    visitCount: 2450
  },
  {
    id: 'f2-president',
    name: 'Office of the President',
    code: '2F-PRES',
    floor: 2,
    hours: '8:00 AM - 5:00 PM (Mon-Fri)',
    head: 'Dr. University President',
    contact: 'president@univ.edu | Ext. 200',
    services: ['Institutional Policy & Executive Inquiries', 'Official Memorandums'],
    keywords: ['president', 'executive', 'policy'],
    visitCount: 310
  },
  {
    id: 'f2-citcs',
    name: 'CITCS Facility',
    code: '2F-CITCS',
    floor: 2,
    hours: '8:00 AM - 5:00 PM (Mon-Fri)',
    head: 'Dean, College of Info Tech & Computer Sciences',
    contact: 'citcs@univ.edu | Ext. 301',
    services: ['BSIT & BSCS Academic Advising', 'Capstone & Internship Approvals', 'Computer Laboratory Assistance'],
    keywords: ['citcs', 'it', 'computer', 'programming', 'capstone', 'dean'],
    visitCount: 1890
  },
  {
    id: 'f2-vpsa',
    name: 'Office of the VP for Student Affairs',
    code: '2F-VPSA',
    floor: 2,
    hours: '8:00 AM - 5:00 PM (Mon-Fri)',
    head: 'Prof. Marcus Brody',
    contact: 'vpsa@univ.edu | Ext. 201',
    services: ['Student Organization Permits', 'Scholarship & Financial Assistance Programs'],
    keywords: ['scholarship', 'student affairs', 'vpsa', 'club'],
    visitCount: 760
  }
];

const CHATBOT_FAQ = [
  { triggers: ['registrar', 'tor', 'transcript', 'grades', 'diploma'], officeId: 'f2-registrar', response: "The **Office of the Registrar** is located on the **Second Floor (Code: 2F-REG)**." },
  { triggers: ['cashier', 'pay', 'tuition', 'fee', 'receipt', 'clearance'], officeId: 'f1-cashier', response: "The **Cashier Office** is located on the **Ground Floor (Code: GF-CSH)**." },
  { triggers: ['accounting', 'ledger', 'balance'], officeId: 'f1-accounting', response: "The **Accounting Office** is located on the **Ground Floor (Code: GF-ACC)**." },
  { triggers: ['president', 'executive', 'policy'], officeId: 'f2-president', response: "The **Office of the President** is located on the **Second Floor (Code: 2F-PRES)**." },
  { triggers: ['citcs', 'it', 'computer', 'programming', 'dean'], officeId: 'f2-citcs', response: "The **CITCS Facility** is located on the **Second Floor (Code: 2F-CITCS)**." },
  { triggers: ['vpsa', 'student affairs', 'scholarship'], officeId: 'f2-vpsa', response: "The **Office of the VP for Student Affairs** is located on the **Second Floor (Code: 2F-VPSA)**." }
];

function findShortestPath(startNodeId, endNodeId, mapNodes, graph) {
  if (!mapNodes[startNodeId] || !mapNodes[endNodeId]) return null;
  const distances = {};
  const previous = {};
  const nodes = new Set();

  for (let node in mapNodes) {
    distances[node] = Infinity;
    previous[node] = null;
    nodes.add(node);
  }

  distances[startNodeId] = 0;

  while (nodes.size > 0) {
    let smallest = null;
    for (let node of nodes) {
      if (smallest === null || distances[node] < distances[smallest]) {
        smallest = node;
      }
    }
    if (smallest === endNodeId || distances[smallest] === Infinity) break;
    nodes.delete(smallest);

    if (graph[smallest]) {
      for (let neighbor of graph[smallest]) {
        let alt = distances[smallest] + neighbor.dist;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = smallest;
        }
      }
    }
  }

  const path = [];
  let curr = endNodeId;
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  if (path[0] !== startNodeId) return null;
  return { path, totalDistance: distances[endNodeId] };
}

function generateTurnInstructions(path, mapNodes) {
  if (!path || path.length < 2) return [];
  const instructions = [];
  for (let i = 0; i < path.length - 1; i++) {
    const curr = mapNodes[path[i]];
    const next = mapNodes[path[i + 1]];
    if (!curr || !next) continue;
    if (curr.floor !== next.floor) {
      instructions.push({ step: i + 1, text: `Take Stairs from ${curr.name} to Floor ${next.floor}`, floorChange: true });
    } else {
      instructions.push({ step: i + 1, text: `Proceed from ${curr.name} towards ${next.name}`, floorChange: false });
    }
  }
  const finalNode = mapNodes[path[path.length - 1]];
  if (finalNode) {
    instructions.push({ step: path.length, text: `Arrive at destination: ${finalNode.name}`, floorChange: false, arrival: true });
  }
  return instructions;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [loginRole, setLoginRole] = useState('student');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [guestName, setGuestName] = useState('');

  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [activeFloor, setActiveFloor] = useState(1);
  const [userLocationNode, setUserLocationNode] = useState('f1-foyer');
  const [destinationNode, setDestinationNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track start point mode: 'foyer' (default main entry) vs 'custom' (user selects specific office/room)
  const [startPointMode, setStartPointMode] = useState('foyer');

  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [liveStepIndex, setLiveStepIndex] = useState(0);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [mapNodes, setMapNodes] = useState(INITIAL_MAP_NODES);
  const [graph, setGraph] = useState(INITIAL_GRAPH);
  const [offices, setOffices] = useState(INITIAL_OFFICES);

  // Language selector state
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    async function loadDataFromSupabase() {
      try {
        let { data: officesData, error: officesError } = await supabase.from('offices').select('*');
        if (!officesError && officesData && officesData.length > 0) {
          setOffices(officesData);
        }
      } catch (err) {
        console.warn("Supabase fetch fallback:", err.message);
      }
    }
    loadDataFromSupabase();
  }, []);
  
  // Admin CRUD Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingOfficeId, setEditingOfficeId] = useState(null);
  const [officeForm, setOfficeForm] = useState({ 
    name: '', code: '', floor: 1, hours: '8:00 AM - 5:00 PM', services: '', x: 50, y: 50 
  });

  const routeResult = useMemo(() => {
    if (!userLocationNode || !destinationNode) return null;
    return findShortestPath(userLocationNode, destinationNode, mapNodes, graph);
  }, [userLocationNode, destinationNode, mapNodes, graph]);

  const routeInstructions = useMemo(() => {
    return routeResult ? generateTurnInstructions(routeResult.path, mapNodes) : [];
  }, [routeResult, mapNodes]);

  useEffect(() => {
    if (destinationNode && mapNodes[destinationNode]) {
      const destFloor = mapNodes[destinationNode]?.floor;
      if (destFloor) setActiveFloor(destFloor);
    }
  }, [destinationNode, mapNodes]);

  // GPS Simulation Step Animation Timer
  useEffect(() => {
    let interval = null;
    if (isLiveTracking && routeResult && routeResult.path.length > 1) {
      interval = setInterval(() => {
        setLiveStepIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < routeResult.path.length) {
            const nextNodeId = routeResult.path[nextIndex];
            setUserLocationNode(nextNodeId);
            if (mapNodes[nextNodeId]) {
              setActiveFloor(mapNodes[nextNodeId].floor);
            }
            return nextIndex;
          } else {
            setIsLiveTracking(false);
            return prevIndex;
          }
        });
      }, 5500);
    } else {
      setIsLiveTracking(false);
    }
    return () => clearInterval(interval);
  }, [isLiveTracking, routeResult, mapNodes]);

  const initializeChat = (user) => {
    const welcomeName = user?.name || 'Visitor';
    setChatMessages([
      {
        id: 1,
        sender: 'bot',
        text: `👋 **Welcome, ${welcomeName}!** I am **NaviBot AI**, your GPS blueprint navigation assistant.\n\nAsk me where any office or room is located or specify your starting office and destination for direct office-to-office routing.`
      }
    ]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let loggedUser = null;
    if (loginRole === 'admin') {
      if (authEmail === 'admin@university.edu' && authPassword === 'admin123') {
        loggedUser = { name: 'University Staff Administrator', role: 'admin', id: 'ADM-001' };
      } else {
        alert('Invalid Admin Credentials! Use: admin@university.edu / admin123');
        return;
      }
    } else if (loginRole === 'student') {
      loggedUser = { name: authEmail ? authEmail.split('@')[0] : 'University Student', role: 'student', id: `STU-8812` };
    } else {
      loggedUser = { name: guestName || 'Registered Visitor', role: 'visitor', id: `VIS-102` };
    }
    setCurrentUser(loggedUser);
    setUserLocationNode('f1-foyer');
    setStartPointMode('foyer');
    setDestinationNode(null);
    
    if (loggedUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('ai-assistant');
      initializeChat(loggedUser);
    }
  };

  const handleQuickGuestLogin = () => {
    const guestUser = { name: 'Campus Student / Visitor', role: 'visitor', id: `GUEST-99` };
    setCurrentUser(guestUser);
    setUserLocationNode('f1-foyer');
    setStartPointMode('foyer');
    setDestinationNode(null);
    setActiveTab('ai-assistant');
    initializeChat(guestUser);
  };

  const triggerFillDemo = (role) => {
    setLoginRole(role);
    if (role === 'admin') { setAuthEmail('admin@university.edu'); setAuthPassword('admin123'); }
    else if (role === 'student') { setAuthEmail('student@univ.edu'); setAuthPassword('student123'); }
    else { setGuestName('Alex Santos'); }
  };

  const handleResetToFoyer = () => {
    setUserLocationNode('f1-foyer');
    setStartPointMode('foyer');
    setLiveStepIndex(0);
    setIsLiveTracking(false);
    setActiveFloor(1);
  };

  const handleSetStartPoint = (nodeId, autoSwitchToMap = false) => {
    setUserLocationNode(nodeId);
    setStartPointMode(nodeId === 'f1-foyer' ? 'foyer' : 'custom');
    setLiveStepIndex(0);
    setIsLiveTracking(false);
    if (mapNodes[nodeId]) {
      setActiveFloor(mapNodes[nodeId].floor);
    }
    if (autoSwitchToMap) setActiveTab('map');
  };

  const handleSetDestination = (nodeId, autoSwitchToMap = false) => {
    setDestinationNode(nodeId);
    setLiveStepIndex(0);
    setIsLiveTracking(false);
    if (autoSwitchToMap) setActiveTab('map');
  };

  const handleSendChatMessage = (textToSend = null) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    const lowerQuery = query.toLowerCase();
    setTimeout(() => {
      let matchedOffice = null;
      let matchedResponseText = "";
      for (let faq of CHATBOT_FAQ) {
        if (faq.triggers.some(t => lowerQuery.includes(t))) {
          matchedOffice = mapNodes[faq.officeId];
          matchedResponseText = faq.response;
          break;
        }
      }
      if (!matchedOffice) {
        const found = offices.find(o => o.name.toLowerCase().includes(lowerQuery));
        if (found) {
          matchedOffice = mapNodes[found.id];
          matchedResponseText = `The **${found.name}** is located on **Floor ${found.floor} (${found.code})**. You can set it as your Start Point or Destination below:`;
        } else {
          matchedResponseText = "I couldn't locate an exact match. Try asking about: **Registrar**, **Cashier**, **CITCS Facility**, or **President Office**.";
        }
      }
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: matchedResponseText, targetNodeId: matchedOffice ? matchedOffice.id : null }]);
      if (matchedOffice) handleSetDestination(matchedOffice.id, false);
    }, 400);
  };

  const handleOpenAddModal = () => {
    setEditingOfficeId(null);
    setOfficeForm({ name: '', code: '', floor: 1, hours: '8:00 AM - 5:00 PM', services: '', x: 50, y: 50 });
    setShowAdminModal(true);
  };

  const handleOpenEditModal = (office) => {
    setEditingOfficeId(office.id);
    const node = mapNodes[office.id] || { x: 50, y: 50 };
    setOfficeForm({
      name: office.name,
      code: office.code,
      floor: office.floor,
      hours: office.hours || '8:00 AM - 5:00 PM',
      services: office.services ? office.services.join(', ') : '',
      x: node.x,
      y: node.y
    });
    setShowAdminModal(true);
  };

  const handleSaveOffice = (e) => {
    e.preventDefault();
    if (!officeForm.name || !officeForm.code) return;

    const floorNum = parseInt(officeForm.floor);
    const servicesArray = officeForm.services ? officeForm.services.split(',').map(s => s.trim()) : ['General Services'];

    if (editingOfficeId) {
      setOffices(prev => prev.map(o => o.id === editingOfficeId ? {
        ...o,
        name: officeForm.name,
        code: officeForm.code,
        floor: floorNum,
        hours: officeForm.hours,
        services: servicesArray
      } : o));

      setMapNodes(prev => ({
        ...prev,
        [editingOfficeId]: {
          ...(prev[editingOfficeId] || {}),
          id: editingOfficeId,
          name: officeForm.name,
          code: officeForm.code,
          floor: floorNum,
          x: parseFloat(officeForm.x),
          y: parseFloat(officeForm.y),
          type: 'office'
        }
      }));
    } else {
      const newId = `f${floorNum}-custom-${Date.now()}`;
      const newOfficeObj = {
        id: newId,
        name: officeForm.name,
        code: officeForm.code,
        floor: floorNum,
        hours: officeForm.hours || '8:00 AM - 5:00 PM',
        head: 'Department Head',
        contact: 'office@univ.edu',
        services: servicesArray,
        keywords: [officeForm.name.toLowerCase(), officeForm.code.toLowerCase()],
        visitCount: 100
      };

      setOffices(prev => [...prev, newOfficeObj]);
      setMapNodes(prev => ({
        ...prev,
        [newId]: {
          id: newId,
          name: officeForm.name,
          code: officeForm.code,
          floor: floorNum,
          x: parseFloat(officeForm.x),
          y: parseFloat(officeForm.y),
          type: 'office'
        }
      }));

      setGraph(prev => ({
        ...prev,
        [floorNum === 1 ? 'f1-lobby' : 'f2-atrium']: [
          ...(prev[floorNum === 1 ? 'f1-lobby' : 'f2-atrium'] || []),
          { node: newId, dist: 12 }
        ],
        [newId]: [
          { node: floorNum === 1 ? 'f1-lobby' : 'f2-atrium', dist: 12 }
        ]
      }));
    }

    setShowAdminModal(false);
  };

  const handleDeleteOffice = (officeId) => {
    if (window.confirm('Are you sure you want to delete this office and its location map node?')) {
      setOffices(prev => prev.filter(o => o.id !== officeId));
      setMapNodes(prev => {
        const copy = { ...prev };
        delete copy[officeId];
        return copy;
      });
      if (destinationNode === officeId) setDestinationNode(null);
    }
  };

  const filteredOffices = offices.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.code.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 mb-3">
              <Compass className="w-10 h-10 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Campus Office Navigation System</h1>
            <p className="text-xs text-slate-400 mt-1">JAAH Building Interactive Indoor GPS</p>
          </div>

          <div className="mb-6 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <span className="block font-semibold text-slate-300 mb-2 text-center text-[11px] uppercase">⚡ Quick Role Selection</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => triggerFillDemo('student')} className={`py-1.5 rounded-lg ${loginRole === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Student</button>
              <button onClick={() => triggerFillDemo('visitor')} className={`py-1.5 rounded-lg ${loginRole === 'visitor' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Visitor</button>
              <button onClick={() => triggerFillDemo('admin')} className={`py-1.5 rounded-lg ${loginRole === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Staff / Admin</button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginRole !== 'visitor' ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email / ID</label>
                  <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="admin@university.edu" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Visitor / Student Name</label>
                <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Alex Santos" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white" />
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2">
              <span>Login & Open System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <button type="button" onClick={handleQuickGuestLogin} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Continue as Student/Visitor</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white leading-tight">Campus Office Navigation System</h1>
            <p className="text-[11px] text-slate-400">Role: <span className="text-emerald-400 font-semibold uppercase">{currentUser.role}</span> ({currentUser.name})</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {currentUser.role === 'admin' ? (
            <button className="px-4 py-1.5 rounded-lg font-semibold bg-amber-600 text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> University Staff Dashboard & Analytics
            </button>
          ) : (
            <>
              <button onClick={() => setActiveTab('ai-assistant')} className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${activeTab === 'ai-assistant' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
                <Bot className="w-4 h-4" /> AI Assistant
              </button>
              <button onClick={() => setActiveTab('map')} className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${activeTab === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
                <Navigation className="w-4 h-4" /> 2D Blueprints & Navigation
              </button>
              <button onClick={() => setActiveTab('directory')} className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${activeTab === 'directory' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
                <Building className="w-4 h-4" /> Office Directory
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'admin' && (
            <button onClick={handleOpenAddModal} className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" /> Add New Office
            </button>
          )}
          <button onClick={() => setCurrentUser(null)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 flex flex-col">
        {/* ADMIN DASHBOARD VIEW */}
        {currentUser.role === 'admin' && (
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Total Registered Offices</p>
                  <h3 className="text-2xl font-bold text-white">{offices.length}</h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Most Visited Office</p>
                  <h3 className="text-lg font-bold text-white truncate max-w-[200px]">
                    {offices.reduce((prev, curr) => (curr.visitCount > prev.visitCount) ? curr : prev, offices[0])?.name || 'N/A'}
                  </h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-teal-600/20 text-teal-400 rounded-xl border border-teal-500/30">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Total FAQ Queries Logged</p>
                  <h3 className="text-2xl font-bold text-white">7,340</h3>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="font-bold text-lg text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500" /> Manage Office Information & Location Map Nodes
                  </h2>
                  <p className="text-xs text-slate-400">University Staff Portal: Update office details, blueprints coordinates, and view visit statistics.</p>
                </div>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Filter offices..." 
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offices.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.code.toLowerCase().includes(searchQuery.toLowerCase())).map((office) => (
                  <div key={office.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-white">{office.name}</h4>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleOpenEditModal(office)} className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg border border-slate-800" title="Update Office Information & Location">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteOffice(office.id)} className="p-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-lg border border-slate-800" title="Delete Office">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-indigo-400 font-semibold mt-1">Code: {office.code} | Floor {office.floor}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">🕒 {office.hours}</p>
                      <div className="mt-3 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Total Visits / Searches:</span>
                        <span className="font-bold text-teal-400">{office.visitCount || 500}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI ASSISTANT TAB */}
        {currentUser.role !== 'admin' && activeTab === 'ai-assistant' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col h-[620px]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-inner">
                    <Bot className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">Interact with NaviBot AI Assistant</h2>
                    <p className="text-xs text-slate-400">Ask where any office or room is to generate instant GPS blueprint guidance</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      {msg.targetNodeId && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                          <button onClick={() => handleSetStartPoint(msg.targetNodeId, true)} className="py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition">
                            <MapPin className="w-3.5 h-3.5" /> Set as Start
                          </button>
                          <button onClick={() => handleSetDestination(msg.targetNodeId, true)} className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow transition">
                            <Navigation className="w-3.5 h-3.5" /> Set Destination
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Where is Registrar? / Where is Cashier? / Show route to CITCS..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500" />
                <button type="submit" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow transition">
                  <Send className="w-4 h-4" /> Ask
                </button>
              </form>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Frequently Asked Destinations
                </h3>
                <div className="space-y-2">
                  {[
                    { text: "Where is the Office of the Registrar?", query: "Where is Registrar?" },
                    { text: "Where is the Cashier Office?", query: "Where is Cashier?" },
                    { text: "Where is CITCS Facility?", query: "Where is CITCS Facility?" },
                    { text: "Where is Office of the President?", query: "Where is President office?" }
                  ].map((item, idx) => (
                    <button key={idx} onClick={() => handleSendChatMessage(item.query)} className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between transition">
                      <span>{item.text}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2D GPS BLUEPRINT MAP TAB */}
        {currentUser.role !== 'admin' && activeTab === 'map' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* TOP MAP CONTROLS & ORIGIN-TO-DESTINATION SELECTOR BAR */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
                
                {/* START POINT MODE TOGGLE & SELECTORS */}
                <div className="space-y-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400" /> Choose Start Location Mode:
                    </span>
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                      <button 
                        onClick={handleResetToFoyer}
                        className={`px-3 py-1 rounded-lg font-bold transition ${startPointMode === 'foyer' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        🏛️ Default Main Foyer (GF)
                      </button>
                      <button 
                        onClick={() => setStartPointMode('custom')}
                        className={`px-3 py-1 rounded-lg font-bold transition ${startPointMode === 'custom' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        📍 Custom Office / Current Room
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* START POINT SELECTION DISPLAY */}
                    <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-400 shrink-0 font-medium">Start Point:</span>
                      {startPointMode === 'foyer' ? (
                        <div className="text-xs text-emerald-300 font-bold truncate">
                          Main Foyer (Ground Floor Entrance)
                        </div>
                      ) : (
                        <select 
                          value={userLocationNode} 
                          onChange={(e) => handleSetStartPoint(e.target.value, false)}
                          className="bg-transparent text-xs text-emerald-300 font-semibold focus:outline-none w-full cursor-pointer"
                        >
                          {Object.values(mapNodes).map((node) => (
                            <option key={`start-${node.id}`} value={node.id} className="bg-slate-900 text-slate-100">
                              {node.name} {node.code ? `(${node.code})` : ''} - Floor {node.floor}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* DESTINATION SELECTION */}
                    <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <Navigation className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-xs text-slate-400 shrink-0 font-medium">Destination:</span>
                      <select 
                        value={destinationNode || ''} 
                        onChange={(e) => handleSetDestination(e.target.value || null, false)}
                        className="bg-transparent text-xs text-rose-300 font-semibold focus:outline-none w-full cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-slate-400">-- Where are you going? --</option>
                        {Object.values(mapNodes).map((node) => (
                          <option key={`dest-${node.id}`} value={node.id} className="bg-slate-900 text-slate-100">
                            {node.name} {node.code ? `(${node.code})` : ''} - Floor {node.floor}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Floor Switcher & Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
                      <Layers className="w-4 h-4 text-emerald-400" /> Active View:
                    </span>
                    {[1, 2].map((f) => (
                      <button key={f} onClick={() => setActiveFloor(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeFloor === f ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                        {f === 1 ? 'Ground Floor' : 'Second Floor'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {routeResult && (
                      <button 
                        onClick={() => setIsLiveTracking(!isLiveTracking)} 
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow ${isLiveTracking ? 'bg-amber-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                      >
                        {isLiveTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isLiveTracking ? 'Pause Simulation' : 'Start Live GPS Tracking'}
                      </button>
                    )}
                    {destinationNode && (
                      <button 
                        onClick={() => { setDestinationNode(null); setIsLiveTracking(false); }} 
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-xl transition" 
                        title="Clear Route"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* CURRENT GPS ROUTE BANNER */}
              {routeResult && (
                <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <Navigation className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">ACTIVE OFFICE-TO-OFFICE ROUTE</span>
                      <strong className="text-white text-xs sm:text-sm">
                        {mapNodes[userLocationNode]?.name} ➔ {mapNodes[destinationNode]?.name}
                      </strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">ESTIMATED DISTANCE</span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">{routeResult.totalDistance * 2} Meters</span>
                  </div>
                </div>
              )}

              {/* ARCHITECTURAL BLUEPRINT RENDERING CONTAINER */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[520px] relative">
                <div className="w-full h-full max-w-[680px] aspect-[4/3] relative bg-slate-950 border-2 border-slate-700 rounded-2xl p-3 shadow-2xl overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="blueprint-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                        <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.4" />
                      </pattern>

                      {/* GPS Route Glow Effects */}
                      <filter id="gps-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="0.8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="gps-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>

                    <rect width="100" height="100" fill="url(#blueprint-grid)" />

                    {/* HALLWAY & FREE SPACE PATHWAYS HIGHLIGHTING */}
                    {activeFloor === 1 && (
                      <g className="opacity-30 pointer-events-none">
                        {/* South Corridor */}
                        <rect x="36" y="70" width="28" height="20" fill="#0284c7" rx="0.5" />
                        {/* Central General Lobby Corridor */}
                        <rect x="37" y="24" width="27" height="46" fill="#0284c7" rx="0.5" />
                        {/* East Wing Main Corridor */}
                        <rect x="64" y="24" width="28" height="8" fill="#0284c7" rx="0.5" />
                        <rect x="71.5" y="48" width="8.5" height="4" fill="#0284c7" rx="0.5" />
                        <rect x="71.5" y="68" width="8.5" height="4" fill="#0284c7" rx="0.5" />
                      </g>
                    )}

                    {activeFloor === 2 && (
                      <g className="opacity-30 pointer-events-none">
                        {/* Atrium Open Corridor */}
                        <rect x="42" y="20" width="16" height="60" fill="#0284c7" rx="0.5" />
                        {/* West Wing Hallway */}
                        <rect x="18" y="22" width="24" height="6" fill="#0284c7" rx="0.5" />
                        {/* East Wing Hallway */}
                        <rect x="68" y="66" width="15" height="12" fill="#0284c7" rx="0.5" />
                      </g>
                    )}

                    {activeFloor === 1 && (
                      <g>
                        {/* Outer Building Perimeter */}
                        <rect x="4" y="6" width="92" height="88" fill="none" stroke="#475569" strokeWidth="1.5" rx="1" />
                        
                        {/* --- LEFT WING --- */}
                        {/* Auditorium */}
                        <rect x="6" y="8" width="30" height="48" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
                        <text x="21" y="32" fontSize="1.8" fontWeight="bold" fill="#64748b" textAnchor="middle" letterSpacing="0.8">AUDITORIUM</text>
                        
                        {/* Stage */}
                        <path d="M 10 56 L 32 56 Q 32 64 21 66 Q 10 64 10 56 Z" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="21" y="61" fontSize="1.2" fontWeight="semibold" fill="#475569" textAnchor="middle">STAGE</text>
                        
                        {/* Bottom Left Offices */}
                        <rect x="6" y="70" width="11" height="22" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="11.5" y="80.5" fontSize="1.0" fill="#64748b" textAnchor="middle">VACANT</text>
                        <text x="11.5" y="82.5" fontSize="1.0" fill="#64748b" textAnchor="middle">ROOM</text>
                        
                        <rect x="17" y="70" width="12" height="22" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="23" y="80.5" fontSize="1.0" fill="#64748b" textAnchor="middle">STOCK</text>
                        <text x="23" y="82.5" fontSize="1.0" fill="#64748b" textAnchor="middle">ROOM</text>

                        <rect x="29" y="70" width="10" height="15" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="34" y="76" fontSize="0.9" fontWeight="bold" fill="#93c5fd" textAnchor="middle">MARKETING</text>
                        <text x="34" y="78" fontSize="0.9" fontWeight="bold" fill="#93c5fd" textAnchor="middle">CENTER</text>

                        {/* --- MIDDLE ZONE --- */}
                        {/* Main Foyer & Stairs */}
                        <rect x="39" y="70" width="22" height="22" fill="#020617" stroke="#334155" strokeWidth="0.6" strokeDasharray="1,1" />
                        <text x="50" y="82" fontSize="1.4" fontWeight="semibold" fill="#475569" textAnchor="middle">FOYER</text>

                        <rect x="36" y="8" width="16" height="18" fill="#1e293b" stroke="#334155" strokeWidth="0.6" />
                        <text x="44" y="16.5" fontSize="1.1" fill="#64748b" textAnchor="middle">WAREHOUSE</text>
                        
                        {/* Main Staircase */}
                        <rect x="42" y="26" width="16" height="10" fill="#0f172a" stroke="#475569" strokeWidth="0.6" />
                        <line x1="46" y1="26" x2="46" y2="36" stroke="#475569" strokeWidth="0.4" />
                        <line x1="50" y1="26" x2="50" y2="36" stroke="#475569" strokeWidth="0.4" />
                        <line x1="54" y1="26" x2="54" y2="36" stroke="#475569" strokeWidth="0.4" />
                        <text x="50" y="32" fontSize="1.0" fontWeight="bold" fill="#38bdf8" textAnchor="middle">STAIRS</text>

                        <text x="50" y="52" fontSize="1.5" fontWeight="bold" fill="#334155" textAnchor="middle" letterSpacing="1">GENERAL LOBBY</text>

                        {/* Supply & Equipment Storage (Top Mid) */}
                        <rect x="52" y="8" width="12" height="18" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="58" y="15" fontSize="0.9" fill="#64748b" textAnchor="middle">SUPPLY &</text>
                        <text x="58" y="17" fontSize="0.9" fill="#64748b" textAnchor="middle">EQUIPMENT</text>

                        {/* --- RIGHT WING --- */}
                        {/* Top Right File Rooms & COA */}
                        <rect x="64" y="8" width="9" height="16" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="68.5" y="15" fontSize="0.8" fill="#64748b" textAnchor="middle">STORAGE</text>

                        <rect x="73" y="8" width="7" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="76.5" y="14" fontSize="0.75" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">ACCT FILE</text>

                        <rect x="80" y="8" width="7" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="83.5" y="14" fontSize="0.75" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">CASHIER FILE</text>

                        <rect x="87" y="8" width="8" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="91" y="14" fontSize="0.8" fontWeight="bold" fill="#93c5fd" textAnchor="middle">COA</text>

                        {/* Middle Right Offices */}
                        <rect x="65" y="32" width="16" height="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.8" />
                        <text x="73" y="41" fontSize="1.2" fontWeight="bold" fill="#93c5fd" textAnchor="middle">CASHIER OFFICE</text>

                        <rect x="81" y="32" width="8" height="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="85" y="40" fontSize="0.8" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">CLERKS</text>
                        <text x="85" y="42" fontSize="0.8" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">OFFICE</text>

                        <rect x="89" y="32" width="6.5" height="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="92.2" y="40" fontSize="0.75" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">BUDGET</text>

                        <rect x="65" y="52" width="16" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.8" />
                        <text x="73" y="59" fontSize="1.1" fontWeight="bold" fill="#93c5fd" textAnchor="middle">ACCOUNTING</text>
                        <text x="73" y="61.5" fontSize="1.1" fontWeight="bold" fill="#93c5fd" textAnchor="middle">OFFICE</text>

                        <rect x="81" y="52" width="8" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="85" y="59" fontSize="0.75" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">ACCOUNTANT</text>

                        <rect x="89" y="52" width="6.5" height="16" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="92.2" y="59" fontSize="0.7" fill="#64748b" textAnchor="middle">STORAGE</text>

                        {/* Bottom Right Offices */}
                        <rect x="65" y="70" width="7" height="22" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="68.5" y="80" fontSize="0.75" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">SECURITY</text>

                        <rect x="72" y="70" width="7" height="22" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="75.5" y="80" fontSize="0.75" fontWeight="semibold" fill="#93c5fd" textAnchor="middle">SUPPLY</text>

                        <rect x="79" y="70" width="6" height="22" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="82" y="80" fontSize="0.7" fill="#64748b" textAnchor="middle">STORAGE</text>

                        <rect x="85" y="70" width="10.5" height="22" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="90.2" y="79" fontSize="0.85" fontWeight="bold" fill="#93c5fd" textAnchor="middle">CAO, FINANCE</text>
                      </g>
                    )}

                    {activeFloor === 2 && (
                      <g>
                        {/* Outer Building Perimeter */}
                        <rect x="4" y="6" width="92" height="88" fill="none" stroke="#475569" strokeWidth="1.5" rx="1" />

                        {/* Top Left Rooms */}
                        <rect x="6" y="8" width="12" height="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="12" y="14" fontSize="0.9" fontWeight="bold" fill="#93c5fd" textAnchor="middle">DJ OFFICE</text>

                        <rect x="18" y="8" width="10" height="14" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="23" y="14" fontSize="0.8" fill="#64748b" textAnchor="middle">POWDER RM</text>

                        <rect x="28" y="8" width="10" height="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="33" y="14" fontSize="0.9" fontWeight="bold" fill="#93c5fd" textAnchor="middle">PDO</text>

                        <rect x="38" y="8" width="7" height="14" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="41.5" y="14" fontSize="0.75" fill="#64748b" textAnchor="middle">STOCK</text>

                        <rect x="36" y="24" width="12" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="42" y="30.5" fontSize="0.8" fontWeight="bold" fill="#93c5fd" textAnchor="middle">ALUMNI AFFAIRS</text>

                        {/* Mid-Left Wing Offices */}
                        <rect x="6" y="24" width="28" height="20" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="20" y="33" fontSize="1.1" fill="#64748b" textAnchor="middle">CONFERENCE ROOM</text>

                        <rect x="6" y="46" width="16" height="24" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="14" y="57" fontSize="1.0" fontWeight="bold" fill="#93c5fd" textAnchor="middle">FACULTY ROOM</text>

                        <rect x="22" y="44" width="9" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="26.5" y="51" fontSize="0.7" fontWeight="bold" fill="#93c5fd" textAnchor="middle">PROG CHAIR</text>

                        <rect x="31" y="42" width="11" height="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.8" />
                        <text x="36.5" y="50" fontSize="1.1" fontWeight="bold" fill="#93c5fd" textAnchor="middle">CITCS</text>

                        {/* Bottom Left Offices */}
                        <rect x="22" y="62" width="8" height="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="26" y="70" fontSize="0.8" fontWeight="bold" fill="#93c5fd" textAnchor="middle">NSTP</text>

                        <rect x="30" y="62" width="9" height="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.6" />
                        <text x="34.5" y="70" fontSize="0.7" fontWeight="bold" fill="#93c5fd" textAnchor="middle">ACCREDITATION</text>

                        <rect x="39" y="62" width="12" height="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.8" />
                        <text x="45" y="70" fontSize="1.0" fontWeight="bold" fill="#93c5fd" textAnchor="middle">REGISTRAR</text>

                        {/* Central Atrium */}
                        <rect x="42" y="42" width="16" height="16" fill="#020617" stroke="#475569" strokeWidth="0.6" strokeDasharray="1,1" />
                        <text x="50" y="51" fontSize="1.2" fontWeight="semibold" fill="#475569" textAnchor="middle">ATRIUM</text>

                        {/* Top Right Rooms & Offices */}
                        <rect x="58" y="8" width="10" height="16" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="63" y="15" fontSize="0.8" fill="#64748b" textAnchor="middle">STORAGE</text>

                        <rect x="68" y="8" width="8" height="10" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="72" y="14" fontSize="0.7" fill="#64748b" textAnchor="middle">FEMALE CR</text>

                        <rect x="68" y="18" width="8" height="10" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="72" y="24" fontSize="0.7" fill="#64748b" textAnchor="middle">MALE CR</text>

                        <rect x="78" y="8" width="17" height="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.8" />
                        <text x="86.5" y="16" fontSize="1.0" fontWeight="bold" fill="#93c5fd" textAnchor="middle">PRESIDENT</text>

                        {/* Right Wing Offices */}
                        <rect x="68" y="30" width="12" height="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="74" y="37" fontSize="0.7" fontWeight="bold" fill="#93c5fd" textAnchor="middle">BOARD SEC</text>

                        <rect x="80" y="30" width="15" height="18" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
                        <text x="87.5" y="38" fontSize="0.9" fill="#64748b" textAnchor="middle">BOARD ROOM</text>

                        <rect x="68" y="50" width="12" height="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="74" y="56" fontSize="0.7" fontWeight="bold" fill="#93c5fd" textAnchor="middle">DASA</text>

                        <rect x="80" y="50" width="15" height="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="87.5" y="56" fontSize="0.8" fontWeight="bold" fill="#93c5fd" textAnchor="middle">PLANT & DEV</text>

                        {/* Bottom Right Offices */}
                        <rect x="68" y="66" width="15" height="12" fill="#020617" stroke="#334155" strokeWidth="0.5" />
                        <text x="75.5" y="73" fontSize="0.8" fill="#475569" textAnchor="middle">HALLWAY</text>

                        <rect x="68" y="78" width="15" height="14" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="75.5" y="85" fontSize="0.8" fontWeight="bold" fill="#93c5fd" textAnchor="middle">VPSA</text>

                        <rect x="83" y="66" width="12" height="26" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.7" />
                        <text x="89" y="78" fontSize="0.8" fontWeight="bold" fill="#93c5fd" textAnchor="middle">INFO</text>
                      </g>
                    )}

                    {/* GPS HALLWAY ROUTE INDICATOR POLYLINE */}
                    {routeResult && routeResult.path && (() => {
                      const activeFloorNodes = routeResult.path
                        .map(id => mapNodes[id])
                        .filter(node => node && node.floor === activeFloor);

                      if (activeFloorNodes.length < 2) return null;
                      const points = activeFloorNodes.map(n => `${n.x/10},${n.y/10}`).join(' ');

                      return (
                        <g>
                          {/* Glowing Ambient Underlayer */}
                          <polyline
                            points={points}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.5"
                            filter="url(#gps-glow)"
                          />
                          {/* Main Glowing Pathway Polyline */}
                          <polyline
                            points={points}
                            fill="none"
                            stroke="url(#gps-gradient)"
                            strokeWidth="2.2"
                            strokeDasharray="2.5 1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-pulse"
                          />
                        </g>
                      );
                    })()}

                    {/* NODE OVERLAY PINS */}
                    {Object.values(mapNodes)
                      .filter(node => node.floor === activeFloor)
                      .map((node) => {
                        const isUserHere = userLocationNode === node.id;
                        const isDestination = destinationNode === node.id;
                        if (!isUserHere && !isDestination && node.type === 'transit') return null;

                        return (
                          <g key={`pin-${node.id}`} transform={`translate(${node.x/10}, ${node.y/10})`}>
                            <circle
                              r={isDestination ? "2.2" : isUserHere ? "2.2" : "1.2"}
                              fill={isDestination ? "#ef4444" : isUserHere ? "#10b981" : "#3b82f6"}
                              stroke="#ffffff"
                              strokeWidth="0.4"
                            />
                            {isUserHere && (
                              <circle r="4.0" fill="none" stroke="#10b981" strokeWidth="0.5" className="animate-ping" />
                            )}
                          </g>
                        );
                      })}
                  </svg>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              {routeResult ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400" /> Optimal Route & Step-by-Step Navigation
                  </h3>
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {routeInstructions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold">{step.step}</span>
                        <span className="flex-1">{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 space-y-3">
                  <Compass className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="font-bold text-white text-sm">Choose Optimal Route Suggestion</h3>
                  <p className="text-xs">Select any start office and destination on the map or search in the Directory to calculate optimal shortest paths.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OFFICE DIRECTORY TAB */}
        {currentUser.role !== 'admin' && activeTab === 'directory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-bold text-lg text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-400" /> Campus Office Directory
                </h2>
                <p className="text-xs text-slate-400">Complete listing of departments, floor levels, and services</p>
              </div>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search office name or room code..." 
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffices.map((office) => (
                <div key={office.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-md">
                  <div>
                    <h4 className="font-bold text-sm text-white">{office.name}</h4>
                    <p className="text-xs text-emerald-400 font-semibold mb-2">Code: {office.code} | Floor {office.floor}</p>
                    <p className="text-[11px] text-slate-400 mb-2">🕒 {office.hours}</p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {office.services.map((srv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    <button onClick={() => handleSetStartPoint(office.id, true)} className="py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Set as Start
                    </button>
                    <button onClick={() => handleSetDestination(office.id, true)} className="py-2 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow">
                      <Navigation className="w-3.5 h-3.5" /> Destination
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 relative">
            <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> 
              {editingOfficeId ? 'Update Office Information & Location' : 'Add New Office Node'}
            </h2>
            <form onSubmit={handleSaveOffice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Office Name</label>
                <input 
                  type="text" 
                  required 
                  value={officeForm.name} 
                  onChange={e => setOfficeForm({...officeForm, name: e.target.value})} 
                  placeholder="e.g., Guidance Office" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" 
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Room Code</label>
                <input 
                  type="text" 
                  required 
                  value={officeForm.code} 
                  onChange={e => setOfficeForm({...officeForm, code: e.target.value})} 
                  placeholder="e.g., 2F-GND" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Floor Level</label>
                  <select 
                    value={officeForm.floor} 
                    onChange={e => setOfficeForm({...officeForm, floor: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value={1}>Ground Floor</option>
                    <option value={2}>Second Floor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Operating Hours</label>
                  <input 
                    type="text" 
                    value={officeForm.hours} 
                    onChange={e => setOfficeForm({...officeForm, hours: e.target.value})} 
                    placeholder="8:00 AM - 5:00 PM" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Blueprint X Coord (10-90)</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="90" 
                    value={officeForm.x} 
                    onChange={e => setOfficeForm({...officeForm, x: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Blueprint Y Coord (10-90)</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="90" 
                    value={officeForm.y} 
                    onChange={e => setOfficeForm({...officeForm, y: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Services Offered (comma separated)</label>
                <input 
                  type="text" 
                  value={officeForm.services} 
                  onChange={e => setOfficeForm({...officeForm, services: e.target.value})} 
                  placeholder="Counseling, Student Advising" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl mt-2 transition">
                {editingOfficeId ? 'Save Updated Office Info & Location' : 'Save New Office Node'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}