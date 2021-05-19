import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@gmmtickets/common";
import { Ticket } from "../../models/tickets";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket Not Found!");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
