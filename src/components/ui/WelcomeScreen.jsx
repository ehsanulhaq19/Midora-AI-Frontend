// components/ui/WelcomeScreen.jsx
const WelcomeScreen = ({ onPromptSelect }) => {
  const prompts = [
    {
      icon: '💻',
      title: 'Code Assistant',
      description: 'Write, debug, and explain code',
      prompt: 'Write a Python function to calculate fibonacci numbers'
    },
    {
      icon: '🧠',
      title: 'Explain Concepts',
      description: 'Break down complex topics',
      prompt: 'Explain quantum computing in simple terms'
    },
    {
      icon: '📋',
      title: 'Planning & Strategy',
      description: 'Organize and plan effectively',
      prompt: 'Help me plan a productive morning routine'
    },
    {
      icon: '✨',
      title: 'Creative Writing',
      description: 'Stories, poems, and creative content',
      prompt: 'Write a creative story about time travel'
    }
  ];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div style={{
          fontSize: '60px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, var(--chatgpt-button) 0%, #667eea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🤖
        </div>

        <h1 className="text-5xl font-semibold mb-6" style={{ color: 'var(--chatgpt-text)' }}>
          AskWiseToday
        </h1>

        <div className="text-xl mb-8" style={{ color: 'var(--chatgpt-text-secondary)' }}>
          How can I help you today?
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
          {prompts.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg cursor-pointer transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--chatgpt-hover)',
                border: '1px solid var(--chatgpt-border)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => onPromptSelect(item.prompt)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                color: 'var(--chatgpt-text)',
                fontWeight: '500',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.title}
              </div>
              <div style={{
                color: 'var(--chatgpt-text-secondary)',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '32px',
          fontSize: '14px',
          color: 'var(--chatgpt-text-secondary)',
          opacity: 0.8
        }}>
          Start typing or click a suggestion above
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;