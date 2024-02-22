import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BpService } from '../bp.service'

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent {
  constructor(
    private formBuilder: FormBuilder, 
    private bpService: BpService
  ) {}

  entryForm = this.formBuilder.group({
    datetime: '',
    sys: '',
    dia: '',
    pulse: '',
    rating: '',
    leftArm: '',
    rightArm: '',
    notes: ''
  })

  onSubmit(): void {
    console.log(this.entryForm.value)
    this.bpService.addData(this.entryForm.value).subscribe(response => {
      console.log(response)
    })
  }
}
