// <| ------- google sign-in -------|>

function accesToken(token) {
  localStorage.setItem('token', token)
}

function onSignIn(googleUser) {
  const idToken = googleUser.AuthResponse().id_token

  $.ajax({
    method: "POST",
    url:"http://localhost:3000/api/users/googleSignin",
    data: { idToken }
  })
  .done((result) => {
    localStorage.setItem('token', result.token)
    alert('Success signed in with google')
  })
  .fail((err) => {
    alert(err.responseJSON.message)
  })
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2
    .signOut()
    .then(() => {
      console.log('User signed out.')
     });
}

// --------- sign in --------- 

$('#login').submit(() => {
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/api/users/login",
    data: {
      email: inputEmail,
      password: inputPassword
    }
  })
  .done((result) => {
    accesToken(result)
    alert('Success signed in')
  })
  .fail(err => {
    console.log(err.responseJSON.message)
  })
})



// -------- Register ------------

$('#register').submit(() => {
  event.preventDefault()
  let inputEmail = $('#registrationEmail').val()
  let inputPassword = $('#registrationPassword').val()

  $.ajax({ 
    method: "POST",
    url: "http://localhost:3000/api/users/register",
    data: {
      email: inputEmail,
      password: inputPassword
    }
  })
  .done((result) => {
    alert('Succes created an account')
  })
  .fail(err => {
    console.log(err.responseJSON.message)
  })
})