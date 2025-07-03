import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorListComponent } from './components/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './components/doctor-form/doctor-form.component'; 

const routes: Routes = [
  { path: 'doctors', component: DoctorListComponent },
  { path: 'doctors/new', component: DoctorFormComponent }, // Маршрут для создания нового доктора
  { path: 'doctors/edit/:id', component: DoctorFormComponent }, // Маршрут для редактирования (с ID доктора)
  { path: '', redirectTo: '/doctors', pathMatch: 'full' }, // Перенаправление на список докторов
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
