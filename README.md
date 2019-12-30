# Aegis UI
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

1- install vscode as IDE for Angular: https://code.visualstudio.com/download

2- using brew install node "brew install node" or install Node.js from this link: https://nodejs.org/en/download/

3- Install CLI for Angular by running this command: npm install -g @angular/cli

   For this step: be aware that you might get an issue stating that you don't have permissions. If yes, continue to step 4, if not skip step 4

4- Do the steps below to fix the permission issue: 

    Run this command to install nvm(Node Version manager): 

             curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

     Verify installition by running this command: 

              command -v nvm

              The result should be : nvm . If you get an error instead, just close you terminal and open new one.  

    Then run these two commands to install Node.js using nvm: 
    nvm install node
     nvm use node
    Repeat STEP:3 again

5- install NPM "npm install"

6- Now CLI is installed, you can run these commands below to create and deploy you Angular application (note: you need to be at the specific folder level at the terminal, where you want your application to be create):

ng new my-app 

cd my-app 

ng serve --open