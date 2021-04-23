import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [`
    #mapa {
      width: 100%;
      height: 100%;
    }
  `]
})
export class FullScreenComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

    const map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-99.15677101320071, 19.449437057213803],
      zoom: 17
    });

  }

}
