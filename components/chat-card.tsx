import { CheckCheck, LockKeyhole } from "lucide-react";
import type { Scenario } from "@/lib/scenarios";

export function ChatCard({ scenario }: { scenario: Scenario }) {
  return (
    <section className="chat-card" aria-label={`Conversación con ${scenario.sender}`}>
      <header className="chat-header">
        <span className="chat-avatar">{scenario.avatar}</span>
        <span className="chat-contact">
          <strong>{scenario.sender}</strong>
          <small>cuenta de empresa · no verificada</small>
        </span>
      </header>
      <div className="encryption-note"><LockKeyhole size={12} /> Mensajes simulados para esta práctica</div>
      <div className="chat-body">
        {scenario.messages.map((message, index) => (
          <div className="message" key={message}>
            <p>{message}</p>
            <span>{index === scenario.messages.length - 1 ? scenario.time : "10:41 a. m."} <CheckCheck size={14} /></span>
          </div>
        ))}
      </div>
    </section>
  );
}
