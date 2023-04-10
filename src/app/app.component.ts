import { Component, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'my-house';

  items: MenuItem[] = [];
  subscriptions: any = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Components',
        icon: 'pi pi-fw pi-box',
        items: [
          { label: 'Shape(s)', icon: 'pi pi-fw pi-book', routerLink: '/shapes' }
        ]
      },
    ];
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
