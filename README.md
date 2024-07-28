# OBS Media Source File Selector

This project is an OBS media source file selector that uses a TCP server to receive commands for changing media files in OBS. It connects to OBS using WebSocket and updates the media source based on incoming commands.

## Features

- Connects to OBS via WebSocket
- Receives commands via TCP to change media files
- Automatic reconnection to OBS WebSocket if the connection is lost
- Configurable settings via `variables.txt`

## Requirements

- Node.js
- OBS Studio with `obs-websocket` plugin

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/YOUR_USERNAME/OBS-MediaSource-File-Selector.git
   cd OBS-MediaSource-File-Selector
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

## Configuration

Create a `variables.txt` file in the root directory with the following content:

```plaintext
Media_Folder: C:\Path_To\Media\Folder
Media_Name: DynamicMedia<--As name of source layer (not scene)
OBS_IP: 127.0.0.1
OBS_Port: 4455
OBS_Pass: Your_Password
TCP_Port: 12345 
```

- `Media_Folder`: Path to the folder containing media files
- `Media_Name`: Name of the media source in OBS
- `OBS_IP`: IP address of the OBS instance
- `OBS_Port`: Port number for OBS WebSocket
- `OBS_Pass`: Password for OBS WebSocket (leave empty if no password)
- `TCP_Port`: Port number for the TCP server

## Usage

1. **Run the server:**

   ```sh
   node OBS_Server.js
   ```

2. **Send commands to the server:**
   - Connect to the TCP server using the configured `TCP_Port`.
   - Send the name of the media file (e.g., `001.mp4`) to update the media source in OBS.

## Example

```sh
node OBS_Server.js
```

### Sending a command

Use any TCP client to send a command to the server. For example, you can use `telnet` or any TCP client application to send the name of the media file:

```sh
telnet 127.0.0.1 12345
```

Then, send the media file name:

```sh
001.mp4
```

## Contributing

If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.
