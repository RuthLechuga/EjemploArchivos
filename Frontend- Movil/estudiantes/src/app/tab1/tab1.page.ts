import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from 'src/app/services/estudiantes.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  estudiantes;
  textoBuscar = '';

  constructor(public estudiantesService: EstudiantesService) {}

  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.getEstudiantes();
  }

  async getEstudiantes(){
    this.estudiantes = await this.estudiantesService.getEstudiantes(); 
    console.log(this.estudiantes);
  }

  buscar(event) {
    this.textoBuscar = event.detail.value;
  }

  view(estudiante){
    console.log(estudiante);
  }

  update(carnet){
    console.log(carnet);
  }

  delete(carnet){
    console.log(carnet);
  }

}
