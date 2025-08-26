import React, { useState } from 'react';

function MyTickets({ tickets, loading }) {
  const [hoveredTicket, setHoveredTicket] = useState(null);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Retrieving your quantum tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌠</div>
        <h3>No Tickets Found</h3>
        <p>You haven't purchased any tickets yet. Explore available tickets to add to your collection.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => document.querySelector('.tab[data-tab="available"]')?.click()}
        >
          Explore Tickets
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
        <h2 className="section-title">Your Quantum Collection</h2>
        <p className="section-subtitle">Manage your purchased and reserved tickets</p>
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
                  <span className="detail-icon">🕒</span>
                  <span className="detail-text">Purchased on {formatDate(ticket.purchaseDate || ticket.createdAt)}</span>
                </div>
                
                <div className="ticket-detail">
                  <span className="detail-icon">🎟️</span>
                  <span className="detail-text">Ticket #{ticket.id.toString().slice(-6)}</span>
                </div>
              </div>
            </div>
            
            <div className="ticket-footer">
              <div className="ticket-price">{ticket.price.toLocaleString()} ICP</div>
              
              <div className="ticket-badge">
                {ticket.status === 'reserved' && (
                  <div className={`badge-pulse ${hoveredTicket === ticket.id ? 'active' : ''}`}>
                    <span className="badge-icon">🔔</span>
                    <span>Reserved</span>
                  </div>
                )}
                {ticket.status === 'sold' && (
                  <div className="badge-verified">
                    <span className="badge-icon">✔️</span>
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyTickets;
