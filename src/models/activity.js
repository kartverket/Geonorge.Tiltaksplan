export class Activity {
    constructor({ id, measureId, no, name, description, implementationStart, implementationEnd, status, participants } = {}) {
       this.id = id || 0;
       this.measureId = measureId || 0;
       this.name = name || '';
       this.description = description || '';
       this.implementationStart = implementationStart;
       this.implementationEnd = implementationEnd;
       this.participants = participants || [];
       this.status = status || 1;
       this.no = no || 0;
       this.culture = 'nb-NO';
    }
 }
 