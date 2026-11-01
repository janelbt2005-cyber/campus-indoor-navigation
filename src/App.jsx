import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navigation, MapPin, Compass, Search, User, ShieldCheck, 
  Send, Bot, Clock, FileText, HelpCircle, LogOut, CheckCircle, 
  ArrowRight, Building, UserCheck, Key, X, Footprints, Sparkles,
  Layers, ChevronRight, RefreshCw, MessageSquare, Edit3, Trash2, PlusCircle, BarChart3, TrendingUp, Users
} from 'lucide-react';

// ==========================================
// COMPREHENSIVE JAAH BUILDING MAP NODES
// ==========================================
const INITIAL_MAP_NODES = {
  // --- GROUND FLOOR ---
  'f1-entrance': { id: 'f1-entrance', name: 'Main Entrance / Canopy', floor: 1, x: 50, y: 92, type: 'transit' },
  'f1-foyer': { id: 'f1-foyer', name: 'Main Foyer', floor: 1, x: 50, y: 82, type: 'transit' },
  'f1-lobby': { id: 'f1-lobby', name: 'General Lobby', floor: 1, x: 50, y: 50, type: 'transit' },
  'f1-stairs': { id: 'f1-stairs', name: 'Main Stairs (Up)', floor: 1, x: 50, y: 22, type: 'elevator' },
  
  // Left Wing (Auditorium & Stage Area)
  'f1-auditorium': { id: 'f1-auditorium', name: 'Auditorium', floor: 1, x: 22, y: 36, type: 'facility' },
  'f1-stage': { id: 'f1-stage', name: 'Stage', floor: 1, x: 22, y: 64, type: 'facility' },
  'f1-vacant': { id: 'f1-vacant', name: 'Vacant Room', floor: 1, x: 12, y: 78, type: 'facility' },
  'f1-stock': { id: 'f1-stock', name: 'Stock Room (Left)', floor: 1, x: 25, y: 78, type: 'facility' },
  'f1-marketing': { id: 'f1-marketing', name: 'Marketing Center', floor: 1, x: 38, y: 78, type: 'office', code: 'GF-MKT' },
  'f1-warehouse': { id: 'f1-warehouse', name: 'Warehouse', floor: 1, x: 41, y: 18, type: 'facility' },

  // Right Wing Hallway & Upper Storage
  'f1-hallway': { id: 'f1-hallway', name: 'East Hallway', floor: 1, x: 78, y: 30, type: 'transit' },
  'f1-storage-top': { id: 'f1-storage-top', name: 'Storage Room (Top)', floor: 1, x: 69, y: 16, type: 'facility' },
  'f1-acct-file': { id: 'f1-acct-file', name: 'Accounting File Room', floor: 1, x: 77, y: 16, type: 'office', code: 'GF-AFR' },
  'f1-cashier-file': { id: 'f1-cashier-file', name: 'Cashier File Room', floor: 1, x: 84, y: 16, type: 'office', code: 'GF-CFR' },
  'f1-coa': { id: 'f1-coa', name: 'Commission on Audit Office', floor: 1, x: 92, y: 16, type: 'office', code: 'GF-COA' },

  // Middle-Right Offices
  'f1-cashier': { id: 'f1-cashier', name: 'Cashier Office', floor: 1, x: 75, y: 42, type: 'office', code: 'GF-CSH' },
  'f1-clerks': { id: 'f1-clerks', name: "Clerk's Office", floor: 1, x: 85, y: 42, type: 'office', code: 'GF-CLR' },
  'f1-budget': { id: 'f1-budget', name: 'Budget Office', floor: 1, x: 93, y: 42, type: 'office', code: 'GF-BDG' },
  'f1-accounting': { id: 'f1-accounting', name: 'Accounting Office', floor: 1, x: 75, y: 58, type: 'office', code: 'GF-ACC' },
  'f1-accountant': { id: 'f1-accountant', name: 'Accountant Office', floor: 1, x: 93, y: 58, type: 'office', code: 'GF-ACT' },
  'f1-mid-storage': { id: 'f1-mid-storage', name: 'Storage Room (Mid)', floor: 1, x: 91, y: 68, type: 'facility' },

  // Bottom-Right Offices
  'f1-security': { id: 'f1-security', name: 'Security Office', floor: 1, x: 70, y: 78, type: 'office', code: 'GF-SEC' },
  'f1-supply': { id: 'f1-supply', name: 'Supply Office', floor: 1, x: 78, y: 78, type: 'office', code: 'GF-SUP' },
  'f1-bottom-storage': { id: 'f1-bottom-storage', name: 'Storage Room (Bottom)', floor: 1, x: 84, y: 78, type: 'facility' },
  'f1-cao-finance': { id: 'f1-cao-finance', name: 'CAO, Finance', floor: 1, x: 92, y: 78, type: 'office', code: 'GF-CAO' },

  // --- SECOND FLOOR ---
  'f2-stairs': { id: 'f2-stairs', name: 'Stairs / Fire Exit', floor: 2, x: 50, y: 22, type: 'elevator' },
  'f2-atrium': { id: 'f2-atrium', name: 'Central Atrium', floor: 2, x: 50, y: 50, type: 'transit' },

  // Left Wing Second Floor
  'f2-dj': { id: 'f2-dj', name: 'DJ Office', floor: 2, x: 14, y: 16, type: 'office', code: '2F-DJ' },
  'f2-powder': { id: 'f2-powder', name: 'Powder Room & CR', floor: 2, x: 23, y: 18, type: 'facility' },
  'f2-pdo': { id: 'f2-pdo', name: 'PDO', floor: 2, x: 33, y: 18, type: 'office', code: '2F-PDO' },
  'f2-stock': { id: 'f2-stock', name: 'Stock Room', floor: 2, x: 41, y: 18, type: 'facility' },
  'f2-alumni': { id: 'f2-alumni', name: 'Alumni Affairs Office', floor: 2, x: 41, y: 32, type: 'office', code: '2F-ALU' },
  'f2-conference': { id: 'f2-conference', name: 'Conference Room', floor: 2, x: 27, y: 36, type: 'facility' },
  'f2-faculty': { id: 'f2-faculty', name: 'Faculty Room', floor: 2, x: 14, y: 56, type: 'office', code: '2F-FAC' },
  'f2-prog-chair': { id: 'f2-prog-chair', name: 'Program Chair Office', floor: 2, x: 26, y: 48, type: 'office', code: '2F-PCO' },
  'f2-citcs': { id: 'f2-citcs', name: 'CITCS Facility', floor: 2, x: 36, y: 48, type: 'office', code: '2F-CITCS' },
  'f2-nstp': { id: 'f2-nstp', name: 'NSTP', floor: 2, x: 25, y: 68, type: 'office', code: '2F-NSTP' },
  'f2-accreditation': { id: 'f2-accreditation', name: 'Accreditation Office', floor: 2, x: 35, y: 68, type: 'office', code: '2F-ACC' },
  'f2-registrar': { id: 'f2-registrar', name: 'Office of the Registrar', floor: 2, x: 41, y: 68, type: 'office', code: '2F-REG' },

  // Right Wing Second Floor
  'f2-storage': { id: 'f2-storage', name: 'Storage Room', floor: 2, x: 63, y: 16, type: 'facility' },
  'f2-female-cr': { id: 'f2-female-cr', name: 'Female C.R.', floor: 2, x: 71, y: 16, type: 'facility' },
  'f2-male-cr': { id: 'f2-male-cr', name: 'Male C.R.', floor: 2, x: 71, y: 24, type: 'facility' },
  'f2-president': { id: 'f2-president', name: 'Office of the President', floor: 2, x: 88, y: 18, type: 'office', code: '2F-PRES' },
  'f2-board-sec': { id: 'f2-board-sec', name: 'President & Board Secretary', floor: 2, x: 75, y: 38, type: 'office', code: '2F-SEC' },
  'f2-board-room': { id: 'f2-board-room', name: 'Board Room', floor: 2, x: 88, y: 38, type: 'facility' },
  'f2-dasa': { id: 'f2-dasa', name: 'Director for Student Affairs & Services', floor: 2, x: 76, y: 56, type: 'office', code: '2F-DASA' },
  'f2-conf-office': { id: 'f2-conf-office', name: 'Conference Office', floor: 2, x: 76, y: 46, type: 'office', code: '2F-CFO' },
  'f2-plant': { id: 'f2-plant', name: 'Physical Plant & Site Development', floor: 2, x: 88, y: 52, type: 'office', code: '2F-PLANT' },
  'f2-hallway': { id: 'f2-hallway', name: 'Hallway', floor: 2, x: 76, y: 68, type: 'transit' },
  'f2-vpsa': { id: 'f2-vpsa', name: 'Office of the VP for Student Affairs', floor: 2, x: 76, y: 80, type: 'office', code: '2F-VPSA' },
  'f2-info': { id: 'f2-info', name: 'Information', floor: 2, x: 88, y: 75, type: 'office', code: '2F-INFO' }
};

