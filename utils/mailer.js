const nodemailer = require('nodemailer');
const dns = require('node:dns');

// Render (and several other hosts) don't have outbound IPv6 connectivity.
// Gmail's SMTP hostname resolves to both AAAA (IPv6) and A (IPv4) records,
// and Node can pick the IPv6 one first, causing ENETUNREACH. Force IPv4 first.
dns.setDefaultResultOrder('ipv4first');

// Reuse a single transporter instead of creating a new one per email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  family: 4, // belt-and-suspenders: pin the socket itself to IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOverdueEmail(email, task) {
  try {
    await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🚨 Overdue: ${task.title}`,
      html: `<h2>Task Overdue!</h2><p>${task.title}</p><p>Due: ${new Date(task.dueDate).toLocaleString()}</p>`
    });
    console.log(`✅ Overdue email sent to ${email}`);
  } catch (e) {
    console.error('❌ Overdue email failed:', e.message);
  }
}

async function sendCompletionEmail(email, task) {
  try {
    await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Completed: ${task.title}`,
      html: `<h2>Task Completed!</h2><p>"${task.title}" was marked as completed.</p>`
    });
    console.log(`✅ Completion email sent to ${email}`);
  } catch (e) {
    console.error('❌ Completion email failed:', e.message);
  }
}

module.exports = { sendOverdueEmail, sendCompletionEmail };