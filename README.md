## Setps to SetUp UI Repo


#### 1. Install package manager :-
if you are using mac install homebrew for details visit [https://brew.sh/](https://brew.sh/)

And you will need `NVM` for maintaining the versions of node for installation details visit [https://github.com/creationix/nvm](https://github.com/creationix/nvm)

**Important install node using `nvm` only (not via brew)**




#### 2. Install Required tools :- 

* Install node 8.9.0 using `nvm` 
* Install yarn using `npm`
* Install varnish using `Homebrew`
* Install git using `Homebrew`


#### 3. Setup the Repository :-
clone the repository locally using git [https://git.ixigo.com/UI/node-ui](https://git.ixigo.com/UI/node-ui) and checkout the `developement` branch

#### 4. Installing the dependency :-

now navigate to the repository root directory and run `yarn install`

after installing the dependency setup the varnish alias

**path may vary depending upon the installation to know more about the installed path run `brew info varnish` if installed by brew**

```
alias varnishOpen='sudo vim /usr/local/etc/varnish/default.vcl'
alias varnishStart='sudo /usr/local/sbin/varnishd -f /usr/local/etc/varnish/default.vcl -s malloc,256m -T 127.0.0.1:2000 -a 0.0.0.0:80'
alias varnishStop='sudo pkill varnishd'
alias varnishRestart='varnishStop;varnishStart;'
```

then run the `varnishOpen` command and set the varnish configuration ( ask someone for configuration file content )


#### 5. Change the localhost IP mapping ( optional ):- 

Instead of using `locahost` you may want to use `dev.ixigo.com` as your development URL

to do this open you `/etc/hosts` file with your favorite editor and add this (`127.0.0.1	dev.ixigo.com`) line below the `127.0.0.1 localhost` line 
now you can access the development server by `dev.ixigo.com` URL

#### 6. Kick start the servers :- 

now start the varnish process by using the command `varnishStart` (setup in alias) 
you will need to run this on every reboot

Navigate to the repository root and run these commands
* `yarn build` ( to process the js and css files )
* `yarn startSeoServer` ( to start the seo server )
* `yarn startServer` ( to start the web server )


**Now update this documentation if required happy coding :)**



