export class Measure {
    constructor({ name, owner, no } = {}) {
        this.name = name || '';
        this.owner = owner || { id: 0 };
        this.no = no || 0;
    }
}
