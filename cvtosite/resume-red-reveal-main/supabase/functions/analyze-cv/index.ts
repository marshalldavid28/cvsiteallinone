
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("CV Analysis function called");
    const { cvText, userId, designStyle, linkedInUrl } = await req.json();

    if (!cvText) {
      console.error("CV text is required but was not provided");
      return new Response(
        JSON.stringify({ error: "CV text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      throw new Error("OPENAI_API_KEY is not set");
    }

    console.log("CV Text Length:", cvText.length);
    console.log("Design Style:", designStyle || "default");
    console.log("LinkedIn URL provided:", linkedInUrl || "none");
    
    try {
      // Make a request to OpenAI API with strict instructions about accuracy
      console.log("Making request to OpenAI API");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert CV analyzer focused on ACCURACY. Your task is to extract ALL information from a CV exactly as presented, maintaining complete fidelity to the original content.

CRITICAL REQUIREMENTS:
1. NEVER invent, make up, or fabricate ANY information that is not explicitly present in the CV
2. Extract EVERY bullet point in work experience EXACTLY as written
3. ONLY include sections that exist in the original CV
4. If a section isn't present in the CV (like certificates, workshops, publications, skills), DO NOT create it or leave it empty
5. Return a VALID JSON object with ONLY information present in the original CV
6. Preserve the exact wording and details from the CV
7. If specific fields in the JSON structure are not found in the CV, OMIT them completely from the JSON
8. NEVER summarize bullet points - capture them individually and exactly as provided
9. Format names properly - do not add spaces where they don't exist (e.g., "Shruthi" not "S hruthi")
10. If there is no dedicated "Skills" section, but skills are mentioned elsewhere (in certifications, experience, etc.), you MAY extract those as skills
11. For certifications, extract them properly into the customSections array
12. The sections present in the output should EXACTLY match what's in the CV - don't create sections that aren't there
13. ALWAYS look for a summary or objective statement which typically appears at the beginning of the CV, often right after the contact information. It may be italicized, in a different font, or formatted differently than the rest of the CV. This should be extracted as the "bio" field.`
            },
            {
              role: "user",
              content: `STRICTLY PARSE THIS CV INTO STRUCTURED JSON WITH ONLY THE INFORMATION PRESENT IN THE CV:

CV CONTENT START:
${cvText}
CV CONTENT END:

REQUIRED JSON FORMAT:
{
  "name": "Full Name without adding extra spaces",
  "title": "Professional Title",
  "bio": "Professional summary/objective/profile statement if present in CV, especially look for statements near the top that describe career goals or professional identity",
  "headline": "Only use a headline if explicitly present in CV",
  "contact": {
    "email": "email@example.com if present",
    "phone": "Phone number if present",
    "location": "City, Country if present"
  },
  "experience": [
    {
      "title": "Job Title exactly as in CV", 
      "company": "Company Name exactly as in CV", 
      "period": "Start-End dates exactly as in CV", 
      "description": "Brief overview of role if present",
      "details": ["Bullet point 1 exactly as written", "Bullet point 2 exactly as written"] 
    }
  ],
  "education": [
    {
      "degree": "Degree Name exactly as in CV", 
      "institution": "Institution exactly as in CV", 
      "year": "Graduation Year exactly as in CV",
      "description": "Education details exactly as in CV if present"
    }
  ],
  "skills": ["Only skills explicitly listed in CV or clearly implied from experience/certifications"],
  "projects": [
    {
      "name": "Project Name if projects section exists", 
      "description": "Project description exactly as in CV", 
      "technologies": ["Only technologies mentioned in project"],
      "url": "Project URL if available in CV"
    }
  ],
  "languages": ["Only languages explicitly mentioned in CV"],
  "socialLinks": [
    {
      "platform": "Only social links mentioned in CV",
      "url": "URLs as provided in CV"
    }
  ],
  "customSections": [
    {
      "title": "ONLY include custom sections explicitly present in CV (e.g., Publications, Certifications)",
      "items": [
        {
          "name": "Item name exactly as written",
          "description": "Description exactly as written",
          "date": "Date exactly as written if present",
          "url": "URL if present in CV"
        }
      ]
    }
  ],
  "designStyle": "${designStyle || "modern"}",
  "colorScheme": ["primary color", "secondary color", "accent color"],
  "fontPairings": {
    "heading": "Heading Font",
    "body": "Body Font"
  }
}`
            }
          ],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API responded with status ${response.status}:`, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("OpenAI response received");
      
      if (!data.choices || data.choices.length === 0) {
        console.error("No choices in OpenAI response");
        return new Response(
          JSON.stringify({ 
            error: "Failed to generate website content", 
            details: "OpenAI did not return any choices" 
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const rawContent = data.choices[0].message.content;
      console.log("Raw content received from OpenAI");

      // Enhanced parsing with multiple fallback strategies
      let websiteContent;
      try {
        // Try direct JSON parsing first
        websiteContent = JSON.parse(rawContent);
        console.log("Successfully parsed JSON directly");
      } catch (jsonError) {
        console.log("Direct JSON parsing failed, attempting regex extraction");
        
        // Try to extract JSON using regex
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            websiteContent = JSON.parse(jsonMatch[0]);
            console.log("Successfully parsed JSON via regex");
          } catch (regexParseError) {
            console.error("Regex JSON parsing failed:", regexParseError);
            throw new Error("Failed to parse OpenAI response as JSON");
          }
        } else {
          throw new Error("Could not find JSON structure in OpenAI response");
        }
      }

      if (!websiteContent) {
        console.error("Could not parse website content");
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse website content",
            rawContent: rawContent 
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Clean up empty sections to prevent fabricated data
      if (websiteContent.customSections) {
        websiteContent.customSections = websiteContent.customSections.filter(
          section => section.items && section.items.length > 0
        );
        if (websiteContent.customSections.length === 0) {
          delete websiteContent.customSections;
        }
      }

      if (websiteContent.projects && websiteContent.projects.length === 0) {
        delete websiteContent.projects;
      }

      // Don't show empty skills sections
      if (websiteContent.skills && websiteContent.skills.length === 0) {
        delete websiteContent.skills;
      }

      // If there's no bio/summary, try to extract it from the "profile" section or other typical locations
      if (!websiteContent.bio || websiteContent.bio.trim().length === 0) {
        console.log("No bio found, attempting to extract from profile or other sections");
        
        // Common headers for sections that might contain summary-like content
        const summaryHeaders = ['summary', 'profile', 'objective', 'professional objective', 'career objective', 'professional summary'];
        
        // Look for lines that might contain a summary header
        const lines = cvText.split('\n');
        let potentialBio = '';
        
        // First look for sections with known headers
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim().toLowerCase();
          
          // Check if this line contains a summary-like header
          const headerMatch = summaryHeaders.some(header => line.includes(header));
          
          if (headerMatch && i + 1 < lines.length) {
            // Collect the next few lines as potential bio content
            let j = i + 1;
            let bioContent = [];
            
            // Collect lines until we hit another section header or bullet points
            while (j < lines.length && 
                  !summaryHeaders.some(header => lines[j].toLowerCase().includes(header)) &&
                  !lines[j].trim().startsWith('•') && 
                  !lines[j].trim().startsWith('-') &&
                  !lines[j].trim().startsWith('*') &&
                  bioContent.length < 5) {
              if (lines[j].trim()) {
                bioContent.push(lines[j].trim());
              }
              j++;
            }
            
            if (bioContent.length > 0) {
              potentialBio = bioContent.join(' ');
              break;
            }
          }
        }
        
        // If no labeled section found, check the first few paragraphs (often summaries don't have explicit headers)
        if (!potentialBio) {
          let paragraphs = [];
          let currentPara = [];
          
          // Group lines into paragraphs
          for (const line of lines.slice(0, 20)) { // Only check the first 20 lines
            const trimmedLine = line.trim();
            if (trimmedLine) {
              currentPara.push(trimmedLine);
            } else if (currentPara.length > 0) {
              paragraphs.push(currentPara.join(' '));
              currentPara = [];
            }
          }
          
          // Add the last paragraph if not empty
          if (currentPara.length > 0) {
            paragraphs.push(currentPara.join(' '));
          }
          
          // Select paragraphs that look like summaries (not too short, not too long)
          const potentialSummaries = paragraphs.filter(p => 
            p.length > 40 &&        // Not too short
            p.length < 500 &&       // Not too long
            !p.includes(':') &&     // Probably not a header line
            !p.startsWith('•') &&   // Not a bullet point
            !p.startsWith('-') &&
            !p.startsWith('*') &&
            !/^\d+\.\s/.test(p)     // Not a numbered list
          );
          
          if (potentialSummaries.length > 0) {
            // Use the first paragraph that meets the criteria
            potentialBio = potentialSummaries[0];
          }
        }
        
        // If we found something, add it to the website content
        if (potentialBio) {
          console.log("Found potential bio content:", potentialBio.substring(0, 100) + (potentialBio.length > 100 ? "..." : ""));
          websiteContent.bio = potentialBio;
        }
      }

      // Add the manually provided LinkedIn URL if it exists and there isn't already one
      if (linkedInUrl) {
        if (!websiteContent.socialLinks) {
          websiteContent.socialLinks = [];
        }
        
        // Check if LinkedIn already exists in the extracted data
        const hasLinkedIn = websiteContent.socialLinks.some(link => 
          link.platform.toLowerCase().includes('linkedin') || 
          (link.url && link.url.toLowerCase().includes('linkedin.com'))
        );
        
        // If no LinkedIn was found, add the manually provided one
        if (!hasLinkedIn) {
          websiteContent.socialLinks.push({
            platform: "LinkedIn",
            url: linkedInUrl
          });
        }
      }

      // If we have certifications but no customSections, create a Certifications section
      if (websiteContent.certifications && !websiteContent.customSections) {
        websiteContent.customSections = [
          {
            title: "Certifications",
            items: websiteContent.certifications.map(cert => ({
              name: cert,
              description: ""
            }))
          }
        ];
        delete websiteContent.certifications;
      }

      // Store the analysis notes to show to the user
      let optimizationNotes = "";
      
      // If there's no skills section, extract implicit skills from experience and certifications
      if (!websiteContent.skills || websiteContent.skills.length === 0) {
        // Add a note about inferring skills
        optimizationNotes += "No explicit Skills section was found in your CV. Consider adding a dedicated Skills section to highlight your expertise.\n\n";
        
        // Logic to infer skills could be added here if needed
      }

      if (optimizationNotes) {
        // Add the optimization notes to the response
        websiteContent.optimizationNotes = optimizationNotes;
      }

      console.log("Successfully processed CV, returning response");
      return new Response(
        JSON.stringify({ 
          success: true, 
          websiteContent 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (openAIError) {
      console.error("Error with OpenAI API:", openAIError);
      return new Response(
        JSON.stringify({ 
          error: "Error communicating with AI service", 
          details: openAIError.message 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Comprehensive Error in analyze-cv function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error processing CV", 
        message: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
