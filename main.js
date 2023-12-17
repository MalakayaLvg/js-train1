const content = document.querySelector(".content")


const baseUrl = "https://b1messenger.imatrythis.com/"
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDI4MzgwNTMsImV4cCI6MTcwMjg0MTY1Mywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoib3NseW54In0.Td1jtR_Wh1-gY2pi_0pUFgB0EghGRKYzCGRjfjOIzPnsJzWLP4MWpHpnx2IE1VRoqnTdS6lzlR1qPCzKTUDKcEJ72zH0W2QGRTYytFoEQ0Xa9rAYM8GSDXkPmq93NrVs4-6ie6e4SkQXuSx0I35HCfs0IUZjidK3AzSYpPXcrkqHLYBDgon6N5SgeKaZE_iHuAqM63B_Uu9cJMjPqi2b6SzgL-buMQUA2Q63uZ2xTNYaHyy6QA46hTA1cIVudGLbGd0kmxkV_Z0vYzLZ2EEz_1_3CvQy-zkdH2b9tYKTFtgSRY3tkqUQLGGTbUan8CHPIxlK4D-MjxSMcGajxAqL_A"
let userObject = null //Object information de l'utilisateur

// -------------------------- RUN ---------------------------------

function run(){
   if(!token){
      loginForm()
   }else{
      console.log("message")
      getUserObject().then(data=>{
         fetchMessage().then(data=>{
            renderMessages(data)
         })
      })

   }
}

run()




// ------------------------- LOGIN & REGISTER PAGE ----------------------------------

//users create :
// oslynx : motdepasse1
// Oslynx2: motdepasse2

// LOGIN
function loginForm(){
   let template = `
      <div>
         <h2>Login Form</h2>
         <h4>Username</h4>
         <input class="inputUsername">
         <h4>Password</h4>
         <input class="inputPassword">
         <div class="my-3">
            <button class="btn btn-primary" id="buttonLogin">Login</button>
            <button class="btn btn-secondary" id="buttonGoRegister">GO Register</button>
         </div>
      </div>
   `
   render(template)

   const buttonLogin = document.querySelector("#buttonLogin")
   const buttonGoRegister = document.querySelector("#buttonGoRegister")
   const username = document.querySelector(".inputUsername")
   const password = document.querySelector(".inputPassword")

   buttonLogin.addEventListener("click",()=>{
      fetchLogin(username,password).then(data=>{
         token = data.token
         run()
      })

   })

   buttonGoRegister.addEventListener("click",()=>{
      registerForm()
   })


}

async function fetchLogin(username,password){

   let body={
      username : username.value,
      password : password.value
   }
   let params = {
      method:"POST",
      headers:{"content-type":"application/json"},
      body: JSON.stringify(body)
   }
   return await fetch("https://b1messenger.imatrythis.com/login",params)
       .then(response=>response.json())
       .then(data=>{
          return data
       })
}

// REGISTER

function registerForm(){
   let template = `
      <div>
         <h2>Register Form</h2>
         <h4>Username</h4>
         <input class="inputUsername">
         <h4>Password</h4>
         <input class="inputPassword">
         <div class="my-3">
            <button class="btn btn-primary" id="buttonRegister">Register</button>
            <button class="btn btn-secondary" id="buttonGoLogin">GO Login</button>
         </div>
      </div>
   `
   render(template)

   const buttonRegister = document.querySelector("#buttonRegister")
   const buttonGoLogin = document.querySelector("#buttonGoLogin")
   const username = document.querySelector(".inputUsername")
   const password = document.querySelector(".inputPassword")

   buttonGoLogin.addEventListener("click",()=>{
      loginForm()
   })

   buttonRegister.addEventListener("click",()=>{
      fetchRegister(username,password).then(data=>{
         token = data.token
      })
   })

}

async function fetchRegister (username,password){

   let body = {
      username: username.value,
      password: password.value
   }
   let params = {
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify(body)
   }
   return await fetch("https://b1messenger.imatrythis.com/register",params)
       .then(response=>response.json())
       .then(data=>{
          return data
       })
}


// ------------------------------ MESSAGE -----------------------------------------

async function fetchMessage(){
   let params = {
      method: "GET",
      headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
   }
   return await fetch("https://b1messenger.imatrythis.com/api/messages",params)
       .then(response=>response.json())
       .then(data=>{
          console.log(data)
          return data

       })
}

