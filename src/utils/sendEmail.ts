import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '@/models/userModel';


export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        if (emailType === "RESET") {

            await User.findByIdAndUpdate(userId,
                { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 })
        }

        var transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}&type=${emailType.toLowerCase()}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}&type=${emailType.toLowerCase()}</p>`,
        };

        const mailresponse = await transport.sendMail
            (mailOptions);
        return mailresponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}