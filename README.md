📦 TrackMateBot

TrackMateBot is a test project developed to explore web scraping techniques and Telegram bot integration. The bot allows users to monitor product prices on Amazon and eBay, providing notifications upon price changes.

🚀 Features
                      
    - Track product prices from Amazon and eBay.
    - Receive Telegram notifications when prices change.
    - Manage a personalized list of tracked products.
    
🛠️ Technologies Used

    - Node.js with TypeScript for robust application development.
    - Telegraf for seamless Telegram bot interactions.
    - Puppeteer for efficient web scraping.
    - Sequelize ORM with SQLite for database management.
    - Node-schedule for scheduling periodic tasks.

📦 Installation

    - Clone the repository:

      `git clone https://github.com/zhelikovskiy/TrackMateBot.git
      cd TrackMateBot`

    - Install dependencies:

      `npm install`

    - Create a .env file in the root directory and add your Telegram bot token:

      `BOT_TOKEN=your_telegram_bot_token`

    - Build the project:

      `npm run build`

    - Start the bot:

      `npm start`

    - For development with automatic restarts on code changes:

    `npm run dev`

🧪 Commands
      - `/start` - Start the bot
      - `/help` - Show this help message
      - `/check <url>` - Check item price
      - `/track <url>` - Track an item
      - `/list` - List tracked items
      - `/remove <itemId>` - Remove an item from tracking

📝 Notes

    This project is intended for educational purposes to practice web scraping and bot development.

