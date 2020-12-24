import { Component, OnInit, ViewChild } from '@angular/core';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  estudiantes;
  carnet:string = '';
  nombre:string = '';

  constructor(public estudiantesService: EstudiantesService) { }

  ngOnInit(): void {
    this.getEstudiantes();
  }

  async getEstudiantes(){
    this.estudiantes = await this.estudiantesService.getEstudiantes(); 
    console.log(this.estudiantes)
  }

  update(carnet){
    console.log(`actualizar ==> ${carnet}`)
  }

  delete(carnet){
    console.log(`eliminar ==> ${carnet}`)
  }

  async add(){
    let respuesta = await this.estudiantesService.addEstudiante(this.carnet,this.nombre); 
    console.log(respuesta)
    this.getEstudiantes();
  }

}
