const verificationTemplate = (code) => {
    return `
    <!DOCTYPE html>
    <html>
        <body>
            <div style="width: 50%; padding-top: 20px;">
                <p style="margin: 0 auto">Click to verify your email address</p>
                <div style="width: 100px; margin-left: 30px; margin-top: 10px;">
                    <a href="http://localhost:5000/verify?token=${code}" target="blank">
                        <button style="height: 50px; width: 100px; border-radius: 10px; border-width: 0px">Verify</button>
                    </a>
                </div>
            </div>
        </body>
    </html>
    `
}

const passwordResetTemplate = (password) => {
    return `
    <!DOCTYPE html>
    <html>
        <body>
            <div style="width: 50%; padding-top: 20px;">
                <p style="margin: 0 auto">Please don't share this password with anyone, even admin. Log into your account to change your password. Your new password is</p>
                <div id="password" style="margin-left: 30px; margin-top: 10px;">
                    <p><b>${password}</b></p>
                </div>
            </div>
        </body>
    </html>
    `
}

module.exports = { verificationTemplate, passwordResetTemplate }