// function Store(initialState = {}) {
//     this.state = initialState;
// }
//
// Store.prototype.mergeState = function (partialState) {
//     Object.assign(this.state, partialState);
// };
//
// Store.prototype.getState = function () {
//     return this.state;
// };

class Store {
    constructor() {
        this.state = {}
    }

    getState() {
        return this.state;
    }

    mergeState(partialState) {
        Object.assign(this.state, partialState);
    }
}

export default Store;
