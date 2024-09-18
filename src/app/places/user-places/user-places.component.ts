import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');
  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places = this.placeService.loadedUserPlaces;
  
  ngOnInit(): void {
    console.log(this.places());
    this.isFetching.set(true)
    const subscribe = this.placeService.loadUserPlaces().subscribe({
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => this.isFetching.set(false)
    })

    this.destroyRef.onDestroy(() => {
      subscribe.unsubscribe();
    })
  }

  onDeletedPlace(selectedPlace: Place) {
    const subscribe = this.placeService.removeUserPlace(selectedPlace).subscribe()
    this.destroyRef.onDestroy(() => {
      subscribe.unsubscribe();
    })
  }
}