// HomeBento.jsx
import React from 'react';

const features = [
  { title: 'Ticket → Integrate Slack', desc: 'Delegate ticket tasks seamlessly.' },
  { title: 'Plan → Review proposal', desc: 'AI drafts and you approve.' },
  { title: 'Test → Automatic validations', desc: 'Built-in test checks.' },
  { title: 'PR → Review changes natively', desc: 'Smooth pull request flow.' },
];

export default function HomeBento() {
  return (
    <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {features.map((f, i) => (
        <div
          key={i}
          className="relative bg-white p-6 rounded-lg shadow-lg overflow-hidden group cursor-pointer transition-transform transform hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-0 group-hover:scale-110" />
          
          <h3 className="relative text-lg font-semibold text-gray-900">{f.title}</h3>
          <p className="relative text-gray-600 mt-2">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
