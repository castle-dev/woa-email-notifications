if (!process.env.FIREBASE_SECRET ||
    !process.env.FIREBASE_URL ||
    !process.env.MANDRILL_API_KEY) {
  console.log(new Date().toString(), 'MANDRILL_API_KEY, FIREBASE_URL, and FIREBASE_SECRET required. Please include them in your environment variables.');
  process.exit();
}

var Firebase = require('firebase');
var EmailService = require('./services/email');
var ref = new Firebase(process.env.FIREBASE_URL);

/* Authenticate to Firebase */
ref.authWithCustomToken(process.env.FIREBASE_SECRET, function (err) {
  if (err) {
    console.log(new Date().toString(), 'Firebase authentication failed!', err);
    EmailService.send('Firebase authentication failed', 'errors@entercastle.com', err);
  }
  else {
    /* Register Firebase Listeners */
    console.log(new Date().toString(), 'Registering firebase listeners');
    var lastPost = true;
        // When a post is added, email out an alert
        ref.child('posts').limitToLast(1).on('child_added', function (snapshot) {
          if (lastPost){
            lastPost = false;
          }
          else {
            var post = snapshot.val();
            var body = 'Name: ' + post.name.big() + '\n\n\n' + 'Accomplishment: ' + post.accomplishment;
            console.log(new Date().toString(), 'new post: ', body);
            EmailService
            .send('New Wall of Accomplishments Post!', 'woa@entercastle.com', body)
            .catch(function (err) { console.log(new Date().toString(), err); });
          }
        });
  }
});
