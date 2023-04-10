import { createFeatureSelector } from '@ngrx/store';
import { SysProject } from '../models/project.entity';

export const selectProjects = createFeatureSelector<ReadonlyArray<SysProject>>('projects');
export const selectProject = createFeatureSelector<SysProject>('project');
