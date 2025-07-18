import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/apiConfig";
import { IconBuilding, IconCalendarEvent, IconTicket, IconX, IconUsers, IconMail, IconPhone, IconMapPin, IconWorldCode } from "@tabler/icons-react";
import Image from "next/image";

interface OrganizationDetailModalProps {
  organizationId: string;
  onClose: () => void;
}

interface Organization {
  id: string;
  name: string;
  description?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date: string;
  banner_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Ticket {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  total_qty: number;
  sold_qty: number;
  sale_start: string;
  sale_end: string;
  status: string;
  created_at: string;
  updated_at: string;
  event?: {
    id: string;
    title: string;
  };
}

const eventStatusColor = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "DRAFT":
      return "bg-gray-500 text-white";
    case "PUBLISHED":
      return "bg-green-500 text-white";
    case "CANCELLED":
      return "bg-red-500 text-white";
    case "COMPLETED":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const ticketStatusColor = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-green-500 text-white";
    case "INACTIVE":
      return "bg-gray-500 text-white";
    case "SOLD_OUT":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const OrganizationDetailModal: React.FC<OrganizationDetailModalProps> = ({ organizationId, onClose }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'tickets'>('events');

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token")
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login first.");
        setLoading(false);
        return;
      }
      try {
        // Fetch organization detail
        const orgRes = await fetch(`${API_BASE_URL}/organizations/${organizationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!orgRes.ok) throw new Error("Failed to fetch organization detail");
        const orgData = await orgRes.json();
        setOrganization(orgData);

        // Fetch events for this organization
        const eventsRes = await fetch(`${API_BASE_URL}/events?organization_id=${organizationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
          
          // Fetch tickets for each event of this organization
          const allTickets: Ticket[] = [];
          for (const event of eventsData) {
            try {
              const ticketsRes = await fetch(`${API_BASE_URL}/tickets/event/${event.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              if (ticketsRes.ok) {
                const eventTickets = await ticketsRes.json();
                // Add event info to each ticket
                const ticketsWithEvent = eventTickets.map((ticket: Ticket) => ({
                  ...ticket,
                  event: {
                    id: event.id,
                    title: event.title
                  }
                }));
                allTickets.push(...ticketsWithEvent);
              }
            } catch (err) {
              console.error(`Failed to fetch tickets for event ${event.id}:`, err);
            }
          }
          setTickets(allTickets);
        }
      } catch (err: any) {
        setError(err.message || "Error fetching organization detail");
      } finally {
        setLoading(false);
      }
    };
    if (organizationId) fetchData();
  }, [organizationId]);

  // Đóng modal khi bấm ESC hoặc click overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-0 animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl z-20"
          onClick={onClose}
          aria-label="Close"
        >
          <IconX className="w-7 h-7" />
        </button>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <IconBuilding className="w-7 h-7 text-blue-500" /> Organization Detail
          </h2>
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : !organization ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Organization not found.</div>
          ) : (
            <>
              {/* Organization Info */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-8">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-start gap-4">
                    {organization.logo_url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={organization.logo_url}
                          alt={organization.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                        {organization.name}
                      </h3>
                      {organization.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {organization.description}
                        </p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {organization.contact_email && (
                          <div className="flex items-center gap-2">
                            <IconMail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{organization.contact_email}</span>
                          </div>
                        )}
                        {organization.phone && (
                          <div className="flex items-center gap-2">
                            <IconPhone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{organization.phone}</span>
                          </div>
                        )}
                        {organization.address && (
                          <div className="flex items-center gap-2">
                            <IconMapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{organization.address}</span>
                          </div>
                        )}
                        {organization.website && (
                          <div className="flex items-center gap-2">
                            <IconWorldCode className="w-4 h-4 text-gray-400" />
                            <a 
                              href={organization.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {organization.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'events'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('events')}
                >
                  <IconCalendarEvent className="w-4 h-4 inline mr-2" />
                  Events ({events.length})
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'tickets'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('tickets')}
                >
                  <IconTicket className="w-4 h-4 inline mr-2" />
                  Tickets ({tickets.length})
                </button>
              </div>

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                      <IconCalendarEvent className="w-5 h-5 text-blue-500" />
                      Events
                    </h3>
                  </div>
                  <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                    {events.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400">No events found for this organization.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table-fixed w-full min-w-[800px] divide-y divide-gray-100 dark:divide-gray-800">
                          <thead>
                            <tr className="border-gray-100 border-y dark:border-gray-800">
                              <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">#</th>
                              <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Event</th>
                              <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Location</th>
                              <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Date</th>
                              <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {events.map((event, idx) => (
                              <tr key={event.id}>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">{idx + 1}</td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  <div className="font-medium">{event.title}</div>
                                  {event.description && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                      {event.description}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  {event.location || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  <div className="text-sm">
                                    <div>Start: {new Date(event.start_date).toLocaleDateString()}</div>
                                    <div>End: {new Date(event.end_date).toLocaleDateString()}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 align-middle">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${eventStatusColor(event.status)}`}>
                                    {event.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                      <IconTicket className="w-5 h-5 text-green-500" />
                      Tickets
                    </h3>
                  </div>
                  <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                    {tickets.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400">No tickets found for this organization.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table-fixed w-full min-w-[1100px] divide-y divide-gray-100 dark:divide-gray-800">
                          <thead>
                            <tr className="border-gray-100 border-y dark:border-gray-800">
                              <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">#</th>
                              <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Event</th>
                              <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Ticket</th>
                              <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Price</th>
                              <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Quantity</th>
                              <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Sale Period</th>
                              <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {tickets.map((ticket, idx) => (
                              <tr key={ticket.id}>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">{idx + 1}</td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  <div className="flex items-center gap-2">
                                    <IconCalendarEvent className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                      {ticket.event?.title || "N/A"}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  <div className="font-medium">{ticket.name}</div>
                                  {ticket.description && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                      {ticket.description}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  {Number(ticket.price).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  <div className="text-sm">
                                    <div>Sold: {ticket.sold_qty}</div>
                                    <div>Total: {ticket.total_qty}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                  <div className="text-sm">
                                    <div>Start: {new Date(ticket.sale_start).toLocaleDateString()}</div>
                                    <div>End: {new Date(ticket.sale_end).toLocaleDateString()}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 align-middle">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${ticketStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailModal; 