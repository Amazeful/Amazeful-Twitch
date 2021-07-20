Setting Up Development Environment
===

AmazefulBot is developed inside a Docker container with Windows Subsystem for Linux (WSL) 2 backend.
All required services to run the application are provided in a Docker Compose file.

# Install WSL2
1. Follow the [instructions for installing Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10#manual-installation-steps).
Ensure to upgrade to WS2 and setup the virtual machine.
2. Download and install the Ubuntu distribution as explained in the installation guide above.
3. Set Ubuntu as default WSL2 distribution:
`wsl --setdefault Ubuntu`

# Install Docker Desktop
Download and install Docker Desktop from: https://www.docker.com/products/docker-desktop

# Install ConEmu (Recommended)
Download and install ConEmu from: https://conemu.github.io/

# Configure Docker with WSL 2
Follow the [instructions to set up Docker with WSL 2](https://docs.docker.com/docker-for-windows/wsl) 

# Setup VSCode Remote (Highly Recommended)
Download and install VSCode Remote WSL extension from: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl

# Clone Project
1. Open a WSL window in the terminal and clone AmazefulBot-Twitch into your home directory (If you use any other directory, you must modify the docker compose file).
`git clone https://github.com/Amazeful/Amazeful-Twitch.git`
2. Go into Amazeful-Twitch direcotry: `cd Amazeful-Twitch`
3. Run `code .`
4. Visual Studio Code will automatically launch and attach to WSL 2.
5. Develop Freely

# Running the App
1. To make things simple, install the Docker extension for VSCode from: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker
2. In VSCode, right click on `docker-compose.dev.yml` file and click "Compose Up"
3. All services required by AmazefulBot are now running. In addition, a container containing the AmazefulBot and the required development programs is provided.
This container is mounted to your /home/AmazefulBot-Twitch directory. This means any changes that you make will immedietly be reflected in the container. 
4. Open the Docker tab in VScode
5. Right Click on `amazeful-twitch` under containers and click "Attach Shell"
6. You may now run all commands you may need such as `yarn start` or `yarn test` 

# Nothing Wrong with Asking
If you have any questions, feel free to ask us in [Discord](https://discord.gg/r4tC38fSr7)

