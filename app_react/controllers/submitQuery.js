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
      user: "expeditionbharat", // generated ethereal user
      pass: "harrysidhu@2019" // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "harishsinghbisht8@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: data // html body
  };

  // send mail with defined transport object
  let info =  transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...



  
  
  res.setHeader('Content-Type', 'application/json');
  res.send({"status":"OK"});
}
