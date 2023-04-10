import { createAction, props } from '@ngrx/store';
import { SysProject } from '../models/project.entity';

export const retrievedProjects = createAction(
    '[retrievedProjects] Retrieve Success', props<{ projects: ReadonlyArray<SysProject> }>()
);

export const retrievedProject = createAction(
    '[retrievedProject] Retrieve Success', props<{ project: SysProject }>()
);