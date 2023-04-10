import { createAction, props } from '@ngrx/store';
import { SysMenuMessage } from '../models/menu.entity';

export const selectMenuIds = createAction(
    '[SysMenuMessage] selectMenuIds', props<{ message: SysMenuMessage }>()
);
