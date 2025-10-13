import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
  const defaultProps = {
    label: 'Test Label',
    id: 'test-input',
  };

  it('should render input with label', () => {
    render(<Input {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render with correct id', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('should display error message when error prop is provided', () => {
    render(<Input {...defaultProps} error="This field is required" />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should apply error styles when error exists', () => {
    render(<Input {...defaultProps} error="Error message" />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not apply error styles when no error', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should link error message to input via aria-describedby', () => {
    render(<Input {...defaultProps} error="Error message" />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Input {...defaultProps} />);
    
    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    await user.type(input, 'Hello World');
    
    expect(input.value).toBe('Hello World');
  });

  it('should accept custom className', () => {
    render(<Input {...defaultProps} className="custom-class" />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input {...defaultProps} ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should handle onChange event', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Input {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test Label');
    await user.type(input, 'a');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should handle onBlur event', async () => {
    const handleBlur = jest.fn();
    const user = userEvent.setup();
    render(<Input {...defaultProps} onBlur={handleBlur} />);
    
    const input = screen.getByLabelText('Test Label');
    await user.click(input);
    await user.tab();
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle onFocus event', async () => {
    const handleFocus = jest.fn();
    const user = userEvent.setup();
    render(<Input {...defaultProps} onFocus={handleFocus} />);
    
    const input = screen.getByLabelText('Test Label');
    await user.click(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('should support different input types', () => {
    render(<Input {...defaultProps} type="password" />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should support placeholder', () => {
    render(<Input {...defaultProps} placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should support disabled state', () => {
    render(<Input {...defaultProps} disabled />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeDisabled();
  });

  it('should support required attribute', () => {
    render(<Input {...defaultProps} required />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeRequired();
  });

  it('should support maxLength attribute', () => {
    render(<Input {...defaultProps} maxLength={10} />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('should support value prop', () => {
    render(<Input {...defaultProps} value="Initial value" readOnly />);
    
    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.value).toBe('Initial value');
  });

  it('should support defaultValue prop', () => {
    render(<Input {...defaultProps} defaultValue="Default value" />);
    
    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.value).toBe('Default value');
  });

  it('should not show error message when error is not provided', () => {
    render(<Input {...defaultProps} />);
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should support autoComplete attribute', () => {
    render(<Input {...defaultProps} autoComplete="off" />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it('should support name attribute', () => {
    render(<Input {...defaultProps} name="test-name" />);
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('name', 'test-name');
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      render(<Input {...defaultProps} />);
      
      const input = screen.getByLabelText('Test Label');
      const label = screen.getByText('Test Label');
      
      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('should announce errors to screen readers', () => {
      render(<Input {...defaultProps} error="Required field" />);
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Required field');
    });

    it('should have accessible error description', () => {
      render(<Input {...defaultProps} error="Invalid input" />);
      
      const input = screen.getByLabelText('Test Label');
      const errorId = `${defaultProps.id}-error`;
      
      expect(input).toHaveAttribute('aria-describedby', errorId);
      expect(screen.getByText('Invalid input')).toHaveAttribute('id', errorId);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label', () => {
      render(<Input label="" id="test" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should handle very long error messages', () => {
      const longError = 'This is a very long error message that should still be displayed correctly without breaking the layout or causing any issues';
      render(<Input {...defaultProps} error={longError} />);
      
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('should handle special characters in label', () => {
      render(<Input label="Test Label (Required) *" id="test" />);
      
      expect(screen.getByText('Test Label (Required) *')).toBeInTheDocument();
    });

    it('should clear input value', async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} />);
      
      const input = screen.getByLabelText('Test Label') as HTMLInputElement;
      await user.type(input, 'Text');
      expect(input.value).toBe('Text');
      
      await user.clear(input);
      expect(input.value).toBe('');
    });
  });
});
