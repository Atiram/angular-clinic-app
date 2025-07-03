export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  email: string;
  specialization: string;
  office: string;
  careerStartYear: number;
  status: DoctorStatus;
  createdAt: string;
  updatedAt?: string;
}

export enum DoctorStatus {
  AtWork = 0,
  OnVacation = 1,
  SickDay = 2,
  SickLeave = 3,
  SelfIsolation = 4,
  LeaveWithoutPay = 5,
  Inactive = 6,
}
export interface PagedResult<T> {
  results: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface GetAllDoctorsParams {
  pageNumber: number;
  pageSize: number;
  searchValue?: string;
  sortParameter?: DoctorSortingParams;
  isDescending?: boolean;
}

export enum DoctorSortingParams {
  FirstName = 0,
  LastName = 1,
  MiddleName = 2,
  DateOfBirth = 3,
  Email = 4,
  Specialization = 5,
  Office = 6,
  CareerStartYear = 7,
  Status = 8,
  CreatedAt = 9,
}