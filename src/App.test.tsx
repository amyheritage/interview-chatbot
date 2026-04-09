import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock GoogleGenAI
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      constructor() {}
      get chats() {
        return {
          create: vi.fn(),
        };
      }
    },
  };
});

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('App Component', () => {
  it('renders the setup screen initially', () => {
    render(<App />);
    expect(screen.getByText('Interview Prep')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter the role/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Interview with Tina/i)).toBeInTheDocument();
  });

  it('updates the role input value', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter the role/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Software Engineer' } });
    expect(input.value).toBe('Software Engineer');
  });

  it('enables the start button when role is entered', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter the role/i);
    const button = screen.getByText(/Start Interview with Tina/i);
    
    expect(button).toBeDisabled();
    
    fireEvent.change(input, { target: { value: 'Software Engineer' } });
    expect(button).not.toBeDisabled();
  });

  it('resets the state when handleReset is called', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter the role/i);
    const button = screen.getByText(/Start Interview with Tina/i);
    
    fireEvent.change(input, { target: { value: 'Software Engineer' } });
    fireEvent.click(button);
    
    // After clicking start, we should see the chat header
    expect(screen.getByText('Tina')).toBeInTheDocument();
    
    const resetButton = screen.getByTitle('Restart Interview');
    fireEvent.click(resetButton);
    
    // Should be back to setup screen
    expect(screen.getByText('Interview Prep')).toBeInTheDocument();
  });
});
