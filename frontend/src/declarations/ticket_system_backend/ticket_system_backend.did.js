export const idlFactory = ({ IDL }) => {
  const TicketId = IDL.Nat;
  const TicketStatus = IDL.Variant({
    'available' : IDL.Null,
    'reserved' : IDL.Null,
    'sold' : IDL.Null,
  });
  const Ticket = IDL.Record({
    'id' : TicketId,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'price' : IDL.Nat,
    'status' : TicketStatus,
    'createdAt' : IDL.Int,
    'eventDate' : IDL.Int,
    'owner' : IDL.Opt(IDL.Principal),
  });
  const TicketRequest = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'price' : IDL.Nat,
    'eventDate' : IDL.Int,
  });
  return IDL.Service({
    'clearAllTickets' : IDL.Func([], [], []),
    'createTicket' : IDL.Func([TicketRequest], [TicketId], []),
    'getAvailableTickets' : IDL.Func([], [IDL.Vec(Ticket)], ['query']),
    'getMyTickets' : IDL.Func([], [IDL.Vec(Ticket)], []),
    'getTicket' : IDL.Func([TicketId], [IDL.Opt(Ticket)], ['query']),
    'purchaseTicket' : IDL.Func([TicketId], [IDL.Bool], []),
    'reserveTicket' : IDL.Func([TicketId], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
