
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '@core/models/task.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Input() set task(value: Task | null) {
    if (value) {
      this.taskForm.patchValue(value);
    }
  }
  @Output() submitTask = new EventEmitter<Omit<Task, 'id'>>();
  @Output() cancelEdit = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      completed: [false]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.submitTask.emit(this.taskForm.value);
      this.taskForm.reset();
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
    this.taskForm.reset();
  }
}
