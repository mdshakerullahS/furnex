/* eslint-disable max-lines */

"use client";

import { useEffect, useState } from "react";
import { Search, Mail, MailOpen, Trash2, Clock, Reply } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Page = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const fetchedMessages = data.submissions || [];
        setMessages(fetchedMessages);

        if (fetchedMessages.length > 0 && !selectedMessage) {
          setSelectedMessage(fetchedMessages[0]);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedMessage]);

  // Toggle status between read / unread
  const toggleReadStatus = async (msg) => {
    try {
      const newStatus = msg.status === "read" ? "unread" : "read";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${msg._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Could not update status");

      // Update local states cleanly
      const updated = messages.map((m) =>
        m._id === msg._id ? { ...m, status: newStatus } : m,
      );
      setMessages(updated);
      if (selectedMessage?._id === msg._id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this message?"))
      return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to delete submission");

      toast.success("Message deleted successfully");
      const updated = messages.filter((m) => m._id !== id);
      setMessages(updated);
      setSelectedMessage(updated[0] || null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">Inbox</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review and respond to customer inquiries from the storefront contact
            form.
          </p>
        </div>
        <div className="text-xs font-medium text-muted-foreground bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">
          Unread Inquiries:{" "}
          <span className="text-primary font-bold">
            {messages.filter((m) => m.status !== "read").length}
          </span>
        </div>
      </div>

      {/* Main Split Layout Workspace */}
      <div className="flex-1 flex gap-6 bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden min-h-0">
        {/* Left Column: Message Thread List */}
        <div className="w-full md:w-[380px] flex flex-col border-r border-gray-50 shrink-0">
          {/* Search Header Container */}
          <div className="p-4 border-b border-gray-50 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by sender or subject..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.translate?.value || e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 bg-secondary/30 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Infinite Scrollable Message Snippets List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
            {filteredMessages.map((msg) => {
              const isUnread = msg.status !== "read";
              const isSelected = selectedMessage?._id === msg._id;
              const formattedDate = new Date(msg.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                },
              );

              return (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={cn(
                    "p-5 cursor-pointer transition-all duration-200 relative flex flex-col gap-1.5 border-l-4",
                    isSelected
                      ? "bg-secondary/20 border-primary"
                      : "hover:bg-secondary/5 border-transparent",
                    isUnread && !isSelected ? "bg-primary/2" : "",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm truncate",
                        isUnread
                          ? "font-bold text-foreground"
                          : "font-medium text-muted-foreground",
                      )}
                    >
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                      {formattedDate}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs truncate",
                      isUnread
                        ? "font-semibold text-primary"
                        : "text-foreground/80",
                    )}
                  >
                    {msg.subject || "General Inquiry"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })}

            {filteredMessages.length === 0 && !loading && (
              <div className="p-12 text-center text-xs text-muted-foreground italic">
                No matching messages found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Complete Message Details Pane */}
        <div className="hidden md:flex flex-1 flex-col min-w-0 bg-secondary/5">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Message Controls Top Bar Toolbar */}
              <div className="bg-white px-6 py-4 border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9 text-xs gap-1.5 font-semibold text-muted-foreground hover:text-primary"
                    onClick={() => toggleReadStatus(selectedMessage)}
                  >
                    {selectedMessage.status === "read" ? (
                      <>
                        <Mail className="w-3.5 h-3.5" /> Mark Unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-3.5 h-3.5" /> Mark Read
                      </>
                    )}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => deleteMessage(selectedMessage._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Message Frame Shell */}
              <div className="flex-1 p-8 overflow-y-auto min-h-0 space-y-6">
                {/* Email Header Card Panel */}
                <div className="bg-white p-6 rounded-6 border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/5">
                    {selectedMessage.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-serif font-bold text-lg text-foreground">
                        {selectedMessage.name}
                      </h3>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(selectedMessage.createdAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>

                {/* Email Core Body Details Text Block Container Content */}
                <div className="bg-white p-8 rounded-6 border border-gray-100 shadow-sm space-y-4">
                  <div className="border-b border-gray-50 pb-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Subject Line
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-1">
                      {selectedMessage.subject || "General Showroom Inquiry"}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                      Message Body
                    </span>
                    <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed font-sans">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Quick Action Smart Reply Interface Sheet Component Box */}
                <div className="bg-white p-6 rounded-6 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Reply className="w-3.5 h-3.5" /> Quick Email Reply
                  </div>
                  <textarea
                    placeholder={`Compose a response back directly to ${selectedMessage.name}...`}
                    className="w-full min-h-[100px] rounded-xl bg-secondary/20 p-4 text-sm border-transparent focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Inquiry")}`)
                      }
                      className="rounded-xl text-xs font-bold uppercase tracking-widest px-6 h-10"
                    >
                      Open Email Client
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 gap-3">
              <Mail className="w-12 h-12 stroke-[1.2] text-muted-foreground/50" />
              <p className="text-sm italic">
                Select a conversation item from the drawer panel to read its
                core content details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
