import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-multi-form',
  templateUrl: './multi-form.component.html',
  styleUrls: ['./multi-form.component.css']
})
export class MultiFormComponent implements OnInit, OnDestroy {

  dynamicForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth:AuthService) {
    this.dynamicForm = this.formBuilder.group({
      entries: this.formBuilder.array([
        this.initEntry(),
      ])
    });
  }

  initEntry() {
    return this.formBuilder.group({
      tspOtherName: ['', Validators.required],
      othersTsp: ['', Validators.required]
    });
  }

  addEntry() {
    const control = this.dynamicForm.get('entries') as FormArray;
    control.push(this.initEntry());
  }
  get entryControls() {
    return (this.dynamicForm.get('entries') as FormArray).controls;
  }
  removeEntry(index: number) {
    const control = this.dynamicForm.get('entries') as FormArray;
    control.removeAt(index);
  }
  getFormData(){
    console.log(this.dynamicForm.value)
    let array = this.dynamicForm.value.entries
    array.forEach((element:any) =>{
      element['reportDate'] = new Date().toISOString();
      element['nbmOfcLaid'] = {id:array.indexOf(element)}

    })
    console.log(array)
  }
ngOnInit(): void {
  // this.auth.getUser();
  // this.auth.getPostData('64ca05bd29669a4b4a0da4a5').subscribe((res:any)=>{
  //   console.log(res)
  // })
}
ngOnDestroy(): void {
  
}
}
