import { Injectable } from '@angular/core';
import { SysProject } from '../models/project.entity';
import { DatabaseEntity } from './database-entity.service';

import { NGXLogger } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends DatabaseEntity<SysProject> {

  constructor(
    private _logger: NGXLogger,
    private _storage: LocalStorageService
  ) {
    super()
    this.init("projects", this._storage, this._logger)
  }

}
