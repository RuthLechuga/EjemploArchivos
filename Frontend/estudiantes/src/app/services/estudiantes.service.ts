import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  url:string = "http://35.239.247.171:3000/Estudiantes/";

  constructor(private httpClient: HttpClient) { }

  getEstudiantes() {
    return this.httpClient.get(this.url).toPromise();
  }

  addEstudiante(carnet, nombre){
    const data = {carnet, nombre};

    /*
    Es equivalente a esto:
      data = {
        "carnet": carnet,
        "nombre": nombre
      }
    */

    return this.httpClient.post(this.url+"add",data).toPromise();
  }

}
