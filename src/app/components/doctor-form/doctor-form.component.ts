// src/app/components/doctor-form/doctor-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, DoctorStatus } from '../../models/doctor.model';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  doctorId: string | null = null;
  doctorStatuses = Object.keys(DoctorStatus).filter(key => isNaN(Number(key))); // Для выпадающего списка статусов
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService
  ) {
    // Инициализация формы с валидаторами
    this.doctorForm = this.fb.group({
      id: [null], // Будет заполнено только в режиме редактирования
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      dateOfBirth: ['', [Validators.required, this.dateOfBirthValidator]], // Добавьте валидатор
      email: ['', [Validators.required, Validators.email]],
      specialization: ['', Validators.required],
      office: ['', Validators.required],
      careerStartYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      status: [DoctorStatus.AtWork, Validators.required] 
    });
  }

  ngOnInit(): void {
    this.route.paramMap
    .pipe(
      switchMap(params => {
        this.doctorId = params.get('id');
        if (this.doctorId) {
          this.isEditMode = true;
          return this.doctorService.getDoctorById(this.doctorId).pipe(
            catchError(err => {
              console.error('Ошибка при загрузке доктора:', err);
              this.errorMessage = 'Не удалось загрузить данные доктора.';
              return of(null); // Возвращаем null, чтобы остановить поток без ошибок
            })
          );
        } else {
          return of(null);
        }
      }),
      tap(doctor => {
        if (doctor) {
          // Заполняем форму данными доктора
          // Преобразование DateOnly из C# (string "YYYY-MM-DD") в формат input type="date"
          this.doctorForm.patchValue({
            ...doctor,
            dateOfBirth: doctor.dateOfBirth
          });
        }
      })
    )
    .subscribe();
  }

  // Пользовательский валидатор для даты рождения
  dateOfBirthValidator(control: { value: string; }) {
    if (control.value) {
      const birthDate = new Date(control.value);
      const today = new Date();
      if (birthDate >= today) {
        return { futureDate: true };
      }
    }
    return null;
  }

  onSubmit(): void {
    this.errorMessage = null; // Сброс сообщения об ошибке
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched(); // Помечаем все поля как "тронутые" для отображения ошибок валидации
      console.log('Форма невалидна:', this.doctorForm.errors);
      this.errorMessage = 'Пожалуйста, заполните все обязательные поля корректно.';
      return;
    }

    const formValue = this.doctorForm.value;

    // Преобразование значения статуса обратно в число, если это необходимо
    // (если используется select с текстовыми значениями enum)
    const doctorDataToSend = {
      ...formValue,
      status: Number(formValue.status) // Убедитесь, что это число
    };

    if (this.isEditMode) {
      // Обновление доктора
      this.doctorService.updateDoctor(doctorDataToSend as Doctor).subscribe({
        next: () => {
          this.router.navigate(['/doctors']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Ошибка при обновлении доктора:', err);
          this.errorMessage = `Ошибка при обновлении: ${err.message || err.statusText}`;
          if (err.error && typeof err.error === 'object') {
            this.errorMessage += '\n' + JSON.stringify(err.error);
          }
        }
      });
    } else {
      // Создание доктора
      // Для CreateDoctorRequest в C# используется [FromForm], поэтому нужен FormData
      this.doctorService.createDoctor(doctorDataToSend).subscribe({
        next: () => {
          this.router.navigate(['/doctors']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Ошибка при создании доктора:', err);
          this.errorMessage = `Ошибка при создании: ${err.message || err.statusText}`;
          if (err.error && typeof err.error === 'object') {
            this.errorMessage += '\n' + JSON.stringify(err.error);
          }
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/doctors']);
  }
}