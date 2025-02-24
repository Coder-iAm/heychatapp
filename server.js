const express = require("express");
const fs = require("fs");
const app = express();
const session=require("express-session");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
   secret:"219da42d530540c8b8a241545283ad01a9e2917de05799671b29fd374c33f14c",
   resave:false,
   saveUninitialized:true,
   cookie:{secure:false}
}));



app.get("/", (req, res) => {
   res.sendFile(__dirname + "/user_login.html");

})
app.get("/style.css",(req,res)=>{
   res.sendFile(__dirname + "/style.css");
})



app.post("/login-data",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
    const dc = JSON.parse(data);
    
    let userFound = false;

    for(let i=0; i<dc.length; i++){
      if(dc[i].username==username && dc[i].password==password){
         req.session.user=username;
         userFound=true;
         break;
      }
    }
    if(userFound){
      res.redirect("/dashboard");
    }
    else{
      res.status(200).send("user not found");
    }

})



app.get("/dashboard",(req,res)=>{

   if(req.session.user){
   res.sendFile(__dirname+"/user_dashboard.html");
   
   }
   else{
      res.redirect("/");
   }
})



app.get("/user-profiles-dash",(req,res)=>{


     if(req.session.user){
      const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
      const dc = JSON.parse(data);
      const username=req.session.user;
      for(let i=0;i<dc.length; i++){

         if(dc[i].username==username){
        
         
            res.send(dc[i]);
            
            break;
         }

      }
     
      
     }
     else{
      res.redirect("/");
   }
     

})

