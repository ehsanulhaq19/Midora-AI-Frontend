import OpenAIIcon from '../assets/icons/openai.svg';
import ClaudeIcon from '../assets/icons/claude.svg';
import GeminiIcon from '../assets/icons/gemini.svg';

export const MODEL_ICONS = {
  openai: <img src={OpenAIIcon} alt="OpenAI" className="h-5 w-5 inline-block" />,
  anthropic: <img src={ClaudeIcon} alt="Claude" className="h-5 w-5 inline-block" />,
  google: <img src={GeminiIcon} alt="Gemini" className="h-5 w-5 inline-block" />,
};

export const PROVIDER_LABELS = {
  openai: 'OpenAI',
  anthropic: 'Claude',
  google: 'Gemini',
};
