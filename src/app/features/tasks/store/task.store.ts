import { Injectable, signal } from '@angular/core';
import { Task } from '../../../core/models/task.interface';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  private state = signal<TaskState>({
    tasks: [],
    loading: false,
    error: null
  });

  tasks = this.state.asReadonly();
  loading = signal(false);
  error = signal<string | null>(null);

  setTasks(tasks: Task[]) {
    this.state.update(state => ({ ...state, tasks }));
  }

  addTask(task: Task) {
    this.state.update(state => ({
      ...state,
      tasks: [...state.tasks, { ...task, completed: false }]
    }));
  }

  updateTask(updatedTask: Task) {
    this.state.update(state => ({
      ...state,
      tasks: state.tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
  }

  deleteTask(id: number) {
    this.state.update(state => ({
      ...state,
      tasks: state.tasks.filter(task => task.id !== id)
    }));
  }

  setLoading(loading: boolean) {
    this.loading.set(loading);
  }

  setError(error: string | null) {
    this.error.set(error);
  }
}
