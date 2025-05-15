import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el asistente virtual de Hotel Elegancia. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  
  // Ofertas y promociones disponibles
  const promotions = [
    {
      id: 1,
      title: "Descuento Early Bird",
      description: "¡Reserva con 30 días de anticipación y obtén un 15% de descuento!",
      code: "EARLY15",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      title: "Paquete Romántico",
      description: "Cena a la luz de las velas, botella de champagne y late check-out por solo $500 adicionales",
      code: "ROMANCE",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      title: "Fin de semana de lujo",
      description: "3 noches al precio de 2 en suites de lujo. Válido para fines de semana.",
      code: "WEEKEND3X2",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  // Auto scroll al último mensaje
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Mostrar una promoción aleatoria después de 1 minuto de inactividad
  useEffect(() => {
    let inactivityTimer;
    if (isOpen) {
      inactivityTimer = setTimeout(() => {
        showRandomPromotion();
      }, 60000);
    }
    
    return () => {
      clearTimeout(inactivityTimer);
    };
  }, [isOpen, messages]);
  
  const showRandomPromotion = () => {
    const randomPromo = promotions[Math.floor(Math.random() * promotions.length)];
    setCurrentPromotion(randomPromo);
    
    const promoMessage = {
      id: messages.length + 1,
      text: `📣 *PROMOCIÓN ESPECIAL* 📣\n\n${randomPromo.title}\n\n${randomPromo.description}\n\nUsa el código: ${randomPromo.code}`,
      sender: "bot",
      isPromotion: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, promoMessage]);
  };
  
  // Manejo del envío de mensajes
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1000);
  };
  
  // Respuestas del bot
  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    const responses = {
      // Información general
      check: {
        keywords: ["check in", "check-in", "check out", "check-out", "llegada", "salida", "hora de", "horario", "entrada", "cuando puedo llegar", "cuando tengo que irme"],
        response: "El check-in es a partir de las 15:00h y el check-out hasta las 12:00h. Si necesitas horarios especiales, contáctanos con anticipación."
      },
      reserva: {
        keywords: ["reserva", "reservar", "reservación", "reservaciones", "hacer reserva", "cómo reservo", "disponibilidad", "habitación disponible", "quiero hacer", "guardar", "apartar", "booking"],
        response: "Puedes hacer una reserva fácilmente utilizando nuestro buscador en la página principal. Solo necesitas seleccionar fechas, número de huéspedes y dar clic en 'Buscar hoteles'. También puedes llamarnos al +52 123 456 7890."
      },
      cancelacion: {
        keywords: ["cancelar", "cancelación", "política", "políticas", "cancelo", "devolucion", "reembolso", "anular", "cambiar fecha", "modificar reserva", "cambio de fecha"],
        response: "Nuestra política de cancelación permite cancelaciones gratuitas hasta 48 horas antes de la llegada. Después de ese plazo, se cobra la primera noche. Para modificaciones contacta directamente con nuestro equipo de reservas."
      },
      
      // Servicios del hotel
      wifi: {
        keywords: ["wifi", "internet", "conexión", "conectarme", "contraseña", "password", "red", "señal", "datos", "navegar"],
        response: "Ofrecemos WiFi gratuito de alta velocidad en todas las áreas de nuestros hoteles. La contraseña se proporciona en el momento del check-in. La red se llama 'Hotel_Elegancia_Guest'."
      },
      desayuno: {
        keywords: ["desayuno", "comida", "comer", "almuerzo", "cena", "restaurante", "horario comida", "buffet", "menú", "menu", "cafetería", "opciones", "vegano", "vegetariano", "alergias", "comida para"],
        response: "El desayuno buffet se sirve de 7:00h a 10:30h. Nuestros restaurantes están abiertos para almuerzo de 13:00h a 16:00h y para cena de 19:00h a 23:00h. Contamos con opciones vegetarianas, veganas y para alergias alimentarias (infórmanos con anticipación)."
      },
      habitaciones: {
        keywords: ["habitacion", "habitaciones", "cuarto", "tipos", "suite", "cama", "individual", "doble", "matrimonio", "king", "queen", "tamaño", "vista", "balcón", "terraza", "equipamiento"],
        response: "Ofrecemos habitaciones estándar (2 camas dobles o 1 king), superiores (más amplias, con sofá), suites junior (zona de estar) y suites ejecutivas (sala separada). Todas incluyen baño privado, TV 4K, minibar, caja fuerte y WiFi gratuito."
      },
      
      // Nuevas categorías
      piscina: {
        keywords: ["piscina", "alberca", "nadar", "natación", "toallas", "horario piscina", "climatizada"],
        response: "Nuestra piscina está abierta de 8:00h a 22:00h. Es climatizada y cuenta con área para niños. Proporcionamos toallas sin costo adicional. El acceso está incluido para todos los huéspedes."
      },
      spa: {
        keywords: ["spa", "masaje", "tratamiento", "relax", "sauna", "jacuzzi", "bienestar", "belleza", "reservar spa"],
        response: "Nuestro spa ofrece diversos tratamientos de 10:00h a 20:00h. Recomendamos reservar con anticipación en recepción o llamando a la ext. 4500 desde su habitación. Los masajes tienen un 15% de descuento para huéspedes."
      },
      gimnasio: {
        keywords: ["gimnasio", "gym", "ejercicio", "fitness", "entrenar", "máquinas", "pesas", "instructor", "personal trainer"],
        response: "El gimnasio está abierto 24/7 con acceso con llave de habitación. Cuenta con equipo cardiovascular, pesas libres y máquinas. Ofrecemos clases de yoga (martes y jueves 8:00h) y entrenador personal bajo reserva."
      },
      mascotas: {
        keywords: ["mascota", "mascotas", "perro", "gato", "pet friendly", "llevar mascota", "animales", "política de mascotas"],
        response: "Somos pet-friendly en habitaciones seleccionadas con un cargo adicional de $200 por estancia. Las mascotas deben pesar menos de 15kg. Contamos con camas para mascotas y platos de comida/agua. Reserve con anticipación ya que las habitaciones pet-friendly son limitadas."
      },
      niños: {
        keywords: ["niños", "niñas", "bebé", "bebés", "familia", "infantil", "kids club", "cuidado", "niñera", "actividades niños"],
        response: "Ofrecemos habitaciones familiares, cunas sin cargo (solicitar al reservar), menú infantil y Kids Club (4-12 años) abierto de 9:00h a 18:00h. El servicio de niñera está disponible con reserva de 24h (cargo adicional). Tenemos paquetes familiares con descuentos para niños."
      },
      estacionamiento: {
        keywords: ["estacionamiento", "parking", "aparcar", "estacionar", "coche", "auto", "valet", "garage", "parqueadero"],
        response: "Contamos con estacionamiento subterráneo vigilado 24/7 por $150/día o $800/semana. El servicio de valet parking está disponible sin costo adicional. Para vehículos eléctricos tenemos 3 puntos de recarga Tesla y 2 universales."
      },
      transporte: {
        keywords: ["transporte", "traslado", "shuttle", "aeropuerto", "taxi", "uber", "metro", "autobús", "bus", "como llegar", "ir a"],
        response: "Ofrecemos servicio de shuttle al aeropuerto por $350 por trayecto (reservar 24h antes). La estación de metro más cercana es 'Centro Histórico' a 400m. En recepción podemos solicitar taxi de sitio con tarifa preferencial. Rental car disponible en el hotel."
      },
      atracciones: {
        keywords: ["atracciones", "visitar", "turismo", "lugares", "cerca", "tour", "excursión", "recomendación", "museo", "playa", "centro", "mall", "plaza"],
        response: "Estamos ubicados a 10 minutos del Centro Histórico y 15 del Distrito de Museos. Ofrecemos tours diarios a sitios de interés (reservar en recepción). Nuestro concierge puede proporcionar mapas personalizados y recomendaciones según sus intereses."
      },
      covid: {
        keywords: ["covid", "coronavirus", "sanitización", "higiene", "seguridad", "protocolo", "sana distancia", "cubrebocas", "mascarilla"],
        response: "Seguimos protocolos estrictos: sanitización constante de áreas comunes, dispensadores de gel antibacterial, personal capacitado y sistema de ventilación mejorado. El servicio de limpieza diario es opcional. Ofrecemos pruebas de antígenos en el hotel."
      },
      accesibilidad: {
        keywords: ["accesibilidad", "discapacidad", "silla de ruedas", "movilidad reducida", "accesible", "ascensor", "elevador", "rampa", "habitación adaptada"],
        response: "Nuestras instalaciones son 100% accesibles, con rampas, elevadores y 8 habitaciones completamente adaptadas con barras de apoyo y duchas accesibles. Ofrecemos sillas de ruedas sin cargo bajo solicitud. Personal entrenado para asistir a todos nuestros huéspedes."
      },
      eventos: {
        keywords: ["evento", "eventos", "conferencia", "reunión", "sala", "congreso", "boda", "fiesta", "celebración", "corporate", "banquete"],
        response: "Contamos con 5 salones para eventos (10 a 300 personas), equipados con tecnología audiovisual, WiFi de alta velocidad y servicio de catering. Ofrecemos paquetes para bodas, reuniones corporativas y eventos sociales. Contacte a eventos@hotelelelegancia.com para detalles."
      },
      
      // Promociones (existente, con mejoras)
      promociones: {
        keywords: ["promocion", "promociones", "descuento", "descuentos", "oferta", "ofertas", "código", "promo", "cupón", "especial", "rebaja", "paquete", "ahorro", "económico"],
        response: "¡Tenemos varias promociones disponibles! ¿Te gustaría conocer alguna de nuestras ofertas especiales?",
        action: () => {
          // Mostrar una promoción
          setTimeout(() => {
            showRandomPromotion();
          }, 1000);
          return true;
        }
      },
      
      // Precio (existente, con mejoras)
      precios: {
        keywords: ["precio", "precios", "costo", "tarifa", "tarifas", "cuánto cuesta", "cuanto vale", "valor", "presupuesto", "económico", "barato", "asequible", "pagar", "cobran"],
        response: "Nuestros precios varían según la temporada y el tipo de habitación. Las tarifas actuales comienzan desde $1,200 para habitaciones estándar, $1,800 para superiores y $2,500 para suites. Incluyen desayuno buffet e impuestos. Contamos con opciones de pago a plazos para estancias largas."
      },
      
      // Ubicación (existente, con mejoras)
      ubicacion: {
        keywords: ["ubicacion", "ubicación", "dirección", "direccion", "donde", "dónde", "llegar", "encontrar", "mapa", "zona", "barrio", "colonia", "calle", "avenida"],
        response: "Nos ubicamos en Av. Reforma 123, Centro Histórico, a 20 min del aeropuerto, 5 min de la zona comercial y 10 min de los principales museos. La estación de metro más cercana es 'Centro Histórico' a 400m. Puede ver nuestra ubicación exacta en Google Maps: https://maps.app.goo.gl/hotel-elegancia"
      },
      
      // Contacto (existente, con mejoras)
      contacto: {
        keywords: ["contacto", "teléfono", "telefono", "correo", "email", "numero", "llamar", "comunicarme", "whatsapp", "hablar con", "contactar"],
        response: "Puedes contactarnos al +52 123 456 7890 (también WhatsApp), por email a reservas@hoteles.com o en nuestras redes sociales @HotelElegancia. Nuestra recepción está disponible 24/7. Para reservas grupales, contacta a grupos@hoteles.com."
      },
    };
    
    // Verificar si es una solicitud de promociones
    if (input.includes("promo") || input.includes("oferta") || input.includes("descuento")) {
      setTimeout(() => {
        showRandomPromotion();
      }, 1000);
      
      return {
        id: messages.length + 2,
        text: "¡Claro! Aquí tienes una de nuestras promociones especiales:",
        sender: "bot",
        timestamp: new Date()
      };
    }
    
    // Mejorada: sistema de detección de intención más sofisticado
    // Analiza todas las keywords de todas las categorías y asigna puntuación por coincidencias
    const intentScores = {};
    
    for (const category in responses) {
      let score = 0;
      
      // Busca coincidencias exactas de palabras clave
      responses[category].keywords.forEach(keyword => {
        if (input.includes(keyword)) {
          // Palabras clave más largas reciben mayor puntuación (más específicas)
          score += keyword.length;
        }
      });
      
      if (score > 0) {
        intentScores[category] = score;
      }
    }
    
    // Si hay coincidencias, usar la categoría con mayor puntuación
    if (Object.keys(intentScores).length > 0) {
      const bestCategory = Object.keys(intentScores).reduce((a, b) => 
        intentScores[a] > intentScores[b] ? a : b
      );
      
      const responseObj = {
        id: messages.length + 2,
        text: responses[bestCategory].response,
        sender: "bot",
        timestamp: new Date()
      };
      
      // Si tiene acción adicional, ejecutarla
      if (responses[bestCategory].action) {
        responses[bestCategory].action();
      }
      
      return responseObj;
    }
    
    // Respuestas para saludos generales
    const greetings = ["hola", "buenos dias", "buenas", "saludos", "hey", "buen día"];
    if (greetings.some(greeting => input.includes(greeting))) {
      return {
        id: messages.length + 2,
        text: "¡Hola! Soy el asistente virtual del Hotel Elegancia. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre reservas, servicios, ubicación o cualquier otra duda.",
        sender: "bot",
        timestamp: new Date()
      };
    }
    
    // Respuestas para agradecimientos
    const thanks = ["gracias", "te agradezco", "muchas gracias", "thank"];
    if (thanks.some(thank => input.includes(thank))) {
      return {
        id: messages.length + 2,
        text: "¡De nada! Estamos para servirte. Si tienes más preguntas, no dudes en consultarme.",
        sender: "bot",
        timestamp: new Date()
      };
    }
    
    // Respuestas para despedidas
    const goodbyes = ["adios", "bye", "hasta luego", "nos vemos", "chao"];
    if (goodbyes.some(goodbye => input.includes(goodbye))) {
      return {
        id: messages.length + 2,
        text: "¡Hasta pronto! Esperamos verte pronto en Hotel Elegancia. Si necesitas más información, estaré aquí para ayudarte.",
        sender: "bot",
        timestamp: new Date()
      };
    }
    
    // Respuesta por defecto mejorada
    return {
      id: messages.length + 2,
      text: "Gracias por tu pregunta. No estoy seguro de entender completamente tu consulta. ¿Podrías reformularla o ser más específico? También puedes llamarnos al +52 123 456 7890 o enviar un email a reservas@hoteles.com para atención personalizada.",
      sender: "bot",
      timestamp: new Date()
    };
  };
  
  // Sugerir mensajes predefinidos
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Opcional: enviar automáticamente después de seleccionar
    // setTimeout(() => {
    //   handleSendMessage({ preventDefault: () => {} });
    // }, 100);
  };
  
  return (
    <div className="hotel-chatbot">
      {/* Botón para abrir/cerrar el chatbot */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span>&times;</span>
        ) : (
          <span>💬</span>
        )}
      </button>
      
      {/* Contenedor del chat */}
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-hotel-info">
            <div className="chatbot-hotel-logo">🏨</div>
            <div className="chatbot-hotel-details">
              <h3>Hotel Elegancia</h3>
              <span>Asistente virtual</span>
            </div>
          </div>
          <button className="close-chat" onClick={() => setIsOpen(false)}>
            &times;
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === "bot" ? "bot" : "user"} ${message.isPromotion ? "promotion" : ""}`}
            >
              {message.sender === "bot" && (
                <div className="bot-avatar">🏨</div>
              )}
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-timestamp">
                  {new Intl.DateTimeFormat('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(new Date(message.timestamp))}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot typing">
              <div className="bot-avatar">🏨</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="chatbot-input"
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={inputValue.trim() === ''}
          >
            <span>➤</span>
          </button>
        </form>
        
        <div className="chatbot-suggestions">
          <p>¿Cómo podemos ayudarte?</p>
          <div className="suggestion-chips">
            <button onClick={() => handleSuggestionClick("¿Cómo hago una reserva?")}>
              Reservas
            </button>
            <button onClick={() => handleSuggestionClick("¿A qué hora es el check-in?")}>
              Check-in/out
            </button>
            <button onClick={() => handleSuggestionClick("¿Tienen promociones disponibles?")}>
              Promociones
            </button>
            <button onClick={() => handleSuggestionClick("¿Qué servicios tiene el hotel?")}>
              Servicios
            </button>
            <button onClick={() => handleSuggestionClick("¿Dónde están ubicados?")}>
              Ubicación
            </button>
            <button onClick={() => handleSuggestionClick("¿Aceptan mascotas?")}>
              Mascotas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;