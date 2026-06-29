# Contributing to GenLayer Reputation Oracle

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Basic understanding of React, TypeScript, and blockchain concepts
- Familiarity with GenLayer Intelligent Contracts (Python)

### Local Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/genlayer-reputation-oracle.git
cd genlayer-reputation-oracle

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 How to Contribute

### Reporting Bugs

1. Check existing [Issues](https://github.com/YOUR_USERNAME/genlayer-reputation-oracle/issues) first
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, browser)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain why it benefits the project

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test** your changes:
   ```bash
   npm run build
   ```
5. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against `main`

## 💻 Coding Standards

### TypeScript/React

- Use TypeScript for all new files
- Follow existing code style
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable/function names

### Python (Intelligent Contracts)

- Follow PEP 8 style guide
- Document all public methods with docstrings
- Include type hints
- Test on GenLayer Studio before committing

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add entity category filter
fix: resolve wallet connection timeout
docs: update deployment guide
```

## 📁 Project Structure

```
├── contracts/           # GenLayer Intelligent Contracts
│   └── ReputationOracle.py
├── src/
│   ├── components/      # React components
│   ├── config/          # Configuration files
│   ├── context/         # React context providers
│   ├── services/        # API/blockchain services
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── docs/                # Documentation
└── public/              # Static assets
```

## 🧪 Testing

### Frontend

```bash
# Build to check for errors
npm run build

# Run development server
npm run dev
```

### Contracts

1. Open [GenLayer Studio](https://studio.genlayer.com)
2. Paste your contract code
3. Test all methods with sample data
4. Verify consensus behavior

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the issue, not the person

## ❓ Questions?

- Open an issue with the `question` label
- Join the [GenLayer Discord](https://discord.gg/genlayer)

---

Thank you for contributing! 🎉
