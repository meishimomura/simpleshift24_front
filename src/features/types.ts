/*authSlice.ts*/
export interface LOGIN_USER {
  id: number;
  username: string;
}
export interface FILE extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
export interface PROFILE {
  id: number;
  user_profile: number;
  img: string | null;
}
export interface POST_PROFILE {
  id: number;
  img: File | null;
}
export interface CRED {
  username: string;
  password: string;
}
export interface JWT {
  refresh: string;
  access: string;
}
export interface USER {
  id: number;
  username: string;
}
export interface AUTH_STATE {
  isLoginView: boolean;
  loginUser: LOGIN_USER;
  profiles: PROFILE[];
}
/*shiftSlice.ts*/
export interface READ_SHIFT {
  id: number;
  owner: number;
  shift_date: string;
  shift_start: string;
  shift_end: string;
  staff: string;
  staff_name: string;
  staff_is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface POST_SHIFT {
  id: number;
  shift_date: string;
  shift_start: string;
  shift_end: string;
  staff: string;
}
export interface SHIFT_STATE {
  shiftViewStatus: boolean;
  shifts: READ_SHIFT[];
  editedShift: POST_SHIFT;
  selectedShift: READ_SHIFT;
  staff: READ_STAFF[];
  editedStaff: POST_STAFF;
}
/*staffSlice.ts*/
export interface READ_STAFF {
  id: number;
  owner: number;
  staff_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface POST_STAFF {
  id: number;
  staff_name: string;
}
//
export interface PUT_STAFF {
  id: number;
  is_active: boolean;
}
//
export interface STAFF_STATE {
  staff: READ_STAFF[];
  editedStaff: POST_STAFF;
}
/*StaffList.tsx*/
export interface PAGE_STATE {
  rows: READ_STAFF[];
  offset: number;
  parPage: number;
}
