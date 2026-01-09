import React, { useEffect, useState } from 'react';
import Loading from './components/Loading';
import GoalCard from './components/GoalCard';
import { getContext } from './api/partnerApi';
import { ContextResponse, Goal } from './models/types';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [context, setContext] = useState<ContextResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid or missing access link');
      setLoading(false);
      return;
    }
    setToken(tokenFromUrl);
    // Do not log the token
    fetchContext(tokenFromUrl);
  }, []);

  const fetchContext = async (token: string) => {
    try {
      const data = await getContext(token);
      setContext(data);
    } catch (err) {
      setError('Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSuccess = (goalId: string, lastCheckIn: { score: number; comment: string; date: string }) => {
    if (!context) return;
    const updatedGoals = context.goals.map((goal: Goal) =>
      goal.id === goalId ? { ...goal, lastCheckIn } : goal
    );
    setContext({ ...context, goals: updatedGoals });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!context) {
    return <div>Unexpected error</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{context.partner.name}</h1>
      {context.goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          token={token!}
          onCheckInSuccess={handleCheckInSuccess}
        />
      ))}
    </div>
  );
};

export default App;
