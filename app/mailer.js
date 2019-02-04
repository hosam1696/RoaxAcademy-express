"use strict";
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
// async..await is not allowed in global scope, must use a wrapper
 async function main(body){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // service: 'gmail',
    port: 465,
    secure: true,
    auth: { type: "OAuth2",
            user: 'hosamelnabawy1996@gmail.com',
            clientId: '66743535063-l8milhsfpc3kf20uc41geprref8gi81t.apps.googleusercontent.com',
            clientSecret: 'HJlKjX9EfM-HfPePrDlSVeWg',
            refreshToken: '1/UbF8dJnru721H6cuN7mG6Q5hjLKWL-hy4F2ZWctUUWA',
            accessToken: 'ya29.GlumBsDiyIt9SgxFEmDEj8rE-_2CaNGfT078IX2xcLY_Lgb8fuL3p3oNnGwUX5UM8oMJC96wCZs9Ke2nZAfFqpSg66Z7jlQmAkUfeUplER0bkjbghxOYqtkeFTec'
        
    //   user: 'hosamelnabawy1996@gmail.com', // generated ethereal user
    //   pass: 'hoss161996' // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Darsy App" <hossam216921@eng.zu.edu.eg>', // sender address
    to: "info.darsy@gmail.com, hosamelnabawy@outlook.com", // list of receivers
    subject: " 📌طلب جديد من التطبيق", // Subject line
    // text: body, // plain text body
    html: body // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
// main('').catch(console.error)
module.exports = main;