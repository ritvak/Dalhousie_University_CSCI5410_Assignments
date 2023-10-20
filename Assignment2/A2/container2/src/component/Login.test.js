import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginValidation from './Login';

/**
 * For writing unit tests, i refered below source and modified to use it mine code
 *https://stackoverflow.com/questions/75609248/react-test-for-checking-firebase-auth-user-not-found-is-failing [Accessed:30 June 2023]
 */
describe('LoginValidation', () => {
  test('renders email and password input fields', () => {
    render(<LoginValidation />);
  
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
  
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
  
  test('updates email and password state on input change', () => {
    render(<LoginValidation />);
  
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
  
    fireEvent.change(emailInput, { target: { value: 'rt664810@dal.ca' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123456' } });
  
    expect(emailInput.value).toBe('rt664810@dal.ca');
    expect(passwordInput.value).toBe('pass123456');
  });
  
  test('requires email and password fields to be filled', () => {
    render(<LoginValidation />);
  
    const loginButton = screen.getByRole('button', { name: 'Login' });
  
    fireEvent.click(loginButton);
  
    const emailErrorContainer = screen.getByTestId('email-error');
    const passwordErrorContainer = screen.getByTestId('password-error');
  
    expect(emailErrorContainer).toHaveClass('error-message');
    expect(passwordErrorContainer).toHaveClass('error-message');
  });
  
  
  
  test('submits the form when email and password fields are filled', () => {
    render(<LoginValidation />);
  
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
  
    fireEvent.change(emailInput, { target: { value: 'rt664810@dal.ca' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123456' } });
    fireEvent.click(loginButton);
  });
});
