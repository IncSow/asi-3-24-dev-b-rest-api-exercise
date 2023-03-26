import PageModel from "../db/models/PageModel.js"
import auth from "../middleware/auth.js"
import { notFound } from "../response.js"

const pageRoutes = ({ app }) => {
  app.get("/pages", auth, async (req, res) => {
    const record = await PageModel.query()
      .where({ "pages.status": true })
      .select()
    res.send({ result: record })
  })

  app.get("/pages/:url_slug", auth, async (req, res) => {
    const { url_slug } = req.params

    const page = await PageModel.query().findById(url_slug)

    if (!page) {
      notFound(res)

      return
    }

    res.send({ page })
  })

  app.post("/pages", auth, async (req, res) => {
    const { title, content } = req.body
    const url_slug = title.replace(/ /g, "-")

    const new_page = await PageModel.query().insertAndFetch({
      title: title,
      content: content,
      url_slug: url_slug,
      user_id: 2,
      status: true,
    })

    res.send({ result: new_page })
  })

  app.patch("/pages/:url_slug", auth, async (req, res) => {
    const {
      params: { url_slug },
      body: { title, content, status },
    } = req
    const page = await PageModel.query().findOne({ url_slug: url_slug })

    if (!page) {
      notFound(res)

      return
    }

    let edited_by = null

    if (page.edited_by === null) {
      edited_by = { editors: [{ user_id: 2, edited_at: Date() }] }
    } else {
      edited_by = {
        editors: [...page.edited_by.editors, { user_id: 2, edited_at: Date() }],
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
