import { LocalStorageService } from 'ngx-webstorage';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { SysEntity } from '../models/entity.model';

export class DatabaseEntity<T extends SysEntity> {

  private storage!: LocalStorageService
  private logger!: NGXLogger
  private selector!: string

  init(
    _selector: string,
    _storage: LocalStorageService,
    _logger: NGXLogger
  ) {
    this.storage = _storage
    this.logger = _logger
    this.selector = `my-system-${_selector}`

    let _datas = this.findAll()
    if (!_datas) {
      this.storage.store(this.selector, [])
    }
  }

  findOne(_id: string): T | undefined {
    let _datas = this.findAll()
    let found = _.find(_datas, (data) => {
      return _id === data.id
    })
    if (found) {
      this.logger.info(`${this.selector} FINDONE`, found)
      return found
    }
    return undefined
  }

  delete(_id: string): Array<T> {
    let _datas = this.findAll()
    _.remove(_datas, (data) => {
      return _id === data.id
    })
    this.storage.store(this.selector, _datas)
    this.logger.info("DELETE", _id)
    return _datas
  }

  store(_data: T, callback: (item: T) => void): Array<T> {
    let _datas = this.findAll()
    let found = _.find(_datas, (data) => {
      return _data.id === data.id
    })
    if (found) {
      found.id = _data.id
      callback(found)
      this.logger.info("STORE/UPDATE", found)
    } else {
      _datas.push(_data)
      this.logger.info("STORE/INSERT", _data)
    }
    this.storage.store(this.selector, _datas)
    return _datas
  }

  findAll(): Array<T> {
    let _data = this.storage.retrieve(this.selector)
    if (_data) {
      let result = JSON.parse(JSON.stringify(_data))
      this.logger.info(`${this.selector} FINDALL`, result)
      return result
    }
    this.storage.store(this.selector, [])
    return []
  }

  reset(): Array<T> {
    this.logger.info("RESET", this.selector)
    this.storage.store(this.selector, [])
    return []
  }
}
