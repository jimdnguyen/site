import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import Skills from '../components/Skills';

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

describe('Skills', () => {
  it('renders the skills section', () => {
    render(() => <Skills />);
    expect(document.querySelector('.skills')).toBeInTheDocument();
  });

  it('displays Technical Skills heading', () => {
    render(() => <Skills />);
    expect(screen.getByText(/Technical Skills/i)).toBeInTheDocument();
  });

  it('displays the main heading with accent', () => {
    render(() => <Skills />);
    expect(screen.getByText(/The/i)).toBeInTheDocument();
    expect(screen.getByText('stack')).toBeInTheDocument();
    expect(screen.getByText(/behind the systems/i)).toBeInTheDocument();
  });

  it('renders Backend category with core skills', () => {
    render(() => <Skills />);
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Flask')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Celery')).toBeInTheDocument();
  });

  it('renders Cloud & DevOps category with infrastructure skills', () => {
    render(() => <Skills />);
    expect(screen.getByText('Cloud & DevOps')).toBeInTheDocument();
    expect(screen.getByText('AWS ECS/ECR')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('GitHub Actions')).toBeInTheDocument();
  });

  it('renders AI & Agentic category with relevant tools', () => {
    render(() => <Skills />);
    expect(screen.getByText('AI & Agentic')).toBeInTheDocument();
    expect(screen.getByText('Claude Code')).toBeInTheDocument();
    expect(screen.getByText('Claude Agent SDK')).toBeInTheDocument();
    expect(screen.getByText('MCP')).toBeInTheDocument();
  });

  it('renders Frontend category with web technologies', () => {
    render(() => <Skills />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
  });

  it('renders Tools & Integrations category with third-party services', () => {
    render(() => <Skills />);
    expect(screen.getByText('Tools & Integrations')).toBeInTheDocument();
    expect(screen.getByText('Auth0')).toBeInTheDocument();
    expect(screen.getByText('Stripe')).toBeInTheDocument();
    expect(screen.getByText('Slack')).toBeInTheDocument();
  });

  it('renders all category icons', () => {
    render(() => <Skills />);
    expect(screen.getByText('⚙️')).toBeInTheDocument();
    expect(screen.getByText('☁️')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('🖥️')).toBeInTheDocument();
    expect(screen.getByText('🔧')).toBeInTheDocument();
  });

  it('has the correct section id for anchor navigation', () => {
    render(() => <Skills />);
    const section = document.querySelector('#skills');
    expect(section).toBeInTheDocument();
  });

  it('renders multiple skill tags with proper styling', () => {
    render(() => <Skills />);
    const skillTags = document.querySelectorAll('.skill-tag');
    expect(skillTags.length).toBeGreaterThan(20);
  });

  it('displays REST APIs in backend section', () => {
    render(() => <Skills />);
    expect(screen.getByText('REST APIs')).toBeInTheDocument();
  });

  it('displays AWS Lambda in backend section', () => {
    render(() => <Skills />);
    expect(screen.getByText('AWS Lambda')).toBeInTheDocument();
  });

  it('displays GCP Cloud Run in Cloud & DevOps section', () => {
    render(() => <Skills />);
    expect(screen.getByText('GCP Cloud Run')).toBeInTheDocument();
  });
});
