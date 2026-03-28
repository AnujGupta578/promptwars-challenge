import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ActionCards from '@/components/ui/ActionCards';
import { ActionPlan } from '@/lib/agents/specialized/StrategyAgent';

expect.extend(toHaveNoViolations);

const mockPlan: ActionPlan = {
  category: 'MEDICAL',
  priority: 'CRITICAL',
  summary: 'Patient is unresponsive.',
  steps: ['Call 911', 'Check pulse', 'Start CPR'],
  requiresVerification: true,
  location: { lat: 0, lng: 0, label: 'Standard Hospital' }
};

describe('Accessibility Audit for ActionCards', () => {
  it('should have no WCAG accessibility violations', async () => {
    const { container } = render(<ActionCards plan={mockPlan} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible labels for priority icons', async () => {
    const { getByText } = render(<ActionCards plan={mockPlan} />);
    expect(getByText(/CRITICAL PRIORITY/i)).toBeInTheDocument();
  });
});
