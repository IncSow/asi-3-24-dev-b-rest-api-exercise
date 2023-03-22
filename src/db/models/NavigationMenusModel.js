import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class NavigationMenuModel extends BaseModel {
  static tableName = "navigation_menus"

  static relationMappings() {
    return {
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.user_id",
          to: "users.id",
        },
      },
    }
  }
}

export default NavigationMenuModel
