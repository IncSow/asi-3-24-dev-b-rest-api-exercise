import hashPassword from "../methods/hashPassword.js"
import BaseModel from "./BaseModel.js"
import PageModel from "./PageModel.js"
import RoleModel from "./RoleModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static relationMappings() {
    return {
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.role_id",
          to: "roles.id"
        }
      },
      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PageModel,
        join: {
          from: "users.id",
          to: "pages.user_id"
        }
      }
    }
  }

  checkPassword = async (password) => {
    const [passwordHash] = await hashPassword(password, this.password_salt)

    return passwordHash === this.password_hash
  }
}

export default UserModel
