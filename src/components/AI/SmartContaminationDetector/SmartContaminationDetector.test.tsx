import React from 'react';
import { render, screen } from '../../../utils/testUtils'; // Import our custom render
import { SmartContaminationDetector } from './SmartContaminationDetector';
import { AIService } from '../../../services/aiService';

// We "mock" the AI service to prevent it from loading real models during a test.
jest.mock('../../../services/aiService');

describe('SmartContaminationDetector', () => {
  it('renders the main title and alert message correctly', () => {
    // 1. Render the component using our custom render function
    render(<SmartContaminationDetector />);

    // 2. Find elements on the screen
    const titleElement = screen.getByText(/Smart Contamination Source Detection/i);
    const alertElement = screen.getByText(/AI analyzes pollution patterns/i);

    // 3. Assert that the elements exist in the document
    expect(titleElement).toBeInTheDocument();
    expect(alertElement).toBeInTheDocument();
  });
});