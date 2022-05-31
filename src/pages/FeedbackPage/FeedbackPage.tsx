import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { darkModeState } from '@store';

import '@translations/i18n';
import './feedbackpage.scss';

export const FeedbackPage = () => {
  const [userRating, setUserRating] = useState(5);
  const [userFeedback, setUserFeedback] = useState('');
  const darkModeStatus = useRecoilValue(darkModeState);

  async function submitToAPI(feedback: string) {
    const URL = 'https://tpzmoaw42e.execute-api.eu-west-1.amazonaws.com/prod/contact';
    const updatedFeedback = `Rating : ${userRating}\n${feedback}`;
    fetch(URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFeedback),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Thank you so much for your feedback! We will improve.');
        setUserFeedback('');
        setUserRating(0);
      })
      .catch(() => {
        alert("Aww... So sorry something went wrong. Please try emailing. We'd love to hear from you!");
      });
  }
  const { t } = useTranslation();

  return (
    <div id="feedback-container">
      <Container fluid>
        <div style={{ color: `${darkModeStatus ? 'white' : 'black'}` }}>
          <p id="feedback-line-1">{t('opinion')}</p>
          <h1 id="feedback-line-2">
            {' '}
            {t('rate')}
          </h1>
          <div className="rating">
            {[...Array(5).keys()].map((index) => {
              const idx = index + 1;
              return (
                <button
                  id="userRating-btn"
                  type="button"
                  key={idx}
                  className={idx <= userRating ? 'decided' : 'notDecided'}
                  onClick={() => { setUserRating(idx); }}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          <h5 id="feedback-line-3">{t('experience')}</h5>
          <textarea
            id="feedback-textbox"
            value={userFeedback}
            onChange={(e) => { setUserFeedback(e.target.value); }}
            placeholder={t('feedbackPlaceholder')}
          />
          <p id="feedback-line-4">{t('anonymousFeedback')}</p>
          <Button id="feedback-submit-btn" onClick={() => { submitToAPI(userFeedback); }}>
            {' '}
            {t('submit')}
          </Button>
        </div>
      </Container>
    </div>
  );
};
