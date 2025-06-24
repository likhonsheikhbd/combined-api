# Geploy AI - Multi-Model Chat Interface

A powerful, prompt-switchable chat interface that integrates multiple AI models including Gemini, GPT, and Claude. Built with Next.js 14, TypeScript, Tailwind CSS, and integrated with the Combined API at https://combined-api.vercel.app/.

## ✨ Features

- 🤖 **Multiple AI Models**: Support for Gemini 1.5, GPT-4, Claude 3.5, and more
- 🔄 **Prompt Switching**: Choose from different AI personality prompts (V0.dev, Cursor, GPT-4o, Claude, etc.)
- ⚡ **Real-time Streaming**: Live response streaming with performance monitoring
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark/Light Theme**: Full theme support with system preference detection
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🛡️ **Error Boundaries**: Robust error handling and recovery
- 🔌 **API Integration**: Seamlessly integrated with Combined API service
- 📊 **Performance Monitoring**: Real-time latency and throughput tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/likhonsdev/geploy-ai.git
   cd geploy-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Core Components

- **ChatInterface**: Main chat component with model selection
- **ChatSDK Hook**: Custom hook for API integration and state management
- **ErrorBoundary**: React error boundary for graceful error handling
- **Footer**: Developer information and project links

### API Integration

The application integrates with the Combined API service at `https://combined-api.vercel.app/` which provides:

- Unified interface for multiple AI providers
- Real-time streaming responses
- Model switching capabilities
- Performance optimization

### State Management

- **React Hooks**: Custom hooks for chat state management
- **Local State**: Component-level state for UI interactions
- **Error Handling**: Comprehensive error boundaries and recovery

## 🎯 Available Models

### Gemini Models
- **Gemini 1.5 Pro**: Most capable model for complex reasoning
- **Gemini 1.5 Flash**: Fast, efficient model optimized for speed

### OpenAI Models
- **GPT-4 Turbo**: Latest GPT-4 model with improved capabilities
- **GPT-3.5 Turbo**: Fast and efficient conversational AI

### Anthropic Models
- **Claude 3.5 Sonnet**: Advanced reasoning and analysis capabilities

## 🛠️ Development

### Project Structure

\`\`\`
geploy-ai/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chat-interface.tsx # Main chat interface
│   ├── footer.tsx        # Footer component
│   └── error-boundary.tsx # Error boundary
├── hooks/                # Custom React hooks
│   └── use-chat-sdk.ts   # Chat SDK integration hook
├── lib/                  # Utility functions
│   ├── api-client.ts     # API client for Combined API
│   └── model-configs.ts  # Model configurations
└── styles/               # Global styles
\`\`\`

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Likhon Sheikh**
- Telegram: [@likhonsheikh](https://t.me/likhonsheikh)
- GitHub: [@likhonsdev](https://github.com/likhonsdev)

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for the AI SDK and hosting platform
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Next.js](https://nextjs.org) for the React framework

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/likhonsdev">Likhon Sheikh</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
