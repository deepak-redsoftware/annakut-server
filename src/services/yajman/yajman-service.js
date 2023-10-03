import Yajman from "../../models/yajman.js";
import { CrudRepository } from "../../repositories/index.js";

class YajmanService extends CrudRepository {
  constructor() {
    super(Yajman);
  }
}

export default YajmanService;
