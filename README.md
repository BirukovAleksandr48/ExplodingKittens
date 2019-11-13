# ExplodingKittens

It's backend for game card ExplodingKittens.

How to deploy:

    git clone https://github.com/BirukovAleksandr48/ExplodingKittens.git
    cd ./ExplodingKittens/
    docker-compose -f docker-compose.dev.yml build
    docker-compose -f docker-compose.dev.yml up

When deploying for the first time, all dependencies must be installed.

    docker-compose -f docker-compose.dev.yml exec backend-dev npm i

For test backend open *SocketIO Client Tool* in several incognitoo tabs

[http://amritb.github.io/socketio-client-tool/#url=bG9jYWxob3N0OjMwMDA=&opt=&events=](http://amritb.github.io/socketio-client-tool/#url=bG9jYWxob3N0OjMwMDA=&opt=&events=)
