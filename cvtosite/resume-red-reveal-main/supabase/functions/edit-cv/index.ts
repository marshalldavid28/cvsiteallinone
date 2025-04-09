
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
    const { prompt, currentProfile } = await req.json();

    if (!prompt || !currentProfile) {
      console.error("Missing required parameters:", { 
        hasPrompt: !!prompt, 
        hasCurrentProfile: !!currentProfile 
      });
      return new Response(
        JSON.stringify({ error: "Prompt and current profile data are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error: API key missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing edit request with prompt:", prompt);
    console.log("Current profile has these keys:", Object.keys(currentProfile));
    
    try {
      // Make a request to OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that helps users edit their CV/resume. 
              You will be given the current CV data as a JSON object and a request from the user.
              Your task is to modify the CV data according to the user's request and return the updated CV data as a JSON object.
              
              IMPORTANT RULES:
              1. ONLY make changes that the user explicitly requests
              2. Return the ENTIRE updated profile object
              3. Preserve all existing fields even if not modified
              4. Format should be exactly the same as the input - only modify content
              5. Make sure arrays remain arrays and objects remain objects
              6. If you are asked to add a new section that doesn't exist, create it with appropriate structure
              7. If you are asked to delete a section, remove it completely
              8. For language changes (tone, style, etc.), preserve the factual content while adjusting the wording
              9. Do not add fabricated information unless specifically requested
              10. Return VALID JSON only`
            },
            {
              role: "user",
              content: `Here is my current CV data:
              ${JSON.stringify(currentProfile, null, 2)}
              
              My request: ${prompt}
              
              Please return the updated CV data as a complete JSON object.`
            }
          ],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API responded with status ${response.status}:`, errorText);
        return new Response(
          JSON.stringify({ 
            error: `OpenAI API error: ${response.status}`, 
            details: errorText 
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("OpenAI response received successfully");
      
      if (!data.choices || data.choices.length === 0) {
        console.error("No choices in OpenAI response:", data);
        return new Response(
          JSON.stringify({ 
            error: "Failed to generate updated CV content", 
            details: "OpenAI did not return any choices",
            response: data
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const rawContent = data.choices[0].message.content;
      console.log("Raw content received from OpenAI");

      // Parse the JSON response from the AI
      let updatedProfile;
      try {
        // Look for JSON object in the response
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          updatedProfile = JSON.parse(jsonMatch[0]);
          console.log("Successfully parsed JSON from OpenAI response");
        } else {
          console.error("Could not find JSON structure in OpenAI response:", rawContent);
          return new Response(
            JSON.stringify({ 
              error: "Could not find JSON structure in AI response", 
              rawContent: rawContent 
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError, "Raw content:", rawContent);
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse updated CV content", 
            details: parseError.message,
            rawContent: rawContent 
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Successfully processed CV edit request");
      return new Response(
        JSON.stringify({ 
          success: true, 
          updatedProfile 
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
    console.error("Comprehensive Error in edit-cv function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error processing edit request", 
        message: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
