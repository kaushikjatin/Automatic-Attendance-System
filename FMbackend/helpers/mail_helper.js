const nodemailer = require("nodemailer");

async function sendMail(email,subject,content) {
  var transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: { 
      user: "restaurantbluegrass@hotmail.com",
      pass: "Microsoft@12",
    },
  });
  let info = await transporter.sendMail({
    from: '"FR admin" <restaurantbluegrass@hotmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: content, // html body
  });
  return info;
}
exports.sendMail = sendMail;