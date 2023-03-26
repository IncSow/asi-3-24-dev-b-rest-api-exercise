import navMenusRoutes from "./routes/navMenuRoutes.js"
import pageRoutes from "./routes/pageRoutes.js"
import signInRoute from "./routes/signInRoute.js"
import userRoutes from "./routes/userRoutes.js"

const prepareRoutes = (ctx) => {
  signInRoute(ctx)
  userRoutes(ctx)
  pageRoutes(ctx)
  navMenusRoutes(ctx)
}

export default prepareRoutes
