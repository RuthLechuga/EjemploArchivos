import { Component, OnInit } from '@angular/core';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from "@ionic-native/google-maps";

import { Platform, LoadingController, ToastController } from "@ionic/angular";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {

  map: GoogleMap;
  loading: any;
  latitud: 0;
  longitud: 0;

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create("map_canvas", {
      camera: {
        target: {
          lat: -2.1537488,
          lng: -79.8883037
        },
        zoom: 18,
        tilt: 30
      }
    });
  }

  async localizar() {
    this.map.clear();
    this.loading = await this.loadingCtrl.create({
      message: "Espera por favor..."
    });
    await this.loading.present();
    this.map
      .getMyLocation()
      .then((location: MyLocation) => {
        this.loading.dismiss();

        this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          tilt: 30
        });

        let marker: Marker = this.map.addMarkerSync({
          title: "Estoy aquí!",
          snippet: "",
          position: location.latLng,
          animation: GoogleMapsAnimation.BOUNCE
        });

        marker.showInfoWindow();

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          this.showToast("clicked!");
        });
      })
      .catch(error => {
        this.loading.dismiss();
        this.showToast(error.error_message);
      });
  }

  async add(){
    this.map.clear();
    this.loading = await this.loadingCtrl.create({
      message: "Espera por favor..."
    });
    await this.loading.present();

    this.map.animateCamera({
      target: {
        lat: this.latitud,
        lng: this.longitud
      },
      zoom: 17,
      tilt: 30
    });

    let marker: Marker = this.map.addMarkerSync({
      title: "Estoy aquí!",
      snippet: "",
      position: {
        lat: this.latitud,
        lng: this.longitud
      },
      animation: GoogleMapsAnimation.BOUNCE
    });

    marker.showInfoWindow();

    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      this.showToast("clicked!");
    });
    this.loading.dismiss();
  }

  async showToast(mensaje) {
    let toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: "bottom"
    });

    toast.present();
  }
}