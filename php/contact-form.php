<?php
// php/contact-form.php
 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = htmlspecialchars($_POST['name']);
  $email = htmlspecialchars($_POST['email']);
  $message = htmlspecialchars($_POST['message']);
 
  $to = 'your@email.com'; // <--- Deine E-Mail hier eintragen
  $subject = 'New Contact Form Message from styleX';
  $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8\r\n";
  $body = "Name: $name\nEmail: $email\nMessage:\n$message";
 
  if (mail($to, $subject, $body, $headers)) {
    echo "Message sent successfully.";
  } else {
    echo "There was an error sending your message.";
  }
} else {
  echo "Invalid request method.";
}
?>