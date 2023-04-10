import { Component, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { MenuService } from './services/menu.service';
import { menuIds } from './models/menu.entity';
import { selectMenu } from './stores/menu.selectors';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { ProjectService } from './services/project.service';
import { v4 as uuidv4 } from 'uuid';
import { retrievedProjects } from './stores/projects.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  items: MenuItem[] = [];
  subscriptions: any = [];

  menu$ = this.store.select(selectMenu);

  constructor(
    public title: Title,
    private projectsService: ProjectService,
    private logger: NGXLogger,
    private store: Store,
    private menuService: MenuService) {
    this.title.setTitle('MyHouse 1.0.0')

    this.subscriptions.push(
      this.menu$.subscribe(_menu => {
        if (!_menu) {
          return
        }
        this.logger.info(_menu)

        switch (_menu.id) {
          case menuIds.project_add_new:
            this.projectsService.store({
              id: uuidv4(),
              label: "default"
            }, (entity) => {
              entity.label = "default"
            })
            // Dispatch new values
            let entities = this.projectsService.findAll()
            this.store.dispatch(retrievedProjects({ projects: entities }))
            break
        }
      })
    )
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Components',
        icon: 'pi pi-fw pi-box',
        items: [
          {
            label: 'New Project ...', icon: 'pi pi-fw pi-book', command: () => {
              this.menuService.dispatch(menuIds.project_add_new)
            }
          },
          { label: 'Project(s)', icon: 'pi pi-fw pi-book', routerLink: '/projects' },
          { label: 'Shape(s)', icon: 'pi pi-fw pi-book', routerLink: '/shapes' }
        ]
      },
    ];
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      _.each(this.subscriptions, (subscription) => {
        subscription.unsubscribe();
      })
    }
  }
}
