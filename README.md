# BookStore

Repository contains the following folders

1) **/apache** - contains `.htaccess` and `.htpasswd` files to restrict access to admin panel
2) **/client** - frontend development folder
3) **/src** - backend development folder

When building application via `gradle clean build`, gradle copies files from `/apache` and `/client` folders to 
`/build/app` folder. After, gradle copies built server jar to the `/build/app`. Just need to copies files from
`/build/app` folder to `/var/www/html/bookstore` folder.