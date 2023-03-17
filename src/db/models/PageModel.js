import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static relationMappings() {
    return {
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
            from: "pages.user_id",
            to: "users.id"
        },
      },
    }
  }
}

export default PageModel
