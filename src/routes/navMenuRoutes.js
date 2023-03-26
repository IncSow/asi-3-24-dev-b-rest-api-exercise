import { stringValidator } from "../validators.js"
import PageModel from "../db/models/PageModel.js"
import { invalidPermissions, notFound } from "../response.js"
import { currentUser } from "../middleware/getCurrentUser.js"
import { auth, isUserAdmin, isUserManager } from "../middleware/auth.js"
import getCount from "../middleware/getCount.js"
import validate from "../middleware/validate.js"
import NavigationMenuModel from "../db/models/NavigationMenusModel.js"

const getMissingPagesFromList = async (pageList) => {
  const allPages = await (
    await PageModel.query().findByIds(pageList).select("id")
  ).map(({ id }) => id)

  return pageList.filter((v) => !allPages.includes(v))
}

const navMenusRoutes = ({ app }) => {
  app.get("/navs", async (req, res) => {
    const { limit, page, orderField, order, nameFilter } = req.query
    const query = NavigationMenuModel.query().modify("paginate", limit, page)

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (nameFilter) {
      query.where("name", "like", `%${nameFilter}%`)
    }

    const count = await getCount(query)
    const navMenus = await query

    res.status(200).send({
      result: navMenus,
      count: count,
    })
  })

  app.post(
    "/navs",
    auth,
    validate({
      body: {
        name: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const { name, pages } = req.body
      const { pageList } = JSON.parse(pages)
      const loggedUser = await currentUser(req)

      if (!isUserAdmin(loggedUser) && !isUserManager(loggedUser)) {
        invalidPermissions(res)

        return
      }

      const navMenu = await NavigationMenuModel.query().findOne({ name })

      if (navMenu) {
        res.status(409).send({
          error: "Another ressource already exists with that name!",
        })

        return
      }

      const missingPages = await getMissingPagesFromList(pageList)

      if (missingPages.length !== 0) {
        res.status(400).send({
          error: `No page(s) with the id : ${missingPages}`,
        })

        return
      }

      const newNavMenu = await NavigationMenuModel.query()
        .insertAndFetch({
          name: name,
          hierarchical: JSON.stringify(pageList),
        })
        .returning("*")

      res.send({
        result: newNavMenu,
      })
    }
  )

  app.get("/navs/:navId", async (req, res) => {
    const {
      params: { navId },
    } = req

    const findNavMenu = await NavigationMenuModel.query().findById(navId)

    if (!findNavMenu) {
      notFound(res)

      return
    }

    res.status(200).send({
      result: findNavMenu,
    })
  })

  app.patch("/navs/:navId", auth, async (req, res) => {
    const {
      params: { navId },
      body: { name, pages },
    } = req

    const { pageList } = JSON.parse(pages)
    const loggedUser = await currentUser(req)

    if (!isUserAdmin(loggedUser) && !isUserManager(loggedUser)) {
      invalidPermissions(res)

      return
    }

    const findNavMenu = await NavigationMenuModel.query().findById(navId)

    if (!findNavMenu) {
      notFound(res)

      return
    }

    const missingPages = await getMissingPagesFromList(pageList)

    if (missingPages.length !== 0) {
      res.status(400).send({
        error: `No page(s) with the id : ${missingPages}`,
      })

      return
    }

    const updatedNavMenu = await NavigationMenuModel.query()
      .update({
        ...(name ? { name } : {}),
        ...(pageList ? { hierarchical: JSON.stringify(pageList) } : {}),
      })
      .where({ id: req.params.navId })
      .returning("*")

    res.status(200).send({
      result: updatedNavMenu,
    })
  })

  app.delete("/navs/:navId", auth, async (req, res) => {
    const { navId } = req.params
    const loggedUser = await currentUser(req)

    if (!isUserAdmin(loggedUser) && !isUserManager(loggedUser)) {
      invalidPermissions(res)

      return
    }

    const navMenu = await NavigationMenuModel.query().findById(navId)

    if (!navMenu) {
      notFound(res)

      return
    }

    await NavigationMenuModel.query()
      .delete()
      .where({ id: navId })
      .returning("*")

    res.status(200).send({
      result: navMenu,
    })
  })
}

export default navMenusRoutes
