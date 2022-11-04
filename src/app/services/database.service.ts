import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';
import { ComponentModel, PaperModel, ProjectModel } from '../models/paper.class';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private storage: LocalStorageService,
    private logger: NGXLogger,
  ) {
    let _projects = this.findProjects()
    if (!_projects) {
      this.logger.info("Create default projects")
      this.storage.store('projects', [])
    }
  }

  findProjects(): Array<ProjectModel> {
    return JSON.parse(JSON.stringify(this.storage.retrieve('projects')))
  }

  getPaper(_projectId: string, _paperId: string): PaperModel | null {
    let _projects = this.findProjects()
    let _project = _.filter(_projects, (project) => {
      return project.id === _projectId
    })
    if (_project && _project.length === 1) {
      let _paper = _.filter(_project[0].papers, (paper) => {
        return paper.id === _paperId
      })
      if (_paper && _paper.length === 1) {
        return _paper[0]
      }
    }
    return null
  }

  getComponents(_projectId: string): Array<ComponentModel> | null {
    let _projects = this.findProjects()
    let _project = _.filter(_projects, (project) => {
      return project.id === _projectId
    })
    if (_project && _project.length === 1) {
      return _project[0].components
    }
    return null
  }

  storePaper(_projectId: string, _paper: PaperModel): void {
    let _projects = this.findProjects()
    let _project = _.filter(_projects, (project) => {
      return project.id === _projectId
    })
    if (_project && _project.length === 1) {
      let _papers = _project[0].papers
      let found = _.find(_papers, (paper) => {
        return _paper.id === paper.id
      })
      if (found) {
        found.id = _paper.id
      } else {
        _papers.push(_paper)
      }
    }
    this.storage.store('projects', _project)
  }
}
