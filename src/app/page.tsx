import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [leadType, setLeadType] = useState<string>("Pizzaria");
  const [location, setLocation] = useState<string>(
    "Cajamar, State of Sao Paulo, Brazil"
  );
  const [whatsappMessage, setWhatsappMessage] = useState<string>(
    `Olá! Tudo bem? 😊\n\nAqui é o Cheffia — uma solução moderna para gestão de pedidos e pagamentos em pizzarias!\n\nVocê consegue automatizar pedidos, integrar pagamentos via QR Code e muito mais.\n\nGostaria de saber mais? É só responder aqui. 🚀`
  );

  return (
    <main>
      <h1>Hello World</h1>
    </main>
  );
}
