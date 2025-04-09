
import { WebsiteData } from "@/types/website";

/**
 * Updates the profile data based on field path and new value
 * Handles array updates, nested properties, and special cases like skills
 */
export const updateProfileField = (
  profile: WebsiteData,
  field: string,
  value: string
): WebsiteData => {
  const updatedProfile = { ...profile };
  console.log(`Updating field: ${field} with value:`, value);
  
  // Check if this is an array update (e.g., 'experiences[0].title')
  if (field.includes('[')) {
    const match = field.match(/([a-zA-Z]+)\[(\d+)\]\.?([a-zA-Z]*)(\.items\[(\d+)\]\.([a-zA-Z]*))?/);
    
    if (match) {
      const [, arrayName, indexStr, property, , nestedIndexStr, nestedProperty] = match;
      const index = parseInt(indexStr);
      
      // Handle the case where the frontend uses 'experiences' but the data model uses 'experience'
      const actualArrayName = arrayName === 'experiences' ? 'experience' : arrayName;
      
      // Make sure the array exists
      if (!updatedProfile[actualArrayName as keyof WebsiteData]) {
        updatedProfile[actualArrayName as keyof WebsiteData] = [] as any;
      }
      
      // Ensure array exists and is of proper length
      const array = updatedProfile[actualArrayName as keyof WebsiteData] as any[];
      
      // Extend array if needed
      while (array.length <= index) {
        array.push({});
      }
      
      // Handle deeply nested updates (e.g., customSections[0].items[1].name)
      if (nestedIndexStr && nestedProperty) {
        const nestedIndex = parseInt(nestedIndexStr);
        
        // Ensure items array exists
        if (!array[index].items) {
          array[index].items = [];
        }
        
        const itemsArray = array[index].items;
        
        // Extend nested array if needed
        while (itemsArray.length <= nestedIndex) {
          itemsArray.push({});
        }
        
        // Update the nested property
        itemsArray[nestedIndex][nestedProperty] = value;
        console.log(`Updated ${actualArrayName}[${index}].items[${nestedIndex}].${nestedProperty} to:`, itemsArray[nestedIndex][nestedProperty]);
      } 
      // Handle regular array item updates
      else if (property) {
        // Check if this is a JSON string to parse (for arrays)
        if (property === 'details' || (value && value.startsWith('[') && value.endsWith(']'))) {
          try {
            array[index][property] = JSON.parse(value);
            console.log(`Updated ${actualArrayName}[${index}].${property} to:`, array[index][property]);
          } catch (e) {
            console.error(`Failed to parse JSON for ${field}:`, e);
            // If parsing fails, just set as regular string
            array[index][property] = value;
            console.log(`Set as string ${actualArrayName}[${index}].${property} to:`, array[index][property]);
          }
        } else {
          array[index][property] = value;
          console.log(`Updated ${actualArrayName}[${index}].${property} to:`, array[index][property]);
        }
      } else {
        // If only array index is specified with no property, update the whole object
        // This shouldn't typically happen but added for completeness
        try {
          array[index] = JSON.parse(value);
          console.log(`Updated entire ${actualArrayName}[${index}] object`);
        } catch (e) {
          console.error(`Failed to parse JSON for entire object ${field}:`, e);
        }
      }
    }
  }
  // Handle nested properties (e.g., 'contact.email')
  else if (field.includes('.')) {
    const [parent, child] = field.split('.');
    if (parent) {
      // Create the object if it doesn't exist
      if (!updatedProfile[parent as keyof WebsiteData]) {
        updatedProfile[parent as keyof WebsiteData] = {} as any;
      }
      
      // Update the nested property
      if (updatedProfile[parent as keyof WebsiteData]) {
        (updatedProfile[parent as keyof WebsiteData] as any)[child] = value;
        console.log(`Updated ${parent}.${child} to:`, (updatedProfile[parent as keyof WebsiteData] as any)[child]);
      }
    }
  } 
  // Handle top-level arrays that need parsing
  else if (field === 'skills' || field === 'languages') {
    try {
      updatedProfile[field] = JSON.parse(value);
      console.log(`Updated ${field} to:`, updatedProfile[field]);
    } catch (e) {
      console.error(`Failed to parse ${field}:`, e);
      
      // Fallback: If it's not valid JSON but a string, try to split by commas
      if (typeof value === 'string') {
        updatedProfile[field] = value.split(',').map(item => item.trim()).filter(Boolean);
        console.log(`Fallback: Updated ${field} by splitting string:`, updatedProfile[field]);
      }
    }
  }
  // Update top-level property for regular strings
  else {
    (updatedProfile[field as keyof WebsiteData] as any) = value;
    console.log(`Updated ${field} to:`, (updatedProfile[field as keyof WebsiteData] as any));
  }
  
  // Ensure the experience array exists
  if (!updatedProfile.experience) {
    updatedProfile.experience = [];
  }
  
  return updatedProfile;
};
