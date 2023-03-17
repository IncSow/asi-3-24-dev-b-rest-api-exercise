import PageModel from "../db/models/PageModel.js"

const pageRoutes = ({ app, db }) => {
  app.get("/pages", async (res) => {
    const record = await PageModel.query()
      .where({ "pages.status": true })
      .select()
    res.send({ result: record })
  })

  app.get("/pages/:pageId", async (req, res) => {
    const { pageId } = req.params

    const page = await PageModel.query().findById(pageId)

    if (!page) {
      res.status(404).send({ error: "Not pages where found with that id" })

      return
    }

    res.send({ page })
  })

  //   app.post("/pages", async (req, res) => {

  //   })
}

export default pageRoutes
