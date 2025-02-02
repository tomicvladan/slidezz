# Slidezz

A slideshow dapp that connects to Fairdrive.

Fair-OS version: https://slidezz.bzz.link

FDP-Storage version: https://slidezz.link.dev.fairdatasociety.org

**Slides separator: `---`**

## Installation

1. Clone the repo

2. Go inside the app folder

3. Install dependencies

   ```bash
   yarn
   ```

4. Run the development server

   ```bash
   yarn dev
   ```

5. Build and start the server

   ```bash
   yarn build
   yarn start
   ```

## Configuration

Create an `.env` file in the root directory and set the following properties:

you can copy the `.env.example` file:

```bash
cp .env.example .env
```

- **NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID** - Google Drive client ID

- **NEXT_PUBLIC_SLIDES_POD** - name of the pod that is used for storing slides

For fdp-storage:

- **NEXT_PUBLIC_BEE_URL** - Address of a Bee node

- **NEXT_PUBLIC_BATCH_ID** - Batch ID from your Bee node

- **NEXT_PUBLIC_RPC_URL** - Address of RPC provider

- **NEXT_PUBLIC_FDS_REGISTRAR** - FDS registrar contract address

- **NEXT_PUBLIC_ENS_REGISTRY** - ENS Registry contract address

- **NEXT_PUBLIC_PUBLIC_RESOLVER** - Public Resolver contract address

  For fair-os:

- **NEXT_PUBLIC_IS_FAIROS** - Set only it if you want to connect to fair-os

- **NEXT_PUBLIC_FAIROSHOST** - Fair-OS host
