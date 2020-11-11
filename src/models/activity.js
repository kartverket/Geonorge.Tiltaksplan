export class Activity {
    constructor({ id, name, title, description, implementationStart, implementationEnd, participants } = {}) {
       this.id = id || 0;
       this.name = name || '';
       this.title = title || '';
       this.description = description || 0;
       this.implementationStart = implementationStart || 1;
       this.implementationEnd = implementationEnd || 1;
       this.participants = participants || '';       
       this.culture = 'nb-NO';
    }
 }
 