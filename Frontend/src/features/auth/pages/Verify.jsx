import React from 'react'
import { useNavigate } from 'react-router'
import '../style/verify.scss'

const Verify = () => {
  const navigate = useNavigate()

  return (
    <main className="verify-page">
      <section className="verify-card">
        <div className="verify-card__icon">✅</div>
        <h1 className="verify-card__title">Check your email</h1>
        <p className="verify-card__text">
          We've sent you an email to verify your account. Please check your inbox and click the verification
          link to complete the registration process.
        </p>
        <p className="verify-card__hint">
          If you don't see the email, check your spam or promotions folder. Then return to login after verification.
        </p>
        <div className="verify-card__actions">
          <button
            type="button"
            className="verify-card__button verify-card__button--primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </section>
    </main>
  )
}

export default Verify
