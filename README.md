<h1 align="center">
  GoStars Server
</h1>

<p align="center">
  <a href="#installation">Installation</a>
  •
  <a href="#running_the_app">Running the app</a>
  •
  <a href="#documentation">Documentation</a>  
  •
  <a href="#contacts">Contacts</a>
  •
  <a href="#license">License</a>
</p>

Installation
-----------

- Open the terminal and run the following commands

```bash
$ git clone https://gitlab.12devs.com/training/2023_trainee/bausiuk_gostars_backend.git

$ cd bausiuk_gostars_backend

$ yarn install
```

- Wait for all the dependencies to be installed
- Create environment files `.development.env` and `.production.env` similar to the `.env` file for working with the
  database

Running the app
-----------

```bash
# development
$ yarn run start

# watch mode
$ yarn run dev

# production mode
$ yarn run start:prod
```

Documentation
-------------
All documentation you can find on the endpoint `'/api/docs/'`.

Contacts
--------
If you want to contact the author, please send an e-mail via visterovegor@gmail.com

License
-----------

Nest is [MIT licensed](LICENSE).