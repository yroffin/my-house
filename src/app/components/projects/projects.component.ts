import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

import { SysProject } from 'src/app/models/project.entity';
import { ProjectService } from 'src/app/services/project.service';
import { selectProject, selectProjects } from 'src/app/stores/projects.selectors';

import { NGXLogger } from 'ngx-logger';
import { retrievedProjects } from 'src/app/stores/projects.actions';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnDestroy, OnInit {
  project!: SysProject
  projects!: SysProject[]

  project$ = this.store.select(selectProject);
  projects$ = this.store.select(selectProjects);

  subscriptions: any = [];

  constructor(
    private router: Router,
    private logger: NGXLogger,
    private projectsService: ProjectService,
    private confirmationService: ConfirmationService,
    private store: Store) {
    this.subscriptions.push(
      this.project$.subscribe(_project => {
        if (!_project) {
          return
        }
        this.project = _project
      })
    )
    this.subscriptions.push(
      this.projects$.subscribe(_projects => {
        if (!_projects) {
          return
        }
        this.projects = _.map(_projects, (project) => {
          return {
            id: project.id,
            label: project.label
          }
        });
        this.logger.info(this.projects)
      })
    )
  }

  ngOnInit(): void {
    let entities = this.projectsService.findAll()
    this.store.dispatch(retrievedProjects({ projects: entities }))
  }

  open(project: SysProject): void {
    this.router.navigate(['projects', project.id])
  }

  delete(event: any, project: SysProject): void {
    this.logger.info(event)
    this.confirmationService.confirm({
      target: event.target || undefined,
      message: 'Are you sure that you want to proceed ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.logger.info(project)
        this.projectsService.delete(project.id)
        let entities = this.projectsService.findAll()
        this.store.dispatch(retrievedProjects({ projects: entities }))
      },
      reject: () => {
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      _.each(this.subscriptions, (subscription) => {
        subscription.unsubscribe();
      })
    }
  }
}
