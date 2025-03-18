Default Port is set to 3000 in the port variable in index.js  
cors is included as I use the task list as its own thing as well as part of a notebook application and wanted the data to pull from the same db for both.  
  
## My setup
1. Create the directory with appropriate permissions
2. pull the git repo
3. install the packages: npm i
4. update the .conf file :
  
`<VirtualHost *:80>'
    'ServerAlias demo-todo.example-domain.co.nz'
    'DocumentRoot /var/www/demo-todo'
    'ProxyPass / http://localhost:3000/'
'</VirtualHost>`

  
5. reload apache
6. update DNS provider with appropriate A record
7. Test operations:
  a. Create Task, Confirm loads to main page
  b. Complete a Task, confirmed that it loads to completed and recent pages
  c. Reomve a Task, confirm that task no longer displays on any page
