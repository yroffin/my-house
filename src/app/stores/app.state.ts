import { SysProject } from "../models/project.entity";

export interface AppState {
    projects: ReadonlyArray<SysProject>;
    project: SysProject;
}