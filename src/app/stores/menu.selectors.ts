import { createFeatureSelector } from '@ngrx/store';
import { SysMenuMessage } from '../models/menu.entity';

export const selectMenu = createFeatureSelector<SysMenuMessage>('menu');
