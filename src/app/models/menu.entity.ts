import * as _ from 'lodash';

export enum menuIds {
    default,
    project_add_new
}

export interface SysMenuMessage {
    id: menuIds;
}
