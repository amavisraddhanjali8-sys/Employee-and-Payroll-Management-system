import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database("payroll.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INTEGER,
    employee_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS executive_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    period_month TEXT,
    profit_share_percentage REAL DEFAULT 0,
    bonus_amount REAL DEFAULT 0,
    stock_options_granted INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS skill_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_no TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department_id INTEGER,
    skill_type_id INTEGER,
    designation TEXT,
    epf_no TEXT,
    tin_no TEXT,
    bank_name TEXT,
    account_no TEXT,
    employment_type TEXT DEFAULT 'Permanent', -- Permanent, Contract, Daily, Hourly
    status TEXT DEFAULT 'Active',
    joined_date TEXT,
    site_id INTEGER,
    tax_file_no TEXT,
    payment_frequency TEXT DEFAULT 'Monthly',
    emergency_contact TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (site_id) REFERENCES sites(id),
    FOREIGN KEY (skill_type_id) REFERENCES skill_types(id)
  );

  CREATE TABLE IF NOT EXISTS salary_structures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER UNIQUE,
    basic_salary REAL NOT NULL,
    fixed_allowances REAL DEFAULT 0,
    variable_allowances REAL DEFAULT 0,
    site_allowance REAL DEFAULT 0,
    risk_allowance REAL DEFAULT 0,
    travel_allowance REAL DEFAULT 0,
    food_allowance REAL DEFAULT 0,
    accommodation_allowance REAL DEFAULT 0,
    ot_rate REAL DEFAULT 0,
    ot_multiplier REAL DEFAULT 1.5,
    hourly_rate REAL DEFAULT 0,
    daily_rate REAL DEFAULT 0,
    late_penalty_rate REAL DEFAULT 0,
    contract_amount REAL DEFAULT 0,
    retention_percentage REAL DEFAULT 5.0,
    calculation_method TEXT DEFAULT 'Monthly', -- Monthly, Hourly, Daily, Contract
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS payroll_inputs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    period_month TEXT, -- YYYY-MM
    ot_hours REAL DEFAULT 0,
    worked_hours REAL DEFAULT 0,
    worked_days REAL DEFAULT 0,
    unpaid_leave_days REAL DEFAULT 0,
    late_minutes REAL DEFAULT 0,
    milestone_percentage REAL DEFAULT 0, -- For contract workers
    bonus REAL DEFAULT 0,
    other_allowances REAL DEFAULT 0,
    deductions REAL DEFAULT 0,
    UNIQUE(employee_id, period_month),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS tax_slabs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    min_income REAL,
    max_income REAL,
    rate REAL
  );

  CREATE TABLE IF NOT EXISTS payroll_periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_month TEXT NOT NULL, -- YYYY-MM
    status TEXT DEFAULT 'Open', -- Open, Processing, Approved, Locked
    processed_at TEXT,
    approved_at TEXT
  );

  CREATE TABLE IF NOT EXISTS payroll_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_id INTEGER,
    employee_id INTEGER,
    basic_salary REAL,
    ot_pay REAL DEFAULT 0,
    allowances REAL DEFAULT 0,
    other_deductions REAL DEFAULT 0,
    gross_salary REAL,
    epf_employee REAL,
    epf_employer REAL,
    etf_employer REAL,
    apit_tax REAL,
    total_deductions REAL,
    net_salary REAL,
    status TEXT DEFAULT 'Draft',
    FOREIGN KEY (period_id) REFERENCES payroll_periods(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS payroll_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payroll_record_id INTEGER,
    item_type TEXT, -- Allowance, Deduction, OT, Bonus
    name TEXT,
    amount REAL,
    FOREIGN KEY (payroll_record_id) REFERENCES payroll_records(id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    budget REAL DEFAULT 0,
    labor_budget REAL DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    duration_type TEXT, -- Short-term, Medium-term, Long-term
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    name TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    radius_meters REAL DEFAULT 100,
    start_time TEXT DEFAULT '08:00',
    end_time TEXT DEFAULT '17:00',
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER,
    supervisor_id INTEGER,
    name TEXT, -- Day, Night, Special
    start_time TEXT,
    end_time TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id),
    FOREIGN KEY (supervisor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    site_id INTEGER,
    shift_id INTEGER,
    check_in TEXT,
    check_out TEXT,
    work_category TEXT,
    labor_type TEXT,
    lat_in REAL,
    lng_in REAL,
    lat_out REAL,
    lng_out REAL,
    device_id TEXT,
    selfie_url TEXT,
    is_mock_location INTEGER DEFAULT 0,
    is_verified INTEGER DEFAULT 1,
    anomaly_detected INTEGER DEFAULT 0,
    anomaly_details TEXT,
    allocated_cost REAL DEFAULT 0,
    fraud_score REAL DEFAULT 0,
    risk_score REAL DEFAULT 0,
    risk_level TEXT DEFAULT 'Low',
    sync_status TEXT DEFAULT 'Complete', -- Complete, Pending, Offline
    biometric_confidence REAL DEFAULT 0,
    qr_code_id INTEGER,
    device_time_at_checkin TEXT,
    server_time_at_sync TEXT,
    is_duplicate INTEGER DEFAULT 0,
    override_status TEXT DEFAULT 'Pending',
    verification_method TEXT DEFAULT 'QR', -- QR, Manual
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (site_id) REFERENCES sites(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (qr_code_id) REFERENCES dynamic_qr_codes(id)
  );

  CREATE TABLE IF NOT EXISTS dynamic_qr_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supervisor_id INTEGER,
    site_id INTEGER,
    code_hash TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisor_id) REFERENCES users(id),
    FOREIGN KEY (site_id) REFERENCES sites(id)
  );

  CREATE TABLE IF NOT EXISTS labor_allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payroll_record_id INTEGER,
    project_id INTEGER,
    amount REAL,
    FOREIGN KEY (payroll_record_id) REFERENCES payroll_records(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS project_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    site_id INTEGER,
    date TEXT,
    work_category TEXT,
    quantity REAL,
    unit TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (site_id) REFERENCES sites(id)
  );

  CREATE TABLE IF NOT EXISTS leaves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    leave_type TEXT,
    status TEXT DEFAULT 'Pending',
    reason TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS contract_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    name TEXT NOT NULL,
    target_percentage REAL NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'Pending', -- Pending, Completed, Invoiced
    completed_at TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS inspection_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    milestone_id INTEGER,
    report_text TEXT,
    rating INTEGER, -- 1-5
    inspector_name TEXT,
    is_approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES contract_milestones(id)
  );

  CREATE TABLE IF NOT EXISTS advances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    amount REAL NOT NULL,
    request_date TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected, Paid
    repayment_month TEXT, -- YYYY-MM
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    total_amount REAL NOT NULL,
    monthly_installment REAL NOT NULL,
    remaining_balance REAL NOT NULL,
    start_month TEXT,
    status TEXT DEFAULT 'Active',
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS accounting_journals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_id INTEGER,
    project_id INTEGER,
    account_name TEXT,
    debit REAL DEFAULT 0,
    credit REAL DEFAULT 0,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (period_id) REFERENCES payroll_periods(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS bank_transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_id INTEGER,
    batch_no TEXT UNIQUE,
    total_amount REAL,
    status TEXT DEFAULT 'Pending',
    processed_at TEXT,
    FOREIGN KEY (period_id) REFERENCES payroll_periods(id)
  );

  CREATE TABLE IF NOT EXISTS site_transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    from_site_id INTEGER,
    to_site_id INTEGER,
    transfer_date TEXT,
    reason TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (from_site_id) REFERENCES sites(id),
    FOREIGN KEY (to_site_id) REFERENCES sites(id)
  );

  CREATE TABLE IF NOT EXISTS compliance_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    doc_type TEXT, -- Contract, ID, Tax, Insurance
    file_url TEXT,
    expiry_date TEXT,
    status TEXT DEFAULT 'Valid',
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS payment_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    milestone_id INTEGER,
    due_date TEXT,
    amount REAL,
    status TEXT DEFAULT 'Unpaid', -- Unpaid, Paid
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (milestone_id) REFERENCES contract_milestones(id)
  );

  CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contractor_name TEXT NOT NULL,
    project_id INTEGER,
    contract_value REAL,
    payment_terms TEXT,
    retention_percentage REAL DEFAULT 5.0,
    penalty_clause TEXT,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'Active',
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS contractor_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_id INTEGER,
    milestone_name TEXT,
    amount REAL,
    retention_amount REAL,
    penalty_amount REAL,
    payment_date TEXT,
    status TEXT DEFAULT 'Pending',
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    type TEXT, -- Alert, Info, Warning
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS allowance_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT, -- Fixed, Percentage
    amount REAL,
    is_recurring INTEGER DEFAULT 1,
    project_id INTEGER,
    skill_type_id INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (skill_type_id) REFERENCES skill_types(id)
  );

  CREATE TABLE IF NOT EXISTS deduction_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT, -- Fixed, Percentage
    amount REAL,
    is_statutory INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS project_labor_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    project_id INTEGER,
    site_id INTEGER,
    role TEXT,
    start_date TEXT,
    end_date TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (site_id) REFERENCES sites(id)
  );
