"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import {
  IconTicket,
  IconCalendarEvent,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

interface Ticket {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  total_qty: number;
  sale_start: string;
  sale_end: string;
  status: string;
  banner_url?: string;
}

interface EventInfo {
  id: string;
  title: string;
}

const statusColor = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-green-500 text-white";
    case "INACTIVE":
      return "bg-gray-400 text-white";
    case "SOLDOUT":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [eventTitles, setEventTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/tickets`);
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data);
        // Fetch all event titles in parallel
        const eventIds = Array.from(
          new Set(data.map((t: Ticket) => t.event_id))
        );
        const eventTitleMap: Record<string, string> = {};
        await Promise.all(
          (eventIds as string[]).map(async (eid) => {
            try {
              const eres = await fetch(`${API_BASE_URL}/events/${eid}`);
              if (!eres.ok) throw new Error();
              const edata = await eres.json();
              eventTitleMap[eid] = edata.title || eid;
            } catch {
              eventTitleMap[eid] = eid;
            }
          })
        );
        setEventTitles(eventTitleMap);
      } catch (err: any) {
        setError(err.message || "Error fetching tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <DashboardLayout>
      <div className="px-[5px] mx-auto w-full md:px-[5px]">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <IconTicket className="w-7 h-7 text-blue-500" /> Tickets
        </h1>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
              <IconTicket className="w-5 h-5 text-blue-500" /> Ticket List
            </h3>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : tickets.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No tickets found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] divide-y divide-gray-100 dark:divide-gray-800">
                  <thead>
                    <tr className="border-gray-100 border-y dark:border-gray-800">
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        #
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Event
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Price
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Total Qty
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Sale Start
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Sale End
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 ">
                    {tickets.map((ticket, idx) => (
                      <tr key={ticket.id}>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <IconTicket className="w-5 h-5 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[160px] overflow-hidden whitespace-nowrap text-ellipsis">
                              {ticket.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[220px]">
                          <div className="flex items-center gap-2">
                            <IconCalendarEvent className="w-5 h-5 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis">
                              {eventTitles[ticket.event_id] || ticket.event_id}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          {Number(ticket.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          {ticket.total_qty}
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          <span className="f text-base text-green-600 dark:text-green-400">
                            {ticket.sale_start ? new Date(ticket.sale_start).toLocaleString() : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          <span className=" text-base text-red-600 dark:text-red-400">
                            {ticket.sale_end ? new Date(ticket.sale_end).toLocaleString() : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4 align-middle">
                          {ticket.status === "ACTIVE" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                              <IconCheck className="w-4 h-4" />
                              <span className="font-semibold">Active</span>
                            </span>
                          )}
                          {ticket.status === "INACTIVE" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-400 text-white">
                              <IconX className="w-4 h-4" />
                              <span className="font-semibold">Inactive</span>
                            </span>
                          )}
                          {ticket.status === "SOLD_OUT" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">
                              <IconX className="w-4 h-4" />
                              <span className="font-semibold">Sold Out</span>
                            </span>
                          )}
                          {!["ACTIVE", "INACTIVE", "SOLD_OUT"].includes(ticket.status) && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-500 text-white">
                              <IconX className="w-4 h-4" />
                              <span className="font-semibold">{ticket.status}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
