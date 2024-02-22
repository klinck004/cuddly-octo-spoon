import { Component } from '@angular/core';
import { BpService } from './bp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cos';
  constructor(private bpService: BpService) {}
  ngOnInit() {
    this.bpService.getAll().subscribe(data => {
      console.log(data)
    })
  }
  
  submitData(value: any) {
    let body = {
      name: value.name,
      age: value.age
    }
    this.bpService.addData(body).subscribe(response => {
      console.log(response)
    })
  }
}
