export class Measure {
    constructor({ name, owner, no, infoUrl } = {}) {
        this.name = name || '';
        this.infoUrl = infoUrl || '';
        this.owner = owner || { id: 0 };
        this.no = no || 0;
    }
}
