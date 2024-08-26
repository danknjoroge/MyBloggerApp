import { NextResponse } from 'next/server';
const nodemailer = require('nodemailer');

// Function to convert a string to sentence case
function toSentenceCase(str) {
    return str
        .split(/(?<=\.)\s*|(?<=\.\w)/) // Split on period followed by a space or period followed by a word character
        .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()) // Capitalize the first letter of each sentence
        .join('. '); // Rejoin the sentences with proper spacing
}

// Handles POST requests to /api
export async function POST(request) {
    const provider = process.env.NEXT_PUBLIC_EMAIL_PROVIDER; //set the email provider to either 'outlook' or 'gmail'
    const username = process.env.NEXT_PUBLIC_BURNER_USERNAME;
    const password = process.env.NEXT_PUBLIC_BURNER_PASSWORD;
    const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

    console.log("dealing with request");
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const messages = formData.get('message');
    const subjects = formData.get("subject");

    // Convert subject and message to sentence case
    const subject = toSentenceCase(subjects);
    const message = toSentenceCase(messages);

    // Define transporter configuration based on the provider
    const transporterConfig = provider === 'gmail' ? {
        service: 'gmail',
        auth: {
            user: username,
            pass: password
        }
    } : {
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // use TLS
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
        auth: {
            user: username,
            pass: password
        }
    };

    // create transporter object
    const transporter = nodemailer.createTransport(transporterConfig);

    try {
        const mail = await transporter.sendMail({
            from: username,
            to: myEmail,
            replyTo: email,
            subject: `New Blog Contact: ${subject}`,
            html: `
                <p>Hi Daniel,</p>
                <p>${message}</p>
                <h4>FROM:</h4>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
            `,
        });

        return NextResponse.json({ message: "Success: email was sent" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "COULD NOT SEND MESSAGE" }, { status: 500 });
    }
}

