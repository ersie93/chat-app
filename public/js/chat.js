const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


const urlTemplate = document.querySelector('#url-template').innerHTML
const messageTemplate = document.querySelector('#message-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('LT')
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
  const html = Mustache.render(urlTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('LT')
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ""
    $messageFormInput.focus()

    if(error){
      return console.log(error)
    }
    console.log("message delivered!")
  })
})

$sendLocationButton.addEventListener('click', () => {

  if(!navigator.geolocation){
    return alert('Geolocation not supported by browser')
  }

  $sendLocationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $sendLocationButton.removeAttribute('disabled')
      console.log('location shared!')
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if(error){
    alert(error)
    location.href = '/'
  }
})
