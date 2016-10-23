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
    serviceAccount: "Vittles-46fbefa423f8.json",
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
// app.use(session({
//   store: new FirebaseStore({
//     database: ref.database()
//   }),
//   secret: "etcetcetc",
//   resave: true,
//   saveUninitialized: false,
//   cookie: { secure: true,
//             httpOnly: true
//   }
// }))


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
app.get('/', routes.main.index )
app.get('/dish', routes.main.dish )
app.get('/editprofile', routes.main.editprofile )
app.get('/profile', routes.main.profile )
app.get('/restaurant', routes.main.restaurant)
app.get('/results', routes.main.results )
app.get('/writereview', routes.main.writereview )
app.get('/additem', routes.main.additem)
<<<<<<< HEAD

=======
>>>>>>> 49494116d21be685c8ece5ce4f40395ed9bc36dd


const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode: http://localhost:%s', app.get('port'), app.get('env'), app.get('port'));
})
