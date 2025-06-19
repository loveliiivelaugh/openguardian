import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from './AuthForm';

describe('AuthForm Component', () => {
  it('renders the form with email and password fields', () => {
    render(<AuthForm />);
  
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('displays the submit button and Cancel button', () => {
    render(<AuthForm />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  // It's not recommended to test the validation directly through UI, as it would involve a lot of mocking.
  // The better approach is to write unit tests for validators in isolation. This will be more efficient and straightforward.

  // Here we could describe('Validators Unit Tests', () => {
  //   ...
  // });
});
