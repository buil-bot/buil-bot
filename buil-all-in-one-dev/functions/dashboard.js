const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let bot = await lib.discord.users['@0.2.0'].me.list();
let count = await lib.meiraba.utils['@1.0.1'].discord.bot_server_count({
  bot_id: `${bot.id}`,
});
let result = await lib.discord.users['@0.2.0'].me.list();
console.log(result)
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>${result.username}</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
    <link rel="stylesheet" href="node_modules/mdbootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="node_modules/mdbootstrap/css/mdb.min.css">
    <link rel="stylesheet" href="node_modules/mdbootstrap/css/style.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
    <meta property="og:site_name" content="H2Developers">
    <meta property="og:title" content="${result.username}">
    <meta property="og:url" content="#">
    <meta property="og:type" content="website">
    <meta property="og:description" content="The best discord bot !">
    <meta property="og:image" content="${result.avatar_url}">
    <link href="${result.avatar_url}" rel="icon">
<style>
  body {
    background-color: #2C2C2C;
     position: relative;
    font-family: Arial;
    color: white;
    margin: 0;
  }
  section{
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 100px 20vw;
  }
  h1{
    font-size: 40px;
    margin-top: 20px;
  }
  h3{
    text-decoration: blink;
    margin-bottom: 20px;
  }
  p{
  font-size: 20px;
  text-align: center;
  }
  #home{
   height: 800px;
  background: url('https://wallpapercave.com/wp/wp4462550.png') no-repeat;
  background-size: cover;
  background-position:center;
  }
  .botinfo{
      display: flex;
      flex-direction: row; 
      justify-content: space-evenly;
  }
  .info{
    margin: 50px;
  }
  #features{
    height: 1200px;
  }
  .f{
    display: flex;
    flex-direction: row;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    margin: 30px;
  }
  .f:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  .f .a {
    margin: 30px;
  }
  .f .d{
    margin: 30px;
  }
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }
   
  
  ::-webkit-scrollbar-thumb {
    background: #888; 
  }
  
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  #commands {
    height: 1100px;
  }
  
  .card {
    width: 500px;
    margin-top: 60px;
  }
  .card-body{
    color: black;
  }
  button {
    color: #ffffff;
    background-color: #2d63c8;
    font-size: 19px;
    border: 1px solid #2d63c8;
    padding: 15px 50px;
    cursor: pointer
  }
  button:hover {
    color: #2d63c8;
    background-color: #ffffff;
  }
  .alert{
    margin: 60px;
  }
  .etn  {
      padding: 15px 100px;
      margin:10px 4px;
      color: #fff;
      text-align: center;
      position: relative;
      text-decoration: none;
      display:inline-block;
    }
    .etn::before {
      content: '';
      position: absolute;
      bottom: 0%;
      left: 0px;
      width: 100%;
      height: 1px;
      background: #6098FF;
      display: block;
      -webkit-transform-origin: right top;
      -ms-transform-origin: right top;
      transform-origin: right top;
      -webkit-transform: scale(0, 1);
      -ms-transform: scale(0, 1);
      transform: scale(0, 1);
      -webkit-transition: transform 0.4s cubic-bezier(1, 0, 0, 1);
      transition: transform 0.4s cubic-bezier(1, 0, 0, 1)
    }
    
    .etn:hover::before {
      -webkit-transform-origin: left top;
      -ms-transform-origin: left top;
      transform-origin: left top;
      -webkit-transform: scale(1, 1);
      -ms-transform: scale(1, 1);
      transform: scale(1, 1)
    }
  
  .baton a{
      color:white;
      font-size: 20px;
      text-decoration: none;
  }
  
  .ending {
    background: url('https://media.discordapp.net/attachments/941577395922694184/944119357724852274/layered-peaks-haikei.png') no-repeat;
    background-size: 1530px 400px;
    background-position:center;
      position: absolute;
      top: 0px;
      bottom: 0;
      left: 0;
      right: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 20vw;
    font-family: sans-serif;
    color:white;
    text-decoration: none;
  }
  
