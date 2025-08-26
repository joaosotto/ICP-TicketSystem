import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TicketList from './components/TicketList';
import MyTickets from './components/MyTickets';
import CreateTicket from './components/CreateTicket';

const getAvailableTickets = async () => {
  try {
    console.log("Calling backend getAvailableTickets");
    const tickets = await backend.getAvailableTickets();
    console.log("Received tickets:", tickets);
    return tickets;
  } catch (error) {
    console.error("Error calling backend getAvailableTickets:", error);
    console.log("Falling back to mock data");
    return [
      {
        id: 1,
        name: "Concert Ticket",
        description: "VIP access to the annual blockchain concert",
        price: 100,
        status: "available",
        createdAt: BigInt(Date.now() * 1000000),
        eventDate: BigInt((Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000000), // 7 days from now
        owner: null
      },
      {
        id: 2,
        name: "Conference Pass",
        description: "Full access to the Blockchain Developer Conference",
        price: 200,
        status: "available",
        createdAt: BigInt((Date.now() - 3600000) * 1000000),
        eventDate: BigInt((Date.now() + 14 * 24 * 60 * 60 * 1000) * 1000000), // 14 days from now
        owner: null
      }
    ];
  }
}

const getMyTickets = async () => {
  try {
    console.log("Calling backend getMyTickets");
    const tickets = await backend.getMyTickets();
    console.log("Received my tickets:", tickets);
    return tickets;
  } catch (error) {
    console.error("Error calling backend getMyTickets:", error);
    console.log("Falling back to mock data");
    return [
      {
        id: 3,
        name: "Workshop Ticket",
        description: "Access to the Smart Contract Development Workshop",
        price: 150,
        status: "reserved",
        createdAt: BigInt((Date.now() - 7200000) * 1000000),
        eventDate: BigInt((Date.now() + 10 * 24 * 60 * 60 * 1000) * 1000000), // 10 days from now
        owner: { toString: () => "rwlgt-iiaaa-aaaaa-aaaaa-cai" }
      },
      {
        id: 4,
        name: "Hackathon Entry",
        description: "Participate in the annual blockchain hackathon",
        price: 50,
        status: "sold",
        createdAt: BigInt((Date.now() - 86400000) * 1000000),
        eventDate: BigInt((Date.now() + 21 * 24 * 60 * 60 * 1000) * 1000000), // 21 days from now
        owner: { toString: () => "rwlgt-iiaaa-aaaaa-aaaaa-cai" }
      }
    ];
  };
}

const getTicket = async (id) => {
  try {
    console.log("Calling backend getTicket with id:", id);
    const result = await backend.getTicket(id);
    console.log("Received ticket result:", result);
    // Handle Option type - if it's empty, return null
    if (!result.length) return null;
    return result[0]; // Unwrap the option type
  } catch (error) {
    console.error("Error calling backend getTicket:", error);
    console.log("Falling back to mock data");
    return {
      id: id,
      name: "Sample Ticket",
      description: "This is a sample ticket",
      price: 100,
      status: "available",
      createdAt: BigInt(Date.now() * 1000000),
      eventDate: BigInt((Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000000),
      owner: null
    };
  };
}

const reserveTicket = async (id) => {
  try {
    console.log("Calling backend reserveTicket with id:", id);
    const result = await backend.reserveTicket(id);
    console.log("Reserve ticket result:", result);
    return result;
  } catch (error) {
    console.error("Error calling backend reserveTicket:", error);
    return false;
  }
};

const purchaseTicket = async (id) => {
  try {
    console.log("Calling backend purchaseTicket with id:", id);
    const result = await backend.purchaseTicket(id);
    console.log("Purchase ticket result:", result);
    return result;
  } catch (error) {
    console.error("Error calling backend purchaseTicket:", error);
    return false;
  }
};

const createTicket = async (request) => {
  try {
    console.log("Calling backend createTicket with request:", request);
    const ticketId = await backend.createTicket(request);
    console.log("Create ticket result:", ticketId);
    return ticketId;
  } catch (error) {
    console.error("Error calling backend createTicket:", error);
    return null;
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [availableTickets, setAvailableTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState({
    availableTickets: false,
    myTickets: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableTickets();
    fetchMyTickets();
  }, []);

  const fetchAvailableTickets = async () => {
    try {
      setLoading(prev => ({ ...prev, availableTickets: true }));
      setError(null);
      const result = await getAvailableTickets();
      setAvailableTickets(result);
    } catch (err) {
      console.error('Error fetching available tickets:', err);
      setError('Failed to load available tickets. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, availableTickets: false }));
    }
  };

  // Fetch user's tickets
  const fetchMyTickets = async () => {
    try {
      setLoading(prev => ({ ...prev, myTickets: true }));
      setError(null);
      const result = await getMyTickets();
      setMyTickets(result);
    } catch (err) {
      console.error('Error fetching my tickets:', err);
      setError('Failed to load your tickets. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, myTickets: false }));
    }
  };

  // Reserve a ticket
  const handleReserveTicket = async (ticketId) => {
    try {
      setError(null);
      const success = await reserveTicket(ticketId);
      if (success) {
        // Update local state
        setAvailableTickets(availableTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, status: "reserved", owner: { toString: () => "current-user-principal" } }
            : ticket
        ));
        // Refresh my tickets
        fetchMyTickets();
      }
    } catch (err) {
      console.error('Error reserving ticket:', err);
      setError('Failed to reserve ticket. Please try again.');
    }
  };

  // Purchase a ticket
  const handlePurchaseTicket = async (ticketId) => {
    try {
      setError(null);
      const success = await purchaseTicket(ticketId);
      if (success) {
        // Update local state
        setAvailableTickets(availableTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, status: "sold", owner: { toString: () => "current-user-principal" } }
            : ticket
        ));
        // Refresh my tickets
        fetchMyTickets();
      }
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      setError('Failed to purchase ticket. Please try again.');
    }
  };

  // Create a new ticket
  const handleCreateTicket = async (ticketRequest) => {
    try {
      setError(null);
      const ticketId = await createTicket(ticketRequest);
      if (ticketId) {
        // Refresh available tickets
        fetchAvailableTickets();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('Failed to create ticket. Please try again.');
      return false;
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="tabs">
        <div
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
          data-tab="tickets"
        >
          Available Tickets
        </div>
        <div
          className={`tab ${activeTab === 'mytickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('mytickets')}
          data-tab="mytickets"
        >
          My Tickets
        </div>
        <div
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
          data-tab="create"
        >
          Create Ticket
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">{error}</div>
          <button className="alert-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {activeTab === 'tickets' && (
        <TicketList
          tickets={availableTickets}
          loading={loading.availableTickets}
          onReserve={handleReserveTicket}
          onPurchase={handlePurchaseTicket}
        />
      )}

      {activeTab === 'mytickets' && (
        <MyTickets
          tickets={myTickets}
          loading={loading.myTickets}
        />
      )}

      {activeTab === 'create' && (
        <CreateTicket onCreateTicket={handleCreateTicket} />
      )}
    </div>
  );
}

export default App;
