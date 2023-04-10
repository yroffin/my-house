import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { menuIds } from '../models/menu.entity';
import { selectMenuIds } from '../stores/menu.actions';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private store: Store) {

  }

  dispatch(id: menuIds) {
    this.store.dispatch(selectMenuIds({
      message: {
        id
      }
    }))
  }
}
