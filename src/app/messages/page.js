"use client"
import { useEffect, useState } from 'react';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/contact');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Messages</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {messages.map((message) => {
        const dateTime = new Date(message.createdAt);
        const date = dateTime.toISOString().split('T')[0];
        const time = dateTime.toTimeString().split(' ')[0];

        return (
          <div key={message._id} className="bg-white shadow-md rounded-md p-4 flex flex-col">
            <div className="card-header border-b border-blue-100 mb-2">
              <h2 className="text-xl font-semibold">SUBJECT: {message.subject.toUpperCase()}</h2>
            </div>
            <div className="card-body my-2 flex flex-col border-b border-gray-200 pb-2">
              <p>
                <span className="font-bold">MESSAGE:</span> <br />
                <span>{message.message}</span>
              </p>
            </div>
            <div className="card-footer text-sm text-gray-600 mt-auto">
              <p>EMAIL: {message.email}</p>
              <p>NAME: {message.name}</p>
              <p>POST DATE: {date} {time}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  );
};

export default MessagesPage;
