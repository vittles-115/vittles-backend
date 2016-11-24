const express = require("express")
const session = require("express-session")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const errorHandler = require("error-handler")
const ejs = require("ejs")
const firebase = require("firebase")
const FirebaseStore = require("connect-session-firebase")(session)

const ref = firebase.initializeApp({
    serviceAccount: "vittles-46fbefa423f8.json",
    databaseURL: "https://vittles-1c0fb.firebaseio.com/"
});

dotenv.load({path: '.env'})

const app = express()

const routes = {
    functions: require("./routes/functions.js"),
    test: require("./routes/test.js"),
    main: require("./routes/main.js"),
    auth: require("./routes/auth.js")
}

app.set('port', process.env.PORT || 8080);

app.set('views', './views')
app.set('view engine', 'ejs')
app.enable('trust proxy')
app.set('trust proxy', 1)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static('./public'))
app.use(session({
  store: new FirebaseStore({
    database: ref.database()
  }),
  secret: "vittlesapproolz",
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false,
            maxAge: 2592000000,
            httpOnly: false
  }
}))


app.use(function(req, res, next) {
  res.successT = function(data) {
    data = data || {}
    data.success = true
    res.json(data)
  }

  res.errorT = function(error) {
    error = error.description || error

    res.json({
      success: false,
      status: 1,
      message: error
    })
  }

  res.renderT = function(template, data) {
    data = data || {}
    data.host = req.protocol + "://" + req.hostname
    data.url = data.host + req.url
    data.template = data.template || template
    data.random = Math.random().toString(36).slice(2)
    res.render(template, data)
  }

  next()
})


// GET REQUESTS (Page rendering, redirects, other non-database-modifying functions)
app.get('/', routes.functions.auth, routes.main.index )
app.get('/dish/:dish', routes.functions.auth, routes.main.dish )

app.get('/editprofile', routes.functions.auth, routes.main.editprofile )
app.get('/profile', routes.functions.auth, routes.main.profile )
app.get('/restaurant/:restaurant', routes.functions.auth, routes.main.restaurant)
app.get('/results', routes.functions.auth, routes.main.results )
app.get('/writereview', routes.functions.auth, routes.main.writereview, routes.main.index )
app.get('/additem', routes.functions.auth, routes.main.additem, routes.main.restaurant)
app.get('/register', routes.functions.auth, routes.main.register)
app.get('/logout', routes.functions.auth, routes.functions.logout )
app.get('/signin', routes.functions.auth, routes.main.signin)


// GET REQUEST FOR DATA
app.get('/search', routes.main.results )
app.get('/getReviewData', routes.functions.getReviewData )


app.post('/newFavDish', routes.functions.auth,routes.functions.addFavDish)
app.post('/newFavRes', routes.functions.auth,routes.functions.addFavRes)
app.post('/newUser', routes.functions.createUser, routes.main.profile)
app.post('/newItem', routes.functions.auth, routes.functions.addItem, routes.main.restaurant)
app.post('/newSearch', routes.main.results)
app.post('/newReview', routes.functions.auth, routes.functions.addReview, routes.main.dish)
app.post('/validateUser', routes.functions.validateUser )
app.post('/updateProfile', routes.functions.auth, routes.functions.updateProfile)

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode: http://localhost:%s', app.get('port'), app.get('env'), app.get('port'));
})
