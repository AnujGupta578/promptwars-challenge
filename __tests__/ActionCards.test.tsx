import { render, screen } from '@testing-library/react';
import ActionCards from '../src/components/ui/ActionCards';

describe('ActionCards', () => {
  it('renders nothing when plan is null', () => {
    const { container } = render(<ActionCards plan={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the action plan correctly', () => {
    const mockPlan = {
      category: 'Medical Emergency',
      priority: 'CRITICAL' as const,
      summary: 'Patient has a severe wound requiring immediate care.',
      steps: ['Apply pressure to the wound.', 'Call emergency services.'],
      requiresVerification: true,
    };

    render(<ActionCards plan={mockPlan} />);

    expect(screen.getByText('Medical Emergency')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL PRIORITY')).toBeInTheDocument();
    expect(screen.getByText('Patient has a severe wound requiring immediate care.')).toBeInTheDocument();
    expect(screen.getByText('Apply pressure to the wound.')).toBeInTheDocument();
    
    // Verify Warning label is present
    expect(screen.getByText(/Verification Required:/i)).toBeInTheDocument();
  });
});
