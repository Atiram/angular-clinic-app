import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, PagedResult, GetAllDoctorsParams, DoctorSortingParams, DoctorStatus } from '../../models/doctor.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  pagedResult: PagedResult<Doctor> | null = null;

  // Параметры для пагинации, сортировки и поиска
  currentParams: GetAllDoctorsParams = {
    pageNumber: 1,
    pageSize: 10,
    searchValue: '',
    sortParameter: DoctorSortingParams.LastName,
    isDescending: false
  };

  doctorSortingParams = DoctorSortingParams; // Для использования в шаблоне
  doctorStatusEnum = DoctorStatus;

  constructor(
    private doctorService: DoctorService,
    private router: Router  
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors(this.currentParams).subscribe({
      next: (data) => {
        this.pagedResult = data;
        this.doctors = data.results;
        console.log('Loaded doctors:', this.doctors);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Ошибка при загрузке докторов:', err);
      }
    });
  }

  onPageChange(pageNumber: number): void {
    if (this.pagedResult && pageNumber >= 1 && pageNumber <= this.pagedResult.totalPages) {
      this.currentParams.pageNumber = pageNumber;
      this.loadDoctors();
    }
  }

  onPageSizeChange(event: Event): void {
    this.currentParams.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentParams.pageNumber = 1; // Сброс на первую страницу при изменении размера
    this.loadDoctors();
  }

  onSearch(): void {
    this.currentParams.pageNumber = 1; // Сброс на первую страницу при поиске
    this.loadDoctors();
  }

  onSort(sortParam: DoctorSortingParams): void {
    if (this.currentParams.sortParameter === sortParam) {
      this.currentParams.isDescending = !this.currentParams.isDescending;
    } else {
      this.currentParams.sortParameter = sortParam;
      this.currentParams.isDescending = false;
    }
    this.currentParams.pageNumber = 1; // Сброс на первую страницу при сортировке
    this.loadDoctors();
  }

  // Вспомогательная функция для генерации массива страниц для пагинации
  get pageNumbers(): number[] {
    if (!this.pagedResult) {
      return [];
    }
    return Array.from({ length: this.pagedResult.totalPages }, (_, i) => i + 1);
  }

  // Метод для удаления доктора
  deleteDoctor(id: string): void {
    if (confirm('Вы уверены, что хотите удалить этого доктора?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          console.log('Доктор успешно удален:', id);
          this.loadDoctors(); // Перезагружаем список докторов после удаления
          // Можно также удалить элемент из массива doctors без перезагрузки, но перезагрузка надежнее
        },
        error: (err: HttpErrorResponse) => {
          console.error('Ошибка при удалении доктора:', err);
          alert(`Ошибка при удалении: ${err.message || err.statusText}`);
        }
      });
    }
  }
}