function renderMessages(messages){

   // 1. MESSAGES

   // ------- RENDER ALL MESSAGES ----------

   // 1.1 All Messages

   let content = ""
   let messageContent = ""

   console.log("userObject:",userObject)


   messages.forEach((message)=>{

      messageContent += `
         <div class="form-control">
            <div class="d-flex">
                <h6><strong>${message.author.username}</strong></h6>
                <h6>@${message.author.displayName}</h6>
            </div>
            
            <p id="divMessage${message.id}">${message.content}</p>
               
         </div>
         <div class="divResponse${message.id}">
               <button class="btn btn-secondary buttonAddResponse" id="${message.id}">Add response</button>
         </div>
      `

      // Ajout Bouton Edit,Delete pour message de l'utilisateur

      if (message.author.id == userObject.id){
         messageContent += `
            <button class="btn btn-warning buttonEditMessage" id="${message.id}">EDIT</button>
            <button class="btn btn-danger buttonDeleteMessage" id="${message.id}">DELETE</button>
         `
         console.log("button edit&delete add on message id:",message.id)
      }

      // Ajout des reponses

      if (message.responses.length > 0){
         console.log("response lenght > 0 on ",message.id)
         let responses = message.responses
         let responsesContent = ""
         responses.forEach((response)=>{
            responsesContent += `
            <div class="form-control m-3">
                <div class="d-flex " >
                    <h6><strong>${response.author.username}</strong></h6>
                    <h6>@${response.author.displayName}</h6>
                </div>
            
                <p>${response.content}</p>
            </div>
            
            `
         })
         messageContent += responsesContent

      }
   })

   content = profileForm() + messageContent + renderNewMessage()
   render(content)


   // 1.2 ----------- POST MESSAGE ------------

   const buttonPostMessage = document.querySelector("#buttonPostMessage")
   const inputNewMessage = document.querySelector("#inputNewMessage")
   buttonPostMessage.addEventListener("click",()=>{
      fetchNewMessage(inputNewMessage.value).then(data=>{
         run()
      })
   })

   // 1.3 --------------- DELETE MESSAGE ----------------

   const buttonDeleteMessage = document.querySelectorAll(".buttonDeleteMessage")
   buttonDeleteMessage.forEach((button)=>{
      button.addEventListener("click",()=>{
         console.log("click delete message")
         fetchDeleteMessage(button.id).then(data=>{
            run()
         })
      })
   })


   // 1.4 ------------------- EDIT MESSAGE ------------------------

   const buttonEditMessage = document.querySelectorAll(".buttonEditMessage")
   buttonEditMessage.forEach((button)=>{
      button.addEventListener("click",()=>{
         console.log("click Edit Message")
         // creation du formulaire edit message
         let thisMessageObject = getMessageObjectById(button.id,messages)
         formEditMessage(button.id,thisMessageObject.content)

         // quand confirmation de l'edit
         const buttonConfirmEdit = document.querySelector("#buttonConfirmEdit")
         const messageEditContent = document.querySelector("#messageEditContent")
         buttonConfirmEdit.addEventListener("click",()=>{
            fetchEditMessage(button.id,messageEditContent.value).then(data=>{
               console.log("edit done")
               run()
            })
         })
      })
   })


   // 1.5 ----------------- MESSAGE RESPONSE ----------------------------

   const buttonAddResponse = document.querySelectorAll(".buttonAddResponse")
   buttonAddResponse.forEach((button)=>{
      button.addEventListener("click",()=>{
         //Creation du formulaire de reponse
         console.log("click response on message id:",button.id)
         formAddResponse(button.id)

         //Quand click confirmation de la reponse
         const buttonConfirmAddResponse = document.querySelector("#buttonConfirmAddResponse")
         const responseContent = document.querySelector("#inputAddResponseContent")
         buttonConfirmAddResponse.addEventListener("click",()=>{
            fetchAddResponse(button.id,responseContent.value).then(data=>{
               console.log("add response done!")
               run()
            })
         })

      })
   })






   // 2. PROFILE

   // ----- GET data profile + RENDER profile ------
   getUserObject().then(data=>{


      // 2.1 ---- RENDER  Edit profile -------

      const buttonEditProfile = document.querySelector("#buttonEditProfile")
      buttonEditProfile.addEventListener("click",()=>{
         render(editProfileForm())

         // 2.1 => 2. ----- Back Messages -----
         const buttonBackMessages = document.querySelector("#buttonBackMessages")
         buttonBackMessages.addEventListener("click",()=>{
            run()
         })


      })
   })

}







