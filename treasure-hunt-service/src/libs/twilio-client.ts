import { Twilio } from "twilio/lib";

const client = new Twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

const sendWhatsAppMessage = (phoneCode: string = '', phone: string = '', messageBody: string = ''): Promise<any> => {
  return client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER!}`,
    to: `whatsapp:+${phoneCode!}${phone!}`,
    body: `${messageBody}`,
  });
};

export const getLastUserMessage = async (userPhone: string): Promise<string | null> => {
    try {
      const messages = await client.messages.list({
        to: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        from: `whatsapp:+91${userPhone}`,
        limit: 1,
      });
      if (messages.length === 0) return null;
      return messages[0].body;
    } catch (err) {
      console.error('Error fetching Twilio message:', err);
      return null;
    }
  };


export default sendWhatsAppMessage;