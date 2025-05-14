export function generateEmailTemplateForUser(mainContent: string, title: string) {
    const imageUrl = "https://ik.imagekit.io/webibee/Webibee/webibeepurplelogo.png";
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 20px;">
                 <img src=${imageUrl} alt="Business Portfolio Logo" style="width: 150px; height: auto;">
              </div>
          ${mainContent}
           <p style="font-size: 16px; color: #555;">Greetings from Business Portfolio Team!</p>
           ${title !== "contact" ?
            `<p style="font-size: 16px; color: #555;">
                Thank you for your interest with Business Portfolio. Please check the attached work sample requested.
            </p>`
            :
            `<p style="font-size: 16px; color: #555;">
                Thank you for choosing Business Portfolio! We're thrilled to confirm we've received your submission and are excited to collaborate with you to bring your vision to life. Let's create something amazing together!
            </p>`
        }
           
            <p style="font-size: 16px;">
                Webibee,<br>
                <a href="mailto:support@Business-Portfolio.com" style="color: #007bff; text-decoration: none;">support@Business-Portfolio.com</a><br>
                Founder & C.E.O,
            </p>
            <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #008080;">
                <p style="margin: 0;">
                    © ${new Date().getFullYear()} 
                    <span style="margin-left: 1.5px; margin-right: 1.5px;">
                        <a href="https://webibee.com/" style="color: #007bff; text-decoration: none;">Business Portfolio</a>
                    </span>
                    . All rights reserved.
                </p>
            </div>
        </div>
          `;
}

export function generateEmailTemplateForClient(mainContent: string) {
    const imageUrl = "https://ik.imagekit.io/webibee/Webibee/webibeepurplelogo.png";
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
              <p style="font-size: 16px; color: #555;">Hi,</p>
              <p style="font-size: 16px; color: #555;">You have a new message from the Business Portfolio website:</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              ${mainContent}
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 16px;">
                Webibee,<br>
                <a href="mailto:support@Business-Portfolio.com" style="color: #007bff; text-decoration: none;">support@Business-Portfolio.com</a><br>
                Founder & C.E.O,
            </p>
              <div style="margin-bottom: 10px;">
                 <img src=${imageUrl} alt="Business Portfolio Logo" style="width: 90px; height: auto;">
              </div>
          </div>
            `;
}

export function generateOtpEmailTemplate(otp: string, expiryTime: string) {
    const imageUrl = "https://ik.imagekit.io/webibee/Webibee/webibeepurplelogo.png";

    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${imageUrl}" alt="Business Portfolio Logo" style="width: 150px; height: auto;">
      </div>
      <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">One-Time Password (OTP) for Your Business Portfolio Account</h2>
      <p style="font-size: 16px; color: #555;">
        Use the following one-time password (OTP) to sign in to your Business Portfolio account:
      </p>
      <p style="font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">
        ${otp}
      </p>
      <p style="font-size: 16px; color: #555;">
        This OTP is valid for <span style="margin-left: 1.5px; margin-right: 1.5px; font-weight: bold;">15 minutes</span> until <span style="margin-left: 1.5px; margin-right: 1.5px; font-weight: bold;">${expiryTime} </span> (GMT +05:30).
      </p>
      <p style="font-size: 16px; color: #555;">
        For further clarifications, please contact 
        <a href="mailto:support@Business-Portfolio.com" style="color: #007bff; text-decoration: none;">
          support@Business-Portfolio.com
        </a>.
      </p>
      <p style="font-size: 16px; color: #555;">Greetings from Business Portfolio Team!</p>
      <p style="font-size: 16px;">
        Webibee,<br>
        <a href="mailto:support@Business-Portfolio.com" style="color: #007bff; text-decoration: none;">support@Business-Portfolio.com</a><br>
        Founder & C.E.O,
      </p>
      <div style="text-align: center; margin-top: 20px; font-size: 14px;">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} 
          <span style="margin-left: 1.5px; margin-right: 1.5px;">
            <a href="https://webibee.com/" style="color: #007bff; text-decoration: none;">Business Portfolio</a>
          </span>
          . All rights reserved.
        </p>
      </div>
    </div>
  `;
}