// MESSAGE FUNCTION

function renderNewMessage(){
   let template = `
    <div>
        <input type="text" id="inputNewMessage">
        <button class="btn btn-primary" id="buttonPostMessage">POST MESSAGE</button>
    </div>
   `
   return template
}
async function fetchNewMessage(messageContent){
   let body = {
      content : messageContent
   }
   let params = {
      method : "POST",
      headers : {"content-type":"application/json","authorization":`Bearer ${token}`},
      body : JSON.stringify(body)
   }
   await fetch(`${baseUrl}api/messages/new`,params)
       .then(response=>response.json())
       .then(data=>{
          console.log("message send")
       })

}

async function fetchDeleteMessage(messageId){
   let params = {
      method: "DELETE",
      headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
   }
   await fetch(`${baseUrl}api/messages/delete/${messageId}`,params)
       .then(response=>response.json())
       .then(data=>{
          console.log("fetch delete message response:",data)
       })
}

function formEditMessage(messageId,messageContent){
   const divMessageSelect = document.querySelector(`#divMessage${messageId}`)
   divMessageSelect.innerHTML = `
    <div class="input-group">
        <input type="text" id="messageEditContent" value="${messageContent}">
        <button class="btn btn-warning" id="buttonConfirmEdit">Confirm</button>
    </div>
   `
}
async function fetchEditMessage(messageId,messageContent){
   console.log("fetchEdit,messageContent =",messageContent,", messageId =",messageId)
   let body = {
      content: messageContent
   }
   let params = {
      method: "PUT",
      headers: {"content-type":"application/json","authorization":`Bearer ${token}`},
      body: JSON.stringify(body)
   }
   await fetch(`${baseUrl}api/messages/${messageId}/edit`,params)
       .then(response=>response.json())
       .then(data=>{
          console.log("edit response:",data)
       })
}

function getMessageObjectById(messageId,messages){
   let messageObject = null
   messages.forEach((message)=>{
      if (message.id == messageId){
         console.log(messageId,message.id)
      }
      messageObject = message
   })
   return messageObject
}

function formAddResponse(messageId){
   const divResponseSelect = document.querySelector(`.divResponse${messageId}`)
   divResponseSelect.innerHTML = `
    <div class="input-group">
        <input type="text" id="inputAddResponseContent">
        <button class="btn btn-primary" id="buttonConfirmAddResponse">Add Response</button>
    </div>
   `
}

async function fetchAddResponse(messageId,responseContent){
   let body = {
      content: responseContent
   }
   let params = {
      method: "POST",
      headers: {"content-type":"application/json","authorization":`Bearer ${token}`},
      body: JSON.stringify(body)
   }
   await fetch(`${baseUrl}api/responses/${messageId}/new`,params)
       .then(response=>response.json())
       .then(data=>{
          console.log("response add response:",data)
       })
}



// PROFILE FUNCTION

function profileForm(){
   let template = `
    <div class="form-control d-flex">
        <h5>${userObject.displayName}  </h5>
        <h5>@${userObject.username}</h5>
        <button id="buttonEditProfile">Edit Profile</button>
      
    </div>
   `
   return template
}
async function getUserObject(){
   let params = {
      method: "GET",
      headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
   }
   await fetch(`${baseUrl}api/whoami`,params)
       .then(response=>response.json())
       .then(data=>{
          userObject = data
       })
}
function editProfileForm(){
   let template = `
    <div>
        <h5>Display name:</h5>
        <input value=${userObject.displayName} id="inputEditDisplayName">
        <button class="btn btn-warning" id="editDisplayName">Change Display Name</button>
      
    </div>
    <button id="buttonBackMessages">Back Messages</button>
   `
   return template
}





// ---------------// function run(){
//    if(!token){
//       loginForm()
//    }else{
//       console.log("message")
//       fetchMessage().then(data=>{
//          renderMessages(data)
//       })
//    }
// }---------------- RENDER --------------------------------

function render(pageContent){
   content.innerHTML = ""
   content.innerHTML = pageContent
}