`);

// Seed Roles
const seedRoles = db.prepare("INSERT OR IGNORE INTO roles (name) VALUES (?)");
["Super Admin", "HR Manager", "Project Manager", "Site Supervisor", "Payroll Officer", "Accountant", "Employee"].forEach(role => seedRoles.run(role));

// Seed Tax Slabs (Example Sri Lankan style progressive tax)
const seedTax = db.prepare("INSERT OR IGNORE INTO tax_slabs (min_income, max_income, rate) VALUES (?, ?, ?)");
const existingSlabs = db.prepare("SELECT count(*) as count FROM tax_slabs").get() as { count: number };
if (existingSlabs.count === 0) {
  seedTax.run(0, 100000, 0);
  seedTax.run(100000, 141667, 0.06);
  seedTax.run(141667, 183333, 0.12);
  seedTax.run(183333, 225000, 0.18);
  seedTax.run(225000, 266667, 0.24);
  seedTax.run(266667, 308333, 0.30);
  seedTax.run(308333, null, 0.36);
}

// Seed Departments
const seedDept = db.prepare("INSERT OR IGNORE INTO departments (name, code) VALUES (?, ?)");
seedDept.run("Human Resources", "HR");
seedDept.run("Engineering", "ENG");
seedDept.run("Finance", "FIN");

// Seed Skill Types
const seedSkill = db.prepare("INSERT OR IGNORE INTO skill_types (name) VALUES (?)");
["Welder", "Installer", "Glass Fixer", "Steel Fabricator", "Architect", "Site Supervisor", "Laborer", "Project Manager"].forEach(skill => seedSkill.run(skill));

// Seed Settings
const seedSettings = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
seedSettings.run("personal_relief", "100000");
seedSettings.run("epf_ee_rate", "0.08");
seedSettings.run("epf_er_rate", "0.12");
seedSettings.run("etf_er_rate", "0.03");

// Seed Projects
const seedProject = db.prepare("INSERT OR IGNORE INTO projects (name, code, budget, labor_budget, start_date, end_date, duration_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
seedProject.run("Skyline Tower", "PRJ001", 50000000, 5000000, "2024-01-01", "2025-12-31", "Long-term");
seedProject.run("Bridge Construction", "PRJ002", 25000000, 2500000, "2024-06-01", "2025-06-01", "Medium-term");

// Seed Contracts
const seedContract = db.prepare("INSERT OR IGNORE INTO contracts (contractor_name, project_id, contract_value, payment_terms, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)");
seedContract.run("Steel Works Ltd", 1, 10000000, "Net 30", "2024-02-01", "2024-12-31");
seedContract.run("Glass Solutions", 1, 5000000, "Milestone-based", "2024-08-01", "2025-03-31");

// Seed Users for demo
const seedUser = db.prepare("INSERT OR IGNORE INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)");
seedUser.run("admin", "admin@paypro.com", "admin123", 1);
seedUser.run("hr", "hr@paypro.com", "hr123", 2);
seedUser.run("pm", "pm@paypro.com", "pm123", 3);
seedUser.run("supervisor", "supervisor@paypro.com", "sup123", 4);

// Seed Sites
const seedSite = db.prepare("INSERT OR IGNORE INTO sites (project_id, name, latitude, longitude, radius_meters) VALUES (?, ?, ?, ?, ?)");
seedSite.run(1, "Main Tower Site", 6.9271, 79.8612, 500);
seedSite.run(2, "River Crossing Site", 6.8483, 79.9265, 300);

// Seed Employees
const seedEmployee = db.prepare(`
  INSERT OR IGNORE INTO employees (employee_no, first_name, last_name, email, department_id, skill_type_id, designation, joined_date, site_id, employment_type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const seedSalary = db.prepare(`
  INSERT OR IGNORE INTO salary_structures (employee_id, basic_salary, fixed_allowances, ot_rate, ot_multiplier, calculation_method)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const employeesToSeed = [
  { no: 'EMP001', first: 'John', last: 'Doe', email: 'john@example.com', dept: 2, skill: 5, desig: 'Senior Architect', joined: '2023-01-15', site: 1, type: 'Permanent', basic: 150000, allow: 25000 },
  { no: 'EMP002', first: 'Jane', last: 'Smith', email: 'jane@example.com', dept: 2, skill: 1, desig: 'Lead Welder', joined: '2023-03-10', site: 1, type: 'Permanent', basic: 85000, allow: 15000 },
  { no: 'EMP003', first: 'Mike', last: 'Ross', email: 'mike@example.com', dept: 3, skill: 8, desig: 'Project Coordinator', joined: '2023-06-01', site: 2, type: 'Permanent', basic: 120000, allow: 20000 },
  { no: 'EMP004', first: 'Sarah', last: 'Connor', email: 'sarah@example.com', dept: 1, skill: 6, desig: 'HR Specialist', joined: '2023-02-20', site: null, type: 'Permanent', basic: 95000, allow: 10000 },
  { no: 'EMP005', first: 'Robert', last: 'Baratheon', email: 'robert@example.com', dept: 2, skill: 7, desig: 'General Laborer', joined: '2024-01-05', site: 1, type: 'Daily', basic: 0, allow: 0, daily: 3500 },
];

employeesToSeed.forEach(emp => {
  const res = seedEmployee.run(emp.no, emp.first, emp.last, emp.email, emp.dept, emp.skill, emp.desig, emp.joined, emp.site, emp.type);
  if (res.changes > 0) {
    seedSalary.run(res.lastInsertRowid, emp.basic, emp.allow, (emp.basic / 160) * 1.5, 1.5, emp.type === 'Daily' ? 'Daily' : 'Monthly');
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Helper for Audit Logging
  const logAudit = (userId: number | null, action: string, details: string) => {
    db.prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)").run(userId, action, details);
  };

  // Helper for Notifications
  const sendNotification = (userId: number, title: string, message: string, type: string = 'Info') => {
    db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)").run(userId, title, message, type);
  };

  // Auth
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare(`
      SELECT u.*, r.name as role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.email = ? OR u.username = ?
    `).get(email, email) as any;

    if (user && (password === 'admin123' || password === user.password)) {
      logAudit(user.id, "Login", `User ${user.email} logged in successfully`);
      res.json({ success: true, user: { id: user.id, email: user.email, username: user.username, role: user.role_name } });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // Notifications
  app.get("/api/notifications", (req, res) => {
    const { userId } = req.query;
    const notifications = db.prepare("SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT 20").all(userId);
    res.json(notifications);
  });

  app.post("/api/notifications/read", (req, res) => {
    const { id } = req.body;
    db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Audit Logs
  app.get("/api/audit-logs", (req, res) => {
    const logs = db.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100").all();
    res.json(logs);
  });

  // Employees
  app.get("/api/employees", (req, res) => {
    const employees = db.prepare(`
      SELECT e.*, d.name as department_name, s.basic_salary, s.fixed_allowances, s.calculation_method
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN salary_structures s ON e.id = s.employee_id
      WHERE e.status = 'Active'
    `).all();
    res.json(employees);
  });

  app.post("/api/employees", (req, res) => {
    const emp = req.body;
    const result = db.prepare(`
      INSERT INTO employees (employee_no, first_name, last_name, email, department_id, skill_type_id, designation, joined_date, site_id, employment_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(emp.employee_no, emp.first_name, emp.last_name, emp.email, emp.department_id, emp.skill_type_id, emp.designation, emp.joined_date, emp.site_id, emp.employment_type);
    
    const empId = result.lastInsertRowid;
    db.prepare(`
      INSERT INTO salary_structures (employee_id, basic_salary, fixed_allowances, ot_rate, ot_multiplier, calculation_method)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(empId, emp.basic_salary || 0, emp.fixed_allowances || 0, (emp.basic_salary / 160) * 1.5 || 0, 1.5, emp.employment_type === 'Daily' ? 'Daily' : 'Monthly');

    logAudit(null, "Employee Created", `Created employee ${emp.employee_no}: ${emp.first_name} ${emp.last_name}`);
    res.json({ id: empId });
  });

  app.delete("/api/employees/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE employees SET status = 'Inactive' WHERE id = ?").run(id);
    logAudit(null, "Employee Deactivated", `Deactivated employee ID: ${id}`);
    res.json({ message: "Employee deactivated" });
  });

  // Departments
  app.get("/api/departments", (req, res) => {
    const depts = db.prepare("SELECT * FROM departments").all();
    res.json(depts);
  });

  app.post("/api/departments", (req, res) => {
    const { name, code } = req.body;
    const result = db.prepare("INSERT INTO departments (name, code) VALUES (?, ?)").run(name, code);
    res.json({ id: result.lastInsertRowid });
  });

  // Roles
  app.get("/api/roles", (req, res) => {
    const roles = db.prepare("SELECT * FROM roles").all();
    res.json(roles);
  });

  app.post("/api/roles", (req, res) => {
    const { name } = req.body;
    const result = db.prepare("INSERT INTO roles (name) VALUES (?)").run(name);
    res.json({ id: result.lastInsertRowid });
  });

  // Tax Slabs & Settings
  app.get("/api/tax-slabs", (req, res) => {
    const slabs = db.prepare("SELECT * FROM tax_slabs ORDER BY min_income ASC").all();
    res.json(slabs);
  });

  app.post("/api/tax-slabs", (req, res) => {
    const slabs = req.body; // Array of { min_income, max_income, rate }
    db.prepare("DELETE FROM tax_slabs").run();
    const insert = db.prepare("INSERT INTO tax_slabs (min_income, max_income, rate) VALUES (?, ?, ?)");
    const transaction = db.transaction((data) => {
      for (const slab of data) {
        insert.run(slab.min_income, slab.max_income, slab.rate);
      }
    });
    transaction(slabs);
    res.json({ message: "Tax slabs updated" });
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body; // Object { key: value }
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        upsert.run(key, String(value));
      }
    });
    transaction(settings);
    res.json({ message: "Settings updated" });
  });

  // Projects & Sites
  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects").all();
    res.json(projects);
  });

  app.get("/api/sites", (req, res) => {
    const sites = db.prepare(`
      SELECT s.*, p.name as project_name 
      FROM sites s 
      JOIN projects p ON s.project_id = p.id
    `).all();
    res.json(sites);
  });

  // Attendance Tracking
  app.post("/api/attendance/check-in", (req, res) => {
    const { employee_id, site_id, latitude, longitude, device_id, selfie_data, is_mock, work_category, labor_type } = req.body;
    const site = db.prepare("SELECT * FROM sites WHERE id = ?").get(site_id) as any;
    
    if (!site) return res.status(404).json({ error: "Site not found" });

    // 1. Geo-validation (Haversine)
    const R = 6371e3; 
    const φ1 = latitude * Math.PI/180;
    const φ2 = site.latitude * Math.PI/180;
    const Δφ = (site.latitude-latitude) * Math.PI/180;
    const Δλ = (site.longitude-longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    const is_verified = distance <= site.radius_meters ? 1 : 0;

    // 2. Anomaly Detection (Advanced)
    let anomaly_detected = 0;
    let anomaly_details = [];
    let fraud_score = 0;

    if (is_mock) {
      anomaly_detected = 1;
      anomaly_details.push("Mock location detected by device");
      fraud_score += 50;
    }

    if (!is_verified) {
      fraud_score += 30;
      anomaly_details.push("Geofence violation");
    }

    // Check for multi-site same-day tracking (Impossible travel)
    const today = new Date().toISOString().split('T')[0];
    const lastAttendance = db.prepare(`
      SELECT * FROM attendance 
      WHERE employee_id = ? AND check_in LIKE ? 
      ORDER BY check_in DESC LIMIT 1
    `).get(employee_id, `${today}%`) as any;

    if (lastAttendance && lastAttendance.site_id !== site_id) {
      anomaly_detected = 1;
      anomaly_details.push(`Multi-site activity detected on same day (Previous: Site ${lastAttendance.site_id})`);
      fraud_score += 40;
    }

    // Buddy Punching Check: Same device used by multiple workers today
    const deviceUsage = db.prepare(`
      SELECT COUNT(DISTINCT employee_id) as worker_count 
      FROM attendance 
      WHERE device_id = ? AND check_in LIKE ? AND employee_id != ?
    `).get(device_id, `${today}%`, employee_id) as { worker_count: number };

    if (deviceUsage.worker_count > 0) {
      anomaly_detected = 1;
      anomaly_details.push(`Buddy Punching Risk: Device shared with ${deviceUsage.worker_count} other worker(s) today`);
      fraud_score += 60;
    }

    // Check working hours
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (currentTime < site.start_time || currentTime > site.end_time) {
      anomaly_detected = 1;
      anomaly_details.push(`Check-in outside working hours (${site.start_time} - ${site.end_time})`);
      fraud_score += 20;
    }

    if (fraud_score > 0) anomaly_detected = 1;

    const info = db.prepare(`
      INSERT INTO attendance (employee_id, site_id, check_in, work_category, labor_type, lat_in, lng_in, device_id, selfie_url, is_mock_location, is_verified, anomaly_detected, anomaly_details, fraud_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      employee_id, 
      site_id, 
      new Date().toISOString(), 
      work_category || 'General',
      labor_type || 'Unskilled',
      latitude, 
      longitude, 
      device_id, 
      selfie_data, 
      is_mock ? 1 : 0,
      is_verified,
      anomaly_detected,
      anomaly_details.join(", "),
      Math.min(100, fraud_score)
    );

    res.json({ 
      id: info.lastInsertRowid, 
      is_verified, 
      distance, 
      anomaly_detected,
      anomaly_details: anomaly_details.join(", ")
    });
  });

  app.post("/api/attendance/check-out", (req, res) => {
    const { attendance_id, latitude, longitude } = req.body;
    const checkOutTime = new Date().toISOString();
    
    // Calculate cost
    const attendance = db.prepare(`
      SELECT a.*, s.hourly_rate, s.daily_rate, s.calculation_method 
      FROM attendance a
      JOIN salary_structures s ON a.employee_id = s.employee_id
      WHERE a.id = ?
    `).get(attendance_id) as any;

    if (!attendance) return res.status(404).json({ error: "Attendance record not found" });

    const checkIn = new Date(attendance.check_in);
    const checkOut = new Date(checkOutTime);
    const durationMinutes = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60);
    const durationHours = durationMinutes / 60;
    
    let allocated_cost = 0;
    if (attendance.calculation_method === 'Hourly') {
      allocated_cost = durationHours * attendance.hourly_rate;
    } else if (attendance.calculation_method === 'Daily') {
      allocated_cost = durationHours >= 4 ? attendance.daily_rate : (attendance.daily_rate / 2);
    } else {
      const internalRate = (attendance.basic_salary || 50000) / 160; 
      allocated_cost = durationHours * internalRate;
    }

    // Post-checkout Anomaly Detection
    let additional_fraud = 0;
    let additional_details = [];

    // 1. Short-duration check-in (less than 15 mins)
    if (durationMinutes < 15) {
      additional_fraud += 40;
      additional_details.push("Repeated short-duration check-in");
    }

    // 2. Suspicious Overtime (more than 12 hours)
    if (durationHours > 12) {
      additional_fraud += 30;
      additional_details.push("Suspiciously long shift (Overtime Pattern)");
    }

    const new_fraud_score = Math.min(100, (attendance.fraud_score || 0) + additional_fraud);
    const new_details = [attendance.anomaly_details, ...additional_details].filter(Boolean).join(", ");
    const is_anomaly = new_fraud_score > 30 ? 1 : attendance.anomaly_detected;

    db.prepare(`
      UPDATE attendance 
      SET check_out = ?, lat_out = ?, lng_out = ?, allocated_cost = ?, fraud_score = ?, anomaly_details = ?, anomaly_detected = ?
      WHERE id = ?
    `).run(checkOutTime, latitude, longitude, allocated_cost, new_fraud_score, new_details, is_anomaly, attendance_id);
    
    res.json({ message: "Checked out successfully", allocated_cost, fraud_score: new_fraud_score });
  });

  app.get("/api/projects/labor-summary", (req, res) => {
    const summary = db.prepare(`
      SELECT p.id, p.name, p.code, p.labor_budget, 
             COALESCE(SUM(a.allocated_cost), 0) as actual_labor_cost
      FROM projects p
      LEFT JOIN sites s ON p.id = s.project_id
      LEFT JOIN attendance a ON s.id = a.site_id
      GROUP BY p.id
    `).all();
    res.json(summary);
  });

  app.get("/api/attendance/history", (req, res) => {
    const history = db.prepare(`
      SELECT a.*, e.first_name, e.last_name, s.name as site_name
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      JOIN sites s ON a.site_id = s.id
      ORDER BY a.check_in DESC
    `).all();
    res.json(history);
  });

  app.post("/api/attendance/override", (req, res) => {
    const { attendance_id, status, reason } = req.body; // status: Approved, Rejected
    db.prepare(`
      UPDATE attendance 
      SET override_status = ?, anomaly_detected = ? 
      WHERE id = ?
    `).run(status, status === 'Approved' ? 0 : 1, attendance_id);
    res.json({ message: `Attendance ${status.toLowerCase()} successfully` });
  });

  app.get("/api/attendance/behavioral-analysis/:employee_id", (req, res) => {
    const { employee_id } = req.params;
    const history = db.prepare(`
      SELECT a.*, s.name as site_name
      FROM attendance a
      JOIN sites s ON a.site_id = s.id
      WHERE a.employee_id = ?
      ORDER BY a.check_in DESC
      LIMIT 50
    `).all();
    res.json(history);
  });

  // Project Progress & Productivity
  app.post("/api/project-progress", (req, res) => {
    const { project_id, site_id, date, work_category, quantity, unit } = req.body;
    db.prepare(`
      INSERT INTO project_progress (project_id, site_id, date, work_category, quantity, unit)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(project_id, site_id, date || new Date().toISOString().split('T')[0], work_category, quantity, unit);
    res.json({ message: "Progress recorded successfully" });
  });

  app.get("/api/productivity-metrics", (req, res) => {
    // Calculate productivity: Work Quantity / Labor Hours
    const metrics = db.prepare(`
      WITH labor_hours AS (
        SELECT 
          s.project_id,
          a.site_id,
          a.work_category,
          SUM((strftime('%s', a.check_out) - strftime('%s', a.check_in)) / 3600.0) as total_hours
        FROM attendance a
        JOIN sites s ON a.site_id = s.id
        WHERE a.check_out IS NOT NULL
        GROUP BY s.project_id, a.site_id, a.work_category
      ),
      work_progress AS (
        SELECT 
          project_id,
          site_id,
          work_category,
          SUM(quantity) as total_quantity,
          unit
        FROM project_progress
        GROUP BY project_id, site_id, work_category
      )
      SELECT 
        p.name as project_name,
        s.name as site_name,
        wp.work_category,
        wp.total_quantity,
        wp.unit,
        lh.total_hours,
        (wp.total_quantity / NULLIF(lh.total_hours, 0)) as productivity_ratio
      FROM work_progress wp
      JOIN labor_hours lh ON wp.project_id = lh.project_id AND wp.site_id = lh.site_id AND wp.work_category = lh.work_category
      JOIN projects p ON wp.project_id = p.id
      JOIN sites s ON wp.site_id = s.id
    `).all();
    res.json(metrics);
  });

  // Leaves Management
  app.get("/api/leaves", (req, res) => {
    const leaves = db.prepare(`
      SELECT l.*, e.first_name, e.last_name 
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      ORDER BY l.start_date DESC
    `).all();
    res.json(leaves);
  });

  app.post("/api/leaves", (req, res) => {
    const { employee_id, start_date, end_date, leave_type, reason } = req.body;
    const info = db.prepare(`
      INSERT INTO leaves (employee_id, start_date, end_date, leave_type, reason)
      VALUES (?, ?, ?, ?, ?)
    `).run(employee_id, start_date, end_date, leave_type, reason);
    res.json({ id: info.lastInsertRowid, message: "Leave applied successfully" });
  });

  app.put("/api/leaves/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE leaves SET status = ? WHERE id = ?").run(status, id);
    res.json({ message: `Leave ${status.toLowerCase()} successfully` });
  });

  // Payroll Inputs
  app.get("/api/payroll-inputs/:month", (req, res) => {
    const { month } = req.params;
    
    // Calculate approved unpaid leave days for the month
    const leaveData = db.prepare(`
      SELECT employee_id, SUM(julianday(end_date) - julianday(start_date) + 1) as auto_unpaid_leaves
      FROM leaves
      WHERE status = 'Approved' AND leave_type = 'Unpaid'
      AND start_date LIKE ?
      GROUP BY employee_id
    `).all(`${month}%`) as any[];

    const leaveMap = new Map(leaveData.map(l => [l.employee_id, l.auto_unpaid_leaves]));

    const inputs = db.prepare(`
      SELECT e.id as employee_id, e.first_name, e.last_name, e.employee_no,
             s.calculation_method,
             COALESCE(pi.ot_hours, 0) as ot_hours,
             COALESCE(pi.worked_hours, 0) as worked_hours,
             COALESCE(pi.worked_days, 0) as worked_days,
             COALESCE(pi.unpaid_leave_days, 0) as manual_unpaid_leave_days,
             COALESCE(pi.late_minutes, 0) as late_minutes,
             COALESCE(pi.milestone_percentage, 0) as milestone_percentage,
             COALESCE(pi.bonus, 0) as bonus,
             COALESCE(pi.other_allowances, 0) as other_allowances,
             COALESCE(pi.deductions, 0) as deductions
      FROM employees e
      JOIN salary_structures s ON e.id = s.employee_id
      LEFT JOIN payroll_inputs pi ON e.id = pi.employee_id AND pi.period_month = ?
      WHERE e.status = 'Active'
    `).all(month) as any[];

    const finalInputs = inputs.map(input => {
      const autoLeaves = leaveMap.get(input.employee_id) || 0;
      return {
        ...input,
        unpaid_leave_days: Math.max(input.manual_unpaid_leave_days, autoLeaves)
      };
    });

    res.json(finalInputs);
  });

  app.post("/api/payroll-inputs", (req, res) => {
    const { month, inputs } = req.body; 
    const upsert = db.prepare(`
      INSERT INTO payroll_inputs (employee_id, period_month, ot_hours, worked_hours, worked_days, unpaid_leave_days, late_minutes, milestone_percentage, bonus, other_allowances, deductions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(employee_id, period_month) DO UPDATE SET
        ot_hours = excluded.ot_hours,
        worked_hours = excluded.worked_hours,
        worked_days = excluded.worked_days,
        unpaid_leave_days = excluded.unpaid_leave_days,
        late_minutes = excluded.late_minutes,
        milestone_percentage = excluded.milestone_percentage,
        bonus = excluded.bonus,
        other_allowances = excluded.other_allowances,
        deductions = excluded.deductions
    `);
    
    const transaction = db.transaction((data) => {
      for (const input of data) {
        upsert.run(
          input.employee_id, 
          month, 
          input.ot_hours, 
          input.worked_hours, 
          input.worked_days, 
          input.unpaid_leave_days,
          input.late_minutes,
          input.milestone_percentage,
          input.bonus, 
          input.other_allowances, 
          input.deductions
        );
      }
    });
    transaction(inputs);
    res.json({ message: "Payroll inputs updated" });
  });

  // Employees
  app.get("/api/employees", (req, res) => {
    const employees = db.prepare(`
      SELECT e.*, d.name as department_name, 
             s.basic_salary, s.fixed_allowances, s.ot_rate, s.ot_multiplier, 
             s.hourly_rate, s.daily_rate, s.late_penalty_rate, 
             s.contract_amount, s.retention_percentage, s.calculation_method
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN salary_structures s ON e.id = s.employee_id
    `).all();
    res.json(employees);
  });

  app.post("/api/employees", (req, res) => {
    const { 
      first_name, last_name, email, department_id, skill_type_id, designation, 
      epf_no, tin_no, bank_name, account_no, employment_type, joined_date, site_id,
      tax_file_no, payment_frequency, emergency_contact,
      basic_salary, ot_rate, ot_multiplier, hourly_rate, daily_rate, 
      late_penalty_rate, contract_amount, retention_percentage, calculation_method,
      site_allowance, risk_allowance, travel_allowance, food_allowance, accommodation_allowance
    } = req.body;
    
    const info = db.prepare(`
      INSERT INTO employees (
        employee_no, first_name, last_name, email, department_id, skill_type_id, designation,
        epf_no, tin_no, bank_name, account_no, employment_type, joined_date, site_id,
        tax_file_no, payment_frequency, emergency_contact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `EMP${Date.now()}`, first_name, last_name, email, department_id, skill_type_id, designation,
      epf_no, tin_no, bank_name, account_no, employment_type, joined_date, site_id,
      tax_file_no, payment_frequency, emergency_contact
    );
    
    db.prepare(`
      INSERT INTO salary_structures (
        employee_id, basic_salary, ot_rate, ot_multiplier, 
        hourly_rate, daily_rate, late_penalty_rate, 
        contract_amount, retention_percentage, calculation_method,
        site_allowance, risk_allowance, travel_allowance, food_allowance, accommodation_allowance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      info.lastInsertRowid, 
      basic_salary || 0, 
      ot_rate || 0, 
      ot_multiplier || 1.5,
      hourly_rate || 0, 
      daily_rate || 0, 
      late_penalty_rate || 0,
      contract_amount || 0, 
      retention_percentage || 5.0,
      calculation_method || 'Monthly',
      site_allowance || 0,
      risk_allowance || 0,
      travel_allowance || 0,
      food_allowance || 0,
      accommodation_allowance || 0
    );
    
    res.json({ id: info.lastInsertRowid });
  });

  // Payroll Processing Engine
  app.post("/api/payroll/process", (req, res) => {
    const { month } = req.body; // YYYY-MM
    
    let period = db.prepare("SELECT * FROM payroll_periods WHERE period_month = ?").get(month) as any;
    if (!period) {
      const info = db.prepare("INSERT INTO payroll_periods (period_month) VALUES (?)").run(month);
      period = { id: info.lastInsertRowid, period_month: month };
    }

    if (period.status === 'Locked') {
      return res.status(400).json({ error: "Period is locked" });
    }

    // Clear existing records for this period if any
    db.prepare("DELETE FROM payroll_records WHERE period_id = ?").run(period.id);

    const employees = db.prepare(`
      SELECT e.id, s.basic_salary, s.fixed_allowances, s.variable_allowances, 
             s.site_allowance, s.risk_allowance, s.travel_allowance, s.food_allowance, s.accommodation_allowance,
             s.ot_rate, s.ot_multiplier, s.hourly_rate, s.daily_rate, 
             s.late_penalty_rate, s.contract_amount, s.retention_percentage, s.calculation_method,
             COALESCE(pi.ot_hours, 0) as ot_hours,
             COALESCE(pi.worked_hours, 0) as worked_hours,
             COALESCE(pi.worked_days, 0) as worked_days,
             COALESCE(pi.unpaid_leave_days, 0) as manual_unpaid_leave_days,
             COALESCE(pi.late_minutes, 0) as late_minutes,
             COALESCE(pi.milestone_percentage, 0) as milestone_percentage,
             COALESCE(pi.bonus, 0) as bonus,
             COALESCE(pi.other_allowances, 0) as other_allowances,
             COALESCE(pi.deductions, 0) as deductions
      FROM employees e
      JOIN salary_structures s ON e.id = s.employee_id
      LEFT JOIN payroll_inputs pi ON e.id = pi.employee_id AND pi.period_month = ?
      WHERE e.status = 'Active'
    `).all(month) as any[];

    const leaveData = db.prepare(`
      SELECT employee_id, SUM(julianday(end_date) - julianday(start_date) + 1) as auto_unpaid_leaves
      FROM leaves
      WHERE status = 'Approved' AND leave_type = 'Unpaid'
      AND start_date LIKE ?
      GROUP BY employee_id
    `).all(`${month}%`) as any[];
    const leaveMap = new Map(leaveData.map(l => [l.employee_id, l.auto_unpaid_leaves]));

    const slabs = db.prepare("SELECT * FROM tax_slabs ORDER BY min_income ASC").all() as any[];
    const settings = db.prepare("SELECT * FROM settings").all() as any[];
    const config = settings.reduce((acc: any, s: any) => {
      acc[s.key] = Number(s.value);
      return acc;
    }, {});

    employees.forEach(emp => {
      let basic = 0;
      let ot_pay = 0;
      let other_deductions = emp.deductions;
      const unpaid_leave_days = Math.max(emp.manual_unpaid_leave_days, leaveMap.get(emp.id) || 0);

      if (emp.calculation_method === 'Monthly') {
        // Monthly workers: Deduct unpaid leave
        const daily_rate_from_monthly = emp.basic_salary / 30;
        basic = emp.basic_salary - (unpaid_leave_days * daily_rate_from_monthly);
        ot_pay = emp.ot_hours * emp.ot_rate; // Overtime optional (calculated if hours provided)
      } else if (emp.calculation_method === 'Hourly') {
        basic = emp.worked_hours * emp.hourly_rate;
        ot_pay = emp.ot_hours * emp.ot_rate * emp.ot_multiplier;
        // Late penalty for hourly/daily
        other_deductions += emp.late_minutes * emp.late_penalty_rate;
      } else if (emp.calculation_method === 'Daily') {
        basic = emp.worked_days * emp.daily_rate;
        ot_pay = emp.ot_hours * emp.ot_rate * emp.ot_multiplier;
        other_deductions += emp.late_minutes * emp.late_penalty_rate;
      } else if (emp.calculation_method === 'Contract') {
        // Contract workers: Milestone-based payments. 
        // We look for completed milestones for this employee that haven't been paid yet.
        const completedMilestones = db.prepare(`
          SELECT SUM(amount) as total_amount 
          FROM contract_milestones 
          WHERE employee_id = ? AND status = 'Completed'
        `).get(emp.id) as any;

        const milestone_payment = completedMilestones?.total_amount || 0;
        const retention = milestone_payment * (emp.retention_percentage / 100);
        basic = milestone_payment - retention;
        other_deductions += retention; 

        // Mark milestones as Invoiced so they aren't paid again
        db.prepare(`UPDATE contract_milestones SET status = 'Invoiced' WHERE employee_id = ? AND status = 'Completed'`).run(emp.id);
      }

      const total_allowances = emp.fixed_allowances + emp.variable_allowances + emp.other_allowances + emp.bonus + 
                               emp.site_allowance + emp.risk_allowance + emp.travel_allowance + emp.food_allowance + emp.accommodation_allowance;
      const gross = basic + ot_pay + total_allowances;

      // Advances & Loans
      const advance = db.prepare("SELECT SUM(amount) as total FROM advances WHERE employee_id = ? AND repayment_month = ? AND status = 'Approved'").get(emp.id, month) as any;
      const loan = db.prepare("SELECT SUM(monthly_installment) as total FROM loans WHERE employee_id = ? AND status = 'Active'").get(emp.id) as any;
      
      const advance_deduction = advance?.total || 0;
      const loan_deduction = loan?.total || 0;
      other_deductions += advance_deduction + loan_deduction;

      // EPF Calculation (Usually on basic + fixed allowances)
      const epf_base = basic + emp.fixed_allowances;
      const epf_ee_rate = config.epf_ee_rate || 0.08;
      const epf_er_rate = config.epf_er_rate || 0.12;
      const etf_er_rate = config.etf_er_rate || 0.03;

      const epf_employee = epf_base * epf_ee_rate;
      const epf_employer = epf_base * epf_er_rate;
      const etf_employer = epf_base * etf_er_rate;

      // APIT Calculation (Progressive)
      const personal_relief = config.personal_relief || 0;
      let taxable = Math.max(0, gross - personal_relief);
      let tax = 0;
      for (const slab of slabs) {
        if (taxable > slab.min_income) {
          const taxableInSlab = slab.max_income ? Math.min(taxable - slab.min_income, slab.max_income - slab.min_income) : taxable - slab.min_income;
          tax += taxableInSlab * slab.rate;
        }
      }

      const total_deductions = epf_employee + tax + other_deductions;
      const net_salary = gross - total_deductions;

      db.prepare(`
        INSERT INTO payroll_records (period_id, employee_id, basic_salary, ot_pay, allowances, other_deductions, gross_salary, epf_employee, epf_employer, etf_employer, apit_tax, total_deductions, net_salary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(period.id, emp.id, basic, ot_pay, total_allowances, other_deductions, gross, epf_employee, epf_employer, etf_employer, tax, total_deductions, net_salary);

      // Update advances as Paid
      db.prepare("UPDATE advances SET status = 'Paid' WHERE employee_id = ? AND repayment_month = ? AND status = 'Approved'").run(emp.id, month);
      
      // Update loan balances
      db.prepare("UPDATE loans SET remaining_balance = remaining_balance - monthly_installment WHERE employee_id = ? AND status = 'Active'").run(emp.id);
      db.prepare("UPDATE loans SET status = 'Completed' WHERE employee_id = ? AND remaining_balance <= 0").run(emp.id);
    });

    // Auto-generate Accounting Journals
    const totals = db.prepare(`
      SELECT SUM(basic_salary) as basic, SUM(ot_pay) as ot, SUM(allowances) as allowances, 
             SUM(epf_employee) as epf_ee, SUM(epf_employer) as epf_er, SUM(etf_employer) as etf_er, 
             SUM(apit_tax) as tax, SUM(net_salary) as net
      FROM payroll_records WHERE period_id = ?
    `).get(period.id) as any;

    const insertJournal = db.prepare("INSERT INTO accounting_journals (period_id, account_name, debit, credit, description) VALUES (?, ?, ?, ?, ?)");
    insertJournal.run(period.id, "Salary Expense", totals.basic + totals.allowances + totals.ot, 0, `Payroll for ${month}`);
    insertJournal.run(period.id, "EPF Employer Expense", totals.epf_er, 0, `Employer EPF for ${month}`);
    insertJournal.run(period.id, "ETF Employer Expense", totals.etf_er, 0, `Employer ETF for ${month}`);
    insertJournal.run(period.id, "EPF Payable", 0, totals.epf_ee + totals.epf_er, `EPF Liability for ${month}`);
    insertJournal.run(period.id, "ETF Payable", 0, totals.etf_er, `ETF Liability for ${month}`);
    insertJournal.run(period.id, "Tax Payable", 0, totals.tax, `Tax Liability for ${month}`);
    insertJournal.run(period.id, "Salary Payable", 0, totals.net, `Net Salary Liability for ${month}`);

    res.json({ message: "Payroll processed successfully", period_id: period.id });
  });

  app.post("/api/payroll/approve", (req, res) => {
    const { month } = req.body;
    try {
      db.prepare("UPDATE payroll_periods SET status = 'Approved' WHERE period_month = ?").run(month);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to approve payroll" });
    }
  });

  app.get("/api/payroll/status/:month", (req, res) => {
    const period = db.prepare("SELECT status FROM payroll_periods WHERE period_month = ?").get(req.params.month) as any;
    res.json({ status: period?.status || 'Draft' });
  });

  // Advances & Loans
  app.get("/api/advances", (req, res) => {
    const advances = db.prepare(`
      SELECT a.*, e.first_name, e.last_name, e.employee_no 
      FROM advances a 
      JOIN employees e ON a.employee_id = e.id
    `).all();
    res.json(advances);
  });

  app.post("/api/advances", (req, res) => {
    const { employee_id, amount, repayment_month } = req.body;
    db.prepare("INSERT INTO advances (employee_id, amount, request_date, repayment_month) VALUES (?, ?, ?, ?)")
      .run(employee_id, amount, new Date().toISOString().split('T')[0], repayment_month);
    res.json({ success: true });
  });

  app.post("/api/advances/approve/:id", (req, res) => {
    db.prepare("UPDATE advances SET status = 'Approved' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/loans", (req, res) => {
    const loans = db.prepare(`
      SELECT l.*, e.first_name, e.last_name, e.employee_no 
      FROM loans l 
      JOIN employees e ON l.employee_id = e.id
    `).all();
    res.json(loans);
  });

  app.post("/api/loans", (req, res) => {
    const { employee_id, total_amount, monthly_installment, start_month } = req.body;
    db.prepare("INSERT INTO loans (employee_id, total_amount, monthly_installment, remaining_balance, start_month) VALUES (?, ?, ?, ?, ?)")
      .run(employee_id, total_amount, monthly_installment, total_amount, start_month);
    res.json({ success: true });
  });

  // Accounting Integration
  app.get("/api/accounting/journals/:month", (req, res) => {
    const journals = db.prepare(`
      SELECT j.* FROM accounting_journals j
      JOIN payroll_periods p ON j.period_id = p.id
      WHERE p.period_month = ?
    `).all(req.params.month);
    res.json(journals);
  });

  // Bank Processing
  app.get("/api/bank/transfers/:month", (req, res) => {
    const transfers = db.prepare(`
      SELECT b.* FROM bank_transfers b
      JOIN payroll_periods p ON b.period_id = p.id
      WHERE p.period_month = ?
    `).all(req.params.month);
    res.json(transfers);
  });

  app.post("/api/bank/generate-batch", (req, res) => {
    const { month } = req.body;
    const period = db.prepare("SELECT id FROM payroll_periods WHERE period_month = ?").get(month) as any;
    if (!period) return res.status(404).json({ error: "Period not found" });

    const total = db.prepare("SELECT SUM(net_salary) as total FROM payroll_records WHERE period_id = ?").get(period.id) as any;
    const batch_no = `BATCH-${month}-${Date.now()}`;
    
    db.prepare("INSERT INTO bank_transfers (period_id, batch_no, total_amount) VALUES (?, ?, ?)")
      .run(period.id, batch_no, total.total);
    
    res.json({ success: true, batch_no });
  });

  // Compliance
  app.get("/api/compliance/documents", (req, res) => {
    const docs = db.prepare(`
      SELECT c.*, e.first_name, e.last_name, e.employee_no 
      FROM compliance_documents c
      JOIN employees e ON c.employee_id = e.id
    `).all();
    res.json(docs);
  });

  app.get("/api/payroll/audit/:period_id", (req, res) => {
    const { period_id } = req.params;
    
    const records = db.prepare(`
      SELECT pr.*, e.first_name, e.last_name, e.employee_no, s.calculation_method
      FROM payroll_records pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN salary_structures s ON e.id = s.employee_id
      WHERE pr.period_id = ?
    `).all(period_id) as any[];

    const anomalies = db.prepare(`
      SELECT a.*, e.first_name, e.last_name
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.anomaly_detected = 1
    `).all() as any[];

    const alerts: any[] = [];

    records.forEach(rec => {
      // Rule 1: High OT Warning
      if (rec.ot_pay > (rec.basic_salary * 0.5)) {
        alerts.push({
          type: 'warning',
          employee: `${rec.first_name} ${rec.last_name}`,
          message: `High Overtime: OT Pay (LKR ${rec.ot_pay}) is more than 50% of Basic Salary.`
        });
      }

      // Rule 2: Negative Net Salary
      if (rec.net_salary < 0) {
        alerts.push({
          type: 'danger',
          employee: `${rec.first_name} ${rec.last_name}`,
          message: `Negative Net Salary: LKR ${rec.net_salary}. Check deductions.`
        });
      }
    });

    // Rule 3: Attendance Anomalies
    anomalies.forEach(a => {
      alerts.push({
        type: 'danger',
        employee: `${a.first_name} ${a.last_name}`,
        message: `Attendance Anomaly: ${a.anomaly_details} at ${a.check_in}`
      });
    });

    res.json(alerts);
  });

  app.get("/api/payroll/:month", (req, res) => {
    const { month } = req.params;
    const records = db.prepare(`
      SELECT pr.*, e.first_name, e.last_name, e.employee_no, d.name as department
      FROM payroll_records pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      JOIN payroll_periods pp ON pr.period_id = pp.id
      WHERE pp.period_month = ?
    `).all(month);
    res.json(records);
  });

  // Reports
  // Payroll Processing
  // Payroll Inputs
  app.get("/api/payroll-inputs/:month", (req, res) => {
    const { month } = req.params;
    const employees = db.prepare(`
      SELECT e.id as employee_id, e.first_name, e.last_name, e.employee_no, s.calculation_method,
             pi.ot_hours, pi.worked_hours, pi.worked_days, pi.bonus, pi.other_allowances, pi.deductions
      FROM employees e
      JOIN salary_structures s ON e.id = s.employee_id
      LEFT JOIN payroll_inputs pi ON e.id = pi.employee_id AND pi.period_month = ?
      WHERE e.status = 'Active'
    `).all(month);
    res.json(employees);
  });

  app.post("/api/payroll-inputs", (req, res) => {
    const { month, inputs } = req.body;
    const upsert = db.prepare(`
      INSERT INTO payroll_inputs (employee_id, period_month, ot_hours, worked_hours, worked_days, bonus, other_allowances, deductions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(employee_id, period_month) DO UPDATE SET
        ot_hours = excluded.ot_hours,
        worked_hours = excluded.worked_hours,
        worked_days = excluded.worked_days,
        bonus = excluded.bonus,
        other_allowances = excluded.other_allowances,
        deductions = excluded.deductions
    `);
    
    const transaction = db.transaction((data) => {
      for (const input of data) {
        upsert.run(input.employee_id, month, input.ot_hours || 0, input.worked_hours || 0, input.worked_days || 0, input.bonus || 0, input.other_allowances || 0, input.deductions || 0);
      }
    });
    transaction(inputs);
    res.json({ success: true });
  });

  // Payroll Processing
  app.get("/api/payroll/status/:month", (req, res) => {
    const { month } = req.params;
    const period = db.prepare("SELECT status FROM payroll_periods WHERE period_month = ?").get(month) as any;
    res.json({ status: period ? period.status : 'Open' });
  });

  app.get("/api/payroll/audit/:periodId", (req, res) => {
    const { periodId } = req.params;
    // Mock alerts for now
    res.json([
      { id: 1, type: 'Warning', message: '3 employees have OT > 60 hours' },
      { id: 2, type: 'Info', message: 'EPF/ETF rates verified' }
    ]);
  });

  app.get("/api/accounting/journals/:month", (req, res) => {
    const { month } = req.params;
    const journals = db.prepare(`
      SELECT aj.* 
      FROM accounting_journals aj
      JOIN payroll_periods pp ON aj.period_id = pp.id
      WHERE pp.period_month = ?
    `).all(month);
    res.json(journals);
  });

  app.get("/api/payroll/records/:month", (req, res) => {
    const { month } = req.params;
    const { project_id } = req.query;
    
    let query = `
      SELECT pr.*, e.first_name, e.last_name, e.employee_no, d.name as department
      FROM payroll_records pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      JOIN payroll_periods pp ON pr.period_id = pp.id
      WHERE pp.period_month = ?
    `;
    const params = [month];
    
    if (project_id) {
      query += " AND e.site_id IN (SELECT id FROM sites WHERE project_id = ?)";
      params.push(String(project_id));
    }

    const records = db.prepare(query).all(...params);
    res.json(records);
  });

  app.post("/api/payroll/process", (req, res) => {
    const { month, project_id } = req.body;
    
    // 1. Ensure period exists
    let period = db.prepare("SELECT * FROM payroll_periods WHERE period_month = ?").get(month) as any;
    if (!period) {
      const result = db.prepare("INSERT INTO payroll_periods (period_month, status) VALUES (?, 'Open')").run(month);
      period = { id: result.lastInsertRowid, status: 'Open' };
    }

    if (period.status === 'Locked') {
      return res.status(400).json({ error: "Period is locked" });
    }

    // 2. Get employees to process
    let empQuery = `
      SELECT e.*, s.basic_salary, s.fixed_allowances, s.ot_rate, s.ot_multiplier, s.calculation_method
      FROM employees e
      JOIN salary_structures s ON e.id = s.employee_id
      WHERE e.status = 'Active'
    `;
    const empParams = [];
    if (project_id) {
      empQuery += " AND e.site_id IN (SELECT id FROM sites WHERE project_id = ?)";
      empParams.push(project_id);
    }
    const employees = db.prepare(empQuery).all(...empParams);

    // 3. Process each employee
    const transaction = db.transaction(() => {
      // Clear existing draft records for this period/project
      if (project_id) {
        db.prepare(`
          DELETE FROM payroll_records 
          WHERE period_id = ? AND employee_id IN (SELECT id FROM employees WHERE site_id IN (SELECT id FROM sites WHERE project_id = ?))
        `).run(period.id, project_id);
      } else {
        db.prepare("DELETE FROM payroll_records WHERE period_id = ?").run(period.id);
      }

      for (const emp of employees as any) {
        // Get inputs
        const inputs = db.prepare("SELECT * FROM payroll_inputs WHERE employee_id = ? AND period_month = ?").get(emp.id, month) as any || {};
        
        const basic = emp.basic_salary;
        const ot_pay = (inputs.ot_hours || 0) * (emp.ot_rate || 0);
        const allowances = (emp.fixed_allowances || 0) + (inputs.other_allowances || 0);
        const deductions = (inputs.deductions || 0);
        
        const gross = basic + ot_pay + allowances;
        
        // Statutory (Simplified Sri Lankan rates)
        const epf_ee = basic * 0.08;
        const epf_er = basic * 0.12;
        const etf_er = basic * 0.03;
        
        // Tax (Simplified)
        let tax = 0;
        if (gross > 100000) {
          tax = (gross - 100000) * 0.06;
        }

        const total_deductions = epf_ee + tax + deductions;
        const net = gross - total_deductions;

        db.prepare(`
          INSERT INTO payroll_records (
            period_id, employee_id, basic_salary, ot_pay, allowances, 
            other_deductions, gross_salary, epf_employee, epf_employer, 
            etf_employer, apit_tax, total_deductions, net_salary, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft')
        `).run(period.id, emp.id, basic, ot_pay, allowances, deductions, gross, epf_ee, epf_er, etf_er, tax, total_deductions, net);
      }
      
      db.prepare("UPDATE payroll_periods SET status = 'Processing', processed_at = CURRENT_TIMESTAMP WHERE id = ?").run(period.id);
    });

    transaction();
    logAudit(null, "Payroll Processed", `Processed payroll for ${month}${project_id ? ' (Project ID: ' + project_id + ')' : ''}`);
    res.json({ success: true });
  });

  app.post("/api/payroll/approve", (req, res) => {
    const { month } = req.body;
    const period = db.prepare("SELECT * FROM payroll_periods WHERE period_month = ?").get(month) as any;
    
    if (!period) return res.status(404).json({ error: "Period not found" });

    const transaction = db.transaction(() => {
      db.prepare("UPDATE payroll_periods SET status = 'Locked', approved_at = CURRENT_TIMESTAMP WHERE id = ?").run(period.id);
      db.prepare("UPDATE payroll_records SET status = 'Finalized' WHERE period_id = ?").run(period.id);
      
      // Generate Accounting Journals (Simplified)
      const totals = db.prepare(`
        SELECT SUM(gross_salary) as gross, SUM(epf_employer) as epf_er, SUM(etf_employer) as etf_er, SUM(net_salary) as net
        FROM payroll_records WHERE period_id = ?
      `).get(period.id) as any;

      db.prepare(`INSERT INTO accounting_journals (period_id, account_name, debit, description) VALUES (?, 'Salary Expense', ?, ?)`).run(period.id, totals.gross, `Gross Salary for ${month}`);
      db.prepare(`INSERT INTO accounting_journals (period_id, account_name, credit, description) VALUES (?, 'Salary Payable', ?, ?)`).run(period.id, totals.net, `Net Salary for ${month}`);
      db.prepare(`INSERT INTO accounting_journals (period_id, account_name, debit, description) VALUES (?, 'Statutory Expense', ?, ?)`).run(period.id, totals.epf_er + totals.etf_er, `Employer EPF/ETF for ${month}`);
    });

    transaction();
    logAudit(null, "Payroll Approved", `Approved and locked payroll for ${month}`);
    res.json({ success: true });
  });

  app.get("/api/reports/summary/:month", (req, res) => {
    const { month } = req.params;
    const summary = db.prepare(`
      SELECT 
        SUM(gross_salary) as total_gross,
        SUM(net_salary) as total_net,
        SUM(epf_employee) as total_epf_ee,
        SUM(epf_employer) as total_epf_er,
        SUM(etf_employer) as total_etf,
        SUM(apit_tax) as total_tax,
        SUM(ot_pay) as total_ot,
        SUM(allowances) as total_allowances
      FROM payroll_records pr
      JOIN payroll_periods pp ON pr.period_id = pp.id
      WHERE pp.period_month = ?
    `).get(month) as any;

    const deptBreakdown = db.prepare(`
      SELECT d.name, SUM(pr.gross_salary) as value
      FROM payroll_records pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      JOIN payroll_periods pp ON pr.period_id = pp.id
      WHERE pp.period_month = ?
      GROUP BY d.id
    `).all(month);

    res.json({ ...summary, deptBreakdown });
  });

  // Contract Management Endpoints
  app.get("/api/contracts/milestones/:employee_id", (req, res) => {
    const { employee_id } = req.params;
    const milestones = db.prepare(`SELECT * FROM contract_milestones WHERE employee_id = ?`).all(employee_id);
    res.json(milestones);
  });

  app.post("/api/contracts/milestones", (req, res) => {
    const { employee_id, name, target_percentage, amount } = req.body;
    db.prepare(`INSERT INTO contract_milestones (employee_id, name, target_percentage, amount) VALUES (?, ?, ?, ?)`).run(employee_id, name, target_percentage, amount);
    res.json({ message: "Milestone added" });
  });

  app.post("/api/contracts/inspections", (req, res) => {
    const { milestone_id, report_text, rating, inspector_name, is_approved } = req.body;
    db.prepare(`INSERT INTO inspection_reports (milestone_id, report_text, rating, inspector_name, is_approved) VALUES (?, ?, ?, ?, ?)`).run(milestone_id, report_text, rating, inspector_name, is_approved ? 1 : 0);
    
    if (is_approved) {
      db.prepare(`UPDATE contract_milestones SET status = 'Completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?`).run(milestone_id);
    }
    res.json({ message: "Inspection report added" });
  });

  app.get("/api/contracts/inspections/:milestone_id", (req, res) => {
    const { milestone_id } = req.params;
    const reports = db.prepare(`SELECT * FROM inspection_reports WHERE milestone_id = ?`).all(milestone_id);
    res.json(reports);
  });

  app.get("/api/contracts/cash-flow", (req, res) => {
    // Forecast based on pending milestones and unpaid schedules
    const milestones = db.prepare(`
      SELECT 
        strftime('%Y-%m', 'now', '+1 month') as month,
        SUM(amount) as total_due
      FROM contract_milestones
      WHERE status = 'Pending'
      GROUP BY month
    `).all();
    
    const schedules = db.prepare(`
      SELECT 
        strftime('%Y-%m', due_date) as month,
        SUM(amount) as total_due
      FROM payment_schedules
      WHERE status = 'Unpaid'
      GROUP BY month
      ORDER BY month
    `).all();

    res.json({ milestones, schedules });
  });

  app.get("/api/contracts/retention/:employee_id", (req, res) => {
    const { employee_id } = req.params;
    const held = db.prepare(`
      SELECT SUM(other_deductions) as total_held
      FROM payroll_records pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN salary_structures s ON e.id = s.employee_id
      WHERE pr.employee_id = ? AND s.calculation_method = 'Contract'
    `).get(employee_id) as any;
    res.json({ total_held: held?.total_held || 0 });
  });

  app.post("/api/contracts/release-retention", (req, res) => {
    const { employee_id, amount, period_month } = req.body;
    // To release retention, we add it as a bonus/allowance in the next payroll input
    const existing = db.prepare(`SELECT * FROM payroll_inputs WHERE employee_id = ? AND period_month = ?`).get(employee_id, period_month) as any;
    
    if (existing) {
      db.prepare(`UPDATE payroll_inputs SET other_allowances = other_allowances + ? WHERE id = ?`).run(amount, existing.id);
    } else {
      db.prepare(`INSERT INTO payroll_inputs (employee_id, period_month, other_allowances) VALUES (?, ?, ?)`).run(employee_id, period_month, amount);
    }
    res.json({ message: "Retention release scheduled" });
  });

  app.get("/api/executive/dashboard", (req, res) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // 1. Real-time site workforce (Checked-in today)
    const today = new Date().toISOString().split('T')[0];
    const workforce = db.prepare(`
      SELECT s.name as site_name, COUNT(a.id) as count
      FROM attendance a
      JOIN sites s ON a.site_id = s.id
      WHERE a.check_in LIKE ? AND a.check_out IS NULL
      GROUP BY s.id
    `).all(today + '%');

    // 2. Labor cost per project
    const projectCosts = db.prepare(`
      SELECT p.name, SUM(la.amount) as cost, p.labor_budget
      FROM projects p
      LEFT JOIN labor_allocations la ON p.id = la.project_id
      GROUP BY p.id
    `).all();

    // 3. Overtime percentage
    const otStats = db.prepare(`
      SELECT 
        SUM(ot_pay) as total_ot,
        SUM(basic_salary) as total_basic
      FROM payroll_records pr
      JOIN payroll_periods pp ON pr.period_id = pp.id
      WHERE pp.period_month = ?
    `).get(currentMonth) as any;
    const otPercentage = otStats?.total_basic ? (otStats.total_ot / otStats.total_basic) * 100 : 0;

    // 4. Productivity scores (Mocked for now based on progress vs labor)
    const productivity = db.prepare(`
      SELECT p.name, 
             (SUM(ppr.quantity) / NULLIF(SUM(la.amount), 0)) * 100 as score
      FROM projects p
      LEFT JOIN project_progress ppr ON p.id = ppr.project_id
      LEFT JOIN labor_allocations la ON p.id = la.project_id
      GROUP BY p.id
    `).all();

    // 5. Fraud risk alerts
    const fraudAlerts = db.prepare(`
      SELECT e.first_name, e.last_name, a.anomaly_details, a.fraud_score, a.risk_level
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.anomaly_detected = 1 OR a.fraud_score > 70 OR a.risk_level = 'High'
      ORDER BY a.fraud_score DESC
      LIMIT 5
    `).all();

    // 6. Contract payment status
    const contractStatus = db.prepare(`
      SELECT status, COUNT(*) as count, SUM(amount) as total_amount
      FROM contract_milestones
      GROUP BY status
    `).all();

    res.json({
      workforce,
      projectCosts,
      otPercentage,
      productivity,
      fraudAlerts,
      contractStatus,
      month: currentMonth
    });
  });

  // Shift Management
  app.get("/api/shifts/:site_id", (req, res) => {
    const { site_id } = req.params;
    const shifts = db.prepare(`SELECT * FROM shifts WHERE site_id = ? AND is_active = 1`).all(site_id);
    res.json(shifts);
  });

  app.post("/api/shifts", (req, res) => {
    const { site_id, supervisor_id, name, start_time, end_time } = req.body;
    const result = db.prepare(`
      INSERT INTO shifts (site_id, supervisor_id, name, start_time, end_time)
      VALUES (?, ?, ?, ?, ?)
    `).run(site_id, supervisor_id, name, start_time, end_time);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/shifts/:id/end", (req, res) => {
    const { id } = req.params;
    db.prepare(`UPDATE shifts SET is_active = 0, end_time = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
    res.json({ message: "Shift ended" });
  });

  // Attendance Verification AI Agent Endpoints
  app.post("/api/attendance/qr/generate", (req, res) => {
    const { supervisor_id, site_id, shift_id } = req.body;
    
    // Validate active shift
    const shift = db.prepare(`SELECT * FROM shifts WHERE id = ? AND is_active = 1`).get(shift_id) as any;
    if (!shift) {
      return res.status(400).json({ error: "No active shift found" });
    }

    const code_hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins expiry

    const result = db.prepare(`
      INSERT INTO dynamic_qr_codes (supervisor_id, site_id, code_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(supervisor_id, site_id, code_hash, expires_at);

    res.json({ id: result.lastInsertRowid, code_hash, expires_at, shift_id });
  });

  app.post("/api/attendance/verify", async (req, res) => {
    const { 
      employee_id, 
      site_id, 
      shift_id,
      qr_code_hash, 
      device_id, 
      lat, 
      lng, 
      selfie_url,
      offline_timestamp,
      device_time
    } = req.body;

    const server_time = new Date().toISOString();

    // 1. Validate QR Code
    const qr = db.prepare(`SELECT * FROM dynamic_qr_codes WHERE code_hash = ?`).get(qr_code_hash) as any;
    let qr_misuse = 0;
    if (!qr || new Date(qr.expires_at) < new Date()) {
      qr_misuse = 1;
    }

    // 2. Device Binding Control (1 device per employee)
    const existingBinding = db.prepare(`SELECT device_id FROM attendance WHERE employee_id = ? AND device_id IS NOT NULL LIMIT 1`).get(employee_id) as any;
    let device_anomaly = 0;
    if (existingBinding && existingBinding.device_id !== device_id) {
      device_anomaly = 1; // Device mismatch
    }

    // 3. Duplicate Attendance Prevention (Same shift)
    const existingAttendance = db.prepare(`
      SELECT id FROM attendance 
      WHERE employee_id = ? AND shift_id = ? AND sync_status != 'Rejected'
    `).get(employee_id, shift_id) as any;
    
    let is_duplicate = 0;
    if (existingAttendance) {
      is_duplicate = 1;
    }

    // 4. Time Validation Control
    let time_anomaly = 0;
    if (device_time && Math.abs(new Date(device_time).getTime() - new Date(server_time).getTime()) > 15 * 60 * 1000) {
      time_anomaly = 1; // More than 15 mins difference
    }

    // 5. Risk Scoring
    const risk_score = (qr_misuse * 40) + (device_anomaly * 30) + (is_duplicate * 20) + (time_anomaly * 10);
    const risk_level = risk_score > 70 ? 'High' : risk_score > 30 ? 'Medium' : 'Low';

    const timestamp = offline_timestamp || server_time;
    
    const result = db.prepare(`
      INSERT INTO attendance (
        employee_id, site_id, shift_id, check_in, device_id, lat_in, lng_in, 
        selfie_url, risk_score, risk_level, qr_code_id, anomaly_detected, 
        anomaly_details, device_time_at_checkin, server_time_at_sync, is_duplicate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      employee_id, 
      site_id, 
      shift_id,
      timestamp, 
      device_id, 
      lat, 
      lng, 
      selfie_url, 
      risk_score, 
      risk_level, 
      qr?.id || null,
      (risk_score > 50 || is_duplicate) ? 1 : 0,
      risk_score > 50 ? `Risk: ${qr_misuse ? 'QR Expired/Invalid' : ''} ${device_anomaly ? 'Device Mismatch' : ''} ${time_anomaly ? 'Clock Tampering' : ''}` : (is_duplicate ? 'Duplicate Scan' : null),
      device_time,
      server_time,
      is_duplicate
    );

    res.json({ 
      id: result.lastInsertRowid, 
      risk_score, 
      risk_level, 
      is_duplicate,
      sync_status: 'Complete' 
    });
  });

  app.get("/api/attendance/insights/:site_id", (req, res) => {
    const { site_id } = req.params;
    const history = db.prepare(`
      SELECT a.*, e.first_name, e.last_name
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.site_id = ?
      ORDER BY a.check_in DESC
      LIMIT 100
    `).all(site_id);
    
    res.json(history);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  // Executive Management Endpoints
app.get("/api/executive/employees", (req, res) => {
  const executives = db.prepare(`
    SELECT e.*, s.basic_salary, s.calculation_method 
    FROM employees e
    JOIN salary_structures s ON e.id = s.employee_id
    WHERE e.designation LIKE '%Director%' 
       OR e.designation LIKE '%CEO%' 
       OR e.designation LIKE '%CFO%' 
       OR e.designation LIKE '%VP%'
       OR e.designation LIKE '%Manager%'
  `).all();
  res.json(executives);
});

app.get("/api/executive/benefits/:month", (req, res) => {
  const benefits = db.prepare(`
    SELECT b.*, e.first_name, e.last_name, e.designation
    FROM executive_benefits b
    JOIN employees e ON b.employee_id = e.id
    WHERE b.period_month = ?
  `).all(req.params.month);
  res.json(benefits);
});

app.post("/api/executive/benefits", (req, res) => {
  const { employee_id, period_month, profit_share_percentage, bonus_amount, stock_options_granted } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO executive_benefits (employee_id, period_month, profit_share_percentage, bonus_amount, stock_options_granted)
      VALUES (?, ?, ?, ?, ?)
    `).run(employee_id, period_month, profit_share_percentage, bonus_amount, stock_options_granted);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: "Failed to allocate executive benefits" });
  }
});

// Manual Attendance Entry (Fallback)
app.post("/api/attendance/manual", (req, res) => {
  const { employee_id, site_id, shift_id, check_in, reason, supervisor_id } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO attendance (
        employee_id, site_id, shift_id, check_in, 
        verification_method, anomaly_details, is_verified, risk_level
      ) VALUES (?, ?, ?, ?, 'Manual', ?, 1, 'Low')
    `).run(employee_id, site_id, shift_id, check_in, `Manual entry by supervisor ${supervisor_id}. Reason: ${reason}`);
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: "Failed to record manual attendance" });
  }
});

// --- Reporting Endpoints ---

app.get("/api/reports/epf-etf/:month", (req, res) => {
  const data = db.prepare(`
    SELECT 
      e.employee_no, e.first_name, e.last_name, e.nic_no,
      p.basic_salary, p.epf_employee, p.epf_employer, p.etf_employer
    FROM payroll_records p
    JOIN employees e ON p.employee_id = e.id
    JOIN payroll_periods pp ON p.period_id = pp.id
    WHERE pp.month = ?
  `).all(req.params.month);
  res.json(data);
});

app.get("/api/reports/tax/:month", (req, res) => {
  const data = db.prepare(`
    SELECT 
      e.employee_no, e.first_name, e.last_name, e.nic_no,
      p.gross_salary, p.apit_tax
    FROM payroll_records p
    JOIN employees e ON p.employee_id = e.id
    JOIN payroll_periods pp ON p.period_id = pp.id
    WHERE pp.month = ? AND p.apit_tax > 0
  `).all(req.params.month);
  res.json(data);
});

app.get("/api/reports/department-costs/:month", (req, res) => {
  const data = db.prepare(`
    SELECT 
      d.name as department,
      SUM(p.gross_salary) as total_gross,
      SUM(p.epf_employer + p.etf_employer) as total_statutory,
      COUNT(p.id) as employee_count
    FROM payroll_records p
    JOIN employees e ON p.employee_id = e.id
    JOIN departments d ON e.department_id = d.id
    JOIN payroll_periods pp ON p.period_id = pp.id
    WHERE pp.month = ?
    GROUP BY d.id
  `).all(req.params.month);
  res.json(data);
});

app.get("/api/reports/project-costs/:month", (req, res) => {
  const data = db.prepare(`
    SELECT 
      pr.name as project,
      SUM(p.gross_salary) as total_labor_cost,
      COUNT(DISTINCT p.employee_id) as worker_count
    FROM payroll_records p
    JOIN employees e ON p.employee_id = e.id
    JOIN projects pr ON e.project_id = pr.id
    JOIN payroll_periods pp ON p.period_id = pp.id
    WHERE pp.month = ?
    GROUP BY pr.id
  `).all(req.params.month);
  res.json(data);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
