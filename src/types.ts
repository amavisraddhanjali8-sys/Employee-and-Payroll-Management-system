export interface Employee {
  id: number;
  employee_no: string;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  department_name?: string;
  designation: string;
  basic_salary: number;
  fixed_allowances: number;
  ot_rate: number;
  ot_multiplier: number;
  hourly_rate: number;
  daily_rate: number;
  late_penalty_rate: number;
  contract_amount: number;
  retention_percentage: number;
  calculation_method: string;
  status: string;
}

export interface PayrollRecord {
  id: number;
  employee_id: number;
  first_name: string;
  last_name: string;
  employee_no: string;
  department: string;
  basic_salary: number;
  ot_pay: number;
  allowances: number;
  other_deductions: number;
  gross_salary: number;
  epf_employee: number;
  epf_employer: number;
  etf_employer: number;
  apit_tax: number;
  total_deductions: number;
  net_salary: number;
}

export interface PayrollSummary {
  total_gross: number;
  total_net: number;
  total_epf_ee: number;
  total_epf_er: number;
  total_etf: number;
  total_tax: number;
  total_ot: number;
  total_allowances: number;
  deptBreakdown?: { name: string, value: number }[];
}

export interface ContractMilestone {
  id: number;
  employee_id: number;
  name: string;
  target_percentage: number;
  amount: number;
  status: string;
  completed_at?: string;
}

export interface InspectionReport {
  id: number;
  milestone_id: number;
  report_text: string;
  rating: number;
  inspector_name: string;
  is_approved: boolean;
  created_at: string;
}
