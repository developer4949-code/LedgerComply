export interface Client {
  id: string;
  company_name: string;
  country: string;
  entity_type: string;
  created_at?: string;
}

export interface Task {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  due_date: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  created_at?: string;
}

export type TaskStatus = Task["status"];
export type TaskPriority = Task["priority"];

export const TASK_CATEGORIES = [
  "Tax Filing",
  "Audit",
  "Regulatory",
  "Payroll",
  "GST",
  "Annual Return",
  "Other",
] as const;

export const TASK_STATUSES: TaskStatus[] = ["Pending", "In Progress", "Completed"];
export const TASK_PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];
