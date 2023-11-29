import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { ITask } from '../model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todoForm !: FormGroup;
  tasks: ITask [] = [];
  inprogress: ITask [] = [];
  done: ITask [] = [];
  isEdit: any = null;
  updateItemIndex: any = null;

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      description: ['', Validators.required]
    })
  }

  onAddTask() {
    this.tasks.push({
      description: this.todoForm.value.description,
      done: false,
    })
    this.todoForm.reset();
  }

  onUpdateTask() {
    if (this.isEdit === 'tasks') {
      this.tasks[this.updateItemIndex].description = this.todoForm.value.description;
      this.tasks[this.updateItemIndex].done = false;
    } else {
      this.inprogress[this.updateItemIndex].description = this.todoForm.value.description;
      this.inprogress[this.updateItemIndex].done = false;
    }

    this.isEdit = null;
    this.updateItemIndex = null;
    this.todoForm.reset();
  }

  onEditTask(item: ITask, index: number, type: string) {
    this.todoForm.controls['description'].setValue(item.description);
    this.updateItemIndex = index;
    this.isEdit = type;
  }

  onDeleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  onDeleteInprogressTask(index: number) {
    this.inprogress.splice(index, 1);
  }

  onDeleteDoneTask(index: number) {
    this.done.splice(index, 1);
  }

  onDrop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data, 
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );
    }
  }
}
