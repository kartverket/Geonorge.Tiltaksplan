export class Activity {
    constructor({ id, measureId, name, description, implementationStart, implementationEnd, participants } = {}) {
       this.id = id || 0;
       this.measureId = measureId || 0;
       this.name = name || '';
       this.description = description || '';
       this.implementationStart = implementationStart || null;
       this.implementationEnd = implementationEnd || null;
       this.participants = participants || [];       
       this.culture = 'nb-NO';
    }
 }
 