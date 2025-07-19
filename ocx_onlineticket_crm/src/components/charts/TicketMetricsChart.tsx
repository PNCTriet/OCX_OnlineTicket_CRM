"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { IconTicket, IconCalendarEvent, IconRefresh } from "@tabler/icons-react";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  organization: {
    id: string;
    name: string;
  };
}

interface Ticket {
  id: string;
  name: string;
  description: string;
  price: number;
  total_qty: number;
  sold_qty: number;
  status: string;
}

interface TicketMetricsChartProps {
  loading?: boolean;
}

export default function TicketMetricsChart({ loading = false }: TicketMetricsChartProps) {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  useEffect(() => {
    if (selectedEvent) {
      fetchTickets(selectedEvent);
    }
  }, [selectedEvent, token]);

  const fetchEvents = async () => {
    if (!token) return;

    try {
      setChartLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
      
      // Auto-select first event if available
      if (data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setChartLoading(false);
    }
  };

  const fetchTickets = async (eventId: string) => {
    if (!token || !eventId) return;

    try {
      setChartLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tickets");
    } finally {
      setChartLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const calculateTotalMetrics = () => {
    const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.total_qty, 0);
    const totalSold = tickets.reduce((sum, ticket) => sum + ticket.sold_qty, 0);
    const totalPercentage = totalTickets > 0 ? (totalSold / totalTickets) * 100 : 0;
    
    return {
      totalTickets,
      totalSold,
      totalPercentage: Math.round(totalPercentage),
      remaining: totalTickets - totalSold
    };
  };

  const getSelectedEventTitle = () => {
    const event = events.find(e => e.id === selectedEvent);
    return event?.title || "Select Event";
  };

  if (loading || chartLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15">
          <IconTicket className="text-blue-600 dark:text-blue-500" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Ticket Metrics</span>
          <div className="mt-2 h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/15">
          <IconTicket className="text-red-600 dark:text-red-500" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Ticket Metrics</span>
          <div className="mt-2 h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-2">Error loading data</div>
              <button
                onClick={fetchEvents}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalMetrics = calculateTotalMetrics();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/15">
            <IconTicket className="text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Ticket Metrics</span>
            <h4 className="text-title-sm font-bold text-gray-800 dark:text-white/90">
              {selectedEvent ? getSelectedEventTitle() : "Select Event"}
            </h4>
          </div>
        </div>
        <button 
          onClick={fetchEvents}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <IconRefresh className="w-5 h-5" />
        </button>
      </div>

      {/* Event Selector */}
      <div className="mb-6">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">Select Event</span>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select an event...</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && tickets.length > 0 ? (
        <div className="space-y-6">
          {/* Total Progress Circle */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    className="dark:stroke-gray-700"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - totalMetrics.totalPercentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {totalMetrics.totalPercentage}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Sold</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {getSelectedEventTitle()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatNumber(totalMetrics.totalSold)} / {formatNumber(totalMetrics.totalTickets)} tickets sold
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatNumber(totalMetrics.remaining)} tickets remaining
            </div>
          </div>

          {/* Individual Ticket Progress Circles */}
          <div>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">Ticket Types</div>
            <div className="flex flex-wrap gap-4 justify-center">
              {tickets.map((ticket) => {
                const percentage = ticket.total_qty > 0 ? (ticket.sold_qty / ticket.total_qty) * 100 : 0;
                const remaining = ticket.total_qty - ticket.sold_qty;
                const color = percentage > 80 ? "#ef4444" : percentage > 50 ? "#eab308" : "#22c55e";
                
                return (
                  <div key={ticket.id} className="text-center flex-shrink-0 min-w-[120px]">
                    <div className="flex justify-center mb-3">
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                            className="dark:stroke-gray-700"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke={color}
                            strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-lg font-bold text-gray-800 dark:text-white">
                            {Math.round(percentage)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-white mb-1">
                      {ticket.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {formatNumber(ticket.sold_qty)} / {formatNumber(ticket.total_qty)} sold
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(ticket.price)} each
                    </div>
                    {remaining > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-500 mt-1">
                        {formatNumber(remaining)} available
                      </div>
                    )}
                    {remaining === 0 && (
                      <div className="text-xs text-red-600 dark:text-red-500 mt-1">
                        Sold out
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : selectedEvent ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">No tickets found for this event</div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">Please select an event to view ticket metrics</div>
        </div>
      )}
    </div>
  );
} 