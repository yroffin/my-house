import { createReducer, on } from '@ngrx/store';
import { menuIds, SysMenuMessage } from '../models/menu.entity';
import { selectMenuIds } from './menu.actions';

export const initialMenuState: SysMenuMessage = {
    id: menuIds.default
}

export const menuReducer = createReducer(
    initialMenuState,
    on(selectMenuIds, (state, { message }) => {
        state = message
        return state
    })
)
