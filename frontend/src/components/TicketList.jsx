import React, { useState } from 'react';

function TicketList({ tickets, loading, onReserve, onPurchase }) {
  const [hoveredTicket, setHoveredTicket] = useState(null);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Discovering quantum tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎫</div>
        <h3>No Tickets Found</h3>
        <p>Be the first to create an amazing event ticket!</p>
        <button 
          className="btn btn-primary" 
          onClick={() => document.querySelector('.tab[data-tab="create"]')?.click()}
        >
          Create Ticket
        </button>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    // Convert nanoseconds to milliseconds
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'reserved':
        return 'status-reserved';
      case 'sold':
        return 'status-sold';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'reserved':
        return 'Reserved';
      case 'sold':
        return 'Sold';
      default:
        return status;
    }
  };

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Explore Quantum Tickets</h2>
        <p className="section-subtitle">Discover unique experiences on the Internet Computer</p>
      </div>
      
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className="ticket-item"
            onMouseEnter={() => setHoveredTicket(ticket.id)}
            onMouseLeave={() => setHoveredTicket(null)}
          >
            <div className="ticket-glow"></div>
            
            <div className="ticket-header">
              <h3>{ticket.name}</h3>
              <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                {getStatusText(ticket.status)}
              </span>
            </div>
            
            <div className="ticket-body">
              <div className="ticket-description">{ticket.description}</div>
              
              <div className="ticket-details">
                <div className="ticket-detail">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">{formatDate(ticket.eventDate)}</span>
                </div>
                
                <div className="ticket-detail">
                  <span className="detail-icon">🔄</span>
                  <span className="detail-text">Created {formatDate(ticket.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="ticket-footer">
              <div className="ticket-price">{ticket.price.toLocaleString()} ICP</div>
              
              <div className="ticket-actions">
                {ticket.status === 'available' && (
                  <>
                    <button 
                      className={`btn btn-primary btn-action ${hoveredTicket === ticket.id ? 'btn-pulse' : ''}`}
                      onClick={() => onReserve(ticket.id)}
                    >
                      <span className="btn-icon">🔖</span>
                      <span>Reserve</span>
                    </button>
                    <button 
                      className="btn btn-secondary btn-action"
                      onClick={() => onPurchase(ticket.id)}
                    >
                      <span className="btn-icon">💎</span>
                      <span>Purchase</span>
                    </button>
                  </>
                )}
                
                {ticket.status === 'reserved' && (
                  <button 
                    className="btn btn-secondary btn-action"
                    onClick={() => onPurchase(ticket.id)}
                  >
                    <span className="btn-icon">✨</span>
                    <span>Complete Purchase</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TicketList;
