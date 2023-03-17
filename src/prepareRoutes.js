import pageRoutes from "./routes/pageRoutes.js"
import signInRoute from "./routes/signInRoute.js"
import signUpRoute from "./routes/signUpRoute.js"
import userRoutes from "./routes/userRoutes.js"

const prepareRoutes = (ctx) => {
  signUpRoute(ctx)
  signInRoute(ctx)
  userRoutes(ctx)
  pageRoutes(ctx)
}

export default prepareRoutes
