# Paint online

An analogue of Paint with the ability to draw online

## Screenshot

![fdf](screenshots/paint_online.png)

## Features

+ collaborative drawing
+ saving a drawn image
+ the ability to undo/redo actions
+ several drawing tools
+ the ability to change the line thickness
+ the ability to change the fill/stroke color

## Environment variables

To run this application on a machine with an IP other than **127.0.0.1**, edit the following environment variable in your **.env.production** file

`REACT_APP_WS_SERVER_ADDRESS`

You should change *"localhost"* to your server's IP or domain name

## Run locally

The easiest way is to use Docker to run this application. You must have [Docker](https://www.docker.com) installed

Then clone the project

```bash
git clone https://github.com/DaniilSintsov/paint.git paint
```

Go to the project directory

```bash
cd paint
```

Launch the application using the command

```bash
docker-compose up -d --build
```

To draw with friends, you can use [Radmin VPN](https://www.radmin-vpn.com)

## Contributing

Bug reports and/or pull requests are welcome
