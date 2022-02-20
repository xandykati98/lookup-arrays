import { ReferenceTable, CreateReferenceArray } from "../reference-memo-arrays";


const data = [
    { db_id: 'id#1', prop1: 1, prop2: [ { x: 100 } ], prop3: { x: 10 } },
    { db_id: 'id#2', prop1: 2, prop2: [ { x: 200 } ], prop3: { x: 20 } },
    { db_id: 'id#3', prop1: 3, prop2: [ { x: 300 } ], prop3: { x: 30 } }
]

const ref_table = new ReferenceTable('db_id')

test('Basic ReferenceTable', () => {
    const ref_array = ref_table.addMultiple(data)
    
    for (let i = 0; i < ref_array.length; i++) {
        expect(ref_array[i]).toBe(data[i]);
    }
});


test('Basic CreateReferenceArray', () => {
    
    expect(CreateReferenceArray(data.map(item => item.db_id), ref_table)).toStrictEqual(data);
});