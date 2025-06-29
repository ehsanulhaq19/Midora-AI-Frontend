# flexai-frontend
This repository contains the backend service for FlexAI.ai, built with FastAPI and designed for scalable AI operations. Core features include:

- Multi-AI `/ask` endpoint (GPT-4, Claude, Gemini-ready)
- MySQL data models (User, Query, Subscription, Alert, DCAPlan)
- JWT-based user authentication
- Redis + Celery for async tasks (stock alerts, scheduled jobs)
- Stripe integration for subscriptions
- RESTful API structure and modular services
