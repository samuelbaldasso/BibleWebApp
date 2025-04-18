# Bible Web App

A modern, responsive web application for reading and studying the Bible. This app provides an intuitive interface for navigating through Bible books, chapters, and verses with support for multiple translations.

## Features

- 📖 Read Bible verses with a clean, distraction-free interface
- 📚 Browse books and chapters with an intuitive navigation system
- 🔄 Switch between different Bible translations/versions
- 🔍 Search functionality for finding specific verses or topics
- 📱 Fully responsive design that works on desktop, tablet, and mobile devices
- ⚡ Fast, client-side navigation between chapters
- 🔌 Offline fallback content when API is unavailable

## Technologies Used

- **React** - Frontend UI library
- **Next.js** - React framework for server-side rendering and static site generation
- **TypeScript** - For type-safe code
- **Tailwind CSS** - For styling
- **Lucide React** - For icons
- **Bible API** - For fetching Bible content

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/samuelbaldasso/BibleWebApp.git
   cd BibleWebApp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Add your Bible API key in the configuration file.**

4. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.**

## Project Structure

```
├── components/        # Reusable UI components
├── pages/             # Next.js pages
├── services/          # API integration
├── styles/           # Tailwind CSS styles
├── public/            # Static assets
├── .env               # Environment variables (API key, etc.)
└── README.md          # Project documentation
```

## Bible API Integration

This project uses a **Bible API** to fetch content. The app supports fallback content in case the API is unavailable.

To use a different Bible API:

- Update the API endpoints in `services/bible-service.ts`
- Adjust the response parsing logic to match the new API's structure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. **Fork the repository**
2. **Create your feature branch:**
   ```sh
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```sh
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```sh
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Bible API** for providing Bible content
- **Tailwind CSS** for the styling framework
- **Next.js** for the React framework
- **All contributors** who participate in this project

---

**Made with ❤️ by Samuel Baldasso**