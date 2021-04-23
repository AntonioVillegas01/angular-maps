import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .row {
      background-color: white;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      border-radius: 5px;
      z-index: 999;
      width: 400px;
    }
  `]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapaRef') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel = 14;
  center: [number, number] = [-99.15677101320071, 19.449437057213803];

  constructor() {
  }

  ngOnDestroy(): void {
    this.mapa.off('zoom', (_) => {});
    this.mapa.off('zoomend', (_) => {});
    this.mapa.off('move', (_) => {});
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit ', this.divMapa);
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', (event) => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', (event) => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    });

    // moviemiento del mapa
    this.mapa.on('move', (event) => {
      const target = event.target;
      const {lng, lat} = target.getCenter();
      this.center = [lng, lat];
    });
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomIn() {
    this.mapa.zoomIn();
    this.zoomLevel = this.mapa.getZoom();
  }


  zoomCambio(value: string) {
    this.mapa.zoomTo(Number(value));
  }

  // Siempre que haya un evento on o un listener hay que
  // destruirlo ccuando se cierre el componente

}
