const nodemailer = require('nodemailer');

// Reuse a single transporter instead of creating a new one per email
const transporter = nodemailer.createTransport({
  service: 'gmail',
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