const nodemailer = require('nodemailer')
const { google} = require('googleapis')
const { OAuth2} = google.auth;
const OAuth_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const  {
    MAILING_SERVIICE_CLIENT_ID,
    MAILING_SERVIICE_CLIENT_SECRET,
    MAILING_SERVIICE_REFRESH_TOKEN,
    SENDER_MAIL_ADDRESS
} = process.env;
console.log("Mail id :",MAILING_SERVIICE_CLIENT_ID);
console.log("Mail id :","747275520406-n7b1rtokjlb11tgrtop77r3nsjheonip.apps.googleusercontent.com");

console.log("Secret :",MAILING_SERVIICE_CLIENT_SECRET);
console.log("Secret :","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");
 
const oauthClient2 = new OAuth2({
    clientId: MAILING_SERVIICE_CLIENT_ID,
    clientSecret: MAILING_SERVIICE_CLIENT_SECRET,
    redirectUri: undefined,
    credentials: {
        refresh_token: MAILING_SERVIICE_REFRESH_TOKEN
    }
});


const sendMail = async(to , url , txt) =>{
    oauthClient2.setCredentials({
        refresh_token: MAILING_SERVIICE_REFRESH_TOKEN
    })
    const accessToken = await oauthClient2.getAccessToken();
    console.log('accessToken : --------------------', accessToken )
    
    const smtpTransporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            type : 'OAuth2',
            user :SENDER_MAIL_ADDRESS,
            clientId : MAILING_SERVIICE_CLIENT_ID,
            clientSecret :MAILING_SERVIICE_CLIENT_SECRET,
            refreshToken : MAILING_SERVIICE_REFRESH_TOKEN,
            accessToken 
        }
    })
    const mailOptions = {
        from : SENDER_MAIL_ADDRESS,
        to : to,
        subject :  "Planty'x",
        html : `
 <div style="max-width: 600px; margin: auto; border: 4px solid #28b463; padding: 40px 20px; font-size: 120%; background-color: #f8f9f9; border-radius: 10px;">
    <h2 style="text-align: center; text-transform: uppercase; color: #28b463;">Welcome to the Planty!</h2>
    <p>Congratulations! You're almost ready to start enjoying all the features of Yeysy tools✨. Simply click the button below to verify your email address.</p>
    
    <a href="${url}" 
   style="
      background: #28b463; 
      text-decoration: none; 
      color: #fff; 
      padding: 12px 24px; 
      margin: 20px 0; 
      border-radius: 5px; 
      display: block; 
      text-align: center;"
>
   ${txt}
</a>

    
    <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
     
    <h3> Retry link :  </h3><a href="${url}" 
   style="
    //   background: #28b463; 
    //   text-decoration: none; 
    //   color: #fff; 
      padding: 12px 24px; 
      margin: 20px 0; 
      border-radius: 5px; 
      display: block; 
      text-align: center;
      font-weight: bold;"
>
   ${txt}
</a>
     
</div>
        `
    }
    smtpTransporter.sendMail(mailOptions ,  (err, information) =>{
        if(err) return err;
        else console.log("sent mail");
        return information;
    })
}

module.exports = sendMail