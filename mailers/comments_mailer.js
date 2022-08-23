const nodeMailer=require('../config/nodemailer');


//this is another way of exporting a method

exports.newComment=(comment) =>{
    // we already give the view and mailesr path in nodemailers in path.join(__dirname,'../views/mailers',relativePath),
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
    nodeMailer.transporter.sendMail({
        form:'anileshcodingninja@gmail.com',
        to:comment.user.email,
        subject:"new comment published!",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
        return;
    })
}