// isso pode ser usado para ter uma memoização mais eficiente na indexeddb, fazendo com que todos os dados fiquem centralizados em uma variavel (reference table) e seja acesada por um proxy quando necessário (reference array)
type ReferenceTableData = {
    [id: string]: any
}
export class ReferenceTable {
    private primary_field: string
    private data: ReferenceTableData
    constructor(primary_field: string) {
        this.primary_field = primary_field
        this.data = {}
    }
    add = (value:any) => {
        this.data[value[this.primary_field]] = value;
        return value
    }
    addMultiple = (values: any[], value_formatter?: (value:any) => any) => {
        for (const value of values) {
            this.data[value[this.primary_field]] = value;
        }
        return this.getReferenceArrayFromValues(values, value_formatter)
    }
    getReferencesFromValues = (values:any[]):string[] => {
        return values.map(value => value[this.primary_field])
    }
    getReferenceArrayFromValues = (values:any[], value_formatter?: (value:any) => any) => {
        return CreateReferenceArray(this.getReferencesFromValues(values), this, value_formatter)
    }
    get = (primary_field: string, value_formatter?: (value:any) => any) => {
        return value_formatter ? value_formatter(this.data[primary_field]) : this.data[primary_field]
    }
    clear = () => {
        this.data = {}
    }
}
/**
 * 
 * @example 
 * const ref_table = new ReferenceTable('db_id')
 * ref_table.addMultiple([
 *     { db_id: '1', p: 1 },
 *     { db_id: '2', p: 10 },
 *     { db_id: '3', p: 100 }
 * ])

 * let arr_id = ['1'] 
 * const data = CreateReferenceArray(arr_id, ref_table)

 * console.log(data[0]) // { db_id: '1', p: 1 }
 */
export function CreateReferenceArray(references:string[], reference_table:ReferenceTable, value_formatter?: (value:any) => any):Array<any> {
    const handler = {
        get: function(target:any, key:any, receiver?:any) {
            const value = Reflect.get(target, key, receiver)
            if ( typeof key === 'number' || (typeof key === 'string' && !isNaN(parseInt(key))) ) return reference_table.get(value, value_formatter);
            return value;
        }
    };

    return new Proxy(references, handler);
}