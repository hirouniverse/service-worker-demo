(function() {
  var app = document.getElementById('app')
  var headline = document.createElement('h1')
  headline.innerHTML = 'Service Worker Demo Application'
  var message = document.createElement('p')
  message.innerHTML = 'Good night, Vietnam'
  app.appendChild(headline)
  app.appendChild(message)

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function(reg) {
        console.log('proceeding registration flow...')
        console.log(reg);
      })
      .catch(function(err) {
        console.error('register failed...')
        console.log(err);
      })
    })
  }
})();
