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