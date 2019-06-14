const baseUrl = 'http://localhost:3000/';
// Data from stef's endpoint
let holidayArr

// Format form inputs to json-like
function format(form) {
  let out = {};
  $(form).serializeArray().forEach(x => {
    out[x.name] = x.value
  });
  return out
}

function appendHoliday(obj) {
  let datestring = new Date(obj.date).toDateString()
  $('#list1').append(
    `<div class="holiday">
    <p>
      ${datestring}<br>
      ${obj.detail}
    </p>
    </div>`)
}

function appendEvent(obj) {
  $('#list2').append(
    `<div class="event">
      <a href="${obj.uri}">${obj.displayName}</a><br>
      <p>
        Start date: ${obj.startDate}<br>
        Venue: ${obj.venue}&nbsp;&nbsp;&nbsp;City: ${obj.city}<br>
        Artists: ${obj.artists}<br>
        Currency: ${obj.currency}&nbsp;&nbsp;&nbsp;Rate: ${obj.rate}<br>
      </p>
      <button class="button button1" onclick="addFav('${obj.eventId}')">Save</button>
    </div>`)
}

function appendFavorite(obj) {
  // Later
}

function addFav(id) {
  // Jays isi ini
  alert(id)
}

function appendCurrency(obj) {
  $('#currencyinfo').html(
    `<div>
    <u>Currency Name</u>:<br>
    ${obj.currency}</div>
    <div><u>Rate</u>:<br>
    1 ${obj.currency} = ${obj.rate} Rupiah
    </div>`)
}

$(document).ready(() => {
  // Search Form submit
  $('#search1').on('submit', function(event) {
    event.preventDefault();
    let input = format(this)
    $.ajax({
      url: `${baseUrl}api/events/`,
      method: 'POST',
      data: input,
    })
      .done(data => {
        console.log(data);
        appendCurrency(data);
        $('#list2').empty();
        for(let event of data.events) {
          appendEvent(event);
        }
      })
      .fail((jqXHR, textStatus) => {
        console.log('Failed: ', textStatus)
      })

    $.ajax({
      url: `${baseUrl}api/holidays/nextholidays`,
      method: 'POST',
      data: input,
    })
      .done(data => {
        console.log(data)
        holidayArr = data;
        $('#list1').empty();
        for(let holiday of data) {
          appendHoliday(holiday)
        }
      })
      .fail((jqXHR, textStatus) => {
        console.log('Failed: ', textStatus)
      })
  })

  $('#ok1').on('click', function() {
    $('#reg-message').hide()
    $('#front-forms').show()
    $('.goog').show()
  })
});


// <| ------- google sign-in -------|>

function accessToken(token) {
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
    $('#outside').hide();
    $('#inside').show();
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
    $('#loginEmail').val('')
    $('#loginPassword').val('')
    accessToken(result)
    $('#outside').hide();
    $('#inside').show();
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
    $('#front-forms').hide()
    $('.goog').hide()
    $('#reg-message').show()
  })
  .fail(err => {
    alert(err.responseJSON.message)
  })
})