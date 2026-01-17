import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../services/api';

const Donate = () => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const presetAmounts = [101, 501, 1001, 2100, 5001, 11000];

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const getFinalAmount = () => {
    return customAmount ? parseInt(customAmount) : amount;
  };

  const handleProceed = async () => {
    const finalAmount = getFinalAmount();
    if (!finalAmount || finalAmount < 1) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await donationAPI.createOrder(finalAmount);
      setOrderDetails(response.data);
      setStep(2);
    } catch (error) {
      alert('Failed to create donation order. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (isSuccess) => {
    setLoading(true);
    try {
      await donationAPI.updateStatus({
        orderId: orderDetails.id,
        isSuccess: isSuccess,
        gatewayResponse: isSuccess ? 'Payment_Successful' : 'Payment_Failed',
      });
      setResult(isSuccess ? 'success' : 'failed');
      setStep(3);
    } catch (error) {
      alert('Failed to update payment status.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="donate-step">
      <div className="step-header">
        <h2>Choose Donation Amount</h2>
        <p>Select a preset amount or enter your own</p>
      </div>

      <div className="amount-grid">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            className={`amount-btn ${amount === preset ? 'selected' : ''}`}
            onClick={() => handleAmountSelect(preset)}
          >
            ₹{preset.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="custom-amount-section">
        <label htmlFor="customAmount">Or enter custom amount</label>
        <div className="custom-amount-input">
          <span className="currency-symbol">₹</span>
          <input
            type="number"
            id="customAmount"
            value={customAmount}
            onChange={handleCustomAmount}
            placeholder="Enter amount"
            min="1"
          />
        </div>
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={handleProceed}
        disabled={!getFinalAmount() || loading}
      >
        {loading ? (
          <span className="loading-spinner"></span>
        ) : (
          <>Proceed to Donate ₹{getFinalAmount()?.toLocaleString() || 0}</>
        )}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="donate-step payment-step">
      <div className="step-header">
        <h2>Payment Gateway (Sandbox)</h2>
        <p>This is a simulated payment for testing purposes</p>
      </div>

      <div className="order-summary">
        <div className="summary-row">
          <span>Order ID</span>
          <span className="order-id">{orderDetails?.id}</span>
        </div>
        <div className="summary-row">
          <span>Amount</span>
          <span className="amount">₹{orderDetails?.amount?.toLocaleString()}</span>
        </div>
        <div className="summary-row">
          <span>Currency</span>
          <span>{orderDetails?.currency}</span>
        </div>
        <div className="summary-row">
          <span>Gateway</span>
          <span>{orderDetails?.gateway}</span>
        </div>
      </div>

      <div className="payment-simulation">
        <h3>Simulate Payment Result</h3>
        <p>In production, this would redirect to a real payment gateway.</p>
        
        <div className="payment-buttons">
          <button
            className="btn btn-success"
            onClick={() => handlePayment(true)}
            disabled={loading}
          >
            {loading ? <span className="loading-spinner"></span> : <>Simulate Success</>}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handlePayment(false)}
            disabled={loading}
          >
            {loading ? <span className="loading-spinner"></span> : <>Simulate Failure</>}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="donate-step result-step">
      {result === 'success' ? (
        <div className="result-content success">
          <div className="result-icon">✅</div>
          <h2>Donation Successful</h2>
          <p>₹{orderDetails?.amount?.toLocaleString()} recorded successfully.</p>
          <div className="result-details">
            <p><strong>Transaction ID:</strong> {orderDetails?.id}</p>
          </div>
          <div className="result-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              View Dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setStep(1);
              setAmount('');
              setCustomAmount('');
              setOrderDetails(null);
              setResult(null);
            }}>
              Donate Again
            </button>
          </div>
        </div>
      ) : (
        <div className="result-content failed">
          <div className="result-icon">❌</div>
          <h2>Payment Failed</h2>
          <p>We couldn't process your payment. Please try again.</p>
          <div className="result-buttons">
            <button className="btn btn-primary" onClick={() => {
              setStep(1);
              setAmount('');
              setCustomAmount('');
              setOrderDetails(null);
              setResult(null);
            }}>
              Try Again
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="donate-page">
      <div className="container">
        <div className="donate-container">
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Amount</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Payment</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Complete</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="donate-content">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Donate;
