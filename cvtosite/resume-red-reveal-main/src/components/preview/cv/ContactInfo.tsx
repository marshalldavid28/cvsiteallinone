
import React from "react";
import { Contact } from "@/types/website";
import { Phone, Mail, MapPin } from "lucide-react";

interface ContactInfoProps {
  contact?: Contact;
  colorStyles: {
    text: string;
    accent: string;
    sectionHeader: string;
  };
}

const ContactInfo: React.FC<ContactInfoProps> = ({ 
  contact, 
  colorStyles 
}) => {
  if (!contact) return null;
  
  return (
    <div className="mb-8">
      <h2 className={`text-lg uppercase mb-4 ${colorStyles.sectionHeader}`}>Contact</h2>
      <ul className="space-y-3">
        {contact.email && (
          <li className="flex items-center gap-2">
            <Mail size={16} className={colorStyles.accent} />
            <span className={`${colorStyles.text} text-sm`}>{contact.email}</span>
          </li>
        )}
        {contact.phone && (
          <li className="flex items-center gap-2">
            <Phone size={16} className={colorStyles.accent} />
            <span className={`${colorStyles.text} text-sm`}>{contact.phone}</span>
          </li>
        )}
        {contact.location && (
          <li className="flex items-center gap-2">
            <MapPin size={16} className={colorStyles.accent} />
            <span className={`${colorStyles.text} text-sm`}>{contact.location}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContactInfo;