</style>
  </head>
  <body>
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <script type="text/javascript" src="node_modules/mdbootstrap/js/jquery.min.js"></script>
  <script type="text/javascript" src="node_modules/mdbootstrap/js/popper.min.js"></script>
  <script type="text/javascript" src="node_modules/mdbootstrap/js/bootstrap.min.js"></script>
  <nav id="navbar-example2" class="navbar navbar-dark bg-#1D1F23">
    <a class="navbar-brand" href="#">Bot dashboard</a>
    <ul class="nav nav-pills">
      <li class="nav-item">
        <a class="nav-link" href="#home">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#features">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#commands">Commands</a>
      </li>
    </ul>
  </nav>
  <section id="home">
  <img src="${result.avatar_url}" style="border-radius: 50%;"></img>
  <h1>${result.username}</h1>
  <div class="baton">
    <a href="https://discord.com/api/oauth2/authorize?client_id=${result.id}&permissions=545394785527&scope=bot" class="etn">
     Invite
   </a>
     <a href="https://discord.gg/UhThVBWWqA" class="etn">
     Discord server
   </a>
  </div>
  </div>
  <div class="botinfo">
  <div class="info">
  <h2>Servers</h2>
  <p>${count}</p>
  </div>
  <div class="info">
  <h2>Users</h2>
  <p>100+</p>
  </div>
  <div class="info">
  <h2>Status</h2>
  <p><i class="fas fa-circle" style="font-size:24px;color:green;"></i> Online</p>
  </div>
  </div>
  </section>
  <section id="features">
  <div class="f">
  <div class="a">
  <h3>Moderation</h3>
  <h4>Whatever moderation stuff you want to  write </h4>
  </div>
  <div class="b">
  <img src="https://media.discordapp.net/attachments/941577395922694184/943364263987249192/unknown.png">
  </div>
  </div>
  <div class="f">
  <div class="c">
  <img src="https://media.discordapp.net/attachments/941577395922694184/943497005970370570/unknown.png" width="588px" height="219px">
  </div>
  <div class="d">
  <h3>Economy</h3>
  <h4>Whatever economy stuff you want to write </h4>
  </div>
  </div>
  <div class="f">
  <div class="a">
  <h3>Music</h3>
  <h4>Whatever music stuff you want to  write </h4>
  </div>
  <div class="b">
  <img src="https://media.discordapp.net/attachments/941577395922694184/943498801061195837/unknown.png" width="588px" height="219px">
  </div>
  </div>
  <div class="f">
  <div class="c">
  <img src="https://media.discordapp.net/attachments/941577395922694184/943502320610709544/unknown.png" width="588px" height="219px">
  </div>
  <div class="d">
  <h3>Level</h3>
  <h4>Whatever level stuff you want to write </h4>
  </div>
  </div>
  </section>
  <section id="commands">
  <h1>Commands</h1>
  <div id="accordion">
    <div class="card">
      <div class="card-header" id="headingOne">
        <h5 class="mb-0">
          <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Moderation Commands
          </button>
        </h5>
      </div>
  
      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
        <div class="card-body">
         1. kick [user] [reason] - kick a member from the server. <br>
         2. ban [user] [reason] - ban a member from the server. <br>
         3. mute [user] [reason] - mute a member in the server. <br>
         4. report - report a member in the server. <br>
         5. warn [user] [reason] - warn a member in the server
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header" id="headingTwo">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            Economy Commands
          </button>
        </h5>
      </div>
      <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
        <div class="card-body">
          1. start - start playing the game.<br>
          2. balance [user] - check your balance or someone else's.<br>
          3. give [user] [amount] - give coins to someone.<br>
          4. deposite [amount] - add coins into your bank.<br>
          5. withdraw [amount] - take coins from your bank.<br>
          6. find - find money from some place.<br>
          7. rob [user] - rob someone is the server.<br>
          8. leaderboard - check the leaderboard.
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header" id="headingThree">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            Music Commands
          </button>
        </h5>
      </div>
      <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
        <div class="card-body">
          1.play [name]/[link] - plays the music of the name/link provided in the VC you the user is present in.<br>
          2.pause - pauses the music.<br>
          3.resume  - resumes the music.<br>
          4.skip - skips the music and plays the next one in the queue.<br>
          5.disconnect - disconnects form the VC.<br>
          6.queue - queues the list of musics provided.
        </div>
      </div>
    </div>
     <div class="card">
      <div class="card-header" id="headingFour">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
            Setup Commands
          </button>
        </h5>
      </div>
      <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
        <div class="card-body">
          1. setprefix [prefix] - set a custom prefix for the server.<br>
          2. setmuterole [role] - set a mute role for the server.<br>
          3. setwelcomechannel [channel] - set a welcome channel for the server.<br>
          4. setlogchannel [channel] - set a log channel for the server.
        </div>
      </div>
    </div>
     <div class="card">
      <div class="card-header" id="headingFive">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
            Level Commands
          </button>
        </h5>
      </div>
      <div id="collapseFive" class="collapse" aria-labelledby="headingFive" data-parent="#accordion">
        <div class="card-body">
          1. level [user] - check your level or someone else's.<br>
          2. leaderboard check the leaderboard.
        </div>
      </div>
    </div>
  </div>
  </div>
  <div class="alert alert-info" role="alert">
   Note: These are both prefix and slash commands
  </div>
  </section>
  <section class="ending" id="contact">
    <p>
         <a href="#">Discord</a> <a href="#">Twitter</a>
      </p>
      <p>&#169;2022 H2 Developers</p>
  </section>
  </body>
</html>


`
return {
    statusCode: 200,
    headers: {'Content-type' : 'text/html'},
    body: html
  }
