import { render, screen } from '@solidjs/testing-library'
import { describe, it, expect, beforeEach } from 'vitest'
import Timeline from '../components/Timeline'

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  }
})

describe('Timeline', () => {
  it('renders the career section', () => {
    render(() => <Timeline />)
    expect(document.querySelector('#career')).toBeInTheDocument()
  })

  it('displays Career Journey label', () => {
    render(() => <Timeline />)
    expect(screen.getByText(/Career Journey/i)).toBeInTheDocument()
  })

  it('displays the section heading', () => {
    render(() => <Timeline />)
    expect(screen.getByText(/From intern to/i)).toBeInTheDocument()
    // heading accent span contains exactly this text
    expect(screen.getByText('founding engineer.')).toBeInTheDocument()
  })

  it('renders timeline items for each role', () => {
    render(() => <Timeline />)
    expect(screen.getByText('Software Engineer I')).toBeInTheDocument()
    expect(screen.getByText('Intern Software Engineer')).toBeInTheDocument()
  })

  it('displays the founding engineer badge', () => {
    render(() => <Timeline />)
    expect(screen.getByText('Founding Engineer')).toBeInTheDocument()
  })

  it('displays company names', () => {
    render(() => <Timeline />)
    expect(screen.getAllByText(/ComplyAi/i).length).toBeGreaterThan(0)
  })
})
