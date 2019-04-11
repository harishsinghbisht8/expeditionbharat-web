import configObj from '../../config/config';

let env = process.env.NODE_ENV || 'dev';
let config = configObj[env];
const nodemailer = require("nodemailer");

export function submitQuery(req, res, next) {
  let data = req.body;
  console.log(data);



  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account =  nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "expbhtquery", // generated ethereal user
      pass: "rinkronk1234" // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Trek query" <expbhtquery@example.com>', // sender address
    to: "expeditionbharat@gmail.com", // list of receivers
    subject: "Trek query", // Subject line
    text: "Trek query", // plain text body
    html: JSON.stringify(data) // html body
  };

  // send mail with defined transport object
  let info =  transporter.sendMail(mailOptions, function(err, info) {
    if(err) {
      console.log("Error while sending mail : " + err)
    }
  })
  //console.log(info)
  //console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.setHeader('Content-Type', 'application/json');
  res.send({"status":"OK"});
}
