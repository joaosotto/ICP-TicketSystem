import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import List "mo:base/List";
import Hash "mo:base/Hash";

persistent actor TicketSystem {
  // Types
  public type TicketId = Nat;
  
  public type TicketStatus = {
    #available;
    #reserved;
    #sold;
  };

  public type Ticket = {
    id: TicketId;
    name: Text;
    description: Text;
    price: Nat;
    status: TicketStatus;
    createdAt: Int;
    eventDate: Int;
    owner: ?Principal;
  };

  public type TicketRequest = {
    name: Text;
    description: Text;
    price: Nat;
    eventDate: Int;
  };

  // Custom hash function for Nat values
  private func natHash(n: Nat): Hash.Hash {
    Text.hash(Nat.toText(n))
  };

  // State
  private var nextTicketId : Nat = 0;
  private var ticketsEntries : [(TicketId, Ticket)] = [];
  private transient var tickets = HashMap.HashMap<TicketId, Ticket>(10, Nat.equal, natHash);
  
  // User tickets mapping
  private var userTicketsEntries : [(Principal, [TicketId])] = [];
  private transient var userTickets = HashMap.HashMap<Principal, List.List<TicketId>>(10, Principal.equal, Principal.hash);

  // Initialize from stable storage during upgrades
  system func preupgrade() {
    ticketsEntries := Iter.toArray(tickets.entries());
    
    userTicketsEntries := Array.map<(Principal, List.List<TicketId>), (Principal, [TicketId])>(
      Iter.toArray(userTickets.entries()),
      func((p, l)) { (p, List.toArray(l)) }
    );
  };

  system func postupgrade() {
    for ((id, ticket) in ticketsEntries.vals()) {
      tickets.put(id, ticket);
    };
    ticketsEntries := [];

    for ((principal, ticketIds) in userTicketsEntries.vals()) {
      userTickets.put(principal, List.fromArray(ticketIds));
    };
    userTicketsEntries := [];
  };

  // Create a new ticket
  public shared(msg) func createTicket(request: TicketRequest) : async TicketId {
    let _ = msg.caller; // Ignore the caller for now
    
    let ticket : Ticket = {
      id = nextTicketId;
      name = request.name;
      description = request.description;
      price = request.price;
      status = #available;
      createdAt = Time.now();
      eventDate = request.eventDate;
      owner = null;
    };

    tickets.put(nextTicketId, ticket);
    nextTicketId += 1;
    
    return ticket.id;
  };

  // Get all available tickets
  public query func getAvailableTickets() : async [Ticket] {
    let availableTickets = Iter.toArray(
      Iter.filter(
        tickets.vals(),
        func(ticket: Ticket) : Bool {
          ticket.status == #available
        }
      )
    );
    
    return availableTickets;
  };

  // Get ticket by ID
  public query func getTicket(id: TicketId) : async ?Ticket {
    tickets.get(id)
  };

  // Reserve a ticket
  public shared(msg) func reserveTicket(ticketId: TicketId) : async Bool {
    let buyer = msg.caller;
    
    switch (tickets.get(ticketId)) {
      case null { return false };
      case (?ticket) {
        if (ticket.status != #available) {
          return false;
        };
        
        let updatedTicket : Ticket = {
          id = ticket.id;
          name = ticket.name;
          description = ticket.description;
          price = ticket.price;
          status = #reserved;
          createdAt = ticket.createdAt;
          eventDate = ticket.eventDate;
          owner = ?buyer;
        };
        
        tickets.put(ticketId, updatedTicket);
        
        // Add ticket to user's tickets
        let userTicketsList = switch (userTickets.get(buyer)) {
          case null { List.nil<TicketId>() };
          case (?list) { list };
        };
        
        userTickets.put(buyer, List.push(ticketId, userTicketsList));
        
        return true;
      };
    }
  };

  // Purchase a ticket
  public shared(msg) func purchaseTicket(ticketId: TicketId) : async Bool {
    let buyer = msg.caller;
    
    switch (tickets.get(ticketId)) {
      case null { return false };
      case (?ticket) {
        if (ticket.status != #available and ticket.status != #reserved) {
          return false;
        };
        
        // In a real application, we would handle payment here
        
        let updatedTicket : Ticket = {
          id = ticket.id;
          name = ticket.name;
          description = ticket.description;
          price = ticket.price;
          status = #sold;
          createdAt = ticket.createdAt;
          eventDate = ticket.eventDate;
          owner = ?buyer;
        };
        
        tickets.put(ticketId, updatedTicket);
        
        // Add ticket to user's tickets if not already there
        let userTicketsList = switch (userTickets.get(buyer)) {
          case null { List.nil<TicketId>() };
          case (?list) { list };
        };
        
        // Check if the ticket is already in the user's list
        let exists = List.some<TicketId>(userTicketsList, func(id) { id == ticketId });
        
        if (not exists) {
          userTickets.put(buyer, List.push(ticketId, userTicketsList));
        };
        
        return true;
      };
    }
  };

  // Get user's tickets
  public shared(msg) func getMyTickets() : async [Ticket] {
    let userPrincipal = msg.caller;
    
    switch (userTickets.get(userPrincipal)) {
      case null { [] };
      case (?ticketIdsList) {
        let ticketIds = List.toArray(ticketIdsList);
        Array.mapFilter<TicketId, Ticket>(
          ticketIds,
          func(id) { tickets.get(id) }
        )
      };
    }
  };

  // For testing - clear all tickets
  public shared(msg) func clearAllTickets() : async () {
    let userPrincipal = msg.caller;
    userTickets.put(userPrincipal, List.nil<TicketId>());
  };
}
