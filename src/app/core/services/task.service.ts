// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const formData = new FormData();

    try {
      // Vérification des champs requis
      if (!task.label) {
        throw new Error('Le champ label est obligatoire');
      }

      // Ajout des champs au FormData
      Object.entries(task).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {  // Ne pas envoyer les valeurs undefined/null
          formData.append(key, value.toString());
        }
      });


      return this.http.post<Task>(this.apiUrl, formData).pipe(
        tap((response) => {
          console.log('Réponse du serveur:', response);
        }),
        catchError((error) => {
          console.error('Erreur lors de la création de la tâche:', error);
          throw error;
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }


  updateTask(task: Task): Observable<Task> {
    const formData = new FormData();

    try {
      // Vérification des champs requis
      if (!task.label) {
        throw new Error('Le champ label est obligatoire');
      }
      if (!task.id) {
        throw new Error('L\'ID de la tâche est requis pour la mise à jour');
      }

      // Ajout des champs au FormData
      Object.entries(task).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });


      return this.http.put<Task>(`${this.apiUrl}/${task.id}`, formData).pipe(
        tap((response) => {
          console.log('Réponse du serveur:', response);
        }),
        catchError((error) => {
          console.error('Erreur lors de la mise à jour de la tâche:', error);
          throw error;
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
