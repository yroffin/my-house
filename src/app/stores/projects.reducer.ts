import { createReducer, on } from '@ngrx/store';
import { SysProject } from '../models/project.entity';
import { retrievedProject, retrievedProjects } from './projects.actions';

export const initialProjectsState: ReadonlyArray<SysProject> = [];

export const projectsReducer = createReducer(
    initialProjectsState,
    on(retrievedProjects, (state, { projects }) => projects)
);

export const initialProjectState: SysProject = {
    id: "default",
    label: "default"
}

export const projectReducer = createReducer(
    initialProjectState,
    on(retrievedProject, (state, { project }) => project)
);