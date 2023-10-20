import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Registration from './Registration';

/**
 * For writing unit tests, i refered below source and modified to use it mine code
 *https://stackoverflow.com/questions/75609248/react-test-for-checking-firebase-auth-user-not-found-is-failing [Accessed:30 June 2023]
 */
describe('Registration', () => {
  it('should show an error message if name contains invalid characters', () => {
    render(<Registration />);
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: '123' } });
    const errorMessage = screen.getByText('Name should contain only letters');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show an error message if email has an invalid format', () => {
    render(<Registration />);
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    const errorMessage = screen.getByText('Invalid email format');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show an error message if password is too short', () => {
    render(<Registration />);
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    const errorMessage = screen.getByText('Password should contain at least 8 characters, including letters and digits');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should submit the form if all inputs are valid', () => {
    render(<Registration />);
    const nameInput = screen.getByPlaceholderText('Name');
    const locationInput = screen.getByPlaceholderText('Location');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(nameInput, { target: { value: 'rachel' } });
    fireEvent.change(locationInput, { target: { value: 'halifax' } });
    fireEvent.change(emailInput, { target: { value: 'rachel.p@dal.ca' } });
    fireEvent.change(passwordInput, { target: { value: 'rachel@123' } });
    const submitButton = screen.getByText('Register');
    fireEvent.click(submitButton);
  });
});
