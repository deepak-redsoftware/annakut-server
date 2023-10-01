import Counter from '../../models/counter.js';
import CrudRepository from '../../repositories/crud-repository.js';

class CounterService extends CrudRepository {
    constructor() {
        super(Counter);
    }

    async getSequenceByID(ID) {
        try {
            const counter = await Counter.findOne({id: ID}).exec();
            return counter;
        } catch (error) {
            console.error(`Error at counter service layer: ${error}`);
            throw error;
        }
    }
}

export default CounterService;