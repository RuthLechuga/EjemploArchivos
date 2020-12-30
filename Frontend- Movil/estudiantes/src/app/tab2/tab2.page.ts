import { Component } from '@angular/core';
import { EstudiantesService } from 'src/app/services/estudiantes.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  carnet:string = '';
  nombre:string = '';

  constructor(public estudiantesService: EstudiantesService) {}

  async add(){
    console.log(this.carnet)
    console.log(this.nombre)
    let respuesta = await this.estudiantesService.addEstudiante(this.carnet,this.nombre); 
    console.log(respuesta)
  }

}
