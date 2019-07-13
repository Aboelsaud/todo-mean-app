const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyparser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user");
var User_Now="";
var taskId="";


app.use(express.static("public"));

mongoose.connect("mongodb+srv://yousef:yousefaboalaoud123@cluster0-7v6kf.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParse: true,
	useCreareIndex: true
}).then(()=>{
	console.log("Connected To DB");
}).catch(err => {
	console.log("Error :",err.message);
});


app.use(require("express-session")({
	secret: "NICEEEE FSSH5",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.CurrentUser = req.user;
	next();
});

var TaskSchema = mongoose.Schema(
  {
    task: { type: String },
	owner: { type: String },
	User: {type: String}  
  },
  { collection: 'task' }
);

var TaskModel = mongoose.model('TaskModel', TaskSchema);

// configure app

app.use('/app', express.static(__dirname + '/app'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);

// GET request
app.get('/', isLoggedIn ,function(req, res) {
 User.find().then(
	 function(data){
	User_Now=req.user;	 
	res.render('index.ejs',{CurrentUser: req.user , User: data});
	 }
 );

});

app.get('/secret', function(req, res) {
  res.render('secret.ejs');
});

app.get("/register", function(req,res){
	res.render("register.ejs");
});

app.get("/login", function(req,res){
	res.render("login.ejs");
});

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/login");
});

function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password, function(err, User){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res, function(){
		res.redirect("/");
		});
	});
});

// Login >>>>>>>>>>>>>>>>
app.post("/login", passport.authenticate("local" ,
		{
	      successRedirect: "/",
	      failureRedirect: "/login" 
        }),function(req,res){
	res.render("login.ejs");
});



// POST request to save todo task in database
app.post('/api/create/todo', createTodo);
function createTodo(req, res) {
  var todoTask = req.body;
  //console.log(todoTask);

  //save the todoTask in db
  TaskModel.create(todoTask).then(
    function(success) {
      //console.log('Success');
    },
    function(error) {
      //console.log('Error');
    }
  );

  res.json(todoTask);
}

// GET all task
app.get('/api/get/tasks', getAllTasks);
function getAllTasks(req, res) {
   if(User_Now.username=='Admin')
	   {
			TaskModel.find().then(
			function(tasks) {
			  res.json(tasks);
			},
			function(err) {
			  res.sendStatus(400);
			}
		  );
	   }
	else
		{
			TaskModel.find({ User: User_Now.username }).then(
			function(tasks) {
			  res.json(tasks);
			},
			function(err) {
			  res.sendStatus(400);
			}
		  );
		}
  
}

// DELETE task
app.delete('/api/delete/task/:id', deleteTask);
function deleteTask(req, res) {
  var taskId = req.params.id;
  //console.log(taskId);
  TaskModel.deleteOne({ _id: mongoose.Types.ObjectId(taskId) }).then(
    function() {
      res.sendStatus(200);
    },
    function() {
      res.sendStatus(400);
    }
  );
}


app.post('/api/Assign/task', function(req,res){
	var user=req.body;
	TaskModel.updateOne({"task":taskId},{$set:{"owner" :User_Now.username , "User" : user.task}}).then(function(success){
		console.log("success");
		res.redirect("/");
	},function(error){
		console.log("Error" + error);
	}  
	);
	
  
});

app.post("/api/selected/task/:id", selectedTask);
function selectedTask(req,res){
  	 taskId = req.params.id;
}



// GET request


app.listen('3000', function() {
  console.log('Server Running!!');
});