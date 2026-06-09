// Shapes mirrored from the dexahub-api gateway. Keep in sync with the backend.

export enum UserRole {
  EMPLOYEE = "employee",
  HRD_ADMIN = "hrd_admin",
}

/** Decoded access-token payload. The backend only signs these two claims. */
export interface JwtPayload {
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkInAt: string;
  photoPath: string;
  date: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  department?: string;
  position?: string;
  joinedAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateEmployeeData {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  department?: string;
  position?: string;
  joinedAt?: string;
}

export interface UpdateEmployeeData {
  fullName?: string;
  phone?: string;
  department?: string;
  position?: string;
  joinedAt?: string;
  isActive?: boolean;
}
