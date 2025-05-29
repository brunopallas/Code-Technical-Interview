# TodoAPI 

This is a REST API built for managing todo lists and items.
The project is preconfigured to run inside a **Dev Container** using Visual Studio Code and Docker.

## Run the API Using Dev Container

## Requirements

* [Docker](https://www.docker.com/products/docker-desktop) installed and running
* [Visual Studio Code](https://code.visualstudio.com/) installed
* [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed

---

1. **Open Docker Desktop**

2.**Open the project in VS Code**

At the bottom-left corner, you may see a blue indicator. Click on it, then select:

> *Reopen in Container*

3. **Build and run the API**

## Build

To build the application:

`dotnet build`

## Run the API

To run the TodoApi in your local environment:

`dotnet run --project TodoApi`

### HTTPS Development Certificates

If you run into HTTPS issues (e.g., browser rejects connection), run this command.

```bash
dotnet dev-certs https --trust
```
This will trust the development certificate on your host machine. Then run the TodoApi again. 

For instructions on how to run the MCP server that allows natural language interaction with this API, check the [README in the TodoApi MCP folder](../TodoApi%20MCP/README.md).






