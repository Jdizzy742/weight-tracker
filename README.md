# 🏋️‍♀️ Weight Tracker - AI-Powered Nutrition Coach

> A behaviorally-informed nutrition tracking app that uses AI coaching to help users build sustainable healthy habits through consistency and evidence-based insights.

[View Project Roadmap](PROJECT_ROADMAP.md)

## 🎯 Vision

Weight Tracker isn't just another fitness app - it's your knowledgeable best friend who helps you understand your body's patterns and build lasting healthy habits. Using behavioral science principles and AI coaching, we make nutrition tracking feel human, encouraging, and actually helpful.

## ✨ Key Features

### 🤖 AI Coach Tier
- **Personal AI Nutritionist** trained on research literature
- **Daily Progress Stories** that make your data meaningful
- **Smart Pattern Recognition** with actionable insights
- **Best-Friend Tone** - encouraging, never clinical

### 📊 Smart Analytics
- **Behavioral Science Design** to reduce overwhelm
- **7 & 30-Day Trend Analysis** with visual storytelling
- **Progressive Disclosure** - one insight at a time
- **Consistency Tracking** to build sustainable habits

### 🎨 Human-Centered Design
- **Calm & Inviting** meditation-app inspired aesthetic
- **Instagram-Familiar** navigation patterns
- **Warm Color Palette** - sage greens, soft blues, earth tones
- **Encouraging Micro-Interactions** that celebrate progress

## 🏗️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (warm, inviting design system)
- Recharts (beautiful data visualization)
- Zustand (simple state management)
- PWA with offline capability

**Backend**
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- OpenAI API (AI coaching)
- Vector Database (RAG system)

## 💰 Pricing Tiers

| Feature | Free | Premium ($4.99/mo) | AI Coach ($14.99/mo) |
|---------|------|-------------------|----------------------|
| Core Tracking | ✅ | ✅ | ✅ |
| 7-Day Averages | ✅ | ✅ | ✅ |
| 30-Day Trends | ❌ | ✅ | ✅ |
| Data Export | ❌ | ✅ | ✅ |
| AI Insights | ❌ | ❌ | ✅ |
| Daily Stories | ❌ | ❌ | ✅ |
| Smart Nudges | ❌ | ❌ | ✅ |

## 🚀 Development Roadmap

📋 **[View Complete Project Roadmap](PROJECT_ROADMAP.md)**

### Current Status: MVP Development (Month 1)
- [x] Project planning and architecture design
- [ ] Backend setup (Node.js + PostgreSQL)
- [ ] React frontend with design system
- [ ] Core data entry and visualization
- [ ] User authentication

### Upcoming Milestones
- **Month 2**: PWA + Data visualization + App Store prep
- **Month 3**: AI coaching development + Premium tiers
- **Month 4**: Marketing launch + User acquisition
- **Month 5-6**: Advanced features + Coach platform

## 🧠 Behavioral Science Principles

Our UX is designed around proven cognitive principles:

1. **Progressive Disclosure** - Prevent decision paralysis with one insight per screen
2. **Context Switching Reduction** - Centralized conversational interface
3. **Gestalt Grouping** - Related data presented as coherent stories
4. **Low Activation Energy** - Smart suggestions and gentle nudges

## 🎨 Design Philosophy

**"Your Knowledgeable Best Friend"**

We believe health tracking should feel like talking to a supportive friend who has 6-12 months more experience than you. Our design prioritizes:

- **Warmth over sterility** - Soft colors, friendly language
- **Encouragement over judgment** - Celebrating small wins
- **Partnership over coaching** - "Let's" instead of "you should"
- **Human over robotic** - Conversational AI that feels genuine

## 🔬 Target Market

### Primary Users
- **Serious fitness enthusiasts** seeking detailed tracking
- **Athletes** needing comprehensive nutrition insights
- **Health-conscious individuals** wanting sustainable habits

### Professional Market
- **Nutrition coaches** managing multiple clients
- **Personal trainers** offering comprehensive services
- **Healthcare providers** supporting patient wellness

## 🌟 Competitive Advantages

| Us | Typical Fitness Apps |
|----|---------------------|
| AI coach with research backing | Generic suggestions |
| Behavioral science UX | Feature-heavy interfaces |
| Warm, human-centered design | Clinical or gamified UI |
| Daily narrative insights | Raw data dumps |
| Evidence-based recommendations | Opinion-based advice |

## 🛠️ Getting Started (Development)

### Prerequisites
- Node.js 18+
- PostgreSQL
- OpenAI API key (for AI features)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Jdizzy742/weight-tracker.git
cd weight-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@localhost:5432/weight_tracker
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

## 📱 App Store Strategy

### Marketing Approach
- **Educational Content**: "What are macros?", "How to count carbs"
- **Instagram Marketing**: Feature demonstrations with Canva
- **SEO-Focused Blog**: Nutrition and fitness educational content
- **Professional Network**: Targeting nutrition coaches and trainers

### Success Metrics
- 1,000+ daily active users within 12 months
- 70%+ user retention after 30 days
- 15%+ conversion to AI coaching tier
- Positive user feedback on AI coaching effectiveness

## 🤝 Contributing

This is currently a solo project, but the codebase is designed to be maintainable and scalable. If you're interested in the intersection of behavioral science, AI, and health technology, feel free to:

- Open issues for bugs or feature suggestions
- Submit PRs for improvements
- Share feedback on the user experience
- Contribute to the educational content library

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Contact

**Solo Developer**: Building the future of human-centered nutrition coaching

- **GitHub**: [@Jdizzy742](https://github.com/Jdizzy742)
- **Project Updates**: Watch this repo for development progress

---

*"The best nutrition coach is the one who helps you become your own expert. We're building technology to make that possible."*

**⭐ Star this repo if you believe in human-centered AI coaching for health and wellness!**
