import { useState, useCallback } from "react";

export const useVolunteerTranslator = (selectedGate: string | null) => {
  const [transInput, setTransInput] = useState("");
  const [transOutput, setTransOutput] = useState("");
  const [transLang, setTransLang] = useState("Spanish");

  const handleTranslate = useCallback(() => {
    if (!transInput) return;
    const mockTranslations: Record<string, Record<string, string>> = {
      Spanish: {
        "where is the metro station?": "La estación de metro está al este, siga la línea azul.",
        "where is gate c?": "La Puerta C es la puerta de accesibilidad en el lado sureste.",
        "where are the restrooms?": "Los baños están en el primer piso, detrás de la sección 102.",
        "i need medical help": "Por favor, quédese aquí. He notificado al equipo médico de la sede."
      },
      French: {
        "where is the metro station?": "La station de métro est à l'est, suivez la ligne bleue.",
        "where is gate c?": "La Porte C est la porte d'accessibilité sur le côté sud-est.",
        "where are the restrooms?": "Les toilettes sont au premier niveau, derrière la section 102.",
        "i need medical help": "Restez ici s'il vous plaît. J'ai prévenu l'équipe médicale."
      },
      Portuguese: {
        "where is the metro station?": "A estação de metrô fica a leste, siga a linha azul.",
        "where is gate c?": "O Portão C é o portão de acessibilidade no lado sudeste.",
        "where are the restrooms?": "Os banheiros ficam no primeiro nível, atrás da seção 102.",
        "i need medical help": "Por favor, aguarde aqui. Já acionei a equipe médica."
      }
    };
    
    const key = transInput.trim().toLowerCase();
    const lDict = mockTranslations[transLang];
    if (lDict && lDict[key]) {
      setTransOutput(lDict[key]);
    } else {
      setTransOutput(`[MatchOps Translation] "Could you please show me your ticket? I will guide you to Gate ${selectedGate || 'C'}."`);
    }
  }, [transInput, transLang, selectedGate]);

  return {
    transInput,
    setTransInput,
    transOutput,
    setTransOutput,
    transLang,
    setTransLang,
    handleTranslate
  };
};
