import { Model } from "objection"

class BaseModel extends Model {
  static modifiers = {
    paginate: (query, limit = 20, page = 1) => {
      return query.limit(limit).offset((page - 1) * limit)
    },
  }
}

export default BaseModel
