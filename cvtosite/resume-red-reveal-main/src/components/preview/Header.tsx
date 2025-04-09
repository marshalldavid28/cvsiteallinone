
import React from 'react';
import { WebsiteData } from '@/types/website';
import { Linkedin } from 'lucide-react';
import EditableField from './EditableField';
import DisplayPicture from './DisplayPicture';

interface HeaderProps {
  profile: WebsiteData;
  styles: {
    headerBg: string;
    titleColor: string;
    textColor: string;
    subtextColor: string;
    [key: string]: string;
  };
  isAdmin: boolean;
  isEditMode?: boolean;
  onProfileUpdate?: (field: string, value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ profile, styles, isAdmin, isEditMode, onProfileUpdate }) => {
  // Helper function to get LinkedIn URL if it exists
  const getLinkedInUrl = () => {
    if (!profile.socialLinks) return null;
    return profile.socialLinks.find(link => 
      link.platform.toLowerCase().includes('linkedin') || 
      link.url.toLowerCase().includes('linkedin.com')
    )?.url;
  };

  // Format name properly by trimming and removing extra spaces
  const formatName = (name: string | undefined) => {
    // Add null check to prevent calling replace on undefined
    if (!name) return '';
    // Remove multiple spaces and trim
    return name.replace(/\s+/g, ' ').trim();
  };

  // Determine if we have a bio/summary to display
  const hasBio = profile.bio && profile.bio.trim().length > 0;
  
  // Check if we have a display picture
  const hasDisplayPicture = !!profile.displayPicture;
  
  if (profile.displayPicture) {
    console.log("Display picture URL:", profile.displayPicture);
  }

  return (
    <header className={`${styles.headerBg} py-10 sm:py-16 px-4`}>
      <div className="max-w-5xl mx-auto text-center">
        {/* Display picture component - only shown if there's an imageUrl or in admin mode */}
        {(hasDisplayPicture || isAdmin) && (
          <div className="mb-6">
            <DisplayPicture 
              imageUrl={profile.displayPicture}
              name={formatName(profile.name)} 
              size="xl"
              isAdmin={isAdmin && !!isEditMode}
              onUpdate={(value) => onProfileUpdate && onProfileUpdate('displayPicture', value)}
              borderColor={styles.borderColor}
            />
          </div>
        )}
        
        {isAdmin && onProfileUpdate ? (
          <EditableField 
            value={formatName(profile.name)} 
            onChange={(newValue) => onProfileUpdate('name', newValue)}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 inline-flex justify-center"
            label="Name"
          />
        ) : (
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 ${styles.textColor}`}>{formatName(profile.name)}</h1>
        )}
        
        {isAdmin && onProfileUpdate ? (
          <EditableField 
            value={profile.title || ''} 
            onChange={(newValue) => onProfileUpdate('title', newValue)}
            className={`text-lg sm:text-xl md:text-2xl ${styles.titleColor} mb-4 inline-flex justify-center`}
            label="Title"
          />
        ) : (
          <p className={`text-lg sm:text-xl md:text-2xl ${styles.titleColor} mb-4`}>{profile.title || ''}</p>
        )}
        
        {/* Bio/Summary section - displayed prominently and styled to stand out */}
        {(hasBio || (isAdmin && isEditMode)) && (
          <div className={`mb-6 max-w-2xl mx-auto ${styles.sectionBg} p-4 rounded-lg`}>
            {isAdmin && onProfileUpdate ? (
              <EditableField 
                value={profile.bio || ''} 
                onChange={(newValue) => onProfileUpdate('bio', newValue)}
                className={`${styles.subtextColor} italic`}
                multiline
                label="Professional Summary"
                placeholder="Add a professional summary that highlights your career objectives and key strengths."
              />
            ) : (
              <p className={`${styles.subtextColor} italic`}>{profile.bio || ''}</p>
            )}
          </div>
        )}
        
        {/* Display social links if they exist */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap mb-6 sm:mb-8">
            {profile.socialLinks.map((link, index) => {
              const isLinkedIn = link.platform.toLowerCase().includes('linkedin') || 
                               link.url.toLowerCase().includes('linkedin.com');
              
              // Ensure LinkedIn URLs have the proper format with https://
              const formattedUrl = isLinkedIn && link.url && !link.url.startsWith('http') 
                ? `https://${link.url}`
                : link.url;
              
              return (
                <a
                  key={index}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm 
                    ${isLinkedIn ? 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20' : styles.techBg} 
                    transition-colors`}
                >
                  {isLinkedIn && <Linkedin size={16} />}
                  <span>{link.platform}</span>
                </a>
              );
            })}
          </div>
        )}
        
        <div className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-sm ${styles.subtextColor}`}>
          {profile.contact ? (
            <>
              {profile.contact.email && (
                isAdmin && onProfileUpdate ? (
                  <EditableField 
                    value={profile.contact.email} 
                    onChange={(newValue) => onProfileUpdate('contact.email', newValue)}
                    className="inline-flex"
                    label="Email"
                  />
                ) : (
                  <div className="break-all">{profile.contact.email}</div>
                )
              )}
              
              {profile.contact.phone && (
                isAdmin && onProfileUpdate ? (
                  <EditableField 
                    value={profile.contact.phone} 
                    onChange={(newValue) => onProfileUpdate('contact.phone', newValue)}
                    className="inline-flex"
                    label="Phone"
                  />
                ) : (
                  <div>{profile.contact.phone}</div>
                )
              )}
              
              {profile.contact.location && (
                isAdmin && onProfileUpdate ? (
                  <EditableField 
                    value={profile.contact.location} 
                    onChange={(newValue) => onProfileUpdate('contact.location', newValue)}
                    className="inline-flex"
                    label="Location"
                  />
                ) : (
                  <div>{profile.contact.location}</div>
                )
              )}
            </>
          ) : (
            <>
              <div className="break-all">contact@{profile.name ? profile.name.toLowerCase().replace(/\s+/g, '') : 'example'}.com</div>
              <div>+1 (555) 123-4567</div>
              <div>San Francisco, CA</div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
