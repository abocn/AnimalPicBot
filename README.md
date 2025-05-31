# AnimalPicBot

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

**Live Preview:** [@justanotherdogchannel](https://t.me/justanotherdogchannel) on Telegram.

## 🤓☝️ Self-host requirements

> [!IMPORTANT]
> You will only need all of them if you are not running it dockerized. Read ["Running with Docker"](#running-with-docker) for more information.

- [Bun](https://bun.sh) (latest is suggested)
- A Telegram bot (create one at [@BotFather](https://t.me/botfather))
- Docker and Docker Compose (only required for Docker setup)

## 🚀 Running locally (non-Docker setup)

First, clone the repo with Git:

```bash
git clone https://github.com/ABOCN/AnimalPicBot
```

Next, inside the repository directory, create an `.env` file with some content, which you can see the [example .env file](.env.example) to fill info with. To see the meaning of each one, see [the Functions section](#env-functions).

After editing the file, save all changes and run the bot with ``bun start``.

> [!TIP]
> To deal with dependencies, just run ``bun install`` or ``bun i`` at any moment to install all of them.

## 🐋 Deploying with Docker

> [!IMPORTANT]
> Please complete the above steps to prepare your local copy for building.

---

> [!NOTE]
> Using the `-d` flag when running causes the bot to run in the background. If you're just playing around or testing, you may not want to use this flag.

You can also run AnimalPicBot using Docker, which simplifies the setup process. Make sure you have Docker and Docker Compose installed.

### 📃 Using Docker Compose

1. **Make sure to setup your `.env` file first!**

2. **Run the container**

   ```bash
   docker compose up -d
   ```

### 🚀 Using Docker Run

If you prefer to use Docker directly, you can use these instructions instead.

1. **Make sure to setup your `.env` file first!**

2. **Build the image**

   ```bash
   docker build -t animalpicbot .
   ```

3. **Run the container**

   ```bash
   docker run -d --name animalpicbot --restart unless-stopped -v $(pwd)/.env:/usr/src/app/.env:ro animalpicbot
   ```

## ⚙️ .env Functions

> [!IMPORTANT]
> Take care of your ``.env`` file, as it is so much important and needs to be secret (like your passwords), as anyone can do whatever they want to the bot with this token!

- **botToken**: Put your bot token that you created at [@BotFather](https://t.me/botfather).
- **channelId**: Channel ID to send images to
- **ownerId**: Your Telegram user ID
- **isCatOrDog**: Set dog or cat mode
- **maxRetries**: Maximum number of retries after a crash
- **dogApiUrl**: Likely `https://dog.ceo/api/breeds/image/random`
- **catApiUrl**: Likely `https://cataas.com/cat?json=true`

## Contributors

<a href="https://github.com/abocn/AnimalPicBot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=abocn/AnimalPicBot" alt="Profile pictures of AnimalPicBot contributors" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## License

BSD-3-Clause - 2024 ABOCN Contributors.
