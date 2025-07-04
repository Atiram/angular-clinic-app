import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, PagedResult, GetAllDoctorsParams } from '../models/doctor.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/Doctor`; // Убедитесь, что ваш API URL настроен в environments

  constructor(private http: HttpClient) { }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  getAllDoctors(params: GetAllDoctorsParams): Observable<PagedResult<Doctor>> {
    let httpParams = new HttpParams();
    if (params.pageNumber) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params.searchValue) {
      httpParams = httpParams.set('searchValue', params.searchValue);
    }
    if (params.sortParameter !== undefined) {
      httpParams = httpParams.set('sortParameter', params.sortParameter.toString());
    }
    if (params.isDescending !== undefined) {
      httpParams = httpParams.set('isDescending', params.isDescending.toString());
    }

    return this.http.get<PagedResult<Doctor>>(this.apiUrl, { params: httpParams });
  }

  // createDoctor(doctor: FormData): Observable<Doctor> { // Используем FormData для [FromForm]
  //   return this.http.post<Doctor>(this.apiUrl, doctor);
  // }

   createDoctor(doctorData: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string; // "YYYY-MM-DD"
    email: string;
    specialization: string;
    office: string;
    careerStartYear: number;
    status: number; // Enum DoctorStatus
  }): Observable<Doctor> {
    const formData = new FormData();
    formData.append('FirstName', doctorData.firstName);
    formData.append('LastName', doctorData.lastName);
    if (doctorData.middleName) formData.append('MiddleName', doctorData.middleName);
    formData.append('DateOfBirth', doctorData.dateOfBirth);
    formData.append('Email', doctorData.email);
    formData.append('Specialization', doctorData.specialization);
    formData.append('Office', doctorData.office);
    formData.append('CareerStartYear', doctorData.careerStartYear.toString());
    formData.append('Status', doctorData.status.toString()); // Передаем числовое значение enum

    return this.http.post<Doctor>(this.apiUrl, formData);
  }

  // updateDoctor(doctor: Doctor): Observable<Doctor> {
  //   return this.http.put<Doctor>(this.apiUrl, doctor);
  // }

   updateDoctor(doctorData: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string; // "YYYY-MM-DD"
    email: string;
    specialization: string;
    office: string;
    careerStartYear: number;
    status: number; // Enum DoctorStatus
  }
   ): Observable<Doctor> {
    const formData = new FormData();
    // Обязательно добавьте Id!
    formData.append('id', doctorData.id);
    formData.append('firstName', doctorData.firstName);
    formData.append('lastName', doctorData.lastName);
    formData.append('middleName', doctorData.middleName || '');
    formData.append('dateOfBirth', doctorData.dateOfBirth);
    formData.append('email', doctorData.email);
    formData.append('specialization', doctorData.specialization);
    formData.append('office', doctorData.office);
    formData.append('careerStartYear', doctorData.careerStartYear.toString());
    formData.append('status', doctorData.status.toString());

    // Добавьте файл, если он есть
    // if (doctorData.formfile) {
    //   formData.append('formfile', doctorData.formfile, doctorData.formfile.name);
    // } else {
    //     // Если файл не выбран, но поле Formfile существует в UpdateDoctorRequest,
    //     // возможно, вам нужно явно отправить пустой файл или сигнал об его отсутствии,
    //     // в зависимости от логики бэкенда.
    //     // Если бэкенд ожидает Formfile, даже если он null, можно отправить пустой Blob:
    //     // formData.append('formfile', new Blob([]), '');
    //     // Или просто не добавлять поле, если бэкенд обрабатывает его как опциональное.
    //     // В вашем случае, если Formfile? означает опциональность, то не отправляем.
    // }


    // PUT-запрос, отправляем FormData
    return this.http.put<Doctor>(this.apiUrl, formData); // PUT на базовый URL
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}