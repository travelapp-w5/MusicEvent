const baseUrl = 'http://localhost:3000/';
// Format form inputs to json-like
function format(form) {
  let out = {};
  $(form).serializeArray().forEach(x => {
    out[x.name] = x.value
  });
  return out
}

$(document).ready(() => {
  $('#search-form').on('submit', function(event) {
    event.preventDefault();
    let input = format(this).search
    // $('#clear').hide();
    $('#search-status').html('Loading . . .');
    $.ajax({
      url: `${baseUrl}search/`,
      method: 'GET',
      data: input,
    })
      .done(data => {})
      .fail((jqXHR, textStatus) => {
        console.log('Failed: ', textStatus)
      })
      .always(() => {})
  })
});
// <| ------- google sign-in -------|>

function accesToken(token) {
  localStorage.setItem('token', token)
}

function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token
  $.ajax({
    method: "POST",
    url:`${baseUrl}api/users/googleSignin`,
    data: { idToken }
  })
  .done((result) => {
    localStorage.setItem('token', result.token)
    alert('Success signed in with google')
  })
  .fail((err) => {
    // console.log(err.responseJSON.message)
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

$('#login-form').submit(() => {
  event.preventDefault()
  let inputEmail = $('#loginEmail').val()
  let inputPassword = $('#loginPassword').val()
  $.ajax({
    method: "POST",
    url: `${baseUrl}api/users/login`,
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
    alert(err.responseJSON.message)
  })
})



// -------- Register ------------

$('#register-form').submit((event) => {
  event.preventDefault()
  let inputEmail = $('#registrationEmail').val()
  let inputPassword = $('#registrationPassword').val()
  console.log('masuk')
  $.ajax({ 
    method: "POST",
    url: `${baseUrl}api/users/register`,
    data: {
      email: inputEmail,
      password: inputPassword
    }
  })
  .done((result) => {
    alert('Succes created an account')
  })
  .fail(err => {
    alert(err.responseJSON.message)
  })
})

// ---------- Sign Out ---------------


function logout() {
  signOut()
  localStorage.removeItem('token')
}