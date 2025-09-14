
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '@core/models/task.interface';
import { TaskService } from '@core/services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    TaskFormComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private filterSubject = new BehaviorSubject<FilterType>('all');

  tasks$ = this.tasksSubject.asObservable();
  currentFilter$ = this.filterSubject.asObservable();
  filteredTasks$: Observable<Task[]>;

  showForm = false;
  editingTask: Task | null = null;
  loading = false;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.currentFilter$
    ]).pipe(
      map(([tasks, filter]) => this.filterTasks(tasks, filter))
    );
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des tâches', 'Fermer', { duration: 3000 });
      }
    });
  }

  private filterTasks(tasks: Task[], filter: FilterType): Task[] {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }

  onFilterChange(filter: FilterType): void {
    this.filterSubject.next(filter);
  }

  getActiveCount(): number {
    return this.tasksSubject.value.filter(task => !task.completed).length;
  }

  getCompletedCount(): number {
    return this.tasksSubject.value.filter(task => task.completed).length;
  }

  onAddTask(): void {
    this.editingTask = null;
    this.showForm = true;
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.showForm = true;
  }

  toggleTask(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.loadTasks();
        this.snackBar.open(
          `Tâche ${updatedTask.completed ? 'terminée' : 'réactivée'}`,
          'Fermer',
          { duration: 3000 }
        );
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour de la tâche', 'Fermer', { duration: 3000 });
      }
    });
  }

  onTaskSubmit(taskData: Omit<Task, 'id'>): void {
    if (this.editingTask) {
      const updatedTask: Task = { ...taskData, id: this.editingTask.id };
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          this.loadTasks();
          this.showForm = false;
          this.editingTask = null;
          this.snackBar.open('Tâche mise à jour avec succès', 'Fermer', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erreur lors de la mise à jour de la tâche', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.loadTasks();
          this.showForm = false;
          this.snackBar.open('Tâche créée avec succès', 'Fermer', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erreur lors de la création de la tâche', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  onCancelEdit(): void {
    this.showForm = false;
    this.editingTask = null;
  }

  deleteTask(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          this.snackBar.open('Tâche supprimée avec succès', 'Fermer', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression de la tâche', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
