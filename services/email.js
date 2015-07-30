var mandrillClient = require('powerdrill')(process.env.MANDRILL_API_KEY);
var q = require('q');
var from = "Castle Robot <robot@entercastle.com>";

module.exports = {
  send: function (subject, to, html) {
    var deferred = q.defer();
    var message = mandrillClient()
    .subject(subject)
    .to(to)
    .from(from)
    .html(html)
    .send(function (err, resp) {
      if (err) {
        deferred.reject(err);
      } else if (resp[0].status === 'rejected') {
        deferred.reject('Error: Email rejected');
      } else {
        deferred.resolve(resp[0].status);
      }
    });
    return deferred.promise
    .then(function () {
      console.log(new Date().toString(), 'Email sent: ' + subject + ' to ' + to);
    });
  },
  sendTemplate: function (to, slug, name, address, callToActionPath) {
    var deferred = q.defer();
    var message = mandrillClient()
    .to(to)
    .from(from)
    .template(slug)
    .templateContent('name', name)
    .templateContent('address', address)
    .templateContent('call-to-action', '<a href="' + process.env.BASE_URL + callToActionPath + '" style="display: block; width: 240px; font-size: 22px; background: #3ab4ad; color: white; border-top: none; border-left: none; border-right: none; border-bottom: 4px solid #24837e; margin-top: 20px; margin-bottom: 10px; border-radius: 8px; height: 46px; line-height: 46px; text-decoration: none; text-align: center;" align="center">Log In & View &rarr;</a>')
    .send(function (err, resp) {
      if (err) {
        deferred.reject(err);
      } else if (resp[0].status === 'rejected') {
        deferred.reject('Error: Email rejected');
      } else {
        deferred.resolve(resp[0].status);
      }
    });
    return deferred.promise
    .then(function () {
      console.log(new Date().toString(), slug, 'template email sent to', to);
    });
  }
}
