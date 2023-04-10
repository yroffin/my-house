import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { ShapeComponent } from './components/shape/shape.component';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { SplitterModule } from 'primeng/splitter';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { ListboxModule } from 'primeng/listbox';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DockModule } from 'primeng/dock';
import { AvatarModule } from 'primeng/avatar';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ShapesComponent } from './components/shapes/shapes.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectComponent } from './components/project/project.component';
import { projectReducer, projectsReducer } from './stores/projects.reducer';
import { menuReducer } from './stores/menu.reducer';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    ShapeComponent,
    ShapesComponent,
    ProjectsComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG
    }),
    // PrimeNg
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    InputSwitchModule,
    SplitterModule,
    MenubarModule,
    FormsModule,
    TagModule,
    TabViewModule,
    OverlayPanelModule,
    TreeModule,
    TreeTableModule,
    ToastModule,
    ListboxModule,
    SidebarModule,
    CardModule,
    AccordionModule,
    DockModule,
    AvatarModule,
    CheckboxModule,
    PanelModule,
    TooltipModule,
    ToggleButtonModule,
    FieldsetModule,
    DividerModule,
    BadgeModule,
    ConfirmPopupModule,
    StoreModule.forRoot({
      projects: projectsReducer,
      project: projectReducer,
      menu: menuReducer
    })
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