app.post("/enter-user-chat",(req,res)=>{

   if(req.session.user){

      const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
      const dc = JSON.parse(data);
      const username=req.session.user;
      for(let i=0;i<dc.length; i++){

         if(dc[i].username==username){
        
            const cusername=req.body.cusername;
         
            res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <title>HeyChat</title>

   
</head>

<body>
    <div id="container_Chatting">
      <div id="Headline"><h2 id="hey">Hey </h2><h2 id="chat">Chat!🙋‍♂️</h2></div>
       <div id="userico2">
        <div id="uc1">
        <span id="userchat2"><i class="fa fa-user" id="fafauser2" aria-hidden="true"></i> ${cusername}<i id="fafauserdot" class="fa fa-circle" aria-hidden="true"></i></span>
      </div>
      <div id="uc2"><i class="fa fa-bars" id="fafamenubar" aria-hidden="true"></i></div>
      </div>

      <div id="myprofilediv2" style="display: none;">
        <a href="/dashboard"><i class="fa fa-angle-right"></i><button id="back">back</button></a>
        <a ><i class='fas fa-comment-slash'></i><button id="dchat">delete chat</button></a>
        <a ><i class="fa fa-trash" aria-hidden="true"></i></i><button id="duser">delete user</button></a>
      </div>

      <div id="userenv">
        
       
      </div>

      <div id="inputmess"><input type="text" id="usermessagesend" required> <button id="sendbtn"><i class='fa fa-paper-plane' style='font-size:20px'></i></button></div>
       </div>

    <script>
document.addEventListener("DOMContentLoaded",()=>{


  function chatload() {
    const cusername=document.getElementById("userchat2").textContent.trim();
    console.log(cusername);
 fetch("/chat-load",{
  method:"POST",
  headers:{
    "Content-Type": "application/json" 
  },
  body:JSON.stringify({cusername})
 })
 
 .then(response=>response.json())
 .then(data=>{

let userenv=document.getElementById("userenv");
userenv.innerHTML="";
  for(let i=0;i<data.length;i++){
    let message=data[i];

           if (message.includes("//user//:")){
            let newmess=message.replace("//user//:"," ");
            userenv.innerHTML+='<div id="userchatdiv"><span id="userchattext">'+newmess+'</span></div>'
            
            
           }
           else{
            let newmess=message.replace("//me//:"," ");
            userenv.innerHTML+='<div id="mychatdiv"><span id="mychattext">'+newmess+'</span></div>';
           }

  }

  userenv.scrollTop = userenv.scrollHeight;
 })
 .catch(error=>{
  console.log("no mess fnd");
 })
}


      setInterval(chatload,2000);


      document.getElementById("sendbtn").addEventListener("click",()=>{

        const umessage=document.getElementById("usermessagesend");
        const usermessage=umessage.value;
        umessage.value="";
        const cusername=document.getElementById("userchat2").textContent.trim();
    

 fetch("/chat-sending",{
  method:"POST",
  headers:{
    "Content-Type": "application/json" 
  },
  body:JSON.stringify({usermessage,cusername})
 })
 .catch(error=>{

  console.log("error sending message!");
 })
 

      })


})
    

document.getElementById("fafamenubar").addEventListener("click",()=>{
              const mydiv=document.getElementById("myprofilediv2"); 
              const icon = document.getElementById("fafamenubar");

            if(mydiv.style.display=="none"){
              mydiv.style.display="flex";
              icon.classList.remove("fa-bars");
              icon.classList.add("fa-x");
            }
            else{
              mydiv.style.display="none";
              icon.classList.remove("fa-x");
              icon.classList.add("fa-bars");
              
            }

      })

      document.getElementById("dchat").addEventListener("click",()=>{

const cusername=document.getElementById("userchat2").textContent.trim();


fetch("/delete-chat",{
method:"POST",
headers:{
"Content-Type": "application/json" 
},
body:JSON.stringify({cusername})
})
.then(response=>response.json())
.then(data=>{
   if(data.message=="ok"){
    
   }
})
.catch(error=>{

console.log("error sending message!");
})

})

document.getElementById("duser").addEventListener("click",()=>{

const cusername=document.getElementById("userchat2").textContent.trim();


fetch("/delete-user",{
method:"POST",
headers:{
"Content-Type": "application/json" 
},
body:JSON.stringify({cusername})
})
.then(response=>response.json())
.then(data=>{
   if(data.message=="ok"){
    window.location.href="/dashboard";
   }
})
.catch(error=>{

console.log("error sending message!");
})

})
   
    </script>
</body>

</html>`);
            
         }

      }
     
      
     }
     else{
      res.redirect("/");
   }
   
})




app.post("/chat-load",(req,res)=>{


   if(req.session.user){
   
    const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
    const dc = JSON.parse(data);
    const username=req.session.user;
    for(let i=0;i<dc.length; i++){

       if(dc[i].username==username){
      
         
         const cusername=req.body.cusername;
      
       
          res.send(dc[i][cusername]);
          break;
       }

    }
   
    
   }
   else{
    res.redirect("/");
 }
   

})




app.post("/chat-sending", (req, res) => {
   if (!req.session.user) {
     return res.redirect("/");
   }
 
   const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
   let dc = JSON.parse(data);
   const username = req.session.user; 
   const cusername = req.body.cusername; 
   const usermessage = req.body.usermessage;
 
   let senderUpdated = false;
   let receiverUpdated = false;
 
   
   for (let i = 0; i < dc.length; i++) {
     if (dc[i].username === username) {
       if (!dc[i][cusername]) {
         dc[i][cusername] = []; 
       }
       dc[i][cusername].push("//me//:" + usermessage);
       senderUpdated = true;
       break;
     }
   }
 
   
   for (let i = 0; i < dc.length; i++) {
     if (dc[i].username === cusername) {
       if (!dc[i][username]) {
         dc[i][username] = []; 
       }
       dc[i][username].push("//user//:" + usermessage);
       receiverUpdated = true;
       break;
     }
   }
 
   
   if (senderUpdated && receiverUpdated) {
     fs.writeFileSync(__dirname + "/user.json", JSON.stringify(dc, null, 2), "utf-8");
   }
 
   res.status(200).send("Message Sent Successfully");
 });


app.get("/connect-user",(req,res)=>{

   res.sendFile(__dirname+"/connect_user.html");
})

app.post("/connect-user-data",(req,res)=>{

   if (req.session.user) {
      
      const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
      const dc = JSON.parse(data);
      const cusername=req.body.cusername;
      const username=req.session.user;
      let found=false;
      
      for(let i=0;i<dc.length; i++){
  
         if(dc[i].username==cusername){
          found=true;
           break;
         }
  
      }
      
      if(!found){
       return  res.json({message:"no"});
      }
    
  
      for(let i=0;i<dc.length; i++){
  
         if(dc[i].username==username){
        
           
            dc[i][cusername] = ["//me//:Start chatting!"];
      
            fs.writeFileSync(__dirname + "/user.json", JSON.stringify(dc, null, 2), "utf-8");
            return  res.json({message:"redirect"});
            

         }
  
      }
   


    }
    else{
    return  res.redirect("/");
    }

})


app.get("/create-account",(req,res)=>{

   res.sendFile(__dirname+"/user_signup.html");

})

app.post("/create-account-data",(req,res)=>{

   const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
   const dc = JSON.parse(data);
   const username=req.body.username;
   const name=req.body.name;
   const password=req.body.password;

   for(let i=0;i<dc.length; i++){

      if(dc[i].username==username){
     
         return res.json({message:"yes"});
         break;
      }

   }

   const newuser = { name:name,username:username, password: password };
   dc.push(newuser);
fs.writeFileSync(__dirname + "/user.json", JSON.stringify(dc, null, 2), "utf-8");
  
return res.json({message:"redirect"});

})


app.post("/delete-chat",(req,res)=>{
   if(req.session.user){
   
      const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
      const dc = JSON.parse(data);
      const username=req.session.user;
      for(let i=0;i<dc.length; i++){
  
         if(dc[i].username==username){
        
           
           const cusername=req.body.cusername;
           dc[i][cusername]=[];
           fs.writeFileSync(__dirname + "/user.json", JSON.stringify(dc, null, 2), "utf-8");
            res.json({message:"ok"});
            break;
         }
  
      }
     
      
     }
     else{
      res.redirect("/");
   }
     
})


app.post("/delete-user",(req,res)=>{
   if(req.session.user){
   
      const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
      const dc = JSON.parse(data);
      const username=req.session.user;
      for(let i=0;i<dc.length; i++){
  
         if(dc[i].username==username){
        
           
           const cusername=req.body.cusername;
           delete dc[i][cusername];

           fs.writeFileSync(__dirname + "/user.json", JSON.stringify(dc, null, 2), "utf-8");
            res.json({message:"ok"});
            break;
         }
  
      }
     
      
     }
     else{
      res.redirect("/");
   }
     
})


app.listen(3000, () => {
   console.log("Server is running on https://localhost/3000");
})







/*
const data = fs.readFileSync(__dirname + "/user.json", "utf-8");
const dc = JSON.parse(data);
dc[0] = { ...dc[0], email2: "sarif@7" };

fs.writeFileSync(__dirname + "/user.json", JSON.stringify(dc, null, 2), "utf-8");
*/
