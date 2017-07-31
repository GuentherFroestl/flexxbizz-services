/**
 * Created by gfr on 07.01.17.
 */
import {DomainServiceQuery} from '@flexxbizz/generic';


/**
 * Interface for persistence CRUDL handling
 */
export interface PersistenceHandler {
    closeConnection(): void;
    queryEntities(collectionName: string, query: DomainServiceQuery): Promise<any[]>;
    saveEntity(collectionName: string, object: any): Promise<any>;
    updateEntity(collectionName: string, object: any, id: string): Promise<any>;
    getEntity(collectionName: string, id: string): Promise<any>;
    deleteEntity(collectionName: string, id: string): Promise<any>;
}
