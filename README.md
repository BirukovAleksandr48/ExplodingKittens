# ExplodingKittens

It's backend for game card ExplodingKittens.

How to deploy:

    git clone https://github.com/BirukovAleksandr48/ExplodingKittens.git
    cd ./ExplodingKittens/
    //Docker version: 18.09.6
    //docker-compose version: 1.24.0
    sh ./commands/deploy-dev.sh
    sh ./commands/up-dev.sh

Next time:

    sh ./commands/up-dev.sh

To open a terminal in a container:

    sh ./commands/exec-dev.sh

To add new dependencies:

    sh ./commands/install-dev.sh [arguments]

For test backend open *SocketIO Client Tool* in several incognito tabs

[http://amritb.github.io/socketio-client-tool/#url=bG9jYWxob3N0OjMwMDA=&opt=&events=](http://amritb.github.io/socketio-client-tool/#url=bG9jYWxob3N0OjMwMDA=&opt=&events=)