const INITIAL_GRAPH = {
  'f1-entrance': [{ node: 'f1-foyer', dist: 10 }],
  'f1-foyer': [{ node: 'f1-entrance', dist: 10 }, { node: 'f1-lobby', dist: 12 }, { node: 'f1-marketing', dist: 10 }],
  'f1-lobby': [
    { node: 'f1-foyer', dist: 12 },
    { node: 'f1-stairs', dist: 15 },
    { node: 'f1-auditorium', dist: 18 },
    { node: 'f1-warehouse', dist: 15 },
    { node: 'f1-cashier', dist: 16 }
  ],
  'f1-stairs': [{ node: 'f1-lobby', dist: 15 }, { node: 'f2-stairs', dist: 15 }],
  'f1-auditorium': [{ node: 'f1-lobby', dist: 18 }, { node: 'f1-stage', dist: 12 }, { node: 'f1-stock', dist: 12 }],
  'f1-stage': [{ node: 'f1-auditorium', dist: 12 }, { node: 'f1-stock', dist: 8 }, { node: 'f1-vacant', dist: 8 }],
  'f1-warehouse': [{ node: 'f1-lobby', dist: 15 }],
  'f1-vacant': [{ node: 'f1-stage', dist: 8 }, { node: 'f1-stock', dist: 8 }],
  'f1-stock': [{ node: 'f1-vacant', dist: 8 }, { node: 'f1-stage', dist: 8 }, { node: 'f1-marketing', dist: 8 }],
  'f1-marketing': [{ node: 'f1-stock', dist: 8 }, { node: 'f1-foyer', dist: 10 }],
  'f1-hallway': [{ node: 'f1-cashier', dist: 10 }, { node: 'f1-storage-top', dist: 8 }, { node: 'f1-budget', dist: 10 }],
  'f1-storage-top': [{ node: 'f1-hallway', dist: 8 }, { node: 'f1-acct-file', dist: 6 }],
  'f1-acct-file': [{ node: 'f1-storage-top', dist: 6 }, { node: 'f1-cashier-file', dist: 6 }],
  'f1-cashier-file': [{ node: 'f1-acct-file', dist: 6 }, { node: 'f1-coa', dist: 6 }],
  'f1-coa': [{ node: 'f1-cashier-file', dist: 6 }, { node: 'f1-budget', dist: 8 }],
  'f1-cashier': [{ node: 'f1-hallway', dist: 10 }, { node: 'f1-clerks', dist: 8 }, { node: 'f1-accounting', dist: 10 }, { node: 'f1-lobby', dist: 16 }],
  'f1-clerks': [{ node: 'f1-cashier', dist: 8 }, { node: 'f1-budget', dist: 8 }],
  'f1-budget': [{ node: 'f1-clerks', dist: 8 }, { node: 'f1-accountant', dist: 8 }, { node: 'f1-coa', dist: 8 }],
  'f1-accounting': [{ node: 'f1-cashier', dist: 10 }, { node: 'f1-accountant', dist: 8 }, { node: 'f1-security', dist: 12 }],
  'f1-accountant': [{ node: 'f1-budget', dist: 8 }, { node: 'f1-accounting', dist: 8 }, { node: 'f1-mid-storage', dist: 6 }],
  'f1-mid-storage': [{ node: 'f1-accountant', dist: 6 }, { node: 'f1-cao-finance', dist: 8 }],
  'f1-security': [{ node: 'f1-foyer', dist: 12 }, { node: 'f1-supply', dist: 8 }, { node: 'f1-accounting', dist: 12 }],
  'f1-supply': [{ node: 'f1-security', dist: 8 }, { node: 'f1-bottom-storage', dist: 8 }],
  'f1-bottom-storage': [{ node: 'f1-supply', dist: 8 }, { node: 'f1-cao-finance', dist: 8 }],
  'f1-cao-finance': [{ node: 'f1-bottom-storage', dist: 8 }, { node: 'f1-mid-storage', dist: 8 }],

  'f2-stairs': [{ node: 'f2-atrium', dist: 12 }, { node: 'f1-stairs', dist: 15 }],
  'f2-atrium': [{ node: 'f2-stairs', dist: 12 }, { node: 'f2-alumni', dist: 10 }, { node: 'f2-citcs', dist: 10 }, { node: 'f2-board-sec', dist: 12 }],
  'f2-dj': [{ node: 'f2-powder', dist: 8 }],
  'f2-powder': [{ node: 'f2-dj', dist: 8 }, { node: 'f2-pdo', dist: 8 }],
  'f2-pdo': [{ node: 'f2-powder', dist: 8 }, { node: 'f2-stock', dist: 6 }],
  'f2-stock': [{ node: 'f2-pdo', dist: 6 }, { node: 'f2-alumni', dist: 6 }],
  'f2-alumni': [{ node: 'f2-stock', dist: 6 }, { node: 'f2-atrium', dist: 10 }, { node: 'f2-conference', dist: 8 }],
  'f2-conference': [{ node: 'f2-alumni', dist: 8 }, { node: 'f2-faculty', dist: 10 }],
  'f2-faculty': [{ node: 'f2-conference', dist: 10 }, { node: 'f2-prog-chair', dist: 8 }, { node: 'f2-nstp', dist: 8 }],
  'f2-prog-chair': [{ node: 'f2-faculty', dist: 8 }, { node: 'f2-citcs', dist: 8 }],
  'f2-citcs': [{ node: 'f2-prog-chair', dist: 8 }, { node: 'f2-atrium', dist: 10 }, { node: 'f2-registrar', dist: 10 }],
  'f2-nstp': [{ node: 'f2-faculty', dist: 8 }, { node: 'f2-accreditation', dist: 8 }],
  'f2-accreditation': [{ node: 'f2-nstp', dist: 8 }, { node: 'f2-registrar', dist: 6 }],
  'f2-registrar': [{ node: 'f2-accreditation', dist: 6 }, { node: 'f2-citcs', dist: 10 }],

  'f2-storage': [{ node: 'f2-female-cr', dist: 6 }],
  'f2-female-cr': [{ node: 'f2-storage', dist: 6 }, { node: 'f2-male-cr', dist: 6 }],
  'f2-male-cr': [{ node: 'f2-female-cr', dist: 6 }, { node: 'f2-president', dist: 10 }],
  'f2-president': [{ node: 'f2-male-cr', dist: 10 }, { node: 'f2-board-room', dist: 8 }],
  'f2-board-room': [{ node: 'f2-president', dist: 8 }, { node: 'f2-board-sec', dist: 8 }],
  'f2-board-sec': [{ node: 'f2-board-room', dist: 8 }, { node: 'f2-atrium', dist: 12 }, { node: 'f2-conf-office', dist: 8 }],
  'f2-conf-office': [{ node: 'f2-board-sec', dist: 8 }, { node: 'f2-dasa', dist: 6 }],
  'f2-dasa': [{ node: 'f2-conf-office', dist: 6 }, { node: 'f2-plant', dist: 8 }, { node: 'f2-hallway', dist: 6 }],
  'f2-plant': [{ node: 'f2-dasa', dist: 8 }],
  'f2-hallway': [{ node: 'f2-dasa', dist: 6 }, { node: 'f2-vpsa', dist: 6 }, { node: 'f2-info', dist: 10 }],
  'f2-vpsa': [{ node: 'f2-hallway', dist: 6 }],
  'f2-info': [{ node: 'f2-hallway', dist: 10 }]
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
  const [userLocationNode, setUserLocationNode] = useState('f1-entrance');
  const [destinationNode, setDestinationNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [liveStepIndex, setLiveStepIndex] = useState(0);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [mapNodes, setMapNodes] = useState(INITIAL_MAP_NODES);
  const [graph, setGraph] = useState(INITIAL_GRAPH);
  const [offices, setOffices] = useState(INITIAL_OFFICES);
  
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
      }, 2200);
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
        text: `👋 **Welcome, ${welcomeName}!** I am **NaviBot AI**, your campus blueprint navigation guide.\n\nAsk me where any room, hallway, or office is located based on our complete architectural floor plans.`
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
    
    // Route to appropriate initial tab depending on role
    if (loggedUser.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('ai-assistant');
      initializeChat(loggedUser);
    }
  };

  const handleQuickGuestLogin = () => {
    const guestUser = { name: 'Guest Student/Visitor', role: 'visitor', id: `GUEST-99` };
    setCurrentUser(guestUser);
    setActiveTab('ai-assistant');
    initializeChat(guestUser);
  };

  const triggerFillDemo = (role) => {
    setLoginRole(role);
    if (role === 'admin') { setAuthEmail('admin@university.edu'); setAuthPassword('admin123'); }
    else if (role === 'student') { setAuthEmail('student@univ.edu'); setAuthPassword('student123'); }
    else { setGuestName('John Doe'); }
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
          matchedResponseText = `The **${found.name}** is located on **Floor ${found.floor} (${found.code})**.`;
        } else {
          matchedResponseText = "I couldn't locate an exact match. Try asking about: **Registrar**, **Cashier**, **CITCS Facility**, or **President Office**.";
        }
      }
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: matchedResponseText, targetNodeId: matchedOffice ? matchedOffice.id : null }]);
      if (matchedOffice) handleSetDestination(matchedOffice.id, false);
    }, 500);
  };

  // --- UNIVERSITY STAFF ADMIN CRUD HANDLERS ---
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
      // --- UPDATE EXISTING OFFICE (Update Office Information & Location) ---
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
      // --- ADD NEW OFFICE ---
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
        visitCount: 100 // initial stats count
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
            <p className="text-xs text-slate-400 mt-1">JAAH Building Interactive Portal</p>
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
                <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white" />
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
            <p className="text-[11px] text-slate-400">Role: <span className="text-indigo-400 font-semibold uppercase">{currentUser.role}</span> ({currentUser.name})</p>
          </div>
        </div>

        {/* ROLE-BASED HEADER NAVIGATION */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {currentUser.role === 'admin' ? (
            <button className="px-4 py-1.5 rounded-lg font-semibold bg-amber-600 text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> University Staff Dashboard & Analytics
            </button>
          ) : (
            <>
              <button onClick={() => setActiveTab('ai-assistant')} className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${activeTab === 'ai-assistant' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                <Bot className="w-4 h-4" /> AI Assistant
              </button>
              <button onClick={() => setActiveTab('map')} className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${activeTab === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                <Navigation className="w-4 h-4" /> 2D Blueprints & Navigation
              </button>
              <button onClick={() => setActiveTab('directory')} className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${activeTab === 'directory' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
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
        {/* ========================================== */}
        {/* UNIVERSITY STAFF ADMIN / ANALYTICS PAGE    */}
        {/* ========================================== */}
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

            {/* ADMIN OFFICE MANAGEMENT & STATS TABLE */}
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

        {/* ========================================== */}
        {/* STUDENT & VISITOR AI ASSISTANT TAB         */}
        {/* ========================================== */}
        {currentUser.role !== 'admin' && activeTab === 'ai-assistant' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col h-[650px]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-2xl">
                    <Bot className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">Interact with AI Navigation Assistant</h2>
                    <p className="text-xs text-slate-400">Ask about any campus office, optimal route, or view my location</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      {msg.targetNodeId && (
                        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
                          <button onClick={() => handleSetDestination(msg.targetNodeId, true)} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                            <Navigation className="w-4 h-4" /> View Room on 2D Blueprint & Get Route
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Where is Registrar? / Where is Cashier? / Show optimal route..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none" />
                <button type="submit" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2">
                  <Send className="w-4 h-4" /> Ask
                </button>
              </form>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Use Help & Support / Search Room
                </h3>
                <div className="space-y-2">
                  {[
                    { text: "Where is the Office of the Registrar?", query: "Where is Registrar?" },
                    { text: "Where is the Cashier Office?", query: "Where is Cashier?" },
                    { text: "Where is CITCS Facility?", query: "Where is CITCS Facility?" },
                    { text: "Where is Office of the President?", query: "Where is President office?" }
                  ].map((item, idx) => (
                    <button key={idx} onClick={() => handleSendChatMessage(item.query)} className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                      <span>{item.text}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* STUDENT & VISITOR MAP & NAVIGATION TAB     */}
        {/* ========================================== */}
        {currentUser.role !== 'admin' && activeTab === 'map' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
                    <Layers className="w-4 h-4 text-indigo-400" /> JAAH Floor:
                  </span>
                  {[1, 2].map((f) => (
                    <button key={f} onClick={() => setActiveFloor(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeFloor === f ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                      {f === 1 ? 'Ground Floor' : 'Second Floor'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">My Location: <strong className="text-emerald-400">{mapNodes[userLocationNode]?.name || userLocationNode}</strong></span>
                  <button 
                  onClick={() => { if (routeResult) setIsLiveTracking(!isLiveTracking); }} 
                  disabled={!routeResult} 
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border ${isLiveTracking ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}
                  >
                  <Footprints className="w-4 h-4" /> 
                  {isLiveTracking ? 'Simulating Step-by-Step...' : 'Start Step-by-Step Navigation'}
                  </button>
                </div>
              </div>

              {/* ARCHITECTURAL BLUEPRINT RENDERING CONTAINER */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[520px] relative">
                <div className="w-full h-full max-w-[680px] aspect-[4/3] relative bg-slate-950 border-2 border-slate-700 rounded-2xl p-3 shadow-2xl overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="blueprint-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                        <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.4" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#blueprint-grid)" />

                    {activeFloor === 1 && (
                      <g>
                        <rect x="5" y="10" width="90" height="84" fill="none" stroke="#64748b" strokeWidth="1.5" rx="2" />
                        <rect x="8" y="14" width="28" height="42" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
                        <text x="22" y="36" fontSize="2.0" fontWeight="bold" fill="#94a3b8" textAnchor="middle">AUDITORIUM</text>
                        <rect x="8" y="58" width="28" height="14" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
                        <text x="22" y="66" fontSize="1.8" fill="#64748b" textAnchor="middle">STAGE</text>
                        <rect x="37" y="14" width="16" height="12" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
                        <text x="45" y="21" fontSize="1.4" fill="#94a3b8" textAnchor="middle">WAREHOUSE</text>
                        <rect x="70" y="34" width="12" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <text x="76" y="43" fontSize="1.5" fontWeight="bold" fill="#93c5fd" textAnchor="middle">CASHIER</text>
                        <rect x="70" y="52" width="12" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <text x="76" y="61" fontSize="1.4" fontWeight="bold" fill="#93c5fd" textAnchor="middle">ACCOUNTING</text>
                      </g>
                    )}

                    {activeFloor === 2 && (
                      <g>
                        <rect x="5" y="10" width="90" height="84" fill="none" stroke="#64748b" strokeWidth="1.5" rx="2" />
                        <rect x="38" y="42" width="14" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <text x="45" y="51" fontSize="1.4" fontWeight="bold" fill="#93c5fd" textAnchor="middle">CITCS</text>
                        <rect x="36" y="60" width="16" height="18" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <text x="44" y="70" fontSize="1.3" fontWeight="bold" fill="#93c5fd" textAnchor="middle">REGISTRAR</text>
                        <rect x="81" y="14" width="19" height="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <text x="90.5" y="23" fontSize="1.4" fontWeight="bold" fill="#93c5fd" textAnchor="middle">PRESIDENT</text>
                      </g>
                    )}

                    {routeResult && routeResult.path && (() => {
                        const activeFloorNodes = routeResult.path
                        .map(id => mapNodes[id])
                        .filter(node => node && node.floor === activeFloor);

                        if (activeFloorNodes.length < 2) return null;
                        const points = activeFloorNodes.map(n => `${n.x},${n.y}`).join(' ');

                        return (
                        <polyline
                            points={points}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3.5"
                            strokeDasharray="3"
                            strokeLinecap="round"
                            className="animate-pulse"
                        />
                        );
                    })()}

                    {Object.values(mapNodes)
                        .filter(node => node.floor === activeFloor)
                        .map((node) => {
                        const isUserHere = userLocationNode === node.id;
                        const isDestination = destinationNode === node.id;

                        return (
                            <g key={node.id} onClick={() => handleSetDestination(node.id, false)} className="cursor-pointer">
                            <circle 
                                cx={node.x} 
                                cy={node.y} 
                                r={isDestination ? "4" : "2.5"} 
                                fill={isDestination ? "#f43f5e" : isUserHere ? "#10b981" : "#3b82f6"} 
                                stroke="#ffffff"
                                strokeWidth="0.6"
                            />
                            {isUserHere && (
                                <g>
                                <circle cx={node.x} cy={node.y} r="6.5" fill="none" stroke="#10b981" strokeWidth="0.8" className="animate-ping" />
                                <circle cx={node.x} cy={node.y} r="4.5" fill="none" stroke="#34d399" strokeWidth="1" className="animate-pulse" />
                                </g>
                            )}
                            <text x={node.x} y={node.y + 4.2} fontSize="1.4" fontWeight="bold" fill="#f8fafc" textAnchor="middle">
                                {node.name}
                            </text>
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
                  <p className="text-xs">Click any room node on the 2D blueprint or search in the Directory to calculate optimal shortest paths.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* STUDENT & VISITOR DIRECTORY TAB            */}
        {/* ========================================== */}
        {currentUser.role !== 'admin' && activeTab === 'directory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-bold text-lg text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-400" /> Search Room & View Office Information
                </h2>
                <p className="text-xs text-slate-400">Ground & Second Floor Office Listings & Services</p>
              </div>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search office or service..." className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffices.map((office) => (
                <div key={office.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-white">{office.name}</h4>
                    <p className="text-xs text-indigo-400 font-semibold mb-2">Code: {office.code} | Floor {office.floor}</p>
                    <p className="text-[11px] text-slate-400 mb-2">🕒 {office.hours}</p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {office.services.map((srv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => handleSetDestination(office.id, true)} className="w-full py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition">
                    View on 2D Blueprint & Route
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- UNIVERSITY STAFF ADMIN CRUD MODAL --- */}
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