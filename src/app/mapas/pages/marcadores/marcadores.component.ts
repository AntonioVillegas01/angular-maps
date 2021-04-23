import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {Marker} from 'mapbox-gl';
import {mark} from '@angular/compiler-cli/src/ngtsc/perf/src/clock';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }

    li {
      cursor: pointer;
    }
  `]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapaRef') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel = 15;
  center: [number, number] = [-99.15677101320071, 19.449437057213803];

  // arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() {
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerMarcadoresLocalStorage();
  }

  agregarMarcador(): void {
    // tslint:disable-next-line:no-bitwise
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    console.log(color);

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    }).setLngLat(this.center)
      .addTo(this.mapa);

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      console.log('drag');
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador(marker: mapboxgl.Marker) {
   // console.log(marker);
    this.mapa.flyTo({
      center: marker.getLngLat()
    });
  }

  guardarMarcadoresLocalStorage() {
    const lngLatArray: MarcadorColor[] = [];
    this.marcadores.forEach(m => {
      const color = m.color;
      // tslint:disable-next-line:no-non-null-assertion
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArray.push({
        color,
        centro: [lng, lat]
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArray));

  }

  leerMarcadoresLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }
    // tslint:disable-next-line:no-non-null-assertion
    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(marker => {
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: marker.color,
        // tslint:disable-next-line:no-non-null-assertion
      }).setLngLat(marker.centro!)
        .addTo(this.mapa);
      this.marcadores.push({
        marker: newMarker,
        color: marker.color
      });

      newMarker.on('dragend', () => {
        console.log('drag');
        this.guardarMarcadoresLocalStorage();
      });
    });


  }

  borrarMarcador(i: number) {
    console.log(`borrando marcador ${i}`);
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
