import React, { useState } from 'react';

function CreateTicket({ onCreateTicket }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !description || !price || !eventDate) {
      setError('Please fill in all fields');
      return;
    }

    // Convert price to number
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Price must be a positive number');
      return;
    }

    // Convert date to timestamp (nanoseconds)
    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj.getTime())) {
      setError('Please enter a valid date');
      return;
    }
    
    // Convert to nanoseconds (ICP's Time format)
    const eventDateNanos = BigInt(eventDateObj.getTime() * 1000000);

    setLoading(true);
    setError('');
    
    try {
      // Create ticket request object
      const ticketRequest = {
        name,
        description,
        price: priceNumber,
        eventDate: eventDateNanos
      };
      
      // Call the onCreateTicket function passed from parent
      const success = await onCreateTicket(ticketRequest);
      
      if (success) {
        setSuccess('Ticket created successfully!');
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setEventDate('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('Failed to create ticket. Please try again.');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('An error occurred while creating the ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Create Quantum Ticket</h2>
        <p className="section-subtitle">Launch your event on the Internet Computer</p>
      </div>
      
      <div className="create-ticket-container">
        <div className="create-ticket-card">
          <div className="create-ticket-glow"></div>
          
          {error && (
            <div className="alert alert-error">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">{error}</div>
              <button className="alert-close" onClick={() => setError('')}>×</button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <div className="alert-icon">✅</div>
              <div className="alert-content">{success}</div>
              <button className="alert-close" onClick={() => setSuccess('')}>×</button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="create-ticket-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="form-icon">🏷️</span>
                Ticket Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter an attractive ticket name"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <span className="form-icon">📝</span>
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event in detail"
                rows="4"
                disabled={loading}
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  <span className="form-icon">💰</span>
                  Price (ICP)
                </label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    id="price"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                  <span className="input-icon">ICP</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="eventDate" className="form-label">
                  <span className="form-icon">📅</span>
                  Event Date
                </label>
                <input
                  type="datetime-local"
                  id="eventDate"
                  className="form-control"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary btn-create ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  <span>Create Quantum Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="create-ticket-preview">
          <div className="preview-header">
            <h3>Ticket Preview</h3>
          </div>
          
          <div className="ticket-preview-card">
            <div className="ticket-header">
              <h3>{name || "Ticket Name"}</h3>
              <span className="ticket-status status-available">Preview</span>
            </div>
            
            <div className="ticket-body">
              <div className="ticket-description">
                {description || "Your ticket description will appear here"}
              </div>
              
              <div className="ticket-details">
                <div className="ticket-detail">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">
                    {eventDate ? new Date(eventDate).toLocaleString() : "Event date will appear here"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="ticket-footer">
              <div className="ticket-price">{price || "0.00"} ICP</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTicket;
