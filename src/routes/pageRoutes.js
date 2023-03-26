import PageModel from "../db/models/PageModel.js"
import {
  auth,
  isUserAdmin,
  isUserManager,
  softAuth,
} from "../middleware/auth.js"
import getCount from "../middleware/getCount.js"
import { currentUser } from "../middleware/getCurrentUser.js"
import validate from "../middleware/validate.js"
import { invalidPermissions, notFound } from "../response.js"
import { stringValidator } from "../validators.js"

const pageRoutes = ({ app }) => {
  app.get("/pages", softAuth, async (req, res) => {
    const { limit, page } = req.query
    const loggedUser = await currentUser(req)

    let query

    if (loggedUser) {
      query = PageModel.query()
    } else {
      query = PageModel.query().where({ status: true })
    }

    const record = await query.modify("paginate", limit, page)
    const count = await getCount(query)

    res.send({ meta: count, result: record })
  })

  app.get("/pages/:url_slug", auth, async (req, res) => {
    const { url_slug } = req.params

    const page = await PageModel.query().findOne({ url_slug })

    if (!page) {
      notFound(res)

      return
    }

    res.send({ page })
  })

  app.post(
    "/pages",
    validate({
      body: {
        title: stringValidator.required(),
        content: stringValidator.required(),
      },
    }),
    auth,
    async (req, res) => {
      const { title, content } = req.body
      const loggedUser = await currentUser(req)

      if (!isUserAdmin(loggedUser) && !isUserManager(loggedUser)) {
        invalidPermissions(res)

        return
      }

      const url_slug = title.replace(/[\W_ ]/g, "-")

      const page = await PageModel.query().findOne({ url_slug })

      if (page) {
        res
          .status(409)
          .send({ error: "A page with that url or title already exists" })

        return
      }

      const new_page = await PageModel.query().insertAndFetch({
        title: title,
        content: content,
        url_slug: url_slug,
        user_id: loggedUser.id,
        status: true,
      })

      res.send({ result: new_page })
    }
  )

  app.patch("/pages/:url_slug", auth, async (req, res) => {
    const {
      params: { url_slug },
      body: { title, content, status },
    } = req
    const loggedUser = await currentUser(req)
    const page = await PageModel.query().findOne({ url_slug: url_slug })

    if (!page) {
      notFound(res)

      return
    }

    let edited_by

    if (page.edited_by === null) {
      edited_by = { editors: [{ user_id: loggedUser.id, edited_at: Date() }] }
    } else {
      edited_by = {
        editors: [
          ...page.edited_by.editors,
          { user_id: loggedUser.id, edited_at: Date() },
        ],
      }
    }

    await PageModel.query()
      .update({
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
        ...(status ? { status } : {}),
        ...{ edited_by },
      })
      .where({ url_slug: url_slug })

    res.send({ result: page })
  })

  app.delete("/pages/:url_slug", auth, async (req, res) => {
    const { url_slug } = req.params
    const loggedUser = await currentUser(req)

    if (!isUserAdmin(loggedUser) && !isUserManager(loggedUser)) {
      invalidPermissions(res)

      return
    }

    const page = await PageModel.query().findOne({ url_slug: url_slug })

    if (!page) {
      notFound(res)

      return
    }

    await PageModel.query().deleteById(page.id)
    res.send({ result: page })
  })
}
export default pageRoutes
