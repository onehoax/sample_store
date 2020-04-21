Simple fullstack website showcasaing the core functionality of an online store:  

The home has functionality for signing up, logging in or resetting a password;  

A user can be either a customer user or an admin user; to sign up as an admin suer include
'@admin' in you username;  

Signing up will automatically take you to the '/account' route, which shows the current items
for sale on the left (each with a button to add to your shopping list) and your current shopping
list on the right (each with a button to remove from your list); it will only show items for sale
if an admin user has already added some;

If you signed up as an admin user then you can access the '/admin' route, which lets you
add new items for sale; customer users don't have access to this route;  

Once you have signed in you can move away from the website, close the tab or navigate
to other routes and you will still be logged in (can go back to your account through '/account');  

To log out, use the route '/account/logout';  

If you forget your password you can reset it with the form provided in the home screen;
submitting the form will prompt mailgun to send you a reset password link (provided you gave a valid
email - only tested with gmail), which is only valid for 24 hours; following the link will
take you back to the website, where you can reset your password (if still within the time window).
The reset-password functionality is broken because of issues with mailgun.

You can access this website, which is hosted on an EC2 AWS instance, at 35.182.54.247.
