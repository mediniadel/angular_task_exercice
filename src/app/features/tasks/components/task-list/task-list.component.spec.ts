
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '@core/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Task } from '@core/models/task.interface';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jest.Mocked<TaskService>;

  const mockTasks: Task[] = [
    { id: 1, label: 'Tâche 1', description: 'Description 1', completed: false },
    { id: 2, label: 'Tâche 2', description: 'Description 2', completed: true }
  ];

  beforeEach(async () => {
    const taskServiceMock = {
      getTasks: jest.fn().mockReturnValue(of(mockTasks))
    } as unknown as jest.Mocked<TaskService>;

    const snackBarMock = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as unknown as jest.Mocked<TaskService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les tâches à l\'initialisation', () => {
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.getActiveCount()).toBe(1);
    expect(component.getCompletedCount()).toBe(1);
  });
});
