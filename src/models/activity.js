export class Activity {
    constructor({ id, measureId, name, title, description, implementationStart, implementationEnd, participants } = {}) {
       this.id = id || 0;
       this.measureId = measureId || 0;
       this.name = name || '';
       this.title = title || '';
       this.description = description || '';
       this.implementationStart = implementationStart || '';
       this.implementationEnd = implementationEnd || '';
       this.participants = participants || [];       
       this.culture = 'nb-NO';
    }
 }
 