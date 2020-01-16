const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// A unique identifier for the given session
const sessionId = uuid.v4();

app.use(express.static("views"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({
  extended:false
}))

//create route, display view
app.get("/", function(req, res){
  res.render("index");
})

app.post('/send-msg',(req, res)=>{
  runSample(req.body.MSG).then(data =>{
    res.send({Reply:data})
  })
})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */

async function runSample(msg,projectId = 'chatbot-yasbvc') {

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
      keyFilename:"C:/Users/TrangNT-GD/Downloads/chatbot-yasbvc-13d7b9f70f12.json",
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText;
}

app.listen(port,()=>{
  console.log("runnig on port" + port)
})