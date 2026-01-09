import React, { useState } from 'react';
import { Goal } from '../models/types';
import { submitCheckIn } from '../api/partnerApi';

interface GoalCardProps {
  goal: Goal;
  token: string;
  onCheckInSuccess: (goalId: string, lastCheckIn: { score: number; comment: string; date: string }) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, token, onCheckInSuccess }) => {
  const [score, setScore] = useState<number | ''>('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score === '' || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');
    try {
      await submitCheckIn(token, {
        goalId: goal.id,
        score: score as number,
        comment: comment || null,
      });
      const now = new Date().toISOString();
      onCheckInSuccess(goal.id, { score: score as number, comment: comment || '', date: now });
      setScore('');
      setComment('');
      setMessage('Check-in submitted successfully');
    } catch (error) {
      setMessage('Failed to submit check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0' }}>
      <h3>{goal.title}</h3>
      {goal.lastCheckIn ? (
        <div>
          <p>Last check-in: Score {goal.lastCheckIn.score}, Comment: {goal.lastCheckIn.comment}, Date: {formatDate(goal.lastCheckIn.date)}</p>
        </div>
      ) : (
        <p>No check-in yet</p>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Score (1-4):
          <select value={score} onChange={(e) => setScore(e.target.value ? parseInt(e.target.value) : '')} required>
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
        <br />
        <label>
          Comment (optional):
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <br />
        <button type="submit" disabled={isSubmitting || score === ''}>
          {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GoalCard;