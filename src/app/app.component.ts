import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: MenuItem[] = [];

  constructor(
    private title: Title) {
    this.title.setTitle(`MySystem 1.1.0a`)
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Graph',
        icon: 'pi pi-fw pi-box',
        items: [
          { label: 'Project(s)', icon: 'pi pi-fw pi-book', routerLink: '/projects' }
        ]
      },
      {
        label: 'Misc',
        icon: 'pi pi-fw pi-cog',
        items: [
          { label: 'Preferences', icon: 'pi pi-fw pi-database', routerLink: '/preferences' },
          { label: 'Images', icon: 'pi pi-fw pi-cloud-upload', routerLink: '/converters/images' },
          { label: 'About', icon: 'pi pi-fw pi-at', routerLink: '/about' }
        ]
      }
    ];
  }
}
